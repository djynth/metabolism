<?php

/**
 * @db pathway_id  smallint(6) the ID of the associated Pathway 
 * @db resource_id smallint(6) the ID of the associated Resource
 * @db value       int(11)     the amount by which the associated Pathway
 *                             modifies the associated Resource each run
 * @fk pathway     Pathway
 * @fk resource    Resource
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
            'pathway' => array(
                self::BELONGS_TO,
                'Pathway',
                array('pathway_id' => 'id'),
            ),
            'resource' => array(
                self::BELONGS_TO,
                'Resource',
                array('resource_id' => 'id'),
            ),
        );
    }

    public function canModify($times, $organ, $reverse=false)
    {
        return $this->resource->isValidChange(
            $this->resource->getProperOrgan($organ),
            ($reverse ? -1 : 1) * $this->value * $times
        );
    }

    public function wouldIncurPenalization($times, $organ, $reverse=false)
    {
        return $this->resource->isPenalizableChange(
            $this->resource->getProperOrgan($organ),
            ($reverse ? -1 : 1) * $this->value * $times
        );
    }

    public function modify($times, $organ, $reverse=false)
    {
        return $this->resource->changeAmount(
            $this->resource->getProperOrgan($organ),
            ($reverse ? -1 : 1) * $this->value * $times
        );
    }
}