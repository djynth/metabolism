<?php

class User extends CActiveRecord
{
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

        return self::findByUsername(Yii::app()->user->id);
    }

    public static function findByUsername($username)
    {
        return self::model()->findByAttributes(array('username' => $username));
    }

    public static function isUsernameTaken($username)
    {
        return self::model()->findByAttributes(array('username' => $username)) !== null;
    }

    public static function isEmailTaken($email)
    {
        return self::model()->findByAttributes(array('email' => $email)) !== null;
    }
}