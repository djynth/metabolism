<?php

/**
 * @property id
 * @property abbr
 * @property name
 * @property full_name
 * @property starting_value
 * @property max_shown_value
 * @property global
 * @property color
 * @property ph
 */
class Resource extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'resources';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public function relations()
    {
        return array();
    }

    public function hasName($name)
    {
        return $this->abbr == $name || $this->name == $name || $this->full_name = $name;
    }

    public function getOrgans()
    {
        if ($this->global) {
            return array(Organ::getGlobal());
        } else {
            return Organ::getNotGlobal();
        }
    }

    public static function getAmounts()
    {
        return Yii::app()->session['amounts'];
    }

    public static function setAmounts($amounts)
    {
        Yii::app()->session['amounts'] = $amounts;
    }

    public function getAmount($organ=null)
    {
        if ($this->global) {
            return self::getAmounts()[intval($this->id)][Organ::GLOBAL_ID];
        } else {
            return self::getAmounts()[intval($this->id)][intval($organ->id)];
        }
        
    }

    public function setAmount($organ, $amount)
    {
        if (!$this->isValidAmount($organ, $amount)) {
            return false;
        }

        $amounts = self::getAmounts();
        $amounts[intval($this->id)][intval($organ->id)] = intval($amount);
        self::setAmounts($amounts);
        return intval($amount);
    }

    public function changeAmount($organ, $change)
    {
        return $this->setAmount($organ, $this->getAmount($organ) + intval($change));
    }

    public static function initStartingValues()
    {
        $amounts = array();

        $resources = self::model()->findAll();
        foreach ($resources as $resource) {
            $organs = $resource->getOrgans();
            $amounts[intval($resource->id)] = array();
            foreach ($organs as $organ) {
                $amounts[intval($resource->id)][intval($organ->id)] = intval($resource->starting_value);
            }
        }

        self::setAmounts($amounts);
    }

    public static function findResourceByName($name)
    {
        return self::model()->find('abbr = :name or name = :name or full_name = :name', array(':name' => $name));
    }

    public function isValidAmount($organ, $amount)
    {
        return $amount >= 0;
    }

    public function isValidChange($organ, $change)
    {
        return $this->isValidAmount($organ, $this->getAmount($organ) + $change);
    }
}