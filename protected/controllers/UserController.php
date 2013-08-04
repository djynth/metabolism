<?php

class UserController extends Controller
{
    public function actions()
    {
        return array();
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

            $message = false;
            $success = false;
            if ($password === $confirm) {
                if (self::isValidPassword($password)) {
                    if (self::isValidUsername($username)) {     // TODO check if username exists
                        $record = new User;
                        $record->username = $username;
                        $record->password = crypt($password);
                        if ($record->save()) {
                            Yii::app()->user->login(new UserIdentity($username, $password), 3600*24);
                            $success = true;
                        } else {
                            $message = 'Unable to create your account';
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

    private static function isValidUsername($username)
    {
        return preg_match("/^[a-z0-9_-]{3,16}$/", $username);
    }

    private static function isValidPassword($password)
    {
        return preg_match("/^[a-z0-9:punct:]{3,32}$/", $password);
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
}