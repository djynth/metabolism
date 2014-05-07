<?php

/**
 * @db resource_id smallint(6) the ID of the resource associated with this alias
 * @db alias       text        the alias
 * @fk resource    Resource
 */
class ResourceAlias extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'resource_aliases';
    }

    public function primaryKey()
    {
        return array('resource_id', 'alias');
    }

    public function relations()
    {
        return array(
            'resource' => array(
                self::BELONGS_TO,
                'Resource',
                array('id' => 'resource_id'),
            ),
        );
    }
}