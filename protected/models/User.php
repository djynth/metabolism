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
 * @fk email_verification EmailVerification
 * @fk reset_password     ResetPassword
 */
class User extends CActiveRecord
{
    const DEFAULT_THEME = 'frosted';
    const DEFAULT_THEME_TYPE = 'light';
    const VERIFICATION_LENGTH = 16;
    const VERIFICATION_VALUES = 
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

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
            'email_verification' => array(
                self::HAS_ONE,
                'EmailVerification',
                array('user_id' => 'id'),
            ),
            'reset_password' => array(
                self::HAS_ONE,
                'ResetPassword',
                array('user_id' => 'id'),
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

    public function createEmailVerification()
    {
        if ($this->email_verification === null) {
            $this->email_verification = new EmailVerification;
            $this->email_verification->user_id = $this->id;
        }

        $this->email_verification->verification = 
            self::generateVerificationCode();
        try {
            $this->email_verification->save();
            return $this->sendEmailVerification();
        } catch (Exception $e) {
            return false;
        }
    }

    public function sendEmailVerification()
    {
        $params = array(
            'username' => $this->username,
            'email' => $this->email,
            'verifyPage' => Yii::app()->params['url'] . Yii::app()->createUrl(
                'site/index',
                array(
                    'action' => 'verify-email',
                    'username' => $this->username,
                    'verification' => $this->email_verification->verification,
                )
            ),
        );

        $message = new YiiMailMessage;
        $message->view = 'verify-email';
        $message->subject = 'Verify Your ' . Yii::app()->name . ' Email';
        $message->setBody($params, 'text/html');
        $message->addTo($this->email);
        $message->from = Yii::app()->params['email'];

        try {
            Yii::app()->mail->send($message);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function createResetPassword()
    {
        if ($this->reset_password === null) {
            $this->reset_password = new ResetPassword;
            $this->reset_password->user_id = $this->id;
        }

        $this->reset_password->verification = self::generateVerificationCode();
        try {
            $this->reset_password->save();
            return $this->sendResetPassword();
        } catch (Exception $e) {
            return false;
        }
    }

    public function sendResetPassword()
    {
        $params = array(
            'username' => $this->username,
            'resetPage' => Yii::app()->createAbsoluteUrl(
                'site/index',
                array(
                    'action' => 'reset-password',
                    'username' => $this->username,
                    'verification' => $this->reset_password->verification,
                )
            ),
        );

        $message = new YiiMailMessage;
        $message->view = 'reset-password';
        $message->subject = 'Reset Your ' . Yii::app()->name . ' Password';
        $message->setBody($params, 'text/html');
        $message->addTo($this->email);
        $message->from = Yii::app()->params['email'];

        try {
            Yii::app()->mail->send($message);
            return true;
        } catch (Exception $e) {
            return false;
        }
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