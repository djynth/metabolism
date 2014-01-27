<?php

/**
 * @db move_id     int(11)	   the ID of the associated move
 * @db resource_id smallint(6) the ID of the associated resource
 * @db organ_id    smallint(6) the ID of the associated organ
 * @db amount      int(11)     the level of the resource
 * @fk move        Move
 * @fk resource    Resource
 * @fk organ       Organ
 */
class MoveLevel extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'move_levels';
    }

    public function relations()
    {
    	return array(
    		'move' => array(self::BELONGS_TO, 'Move', array('move_id' => 'id')),
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