<?php

/**
 * @db user_id       int(11) the ID of the user to whom this preference belongs
 * @db preference_id int(11) the ID of the preference in question
 * @db option_id     int(11) the ID of the option set by the user
 * @fk user          User
 * @fk preference    Preference
 * @fk option        PreferenceOption
 */
class UserPreference extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'user_preferences';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public function relations()
    {
        return array(
            'user' => array(
                self::BELONGS_TO,
                'User',
                array('user_id' => 'id'),
            ),
            'preference' => array(
                self::BELONGS_TO,
                'Preference',
                array('preference_id' => 'id'),
            ),
            'option' => array(
                self::BELONGS_TO,
                'PreferenceOption',
                array('option_id' => 'option_id'),
            ),
        );
    }
}