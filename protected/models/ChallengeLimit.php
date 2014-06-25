<?php

/**
 * @db challenge_id   int(11)       the ID of the challenge for which a limit is
 *                                  held
 * @db resource_id    smallint(6)   the ID of the limited resource
 * @db hard_min       int(11)       the hard minimum for the limited resource in
 *                                  the associated challenge
 * @db soft_min       int(11)       the soft minimum for the limited resource in
 *                                  the associated challenge
 * @db soft_max       int(11)       the soft maximum for the limited resource in
 *                                  the associated challenge
 * @db hard_max       int(11)       the hard maximum for the limited resource in
 *                                  the associated challenge
 * @db penalization   decimal(10,4) the number of points lost per turn per
 *                                  amount excess for the limited resource
 * 
 * @fk challenge Challenge
 * @fk resource  Resource
 */
class ChallengeLimit extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'challenge_limits';
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