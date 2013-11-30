<?php

/**
 * @property pathway_id
 * @property resource_id
 * @property value
 */
class PathwayResource extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'pathway_resources';
    }

    public function primaryKey()
    {
        return 'pathway_id';
    }

    public function relations()
    {
        return array(
            'pathway' => array(self::BELONGS_TO, 'Pathway', 'id'),
            'resource' => array(self::BELONGS_TO, 'Resource', array('resource_id'=>'id')),
        );
    }

    public function canModify($times, $organ, $reverse=false)
    {
        if ($this->resource->global && !$organ->isGlobal()) {
            $organ = Organ::getGlobal();
        }

        return $this->resource->isValidChange(
            $organ,
            ($reverse ? -1 : 1) * $this->value * $times
        );
    }

    public function modify($times, $organ, $reverse=false)
    {
        if ($this->resource->global && !$organ->isGlobal()) {
            $organ = Organ::getGlobal();
        }

        return $this->resource->changeAmount(
            $organ,
            ($reverse ? -1 : 1) * $this->value * $times
        );
    }
}