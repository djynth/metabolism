<?php

/**
 * @property id
 * @property name
 * @property color
 * @property description
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
            'pathways' => array(self::MANY_MANY, 'Pathway', 'pathway_organs(pathway_id, organ_id)',
                'order' => 'pathways.id asc'),
        );
    }

    public function matches($organ)
    {
        if (gettype($organ) === 'integer') {
            return intval($this->id) === $organ;
        } elseif (gettype($organ) === 'string') {
            return $this->name === $organ;
        }

        return $this === $organ || $this->id == $organ->id;
    }

    public function isGlobal()
    {
        return intval($this->id) == self::GLOBAL_ID;
    }

    public static function getGlobal()
    {
        return self::model()->findByAttributes(array('id' => self::GLOBAL_ID));
    }

    public static function getNotGlobal()
    {
        return Organ::model()->findAll(array(
            'condition' => 'id != :id',
            'params' => array(':id' => Organ::GLOBAL_ID),
            'order' => 'id',
        ));
    }

    public function getResources()
    {
        return Resource::model()->findAllByAttributes(array('global' => $this->isGlobal()));
    }
}