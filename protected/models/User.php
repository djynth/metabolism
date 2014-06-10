<?php

/**
 * @db id                 int(11)         a unique user ID
 * @db username           varchar(255)    this user's chosen name
 * @db password           varchar(255)    this user's chosen password (hashed)
 * @db created            timestamp       the time of the account's creation
 * @db theme              varchar(8)      this user's chosen color theme
 * @db theme_type         varchat(20)     the type of this user's chosen theme
 * @db email              varchar(80)     the email address associated with this
 *                                        user
 * @db email_verified     tinyint(1)      whether the user has verified the
 *                                        email address
 * @db email_verification varchar(16)     the email verification code
 * @db help               tinyint(1)      whether the user has chosen to display
 *                                        help tooltips
 * @fk password_recovery  RecoverPassword
 */
class User extends CActiveRecord
{
    const DEFAULT_THEME = 'frosted';
    const DEFAULT_THEME_TYPE = 'light';

    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'users';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public function relations()
    {
        return array(
            'password_recovery' => array(
                self::HAS_ONE,
                'RecoverPassword',
                array('user_id' => 'id')
            ),
        );
    }

    public function authenticate($password)
    {
        return $this->password === crypt($password, $this->password);
    }

    public function getEmailDomain()
    {
        $split = split('@', $this->email);
        return $split[1];
    }

    public static function getCurrentUser()
    {
        if (Yii::app()->user->isGuest) {
            return null;
        }

        return self::model()->findByAttributes(array(
            'username' => Yii::app()->user->name
        ));
    }

    public static function isValidUsername($username)
    {
        return preg_match("/^[a-zA-Z0-9_-]{3,16}$/", $username);
    }

    public static function isValidPassword($password)
    {
        return preg_match("/^[a-zA-Z0-9:punct:]{3,32}$/", $password);
    }

    public static function isValidEmail($email)
    {
        return preg_match("/.+\@.+\..+/", $email);
    }

    public static function isUsernameTaken($username)
    {
        return self::model()->findByAttributes(array(
            'username' => $username
        )) !== null;
    }

    public static function isEmailTaken($email)
    {
        return self::model()->findByAttributes(array(
            'email' => $email
        )) !== null;
    }

    public static function getCurrentTheme()
    {
        $user = self::getCurrentUser();
        if ($user !== null) {
            return array(
                'theme' => $user->theme,
                'type'  => $user->theme_type,
            );
        } else {
            $cookies = Yii::app()->request->cookies;
            return array(
                'theme' => $cookies->contains('theme') ? 
                    $cookies['theme']->value : self::DEFAULT_THEME,
                'type' => $cookies->contains('theme_type') ?
                    $cookies['theme_type']->value : self::DEFAULT_THEME_TYPE,
            );
        }
    }
}