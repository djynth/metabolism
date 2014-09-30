<?php

class UserController extends CController
{
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
        'email_verify_sent' =>
            'A verification email was sent to your address at %domain.',
        'password_reset_too_soon' =>
            'A password recovery email has been sent for this account too
            recently.',
        'password_reset_sent' =>
            'A password recovery email was sent to your email address at
            %domain.',
    );

    public function getActionParams()
    {
        return array_merge($_GET, $_POST);
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

    public function actionSaveBinding($action, $key)
    {
        $user = User::getCurrentUser();
        if ($user !== null) {
            $keybind = UserKeyboardShortcut::model()->findByAttributes(array(
                'user_id' => $user->id,
                'action'  => $action,
            ));

            if ($keybind === null) {
                $keybind = new UserKeyboardShortcut();
                $keybind->user_id = $user->id;
                $keybind->action = $action;
            }

            $keybind->key = $key;
            $keybind->save();
        }

        $cookies = Yii::app()->request->cookies;
        $cookie_name = self::getBindingCookieName($action);
        $cookies[$cookie_name] = new CHttpCookie($cookie_name, $key, array(
            'expire' => time() + self::LOGIN_DURATION,
        ));
    }

    public function actionRemoveBinding($action)
    {
        $user = User::getCurrentUser();
        if ($user !== null) {
            $keybind = UserKeyboardShortcut::model()->findByAttributes(array(
                'user_id' => $user->id,
                'action'  => $action,
            ));

            if ($keybind !== null) {
                $keybind->delete();
            }
        }

        $cookies = Yii::app()->request->cookies;
        unset($cookies[self::getBindingCookieName($action)]);
    }

    public function actionSavePreference($preference_id, $option_id)
    {
        $user = User::getCurrentUser();
        if ($user !== null) {
            $userPreference = UserPreference::model()->findByAttributes(array(
                'user_id'       => $user->id,
                'preference_id' => $preference_id,
            ));

            if ($userPreference === null) {
                $userPreference = new UserPreference();
                $userPreference->user_id = $user->id;
                $userPreference->preference_id = $preference_id;
            }

            $userPreference->option_id = $option_id;
            $userPreference->save();
        }

        $cookies = Yii::app()->request->cookies;
        $cookie_name = self::getPreferenceCookieName($preference_id);
        $cookies[$cookie_name] = new CHttpCookie(
            $cookie_name,
            $option_id,
            array(
                'expire' => time() + self::LOGIN_DURATION,
            )
        );
    }

    public function actionValidate($type, $value)
    {
        $valid = true;
        $message = '';
        if ($type === 'username') {
            if (!User::isValidUsername($value)) {
                $valid = false;
                $message = 'Invalid username';
            } elseif (User::isUsernameTaken($value)) {
                $valid = false;
                $message = 'Username taken';
            }
        } else if ($type === 'password') {
            if (!User::isValidPassword($value)) {
                $valid = false;
                $message = 'Invalid password';
            }
        } else if ($type === 'email') {
            if (!User::isValidEmail($value)) {
                $valid = false;
                $message = 'Invalid email address';
            } elseif (User::isEmailTaken($value)) {
                $valid = false;
                $message = 'Email address in use';
            }
        }
        echo CJavaScript::jsonEncode(array(
            'valid' => $valid,
            'message' => $message
        ));
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
            if ($user->save()) {
                Yii::app()->user->login(
                    new CUserIdentity($username, $password),
                    self::LOGIN_DURATION
                );
                $success = true;

                $user->createEmailVerification();
            } else {
                $message = self::$MESSAGES['internal_error'];
            }
        }
        
        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    public function actionDeleteAccount($password)
    {
        $success = false;
        $message = false;

        $user = User::getCurrentUser();

        if ($user === null) {
            $message = self::$MESSAGES['not_logged_in'];
        } elseif (!$user->authenticate($password)) {
            $message = self::$MESSAGES['incorrect_login'];
        } else {
            if ($user->delete()) {
                Yii::app()->user->logout();
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
            if ($user->save()) {
                if ($user->email_verification !== null) {
                    $user->email_verification->delete();
                    $user->email_verification = null;
                }

                $user->createEmailVerification();
                $success = true;
                $message = self::$MESSAGES['email_update'];
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

        if ($user === null || $user->email_verification === null) {
            $message = self::$MESSAGES['email_verify_incorret'];
        } elseif ($user->email_verification->verified) {
            $message = self::$MESSAGES['email_already_verified'];
            $success = true;
        } else {
            if ($user->email_verification->attempt($verification)) {
                $message = self::$MESSAGES['email_verified'];
                $success = true;
            } else {
                $message = self::$MESSAGES['email_verify_incorret'];
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

        if ($user === null || $user->reset_password === null) {
            $message = self::$MESSAGES['email_verify_incorret'];
        } else if (!$user->email_verification->verified) {
            $message = self::$MESSAGES['email_verification_impossible'];
        } else {
            if ($user->reset_password->attempt($verification)) {
                $user->password = crypt($new_password, self::blowfishSalt());
                if ($user->save() && $user->reset_password->delete()) {
                    $success = true;
                    $message = self::$MESSAGES['password_update'];
                } else {
                    $message = self::$MESSAGES['internal_error'];
                }
            } else {
                $message = self::$MESSAGES['email_verify_incorret'];
            }
        }

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'message' => $message,
        ));
    }

    public function actionResendEmailVerification()
    {
        $user = User::getCurrentUser();
        $user->sendEmailVerification();

        echo CJavaScript::jsonEncode(array(
            'success' => true,
            'message' => strtr(
                self::$MESSAGES['email_verify_sent'],
                array('%domain' => $user->getEmailDomain())
            ),
        ));
    }

    public function actionForgotPassword($username)
    {
        $success = false;
        $message = false;
        $user = User::model()->findByAttributes(array(
            'username' => $username
        ));

        if ($user === null || $user->email_verification === null) {
            $message = self::$MESSAGES['email_verification_impossible'];
        } elseif (!$user->email_verification->verified) {
            $message = self::$MESSAGES['email_verification_impossible'];
        } elseif ($user->reset_password !== null && 
                  time() - strtotime($user->reset_password->created) <= 60*60) {
            $message = self::$MESSAGES['password_reset_too_soon'];
        } else {
            if ($user->createResetPassword()) {
                $message = strtr(
                    self::$MESSAGES['password_reset_sent'],
                    array('%domain' => $user->getEmailDomain())
                );
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

    public static function getBindingCookieName($action)
    {
        return 'binding_' . $action;
    }

    public static function getPreferenceCookieName($preference_id)
    {
        $pref = Preference::model()->findByAttributes(array(
            'id' => $preference_id
        ));

        if ($pref === null) {
            return null;
        }

        return 'pref_' . str_replace(' ', '_', strtolower($pref->name));
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
}