<?php

class UserController extends Controller
{
    const VERIFICATION_LENGTH = 16;
    const VERIFICATION_VALUES = 
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const MAX_RECOVER_PASSWORD_ATTEMPTS = 10;
    const LOGIN_DURATION = 86400;

    private static $MESSAGES = array(
        'internal_error' => 'An internal error occurred.',
        'incorrect_login' => 'Incorrect username or password',
        'invalid_username' => 'Invalid username.',
        'invalid_password' => 'Invalid password.',
        'invalid_email' => 'Invalid email address.',
        'username_taken' => 'That username is taken.',
        'email_taken' => 'That email address is taken.',
        'not_logged_in' => 'You must be logged in to perform this action.',
        'password_update' => 'Your password has been updated.',
        'email_update' => 'Your email address has been updated.',
        'email_verify_incorret' => 
            'Your username or verification code are incorrect.',
        'email_already_verified' => 
            'Your email address has already been verified',
        'email_verified' => 'Your email address has been verified',
        'email_verification_impossible' => 
            'Either that user does not exist or does not have a verified email address. Contact us to recovery your account.',
        'password_reset_sent' =>
            'A password recovery email was sent to your email address at %domain.',
    );

    /**
     * Attempts to log the player in with the given authentication information.
     * The login attempt's success and optional error message are returned to
     *  the client in a JSON packet.
     *
     * @param username string the player's username
     * @param password string the player's password
     */
    public function actionLogin($username, $password)
    {
        $success = false;
        $message = false;
        $identity = new UserIdentity($username, $password);
        if ($identity->authenticate()) {
            Yii::app()->user->login($identity, self::LOGIN_DURATION);
            $success = true;
        } else {
            $message = self::$MESSAGES['incorrect_login'];
        }

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    /**
     * Logs the current player out.
     */
    public function actionLogout()
    {
        Yii::app()->user->logout();
    }

    /**
     * Creates a new player account with the given information.
     * The success or error message of the account creation are returned to the
     *  client in a JSON packet.
     *
     * @param username   string the player's username, used as identity
     * @param password   string the player's password, used for authentication
     * @param theme      string the color theme chosen by the player
     * @param theme_type string the type of the color theme chose by the player
     * @param email      string the email address associated with the player
     */
    public function actionCreateAccount($username, $password, $theme,
                                        $theme_type, $email)
    {
        $message = false;
        $success = false;

        if (!User::isValidPassword($password)) {
            $message = self::$MESSAGES['invalid_password'];
        } elseif (!User::isValidUsername($username)) {
            $message = self::$MESSAGES['invalid_username'];
        } elseif (User::isUsernameTaken($username)) {
            $message = self::$MESSAGES['username_taken'];
        } elseif (!User::isValidEmail($email)) {
            $message = self::$MESSAGES['invalid_email'];
        } elseif (User::isEmailTaken($email)) {
            $message = self::$MESSAGES['email_taken'];
        } else {
            $user = new User;
            $user->username = $username;
            $user->password = crypt($password, self::blowfishSalt());
            $user->theme = $theme;
            $user->theme_type = $theme_type;
            $user->email = $email;
            $user->email_verified = false;
            $user->email_verification = self::generateVerificationCode();
            if ($user->save()) {
                Yii::app()->user->login(
                    new UserIdentity($username, $password),
                    self::LOGIN_DURATION
                );
                $success = true;

                $this->sendEmailVerification();
            } else {
                $message = self::$MESSAGES['internal_error'];
            }
        }
        
        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    /**
     * Changes the password of the player currently logged in.
     * The success of the operation and an informational message are returned to
     *  the client in a JSON packet.
     *
     * @param current_password string the player's current password, used to
     *                                authenticate the player's identity
     * @param new_password     string the new password to be associated with
     *                                the player's account
     */
    public function actionChangePassword($current_password, $new_password)
    {
        $success = false;
        $message = false;

        $user = User::getCurrentUser();

        if ($user === null) {
            $message = self::$MESSAGES['not_logged_in'];
        } elseif (!User::isValidPassword($new_password)) {
            $message = self::$MESSAGES['invalid_password'];
        } elseif (!$user->authenticate($current_password)) {
            $message = self::$MESSAGES['incorrect_login'];
        } else {
            $user->password = crypt($new_password, self::blowfishSalt());
            if ($user->save()) {
                $success = true;
                $message = self::$MESSAGES['password_update'];
            } else {
                $message = self::$MESSAGES['internal_error'];
            }
        }

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    /**
     * Changes the email address associated with the player currently logged in.
     * The success of the operation and an informational message are returned to
     *  the client in a JSON packet.
     *
     * @param password string the player's current password, used to
     *                        authenticate the player's identity
     * @param email    string the new email address to be associated with the
     *                        player's account
     */
    public function actionChangeEmail($password, $email)
    {
        $success = false;
        $message = false;

        $user = User::getCurrentUser();

        if ($user === null) {
            $message = self::$MESSAGES['not_logged_in'];
        } elseif (!User::isValidEmail($email)) {
            $message = self::$MESSAGES['invalid_email'];
        } elseif (User::isEmailTaken($email)) {
            $message = self::$MESSAGES['email_taken'];
        } elseif (!$user->authenticate($password)) {
            $message = self::$MESSAGES['incorrect_login'];
        } else {
            $user->email = $email;
            $user->email_verified = false;
            $user->email_verification = self::generateVerificationCode();
            if ($user->save()) {
                $success = true;
                $message = self::$MESSAGES['email_update'];

                $this->sendEmailVerification();
            } else {
                $message = self::$MESSAGES['internal_error'];
            }
        }

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    /**
     * Verifies the email address associated with a player's account.
     * The success of the operation and an informational message are returned to
     *  the client in a JSON packet.
     *
     * @param username     string the username of the account for which to
     *                            verify the email address
     * @param verification string the verification code sent to the player in an
     *                            email, used to authenticate the player
     */
    public function actionVerifyEmail($username, $verification)
    {
        $success = false;
        $message = false;

        $user = User::findByUsername($username);

        if ($user === null) {
            $message = self::$MESSAGES['email_verify_incorret'];
        } elseif ($user->email_verified) {
            $message = self::$MESSAGES['email_already_verified'];
            $success = true;
        } elseif ($user->email_verification !== $verification) {
            $message = self::$MESSAGES['email_verify_incorret'];
        } else {
            $user->email_verified = true;
            if ($user->save()) {
                $message = self::$MESSAGES['email_verified'];
                $success = true;
            } else {
                $message = self::$MESSAGES['internal_error'];
            }
        }

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    /**
     * Resets the password associated with a player's account to the one given.
     * The success of the operation and an informational message are returned to
     *  the client in a JSON packet.
     *
     * @param username     string the username of the account for which to reset
     *                            the password
     * @param verification string the verification code sent to the player in an
     *                            email, used to authenticate the player
     * @param new_password string the new password for the player's account
     */
    public function actionResetPassword($username, $verification, $new_password)
    {
        $success = false;
        $message = false;

        $user = User::findByUsername($username);

        if ($user === null) {
            $message = self::$MESSAGES['email_verify_incorret'];
        } else {
            $recovery = $user->password_recovery;
            if ($recovery === null) {
                $message = self::$MESSAGES['email_verify_incorret'];
            } elseif ($verification !== $recovery->verification) {
                $recovery->attempts++;
                $recovery->save();
                if ($recovery->attempts > self::MAX_RECOVER_PASSWORD_ATTEMPTS) {
                    $recovery->delete();
                }

                $message = self::$MESSAGES['email_verify_incorret'];
            } else {
                $user->password = crypt($new_password, self::blowfishSalt());
                if ($user->save()) {
                    $recovery->delete();
                    $success = true;
                    $message = self::$MESSAGES['password_update'];
                } else {
                    $message = self::$MESSAGES['internal_error'];
                }
            }
        }

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    /**
     * Determines whether the given username is valid.
     * The result is returned to the client in a JSON packet.
     *
     * @param username string a potential username
     */
    public function actionValidateUsername($username)
    {
        echo CJavaScript::jsonEncode(array(
            'valid' => User::isValidUsername($username)
        ));
    }

    /**
     * Determines whether the given password is valid.
     * The result is returned to the client in a JSON packet.
     *
     * @param password string a potential password
     */
    public function actionValidatePassword($password)
    {
        echo CJavaScript::jsonEncode(array(
            'valid' => User::isValidPassword($password)
        ));
    }

    /**
     * Determines whether the given email address is valid.
     * The result is returned to the client in a JSON packet.
     *
     * @param email string a potential email address
     */
    public function actionValidateEmail($email)
    {
        echo CJavaScript::jsonEncode(array(
            'valid' => User::isValidEmail($email)
        ));
    }

    /**
     * Saves the given color theme and type as the preference for the current
     *  user, if one is logged in.
     * No data is returned to the client regarding the success of this
     *  operation.
     *
     * @param theme string the name of the color theme
     * @param type  string the type of the color theme
     */
    public function actionSaveTheme($theme, $type)
    {
        $user = User::getCurrentUser();
        if ($user !== null) {
            $user->theme = $theme;
            $user->theme_type = $type;
            $user->save();
        }
    }

    /**
     * Saves the given help setting as the preference for the current user, if
     *  one is logged in.
     * No data is returned to the client regarding the success of this
     *  operation.
     *
     * @param help string whether help tooltips should be shown, either "true"
     *                    or "false"
     */
    public function actionSaveHelp($help)
    {
        $user = User::getCurrentUser();
        if ($user !== null) {
            $user->help = filter_var($help, FILTER_VALIDATE_BOOLEAN);
            $user->save();
        }
    }

    /**
     * Resends the email verification code to the currently logged in user.
     */
    public function actionResendEmailVerification()
    {
        $this->sendEmailVerification();
    }

    /**
     * Sends an email to the user with the given username in order to allow the
     *  user to reset his password.
     *
     * @param username string the username for which to send a password reset
     *                        email
     */
    public function actionForgotPassword($username)
    {
        $success = false;
        $message = false;

        $user = User::findByUsername($username);

        if ($user === null) {
            $message = self::$MESSAGES['email_verification_impossible'];
        } elseif (!$user->email_verified) {
            $message = self::$MESSAGES['email_verification_impossible'];
        } else {
            $recovery = $user->password_recovery;

            if ($recovery === null) {
                $recovery = new RecoverPassword;
                $recovery->user_id = $user->id;
                $recovery->verification = self::generateVerificationCode();
                $recovery->attempts = 0;
                $recovery->save();
            } else {
                $recovery->attempts = 0;
                $recovery->save();
            }

            $url = Yii::app()->params['url'];
            $params = array(
                'url' => $url,
                'username' => $user->username,
                'verification' => $recovery->verification,
                'resetPage' => $url . $this->createUrl(
                    'site/resetpassword', array('username' => $username)
                ),
            );

            $message = new YiiMailMessage;
            $message->view = 'forgot-password';
            $message->subject = 'Metabolism Fun Password Reset';
            $message->setBody($params, 'text/html');
            $message->addTo($user->email);
            $message->from = Yii::app()->params['email'];

            try {
                Yii::app()->mail->send($message);
                $message = strtr(
                    self::$MESSAGES['password_reset_sent'],
                    array('%domain' => $user->getEmailDomain())
                );
                $success = true;
            } catch (Exception $e) {
                $message = self::$MESSAGES['internal_error'];
            }
        }
        
        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    /**
     * Generates a verification code used to verify an email address.
     *
     * @return a random verification code
     */
    private static function generateVerificationCode()
    {
        $values = str_split(self::VERIFICATION_VALUES);
        $keys = array_rand($values, self::VERIFICATION_LENGTH);

        for ($i = 0; $i < self::VERIFICATION_LENGTH; $i++) {
            $keys[$i] = $values[$keys[$i]];
        }

        shuffle($keys);
        return implode('', $keys);
    }

    /**
     * Generates a random salt in the crypt(3) standard Blowfish format.
     * Source code attribution belongs to "fsb" 
     *  <yiiframework.com/wiki/425/use-crypt-for-password-storage>.
     *
     * @param cost int cost parameter from 4 to 31, default 13
     * @return a Blowfish hash salt for use in PHP's crypt()
     * @throws Exception on invalid cost parameter
     */
    private static function blowfishSalt($cost = 13)
    {
        if (!is_numeric($cost) || $cost < 4 || $cost > 31) {
            throw new Exception("cost parameter must be between 4 and 31");
        }
        $rand = array();
        for ($i = 0; $i < 8; $i += 1) {
            $rand[] = pack('S', mt_rand(0, 0xffff));
        }
        $rand[] = substr(microtime(), 2, 6);
        $rand = sha1(implode('', $rand), true);
        $salt = '$2a$' . sprintf('%02d', $cost) . '$';
        $salt .= strtr(substr(base64_encode($rand), 0, 22), array('+' => '.'));
        return $salt;
    }

    /**
     * Sends an email verification message to the currently logged in player.
     *
     * @return true if the email was sent successfully, false otherwise
     */
    private function sendEmailVerification()
    {
        $user = User::getCurrentUser();

        $url = Yii::app()->params['url'];
        $params = array(
            'url' => $url,
            'username' => $user->username,
            'verification' => $user->email_verification,
            'email' => $user->email,
            'verifyPage' => $url . $this->createUrl(
                'site/verifyemail',
                array(
                    'email' => $user->email,
                    'username' => $user->username,
                )
            ),
        );

        $message = new YiiMailMessage;
        $message->view = 'verify-email';
        $message->subject = 'Welcome to Metabolism Fun!';
        $message->setBody($params, 'text/html');
        $message->addTo($user->email);
        $message->from = Yii::app()->params['email'];

        try {
            Yii::app()->mail->send($message);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}