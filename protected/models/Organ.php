<?php

/**
 * @db id                  smallint(6) a unique organ ID
 * @db name                varchar(20) the user-readable name of the organ
 * @db color               char(6)     the HTML color code for the color
 *                                     related to this organ
 * @db description         text        a user-readable description
 * @db action_name         varchar(20) a user-readable name for the tracked
 *                                     action specific to this organ, null if
 *                                     there is no such action
 * @db storage_resource_id smallint(6) the ID of the resource which stores
 *                                     energy in this organ
 * @fk pathways            array(Pathway)
 * @fk resources           array(Resource)
 * @fk storage_resource    Resource
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
            'storage_resource' => array(
                self::HAS_ONE,
                'Resource',
                array('id' => 'storage_resource_id'),
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
        $counts = self::getActionCounts();
        if (!count($counts)) {
            return 0;
        }
        return $counts[$this->id];
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