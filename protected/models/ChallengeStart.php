<?php

/**
 * @db challenge_id   int(11)     the ID of the challenge for which a starting
 *                                value is held
 * @db resource_id    smallint(6) the ID of the associated resource
 * @db starting_value int(11)     the amount at which the associated resource
 *                                should start in the associated challenge
 * @fk challenge Challenge
 * @fk resource  Resource
 */
class ChallengeStart extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'challenge_starts';
    }

    public function primaryKey()
    {
        return array('challenge_id', 'resource_id');
    }

    public function relations()
    {
        return array(
            'challenge' => array(
                self::BELONGS_TO,
                'Challenge',
                array('challenge_id' => 'id'),
            ),
            'resource' => array(
                self::BELONGS_TO,
                'Resource',
                array('resource_id' => 'id'),
            ),
        );
    }
}