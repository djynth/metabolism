<?php

/**
 * @db id              smallint(6)   a unique resource ID
 * @db name            varchar(20)   the most common user-readable name for this
 *                                   resource
 * @db starting_value  int(11)       the amount to which this resource is
 *                                   initialized
 * @db max_shown_value int(11)       the point at which the indicator for this
 *                                   resource is maxed out
 * @db color           char(6)       the color of this resource
 * @db primary         tinyint(1)    whether this resource is a primary resource
 *                                   monitored at all times in the footer
 * @db formula         varchar(20)   the chemical formula of this resource
 * @db description     text          a full-text and user-readable description
 *                                   of the properties of this resource
 * @db group           smallint(6)   the non-unique group of this resource - 
 *                                   resources in the same group are placed
 *                                   together in the pathway reaction table
 * @db soft_max        int(11)       the point above which points are deducted
 * @db hard_max        int(11)       the point which the resource may not exceed
 * @db soft_min        int(11)       the point below which points are deducted
 * @db hard_min        int(11)       the point which the resource may not drop
 *                                   below
 * @db rel_soft_max    smallint(6)   the resource for which points are deducted
 *                                   if exceeded by this resource
 * @db rel_hard_max    smallint(6)   the resource for which this resource may
 *                                   not exceed
 * @db rel_soft_min    smallint(6)   the resource for which points are deducted
 *                                   if this resource drops below
 * @db rel_hard_min    smallint(6)   the resource for which this resource may
 *                                   not drop below
 * @db penalization    decimal(10,4) the points deducted per turn and per amount
 *                                   by which the soft limit was broken
 * @fk organs          array(Organ)
 * @fk aliases         array(ResourceAlias)
 * @fk res_soft_max    Resource
 * @fk res_hard_max    Resource
 * @fk res_soft_min    Resource
 * @fk res_hard_min    Resource
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
        return array(
            'organs' => array(
                self::MANY_MANY,
                'Organ',
                'resource_organs(resource_id, organ_id)',
            ),
            'aliases' => array(
                self::HAS_MANY,
                'ResourceAlias',
                array('resource_id' => 'id'),
            ),
            'res_soft_max' => array(
                self::BELONGS_TO,
                'Resource',
                'rel_soft_max',
            ),
            'res_hard_max' => array(
                self::BELONGS_TO,
                'Resource',
                'rel_hard_max',
            ),
            'res_soft_min' => array(
                self::BELONGS_TO,
                'Resource',
                'rel_soft_min',
            ),
            'res_hard_min' => array(
                self::BELONGS_TO,
                'Resource',
                'rel_hard_min',
            ),
        );
    }

    public function hasName($name)
    {
        foreach ($this->getNames() as $myName) {
            if ($name === $myName) {
                return true;
            }
        }
        return false;
    }

    public function matchesName($name)
    {
        $pattern = '/' . $name . '/i';

        foreach ($this->getNames() as $name) {
            if (preg_match($pattern, $name)) {
                return true;
            }
        }
        return false;
    }

    public function getNames()
    {
        $names = $this->getAliases();
        array_push($names, $this->name);
        return $names;
    }

    public function getAliases()
    {
        $aliases = array();
        foreach ($this->aliases as $alias) {
            array_push($aliases, $alias->alias);
        }
        return $aliases;
    }

    public static function getAmounts()
    {
        return Yii::app()->session['amounts'];
    }

    public static function setAmounts($amounts)
    {
        Yii::app()->session['amounts'] = $amounts;
    }

    public function getAmount($organ)
    {
        return self::getAmounts()[$this->id][$organ->id];
    }

    public function getTotal()
    {
        $total = 0;

        foreach ($this->organs as $organ) {
            $total += $this->getAmount($organ->id);
        }

        return $total;
    }

    public function setAmount($organ, $amount)
    {
        $amounts = self::getAmounts();
        $amounts[$this->id][$organ->id] = $amount;
        self::setAmounts($amounts);
        return intval($amount);
    }

    public function changeAmount($organ, $change)
    {
        return $this->setAmount(
            $organ,
            $this->getAmount($organ) + $change
        );
    }

    public static function getStartingAmounts()
    {
        $amounts = array();

        foreach (self::model()->findAll() as $resource) {
            $amounts[$resource->id] = array();
            foreach ($resource->organs as $organ) {
                $amounts[$resource->id][$organ->id] = $resource->starting_value;
            }
        }

        return $amounts;
    }

    public function isValidAmount($organ, $amount)
    {
        foreach ($this->organs as $myOrgan) {
            if ($organ->id === $myOrgan->id) {
                if ($this->hard_max !== null && $amount > $this->hard_max) {
                    return false;
                }
                if ($this->hard_min !== null && $amount < $this->hard_min) {
                    return false;
                }
                if ($this->res_hard_max !== null && 
                    $amount > $this->res_hard_max->getAmount($organ->id)) {
                    return false;
                }
                if ($this->res_hard_min !== null && 
                    $amount < $this->res_hard_min->getAmount($organ->id)) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    public function isValidChange($organ, $change)
    {
        return $this->isValidAmount(
            $organ,
            $this->getAmount($organ) + $change
        );
    }

    public function isPenalizableChange($organ, $change)
    {
        return $this->getPenalization(
            $organ,
            $this->getAmount($organ) + $change
        ) > 0;
    }

    public static function getPenalizations()
    {
        $pen = 0;

        foreach (self::model()->findAll() as $resource) {
            foreach ($resource->organs as $organ) {
                $pen += $resource->getPenalization(
                    $organ,
                    $resource->getAmount($organ)
                );
            }
        }

        return $pen;
    }
    
    public function getPenalization($organ, $amount)
    {
        $pen = 0;
        $min = $this->getSoftMin($organ);
        $max = $this->getSoftMax($organ);
        if ($min !== null) {
            $pen += max(0, $this->penalization * ($min - $amount));
        }
        if ($max !== null) {
            $pen += max(0, $this->penalization * ($amount - $max));
        }
        return $pen;
    }

    public function getSoftMin($organ)
    {
        if ($this->soft_min === null && $this->rel_soft_min === null) {
            return null;
        }

        if ($this->soft_min === null) {
            return $this->res_soft_min->getAmount($organ);
        }

        if ($this->rel_soft_min === null) {
            return $this->soft_min;
        }

        return max($this->res_soft_min->getAmount($organ), $this->soft_min);
    }

    public function getSoftMax($organ)
    {
        if ($this->soft_max === null && $this->rel_soft_max === null) {
            return null;
        }

        if ($this->soft_max === null) {
            return $this->res_soft_max->getAmount($organ);
        }

        if ($this->rel_soft_max === null) {
            return $this->soft_max;
        }

        return min($this->res_soft_max->getAmount($organ), $this->soft_max);
    }

    public function getProperOrgan($organ)
    {
        foreach ($this->organs as $myOrgan) {
            if ($organ->id === $myOrgan->id) {
                return $organ;
            }
        }
        return Organ::getGlobal();
    }
}