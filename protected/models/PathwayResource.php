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
        );
    }

    public function getPathway()
    {
        return Pathway::model()->findByPk($this->pathway_id);
    }

    public function getResource()
    {
        return Resource::model()->findByPk($this->resource_id);
    }

    public function canModify($times, $organ)
    {
        $resource = $this->getResource();
        if ($resource->global && !$organ->isGlobal()) {
            $organ = Organ::getGlobal();
        }

        return $resource->isValidChange($organ, $this->value * $times);
    }

    public function modify($times, $organ)
    {
        $resource = $this->getResource();
        if ($resource->global && !$organ->isGlobal()) {
            $organ = Organ::getGlobal();
        }

        return $resource->changeAmount($organ, $this->value * $times);
    }
}