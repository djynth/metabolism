<?php

/**
 * @db user_id      int(11)  the ID of the user to whom this password recovery
 *                           belongs
 * @db verification char(16) the verification code associated with this password
 *                           recovery
 * @db attempts     int(11)  the number of times the password has been attempted
 *                           to be recovered
 * @fk user         User
 */
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

    public function relations()
    {
        return array(
            'user' => array(self::HAS_ONE, 'User', array('user_id' => 'id')),
        );
    }
}