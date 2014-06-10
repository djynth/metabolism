<?php

class UserController extends CController
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
            'Either that user does not exist or does not have a verified email
            address. Contact us to recover your account.',
        'password_reset_sent' =>
            'A password recovery email was sent to your email address at
            %domain.',
    );

    public function getActionParams()
    {
        return array_merge($_GET, $_POST);
    }

    public function actionValidate($type, $value)
    {
        $valid = false;
        if ($type === 'username') {
            $valid = User::isValidUsername($value);
        } else if ($type === 'password') {
            $valid = User::isValidPassword($value);
        } else if ($type === 'email') {
            $valid = User::isValidEmail($value);
        }
        echo CJavaScript::jsonEncode(array('valid' => $valid));
    }

    public function actionLogin($username, $password)
    {
        $success = false;
        $message = false;
        $user = User::model()->findByAttributes(array('username' => $username));
        if ($user !== null && $user->authenticate($password)) {
            Yii::app()->user->login(
                new CUserIdentity($username, $password),
                self::LOGIN_DURATION
            );
            $success = true;
        } else {
            $message = self::$MESSAGES['incorrect_login'];
        }

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    public function actionLogout()
    {
        Yii::app()->user->logout();
    }

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
                    new CUserIdentity($username, $password),
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

    public function actionVerifyEmail($username, $verification)
    {
        $success = false;
        $message = false;
        $user = User::model()->findByAttributes(array(
            'username' => $username
        ));

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

    public function actionResetPassword($username, $verification, $new_password)
    {
        $success = false;
        $message = false;
        $user = User::model()->findByAttributes(array(
            'username' => $username
        ));

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

    public function actionSaveTheme($theme, $type)
    {
        $user = User::getCurrentUser();
        if ($user !== null) {
            $user->theme = $theme;
            $user->theme_type = $type;
            $user->save();
        }

        $cookies = Yii::app()->request->cookies;
        $cookies['theme'] = new CHttpCookie('theme', $theme, array(
            'expire' => time() + self::LOGIN_DURATION,
        ));
        $cookies['theme_type'] = new CHttpCookie('theme_type', $type, array(
            'expire' => time() + self::LOGIN_DURATION,
        ));
    }

    public function actionResendEmailVerification()
    {
        $this->sendEmailVerification();
    }

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

            $params = array(
                'username' => $user->username,
                'resetPage' => Yii::app()->params['url'] . $this->createUrl(
                    'site/resetpassword', array(
                        'username' => $username,
                        'verification' => $recovery->verification,
                    )
                ),
            );

            $message = new YiiMailMessage;
            $message->view = 'forgot-password';
            $message->subject = Yii::app()->name . ' Password Reset';
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
            'email' => $user->email,
            'verifyPage' => Yii::app()->params['url'] . $this->createUrl(
                'site/verifyemail',
                array(
                    'email' => $user->email,
                    'username' => $user->username,
                    'verification' => $user->email_verification,
                )
            ),
        );

        $message = new YiiMailMessage;
        $message->view = 'verify-email';
        $message->subject = 'Welcome to ' . Yii::app()->name;
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