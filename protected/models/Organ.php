<?php

/**
 * @db id          smallint(6)     a unique organ ID
 * @db name        varchar(20)     the user-readable name of the organ
 * @db color       char(6)         the HTML color code for the color related to
 *                                 this organ
 * @db description text            a user-readable description of the organ
 * @fk pathways    array(Pathway)  ordered by pathway ID ascending
 * @fk resources   array(Resource) ordered by resource ID ascending
 */
class Organ extends CActiveRecord
{
    private static $global = null;
    private static $not_global = null;
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
                'order' => 'resource.id asc',
            ),
        );
    }

    /**
     * Determines whether this is the special global organ.
     *
     * @return true if this Organ is global, false otherwise
     */
    public function isGlobal()
    {
        return $this->id === self::GLOBAL_ID;
    }

    /**
     * Gets the global organ.
     * Note that the result is memoized, so repeated calls to this function will
     *  not result in repeated database queries.
     *
     * @return the special global organ
     */
    public static function getGlobal()
    {
        if (self::$global === null) {
            self::$global = self::model()->findByPk(self::GLOBAL_ID);
        }
        return self::$global;
    }

    /**
     * Gets an array of all the organs which are not the global organ.
     * Note that the results are memoized, so repeated calls to this function
     *  will not result in repeated database queries.
     *
     * @return an array of all the organs which are not the special global organ
     */
    public static function getNotGloabl()
    {
        if (self::$not_global === null) {
            self::$not_global = self::model()->findAll(
                'id <> :id',
                array(':id' => self::GLOBAL_ID)
            );
        }
        return self::$not_global;
    }
}