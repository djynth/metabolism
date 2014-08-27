<?php

/**
 * @db game_id     int(11)     the ID of the game to which this state datum
 *                             belongs
 * @db resource_id smallint(6) the ID of the resource, or null if the amount is
 *                             the action count of the organ
 * @db organ_id    smallint(6) the ID of the organ
 * @db amount      int(11)     the amount of the resource in question or the
 *                             action count for the organ in question
 * @fk game        Game
 * @fk resource    Resource
 * @fk organ       Organ
 */
class GameState extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'game_state';
    }

    public function primaryKey()
    {
        return 'game_id';
    }

    public function relations()
    {
        return array(
            'game' => array(
                self::BELONGS_TO,
                'Game',
                array('game_id' => 'id'),
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
}