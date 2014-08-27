<?php

/**
 * @db user_id      int(11)   the ID of the User associated with this email
 *                            verification data
 * @db verified     int(1)    whether the email of the associated User has been
 *                            verified
 * @db verification char(16)  the verfication code
 * @db attempts     int(11)   the number of attempts that have been made to
 *                            verify this email
 * @db created      timestamp the time at which the verification was created
 * @fk user         User
 */
class EmailVerification extends CActiveRecord
{
    const MAX_ATTEMPTS = 10;
    const MAX_TIME = 86400;

    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'user_email_verification';
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

    public function attempt($verification)
    {
        if ($verification === $this->verification) {
            $this->verified = true;
        } else {
            $this->attempts++;
        }

        $this->save();
        return $this->verified;
    }
}