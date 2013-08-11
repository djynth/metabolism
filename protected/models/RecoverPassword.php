<?php

class RecoverPassword extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'recover_password';
    }

    public function primaryKey()
    {
        return 'user_id';
    }
}