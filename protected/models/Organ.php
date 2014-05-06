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
                'order' => 'resources.id asc',
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
        return $this->id == self::GLOBAL_ID;
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
    public static function getNotGlobal()
    {
        if (self::$not_global === null) {
            self::$not_global = self::model()->findAll(
                'id <> :id',
                array(':id' => self::GLOBAL_ID)
            );
        }
        return self::$not_global;
    }

    private static function getCounts()
    {
        return Yii::app()->session['actions'];
    }

    private static function setCounts($counts)
    {
        Yii::app()->session['actions'] = $counts;
    }

    /**
     * Determines whenther this Organ has an action associated with it.
     * 
     * @return true if there is a specific action associated with this Organ,
     *         false otherwise
     */
    public function hasAction()
    {
        return $this->action_name !== null;
    }

    /**
     * Gets the number of times the action associated with this Organ has been
     *  activated in the current game.
     * 
     * @return the count of this Organ's action
     */
    public function getActionCount()
    {
        return self::getCounts()[$this->id];
    }

    /**
     * Sets the number of times the action associated with this Organ has been
     *  activated in the current game
     *
     * @param count number the new count of this Organ's action
     * @return the new count of this Organ's action
     */
    public function setActionCount($count)
    {
        $counts = self::getCounts();
        $counts[$this->id] = $count;
        self::setCounts($counts);
        return $count;
    }

    /**
     * Increments the number of times the action associated with this Organ has
     *  been activated in the current game.
     * 
     * @param count int the amount by which to increment the action count; i.e.
     *                  the number of times the action has been activated
     * @return the new count of this Organ's action
     */
    public function incrementActionCount($count)
    {
        return $this->setActionCount($this->getActionCount() + $count);
    }

    public static function initActionCounts()
    {
        $organs = self::model()->findAll();

        foreach ($organs as $organ) {
            $organ->setActionCount(0);
        }
    }

    /**
     * Gets an array of the action counts in all the organs.
     * The returned array is of the form id => count.
     *
     * @return the number of times the action associated with each Organ has
     *         been activated
     */
    public static function getActionCounts()
    {
        $counts = array();
        $organs = self::model()->findAll();

        foreach ($organs as $organ) {
            $counts[$organ->id] = $organ->getActionCount();
        }

        return $counts;
    }

    /**
     * Gets a list of all the Resources in this Organ that have a soft limit of
     *  any type.
     *
     * @return an Array of Resources belonging to this Organ with a soft limit
     */
    public function getSoftLimitResources()
    {
        $resources = array();
        foreach ($this->resources as $resource) {
            if ($resource->limit->soft_max || $resource->limit->soft_min || 
                $resource->limit->rel_soft_max || 
                $resource->limit->rel_soft_min) {
                array_push($resources, $resource);
            }
        }
        return $resources;
    }
}