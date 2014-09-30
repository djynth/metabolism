<?php

/**
 * @db id                 smallint(6)   a unique resource ID
 * @db name               varchar(20)   the most common user-readable name for
 *                                      this resource
 * @db recommended_amount int(11)       the ideal amount of this resource; also
 *                                      the halfway point for the level bar
 * @db color              char(6)       the color of this resource
 * @db primary            tinyint(1)    whether this resource is a primary
 *                                      resource monitored at all times in the
 *                                      footer
 * @db formula            varchar(20)   the chemical formula of this resource
 * @db description        text          a full-text and user-readable
 *                                      description
 *                                      of the properties of this resource
 * @db group              smallint(6)   the non-unique group of this resource - 
 *                                      resources in the same group are placed
 *                                      together in the pathway reaction table
 * @fk organs             array(Organ)
 * @fk aliases            array(ResourceAlias)
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
        $amounts[$this->id][$organ->id] = (int)$amount;
        self::setAmounts($amounts);
        return (int)$amount;
    }

    public function changeAmount($organ, $change)
    {
        return $this->setAmount(
            $organ,
            $this->getAmount($organ) + $change
        );
    }

    public function isValidAmount($challenge, $amount)
    {
        $limit = ChallengeLimit::model()->findByAttributes(array(
            'challenge_id' => $challenge->id,
            'resource_id' => $this->id,
        ));

        if ($limit === null) {
            return true;
        }
        if (($limit->hard_max !== null && $amount > $limit->hard_max) || 
            ($limit->hard_min !== null && $amount < $limit->hard_min)) {
            return false;
        }
        return true;
    }

    public function isValidChange($challenge, $organ, $change)
    {
        return $this->isValidAmount(
            $challenge,
            $this->getAmount($organ) + $change
        );
    }

    public function isPenalizableChange($challenge, $organ, $change)
    {
        return $this->getPenalization(
            $challenge,
            $this->getAmount($organ) + $change
        ) > 0;
    }

    public static function getPenalizations($challenge)
    {
        $pen = 0;

        foreach (self::model()->findAll() as $resource) {
            foreach ($resource->organs as $organ) {
                $pen += $resource->getPenalization(
                    $challenge,
                    $resource->getAmount($organ)
                );
            }
        }

        return $pen;
    }
    
    public function getPenalization($challenge, $amount)
    {
        $limit = ChallengeLimit::model()->findByAttributes(array(
            'challenge_id' => $challenge->id,
            'resource_id' => $this->id,
        ));

        if ($limit === null) {
            return 0;
        }

        $pen = 0;
        if ($limit->soft_min !== null) {
            $pen += $limit->penalization * max(0, $limit->soft_min - $amount);
        }
        if ($limit->soft_max !== null) {
            $pen += $limit->penalization * max(0, $amount - $limit->soft_max);
        }
        return $pen;
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