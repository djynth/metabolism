<?php

/**
 * @db preference_id the ID of the preference of which this is an option
 * @db option_id     a unique ID for this option among all preference options
 * @db name          the user-readable name of this option
 * @fk preference    Preference
 */
class PreferenceOption extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'preference_options';
    }

    public function primaryKey()
    {
        return 'option_id';
    }

    public function relations()
    {
        return array(
            'preference' => array(
                self::BELONGS_TO,
                'Preference',
                array('preference_id' => 'id'),
            ),
        );
    }
}