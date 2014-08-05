<?php

/**
 * @db challenge_id   int(11)     the ID of the challenge for which a goal is
 *                                held
 * @db resource_id    smallint(6) the ID of the resource which must be within a
 *                                certain range for the goal to be met
 * @db organ_id       smallint(6) the ID of the organ in which the resource must
 *                                meet the goal
 * @db min            int(11)     the smallest value for which the resource
 *                                meets the goal, or null if there is no minimum
 * @db max            int(11)     the largest value for which the resource meets
 *                                the goal, or null if there is no maximum
 * 
 * @fk challenge Challenge
 * @fk resource  Resource
 * @fk organ     Organ
 */
class ChallengeGoal extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'challenge_goals';
    }

    public function primaryKey()
    {
        return array('challenge_id', 'resource_id', 'organ_id');
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
            'organ' => array(
                self::BELONGS_TO,
                'Organ',
                array('organ_id' => 'id'),
            ),
        );
    }

    public function isMet()
    {
        $amount = $this->resource->getAmount($this->organ);
        return ($this->min === null || $amount >= $this->min) &&
               ($this->max === null || $amount <= $this->max);
    }

    public function __toString()
    {
        return ($this->min !== null ? $this->min . ' < ' : '') . 
               $this->resource->name . 
               ($this->max !== null ? ' > ' . $this->max : '') . 
               ' in ' . $this->organ->name;
    }
}