<?php

/**
 * @db challenge_id   int(11)     the ID of the challenge for which a pathway
 *                                restriction is held
 * @db pathway_id     smallint(6) the ID of the restricted pathway
 * @db limit          int(11)     the maximum number of times the restricted
 *                                pathway can be run in the associated challenge
 * @fk challenge Challenge
 * @fk pathway Pathway
 */
class ChallengeRestriction extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'challenge_restrictions';
    }

    public function primaryKey()
    {
        return array('challenge_id', 'pathway_id');
    }

    public function relations()
    {
        return array(
            'challenge' => array(
                self::BELONGS_TO,
                'Challenge',
                array('challenge_id' => 'id'),
            ),
            'pathway' => array(
                self::BELONGS_TO,
                'Pathway',
                array('pathway_id' => 'id'),
            ),
        );
    }

    public function __toString()
    {
        if ($this->limit == 0) {
            return $this->pathway->name . ' disabled';
        } elseif ($this->limit == 1) {
            return $this->pathway->name . ' limited to 1 run per turn';
        } else {
            return $this->pathway->name . ' limited to ' . $this->limit . 
                   ' runs per turn';
        }
    }
}