<?php

/**
 * @db id          smallint(6)     a unique organ ID
 * @db name        varchar(20)     the user-readable name of the organ
 * @db color       char(6)         the HTML color code for the color related to
 *                                 this organ
 * @db description text            a user-readable description of the organ
 * @db action_name varchar(20)     a user-readable name for the tracked action
 *                                 specific to this organ - may be null if there
 *                                 is no such action
 * @fk pathways    array(Pathway)  ordered by pathway ID ascending
 * @fk resources   array(Resource) ordered by resource ID ascending
 */
class Organ extends CActiveRecord
{
    const GLOBAL_ID = 1;

    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'organs';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public function relations()
    {
        return array(
            'pathways' => array(
                self::MANY_MANY,
                'Pathway',
                'pathway_organs(pathway_id, organ_id)',
                'order' => 'pathways.id asc',
            ),
            'resources' => array(
                self::MANY_MANY,
                'Resource',
                'resource_organs(resource_id, organ_id)',
                'order' => 'resources.id asc',
            ),
        );
    }

    public static function getGlobal()
    {
        return self::model()->findByPk(self::GLOBAL_ID);
    }

    public static function getNotGlobal()
    {
        return self::model()->findAll(
            'id <> :id',
            array(':id' => self::GLOBAL_ID)
        );
    }

    public static function getActionCounts()
    {
        return Yii::app()->session['actions'];
    }

    public static function setActionCounts($counts)
    {
        Yii::app()->session['actions'] = $counts;
    }

    public function getActionCount()
    {
        return self::getActionCounts()[$this->id];
    }

    public function setActionCount($count)
    {
        $counts = self::getActionCounts();
        $counts[$this->id] = $count;
        self::setActionCounts($counts);
        return $count;
    }

    public static function getStartingActionCounts()
    {
        $counts = array();

        foreach (self::model()->findAll() as $organ) {
            $counts[$organ->id] = 0;
        }

        return $counts;
    }
}