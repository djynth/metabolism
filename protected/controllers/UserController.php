<?php

class UserController extends Controller
{
    const VERIFICATION_LENGTH = 16;
    const VERIFICATION_VALUES = 
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const MAX_RECOVER_PASSWORD_ATTEMPTS = 10;
    const LOGIN_DURATION = 3600*24;

    const MESSAGES = array(
        'internal_error' => 'An internal error occurred.',
        'incorrect_login' => 'Incorrect username or password',
        'password_confirmation_conflict' =>
            'Password and confirmation do not match.',
        'invalid_username' => 'Invalid username.',
        'invalid_password' => 'Invalid password.',
        'invalid_email' => 'Invalid email address.',
        'username_taken' => 'That username is taken.',
        'email_taken' => 'That email address is taken.',
    )

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
            $message = self::MESSAGES['incorrect_login'];
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
     * TODO: stopped here
     *
     * @param username string
     * @param password string
     * @param confirm string
     * @param theme string
     * @param email string
     */
    public function actionCreateAccount($username, $password, $confirm, $theme,
                                        $email)
    {
        $message = false;
        $success = false;

        if ($password !== $confirm) {
            $message = self::MESSAGES['password_confirmation_conflict'];
        } elseif (!self::isValidPassword($password)) {
            $message = self::MESSAGES['invalid_password'];
        } elseif (!self::isValidUsername($username)) {
            $message = self::MESSAGES['invalid_username'];
        } elseif (User::isUsernameTaken($username)) {
            $message = self::MESSAGES['username_taken'];
        } elseif (!User::isValidEmail($email)) {
            $message = self::MESSAGES['invalid_email'];
        } elseif (User::isEmailTaken($email)) {
            $message = self::MESSAGES['email_taken'];
        } else {
            $user = new User;
            $user->username = $username;
            $user->password = crypt($password, self::blowfishSalt());
            $user->theme = $theme;
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
                $message = self::MESSAGES['internal_error'];
            }
        }
        
        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    public function actionChangePassword()
    {
        if (isset($_POST['current'], $_POST['new_password'], $_POST['confirm'])) {
            $current = $_POST['current'];
            $new     = $_POST['new_password'];
            $confirm = $_POST['confirm'];

            $success = false;
            $message = false;

            $user = User::getCurrentUser();
            if ($user !== null) {
                if ($new === $confirm) {
                    if (self::isValidPassword($new)) {
                        if ($user->authenticate($current)) {
                            $user->password = crypt($new, self::blowfishSalt());
                            if ($user->save()) {
                                $success = true;
                                $message = 'Your password has been updated.';
                            } else {
                                $message = self::MESSAGE_INTERNAL_ERROR;
                            }
                        } else {
                            $message = 'Incorrect current password.';
                        }
                    } else {
                        $message = 'Invalid new password.';
                    }
                } else {
                    $message = 'New password and confirmation do not match.';
                }
            } else {
                $message = 'You must be logged in to change your password.';
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
    }

    public function actionChangeEmail()
    {
        if (isset($_POST['email'], $_POST['password'])) {
            $email    = $_POST['email'];
            $password = $_POST['password'];

            $success = false;
            $message = false;

            $user = User::getCurrentUser();
            if ($user !== null) {
                if (self::isValidEmail($email)) {
                    if (!User::isEmailTaken()) {
                        if ($user->authenticate($password)) {
                            $user->email = $email;
                            $user->email_verified = false;
                            $user->email_verification = self::generateVerificationCode();
                            if ($user->save()) {
                                $success = true;
                                $message = 'Your email has been updated.';

                                $this->sendEmailVerification();
                            } else {
                                $message = self::MESSAGE_INTERNAL_ERROR;
                            }
                        } else {
                            $message = 'Incorrect password.';
                        }
                    } else {
                        $message = 'That email address is taken.';
                    }
                } else {
                    $message = 'Invalid email address.';
                }
            } else {
                $message = 'You must be logged in to change your email address.';
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
    }

    public function actionVerifyEmail()
    {
        if (isset($_POST['username'], $_POST['verification'])) {
            $username     = $_POST['username'];
            $verification = $_POST['verification'];

            $success = false;
            $message = false;

            $user = User::findByUsername($username);
            if ($user !== null) {
                if (!$user->email_verified) {
                    if ($user->email_verification === $verification) {
                        $user->email_verified = true;
                        if ($user->save()) {
                            $message = 'The email address ' . $user->email . ' has been verified.';
                            $success = true;
                        } else {
                            $message = self::MESSAGE_INTERNAL_ERROR;
                        }
                    } else {
                        $message = 'Incorrect verfication code.';
                    }
                } else {
                    $success = true;
                    $message = 'Your email has already been verified.';
                }
            } else {
                $message = 'Account "' . $username . '" not found.';
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        } else {
            $email = isset($_GET['email']) ? $_GET['email'] : '';
            $username = isset($_GET['username']) ? $_GET['username'] : '';

            $this->render('verify-email', array(
                'email' => $email,
                'username' => $username,
            ));
        }
    }

    public function actionResetPassword()
    {
        if (isset($_POST['username'], $_POST['verification'], $_POST['new_password'], $_POST['confirm'])) {
            $username     = $_POST['username'];
            $verification = $_POST['verification'];
            $new          = $_POST['new_password'];
            $confirm      = $_POST['confirm'];

            $success = false;
            $message = false;

            if ($username) {
                if ($new === $confirm) {
                    $user = User::findByUsername($username);
                    if ($user !== null) {
                        $request = RecoverPassword::model()->findByAttributes(array('user_id' => $user->id));
                        if ($request !== null) {
                            if ($verification === $request->verification) {
                                $user->password = crypt($new, self::blowfishSalt());
                                if ($user->save()) {
                                    $request->delete();
                                    $success = true;
                                    $message = 'Your password has been reset.';
                                } else {
                                    $message = self::MESSAGE_INTERNAL_ERROR;
                                }
                            } else {
                                $request->attempts++;
                                $request->save();
                                if ($request->attempts > self::MAX_RECOVER_PASSWORD_ATTEMPTS) {
                                    $request->delete();
                                }

                                $message = 'Incorrect verification code.';
                            }
                        } else {
                            $message = 'There is no password recovery request open for ' . $username . '.';
                        }
                    } else {
                        $message = 'Account "' . $username . '"" not found.';
                    }
                } else {
                    $message = 'The new and confirmation passwords do not match.';
                }
            } else {
                $message = 'No username given.';
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        } else {
            $username = isset($_GET['username']) ? $_GET['username'] : '';

            $this->render('reset-password', array(
                'username' => $username,
            ));
        }
    }

    public function actionValidateUsername()
    {
        if (isset($_POST['username'])) {
            echo CJavaScript::jsonEncode(array(
                'valid' => self::isValidUsername($_POST['username'])
            ));
        }
    }

    public function actionValidatePassword()
    {
        if (isset($_POST['password'])) {
            echo CJavaScript::jsonEncode(array(
                'valid' => self::isValidPassword($_POST['password'])
            ));
        }
    }

    public function actionValidateEmail()
    {
        if (isset($_POST['email'])) {
            echo CJavaScript::jsonEncode(array(
                'valid' => self::isValidEmail($_POST['email'])
            ));
        }
    }

    public function actionSaveTheme()
    {
        if (isset($_POST['theme']) && isset($_POST['theme_type'])) {
            $user = User::getCurrentUser();
            if ($user !== null) {
                $user->theme = $_POST['theme'];
                $user->theme_type = $_POST['theme_type'];
                $user->save();
            }
        }
    }

    public function actionSaveHelp()
    {
        if (isset($_POST['help'])) {
            $user = User::getCurrentUser();
            if ($user !== null) {
                $user->help = filter_var($_POST['help'], FILTER_VALIDATE_BOOLEAN);
                $user->save();
            }
        }
    }

    public function actionResendEmailVerification()
    {
        $this->sendEmailVerification();
    }

    public function actionForgotPassword()
    {
        if (isset($_POST['username'])) {
            $username = $_POST['username'];

            $success = false;
            $message = false;

            if ($username) {
                $user = User::findByUsername($username);
                if ($user !== null) {
                    if ($user->email_verified) {
                        $request = RecoverPassword::model()->findByAttributes(array('user_id' => $user->id));
                        if ($request === null) {
                            $request = new RecoverPassword;
                            $request->user_id = $user->id;
                            $request->verification = self::generateVerificationCode();
                            $request->save();
                        }
                        
                        $params = array(
                            'username' => $user->username,
                            'verification' => $request->verification,
                            'resetPage' => Yii::app()->params['url'] . $this->createUrl('user/resetpassword', array(
                                'username' => $username,
                            )),
                        );

                        $message = new YiiMailMessage;
                        $message->view = 'forgot-password';
                        $message->subject = 'Recover Your Password';
                        $message->setBody($params, 'text/html');
                        $message->addTo($user->email);
                        $message->from = Yii::app()->params['email'];

                        try {
                            Yii::app()->mail->send($message);
                        } catch (Exception $e) { }

                        $message = 'A password recovery email was sent to your email address at ' . $user->getEmailDomain() . '.';
                        $success = true;
                    } else {
                        $message = 'You do not have a verified email address on file. Please contact us to reset your account.';
                    }
                } else {
                    $message = 'Account "' . $username . '"" not found.';
                }
            } else {
                $message = 'Please enter a username.';
            }
            
            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
    }

    private static function isValidUsername($username)
    {
        return preg_match("/^[a-zA-Z0-9_-]{3,16}$/", $username);
    }

    private static function isValidPassword($password)
    {
        return preg_match("/^[a-zA-Z0-9:punct:]{3,32}$/", $password);
    }

    private static function isValidEmail($email)
    {
        return preg_match("/.+\@.+\..+/", $email);
    }

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
     * Generate a random salt in the crypt(3) standard Blowfish format.
     * Source code attribution belongs to "fsb" <yiiframework.com/wiki/425/use-crypt-for-password-storage>.
     *
     * @param int $cost Cost parameter from 4 to 31, default 13
     * @return string A Blowfish hash salt for use in PHP's crypt()
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

    private function sendEmailVerification()
    {
        $user = User::getCurrentUser();

        $params = array(
            'username' => $user->username,
            'verification' => $user->email_verification,
            'email' => $user->email,
            'verifyPage' => Yii::app()->params['url'] . $this->createUrl('user/verifyemail', array(
                'email' => $user->email,
                'username' => $user->username,
            )),
        );

        $message = new YiiMailMessage;
        $message->view = 'verify-email';
        $message->subject = 'Welcome to Metabolism Fun!';
        $message->setBody($params, 'text/html');
        $message->addTo($user->email);
        $message->from = Yii::app()->params['email'];

        try {
            Yii::app()->mail->send($message);
        } catch (Exception $e) { }
    }
}