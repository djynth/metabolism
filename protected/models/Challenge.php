<?php

/**
 * @db id   int(11)     a unique challenge ID
 * @db name varchar(80) the user-readable name of this challenge
 * @fk limits       array(ChallengeLimit)
 * @fk restrictions array(ChallengeRestriction)
 * @fk starts       array(ChallengeStart)
 */
class Challenge extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'challenges';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public function relations()
    {
        return array(
            'limits' => array(
                self::HAS_MANY,
                'ChallengeLimit',
                array('id' => 'challenge_id'),
            ),
            'restrictions' => array(
                self::HAS_MANY,
                'ChallengeRestriction',
                array('id' => 'challenge_id'),
            ),
            'starts' => array(
                self::HAS_MANY,
                'ChallengeStart',
                array('id' => 'challenge_id'),
            ),
        );
    }
}