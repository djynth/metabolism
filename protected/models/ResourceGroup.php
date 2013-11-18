<?php

/**
 * @property group_id
 * @property resource_id
 */
class ResourceGroup extends CActiveRecord
{
	public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'resource_group';
    }

    public function primaryKey()
    {
    	return 'resource_id';
    }

    public function relations()
    {
        return array(
            'resources' => array(self::HAS_MANY, 'Resource', 'id')
        );
    }
}