<?php

/**
 * @db resource_id  smallint(6)     the ID of the resource whose limit is
 *                                  determined by this ResourceLimit
 * @db soft_max     int             the point above which points are deducted
 * @db hard_max     int             the point which the resource may not exceed
 * @db soft_min     int             the point below which points are deducted
 * @db hard_min     int             the point which the resource may not drop
 *                                  below
 * @db rel_soft_max smallint(6)     the resource for which points are deducted
 *                                  if exceeded by this resource
 * @db rel_hard_max smallint(6)     the resource for which this resource may not
 *                                  exceed
 * @db rel_soft_min smallint(6)     the resource for which points are deducted
 *                                  if this resource drops below
 * @db rel_hard_min smallint(6)     the resource for which this resource may not
 *                                  drop below
 * @db penalization decimal(10,4)   the points deducted per turn and per amount
 *                                  by which the soft limit was broken
 * @fk resource     Resource
 * @fk res_soft_max Resource
 * @fk res_hard_max Resource
 * @fk res_soft_min Resource
 * @fk res_hard_min Resource
 */
class ResourceLimit extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'resource_limits';
    }

    public function primaryKey()
    {
        return 'resource_id';
    }

    public function relations()
    {
        return array(
            'resource' => array(
                self::BELONGS_TO,
                'Resource',
                array('id' => 'resource_id'),
            ),
            'res_soft_max' => array(
                self::BELONGS_TO,
                'Resource',
                array('id' => 'rel_soft_max'),
            ),
            'res_hard_max' => array(
                self::BELONGS_TO,
                'Resource',
                array('id' => 'rel_hard_max'),
            ),
            'res_soft_min' => array(
                self::BELONGS_TO,
                'Resource',
                array('id' => 'rel_soft_min'),
            ),
            'res_hard_min' => array(
                self::BELONGS_TO,
                'Resource',
                array('id' => 'rel_hard_min'),
            ),
        );
    }
}