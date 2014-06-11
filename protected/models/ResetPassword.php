<?php

/**
 * @db user_id      int(11)   the ID of the User associated with this reset
 *                            password attempt
 * @db verification char(16)  the verification code
 * @db attempts     int(11)   the number of attempts that have been made to
 *                            reset the password
 * @db created      timestamp the time at which this reset password attempt was
 *                            created
 * @fk user         User
 */
class ResetPassword extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'user_reset_password';
    }

    public function primaryKey()
    {
        return 'user_id';
    }

    public function relations()
    {
        return array(
            'user' => array(
                self::HAS_ONE,
                'User',
                array('id' => 'user_id')
            ),
        );
    }
}