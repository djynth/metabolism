<?php

/**
 * @db id         int(11)          a unique move ID
 * @db score      smallint(6)      the score of the game at the end of this move
 * @db turn       smallint(6)      the turn count at the end of this move; i.e.
 *                                 1 after the first move of a game
 * @db times_run  smallint(6)      the number of times the pathway was run
 * @db game_id    int(11)          the game ID of the containing game
 * @db pathway_id smallint(6)      the ID of the pathway which was run
 * @db organ_id   smallint(6)      the ID of the organ in which pathway was run
 * @db reverse    tinyint(1)       whether the pathway was reversed
 * @fk game       Game
 * @fk pathway    Pathway
 * @fk organ      Organ
 * @fk levels     array(MoveLevel)
 */
class Move extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'moves';
    }

    public function relations()
    {
    	return array(
    		'game' => array(
    			self::BELONGS_TO,
    			'Game',
    			array('game_id' => 'id')
    		),
    		'pathway' => array(
    			self::BELONGS_TO,
    			'Pathway',
    			array('pathway_id' => 'id')
    		),
    		'organ' => array(
    			self::BELONGS_TO,
    			'Organ',
    			array('organ_id' => 'id')
    		),
    		'levels' => array(
    			self::HAS_MANY,
    			'MoveLevel',
    			array('id' => 'move_id')
    		)
    	);
    }
}