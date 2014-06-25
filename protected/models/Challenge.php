<?php

/**
 * @db id        int(11)     a unique challenge ID
 * @db name      varchar(80) the user-readable name of this challenge
 * @db max_turns int(11)     the turn count at which this challenge ends, or -1
 *                           if the cnallenge is not turn-limited
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
                array('challenge_id' => 'id'),
            ),
            'restrictions' => array(
                self::HAS_MANY,
                'ChallengeRestriction',
                array('challenge_id' => 'id'),
            ),
            'starts' => array(
                self::HAS_MANY,
                'ChallengeStart',
                array('challenge_id' => 'id'),
            ),
        );
    }

    public static function getFreePlay()
    {
        return self::model()->findByPk(0);
    }

    public function getStartingAmounts()
    {
        $amounts = array();
        foreach ($this->starts as $start) {
            $amounts[$start->resource_id] = array();
            foreach ($start->resource->organs as $organ) {
                $amounts[$start->resource_id][$organ->id] = 
                    $start->starting_value;
            }
        }
        return $amounts;
    }
}