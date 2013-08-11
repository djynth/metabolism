<?php

class UserController extends CController
{
    const EMAIL_VERIFICATION_LENGTH = 16;
    const EMAIL_VERIFICATION_VALUES = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    public function actionVerifyEmail()
    {
        if (isset($_POST) && count($_POST) > 0) {
            $username = $_POST['username'];
            $verification = $_POST['verification'];

            $success = false;
            $message = false;

            $user = User::model()->findByAttributes(array('username' => $username));
            if ($user !== null) {
                if (!$user->email_verified) {
                    if ($user->email_verification === $verification) {
                        $user->email_verified = true;
                        if ($user->save()) {
                            $message = 'The email address ' . $user->email . ' has been verified!';
                            $success = true;
                        } else {
                            $message = 'There was an error updating your email verification status';
                        }
                    } else {
                        $message = 'Incorrect verfication code';
                    }
                } else {
                    $success = true;
                    $message = 'Your email has already been verified';
                }
            } else {
                $message = 'Unable to find an account with the username ' . $username;
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

    public function actionLogin()
    {
        if (isset($_POST)) {
            $username = $_POST['username'];
            $password = $_POST['password'];

            $success = false;
            $message = false;
            $identity = new UserIdentity($username, $password);
            if ($identity->authenticate()) {
                Yii::app()->user->login($identity, 3600*24);
                $success = true;
            } else {
                $message = 'Invalid username or password';
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
    }

    public function actionCreateAccount()
    {
        if (isset($_POST)) {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $confirm = $_POST['confirm'];
            $theme = $_POST['theme'];
            $email = $_POST['email'];

            $message = false;
            $success = false;
            if ($password === $confirm) {
                if (self::isValidPassword($password)) {
                    if (self::isValidUsername($username)) {
                        if (!self::isUsernameTaken($username)) {
                            if (self::isValidEmail($email)) {
                                if (!self::isEmailTaken($email)) {
                                    $record = new User;
                                    $record->username = $username;
                                    $record->password = crypt($password, self::blowfishSalt());
                                    $record->theme = $theme;
                                    $record->email = $email;
                                    $record->email_verified = false;
                                    $record->email_verification = self::generateEmailVerification();
                                    if ($record->save()) {
                                        Yii::app()->user->login(new UserIdentity($username, $password), 3600*24);
                                        $success = true;

                                        $params = array(
                                            'username' => $username,
                                            'verification' => $record->email_verification,
                                            'email' => $email,
                                            'verifyPage' => Yii::app()->params['url'] . $this->createUrl('user/verifyemail', array(
                                                'email' => $email,
                                                'username' => $username,
                                            )),
                                        );

                                        $message = new YiiMailMessage;
                                        $message->view = 'verify-email';
                                        $message->subject = 'Welcome to Metabolism Fun!';
                                        $message->setBody($params, 'text/html');
                                        $message->addTo($email);
                                        $message->from = Yii::app()->params['email'];

                                        try {
                                            Yii::app()->mail->send($message);
                                        } catch (Exception $e) { }
                                    } else {
                                        $message = 'Unable to create your account';
                                    }
                                } else {
                                    $message = 'That email address is taken';
                                }
                            } else {
                                $message = 'Invalid email address';
                            }
                        } else {
                            $message = 'That username is taken';
                        }
                    } else {
                        $message = 'Invalid username';
                    }
                } else {
                    $message = 'Invalid password';
                }
            } else {
                $message = 'Password and confirmation do not match';
            }
            
            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
    }

    public function actionLogout()
    {
        Yii::app()->user->logout();
    }

    public function actionChangePassword()
    {
        if (isset($_POST)) {
            $current = $_POST['current'];
            $new = $_POST['newPassword'];
            $confirm = $_POST['confirm'];

            $success = false;
            $message = false;
            if (!Yii::app()->user->isGuest) {
                $user = User::model()->findByAttributes(array('username' => Yii::app()->user->id));
                if ($user !== null) {
                    if ($new === $confirm) {
                        if (self::isValidPassword($new)) {
                            if ($user->authenticate($current)) {
                                $user->password = crypt($new);
                                if ($user->save()) {
                                    $success = true;
                                    $message = 'Successfully changed your password';
                                } else {
                                    $message = 'Unable to update your account';
                                }
                            } else {
                                $message = 'Incorrect password';
                            }
                        } else {
                            $message = 'Invalid password';
                        }
                    } else {
                        $message = 'New password and confirmation do not match';
                    }
                } else {
                    $message = 'Unable to find your account';
                }
            } else {
                $message = 'You must be logged in to change your password';
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
    }

    public function actionValidateUsername()
    {
        echo CJavaScript::jsonEncode(array(
            'valid' => self::isValidUsername($_POST['username'])
        ));
    }

    public function actionValidatePassword()
    {
        echo CJavaScript::jsonEncode(array(
            'valid' => self::isValidPassword($_POST['password'])
        ));
    }

    public function actionValidateEmail()
    {
        echo CJavaScript::jsonEncode(array(
            'valid' => self::isValidEmail($_POST['email'])
        ));
    }

    private static function isValidUsername($username)
    {
        return preg_match("/^[a-z0-9_-]{3,16}$/", $username);
    }

    private static function isValidPassword($password)
    {
        return preg_match("/^[a-z0-9:punct:]{3,32}$/", $password);
    }

    private static function isValidEmail($email)
    {
        return preg_match("/.+\@.+\..+/", $email);
    }

    private static function isUsernameTaken($username)
    {
        return User::model()->findByAttributes(array('username' => $username)) !== null;
    }

    private static function isEmailTaken($email)
    {
        return User::model()->findByAttributes(array('email' => $email)) !== null;
    }

    private static function generateEmailVerification()
    {
        $values = str_split(self::EMAIL_VERIFICATION_VALUES);
        $keys = array_rand($values, self::EMAIL_VERIFICATION_LENGTH);

        for ($i = 0; $i < self::EMAIL_VERIFICATION_LENGTH; $i++) {
            $keys[$i] = $values[$keys[$i]];
        }

        shuffle($keys);
        return implode('', $keys);
    }

    public function actionSaveTheme()
    {
        if (isset($_POST)) {
            $theme = $_POST['theme'];

            if (!Yii::app()->user->isGuest) {
                $user = User::model()->findByAttributes(array('username' => Yii::app()->user->id));
                $user->theme = $theme;
                $user->save();
            }
        }
    }

    public function actionChangeEmail()
    {
        if (isset($_POST)) {
            $email = $_POST['email'];
            $password = $_POST['password'];

            $success = false;
            $message = false;
            if (!Yii::app()->user->isGuest) {
                $user = User::model()->findByAttributes(array('username' => Yii::app()->user->id));
                if ($user !== null) {
                    if (self::isValidEmail($email)) {
                        if ($user->authenticate($password)) {
                            $user->email = $email;
                            $user->email_verified = false;
                            $record->email_verification = self::generateEmailVerification();
                            if ($user->save()) {
                                $success = true;
                                $message = 'Successfully changed your email';
                            } else {
                                $message = 'Unable to update your account';
                            }
                        } else {
                            $message = 'Incorrect password';
                        }
                    } else {
                        $message = 'Invalid email';
                    }
                } else {
                    $message = 'Unable to find your account';
                }
            } else {
                $message = 'You must be logged in to change your email';
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
    }

    public function actionForgotPassword()
    {
        if (isset($_POST)) {
            $username = $_POST['username'];

            $success = false;
            $message = false;

            if ($username) {
                $user = User::model()->findByAttributes(array('username' => $username));
                if ($user !== null) {
                    if ($user->email_verified) {
                        $params = array(
                            'username' => $user->username,
                            'password' => '<password>',
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

                        $message = 'An email was sent to your email at ' . split('@', $user->email)[1] . ' with your password';
                        $success = true;
                    } else {
                        $message = $username . ' does not have a verified email address on file. Please contact us to reset your account.';
                    }
                } else {
                    $message = $username . ' does not exist';
                }
            } else {
                $message = 'Please enter a username';
            }
            
            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'message' => $message,
            ));
        }
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
}