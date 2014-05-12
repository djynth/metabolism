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
    private $sources;
    private $destinations;
    private $formatted_formula = null;

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

    /**
     * Determines whether any of this Resource's names (i.e. name or aliases)
     *  are exactly equal to the given name.
     *
     * @param name string the name for which to test this Resource
     * @return true if any of this Resource's names are exactly equal to the
     *         given name, false otherwise
     */
    public function hasName($name)
    {
        if ($name === $this->name) {
            return true;
        }

        foreach ($this->aliases as $alias) {
            if ($name === $alias->alias) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determines whether the basic, non-case sensitive regular expression given
     *  by the given name matches any of this Resource's names (i.e. name or
     *  aliases).
     *
     * @param name string the base of the regular expression to text each of
     *                    this Resource's names
     * @return true if any of this Resource's names match the given name, false
     *         otherwise
     */
    public function matchesName($name)
    {
        $pattern = '/' . $name . '/i';

        if (preg_match($pattern, $this->name)) {
            return true;
        }

        foreach ($this->aliases as $alias) {
            if (preg_match($pattern, $alias->alias)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets a array of all the names associated with this Resource (i.e. the
     *  name and all the aliases).
     *
     * @return a list of all the names associated with this Resource
     */
    public function getNames()
    {
        $names = $this->getAliases();
        array_push($names, $this->name);
        return $names;
    }

    /**
     * Gets a array of all the aliases associated with this Resource.
     *
     * @return a list of all the aliases associated with this Resource
     */
    public function getAliases()
    {
        $aliases = array();
        foreach ($this->aliases as $alias) {
            array_push($aliases, $alias->alias);
        }
        return $aliases;
    }

    /**
     * Gets an array of all the current resource amounts, formatted as an array
     *  from resource ID to an array of organ ID to the amount of that resource
     *  in that organ.
     *
     * @return the current resource amounts
     */
    public static function getAmounts()
    {
        return Yii::app()->session['amounts'];
    }

    /**
     * Sets the current resource amounts to the given array, which should be
     *  formatted as an array from resource ID to an array of organ ID to the
     *  amount of that resource in that organ.
     *
     * @param amounts array the new resource amounts
     */
    public static function setAmounts($amounts)
    {
        Yii::app()->session['amounts'] = $amounts;
    }

    /**
     * Gets the amount of this Resource in the given Organ.
     *
     * @param organ_id int the ID of the Organ in which to get the amount
     * @return the amount of this Resource in the given Organ
     */
    public function getAmount($organ_id)
    {
        return self::getAmounts()[$this->id][$organ_id];
    }

    /**
     * Gets the total amount of this Resource over all the Organs in which it is
     *  present.
     *
     * @return the total amount of this Resource in the system
     */
    public function getTotal()
    {
        $total = 0;

        foreach ($this->organs as $organ) {
            $total += $this->getAmount($organ->id);
        }

        return $total;
    }

    /**
     * Sets the amount of a specific resource.
     *
     * @param res_id   int the ID of the Resource whose amount is to be set
     * @param organ_id int the ID of the Organ in which to set the Resource
     *                     amount
     * @param amount   int the new amount of the Resource
     * @return the new amount of the resource
     */
    public static function setResourceAmount($res_id, $organ_id, $amount)
    {
        return self::model()->findByPk($res_id)->setAmount($organ_id, $amount);
    }

    /**
     * Sets the amount of this Resource in the given organ to the given value.
     *
     * @param organ_id int the ID of the Organ in which to set this Resource's
     *                     amount
     * @param amount   int the new amount of this Resource
     * @return the new amount of this Resource
     */
    public function setAmount($organ_id, $amount)
    {
        $amounts = self::getAmounts();
        $amounts[$this->id][$organ_id] = $amount;
        self::setAmounts($amounts);
        return intval($amount);
    }

    /**
     * Alters the amount of this Resource in the given organ by the given value.
     *
     * @param organ_id int the ID of the Organ in which to change this
     *                     Resource's amount
     * @param change   int the amount by which to change this Resource
     * @return the new amount of this Resource
     */
    public function changeAmount($organ_id, $change)
    {
        return $this->setAmount(
            $organ_id,
            $this->getAmount($organ_id) + $change
        );
    }

    /**
     * Initializes all the Resource amounts to their starting values.
     * This function should be called whenever a new session is started or the
     *  game is restarted.
     */
    public static function initStartingValues()
    {
        $amounts = array();

        foreach (self::model()->findAll() as $resource) {
            $amounts[$resource->id] = array();
            foreach ($resource->organs as $organ) {
                $amounts[$resource->id][$organ->id] = $resource->starting_value;
            }
        }

        self::setAmounts($amounts);
    }

    /**
     * Determines whether the given value is a permissable amount for this
     *  Resource in the given Organ.
     *
     * @param organ_id number the ID of the Organ in which to check for validity
     * @param amount   number the potential value for this Resource
     * @return true if the given value is valid in the given organ, false
     *         otherwise
     */
    public function isValidAmount($organ_id, $amount)
    {
        foreach ($this->organs as $organ) {
            if ($organ_id === $organ->id) {
                if ($this->hard_max !== null && $amount > $this->hard_max) {
                    return false;
                }
                if ($this->hard_min !== null && $amount < $this->hard_min) {
                    return false;
                }
                if ($this->res_hard_max !== null && 
                    $amount > $this->res_hard_max->getAmount($organ_id)) {
                    return false;
                }
                if ($this->res_hard_min !== null && 
                    $amount < $this->res_hard_min->getAmount($organ_id)) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Determines whether the given value crosses a soft limit for this Resource
     *  in the given Organ.
     *
     * @param organ_id number the ID of the Organ in which to check for
     *                        penalization
     * @param amount   number the potential value for this Resource
     * @return true if the given value is penalizable in the given organ, false
     *         otherwise
     */
    public function isPenalizableAmount($organ_id, $amount)
    {
        foreach ($this->organs as $organ) {
            if ($organ_id === $organ->id) {
                return $this->getPenalization($amount, $organ);    
            }
        }
        return false;
    }

    /**
     * Determines whether the level of this Resource in the given Organ after a
     *  change of the given amount is permissable.
     *
     * @param organ_id number the ID of the Organ in which to check for validity
     * @param change   number the potential change for this Resource
     * @return true if the level of this Resource after the given change is
     *         valid, false otherwise
     */
    public function isValidChange($organ_id, $change)
    {
        return $this->isValidAmount(
            $organ_id,
            $this->getAmount($organ_id) + $change
        );
    }

    /**
     * Determines whether the level of this Resource in the given Organ after a
     *  change of the given amount would cross a soft limit.
     *
     * @param organ_id number the ID of the Organ in which to check for
     *                        penalization
     * @param change   number the potential change for this Resource
     * @return true if the level of this Resource after the given change is
     *         penalizable, false otherwise
     */
    public function isPenalizableChange($organ_id, $change)
    {
        return $this->isPenalizableAmount(
            $organ_id,
            $this->getAmount($organ_id) + $change
        );
    }

    /**
     * Returns an array of all the Pathways which use this Resource, i.e. those
     *  Pathways which have this Resource as a reactant.
     * Note that this funciton is memoized, so calling it repeatedly will not
     *  result in performance hits.
     *
     * @return an array of all the Pathways which act as destinations for this
     *         Resource
     */
    public function getDestinations()
    {
        if ($this->destinations === null) {
            $pathways = Pathway::model()->findAll();
            $this->destinations = array();
            foreach ($pathways as $pathway) {
                $reactants = $pathway->getReactants();
                foreach ($reactants as $reactant) {
                    if ($reactant->resource_id === $this->id) {
                        $this->destinations[] = $pathway;
                        break;
                    }
                }
            }
        }
        
        return $this->destinations;
    }

    /**
     * Returns an array of all the Pathways which product this Resource, i.e.
     *  those Pathways which have this Resource as a product.
     * Note that this funciton is memoized, so calling it repeatedly will not
     *  result in performance hits.
     *
     * @return an array of all the Pathways which act as sources for this
     *         Resource
     */
    public function getSources()
    {
        if ($this->sources === null) {
            $pathways = Pathway::model()->findAll();
            $this->sources = array();
            foreach ($pathways as $pathway) {
                $products = $pathway->getProducts();
                foreach ($products as $product) {
                    if ($product->resource_id === $this->id) {
                        $this->sources[] = $pathway;
                        break;
                    }
                }
            }
        }
        
        return $this->sources;
    }

    /**
     * Gets a user-readable, properly HTML formatted version of this Resource's
     *  chemical formula.
     * Note that this funciton is memoized, so calling it repeatedly will not
     *  result in performance hits.
     *
     * @return a well-formatted version of this Resource's formula
     */
    public function getFormattedFormula()
    {
        if ($this->formatted_formula === null) {
            $this->formatted_formula = '';
            $subscript = false;

            for ($i = 0; $i < strlen($this->formula); $i++) {
                $char = substr($this->formula, $i, 1);
                if (!$subscript && is_numeric($char)) {
                    $this->formatted_formula .= '<sub>';
                    $subscript = true;
                } elseif ($subscript && !is_numeric($char)) {
                    $this->formatted_formula .= '</sub>';
                    $subscript = false;
                }

                $this->formatted_formula .= $char;
            }
        }

        return $this->formatted_formula;
    }

    /**
     * Determines whether this Resource is global, i.e. if it only exists in the
     *  special global organ.
     *
     * @return true if this Resource is global, false otherwise
     */
    public function isGlobal()
    {
        if (count($this->organs) !== 1) {
            return false;
        }

        return $this->organs[0]->isGlobal();
    }

    public function getOrgan($organ)
    {
        return $this->isGlobal() ? Organ::getGlobal() : $organ;
    }

    /**
     *  Gets the total amount of penalization per turn based on resources
     *   breaking soft limits.
     *
     * @return the number of points which should be deducted per turn based on
     *         soft limit excesses
     */
    public static function getPenalizations()
    {
        $pen = 0;

        foreach (self::model()->findAll() as $resource) {
            foreach ($resource->organs as $organ) {
                $pen += $resource->getPenalization(
                    $resource->getAmount($organ->id),
                    $organ
                );
            }
        }

        return $pen;
    }
    
    /**
     * Determines the amount of penalization per turn that should be deducted
     *  from the player's score for having the associated resource at the given
     *  amount in the given Organ.
     *
     * @param amount int   the amount taken on by the associated resource
     * @param organ  Organ the Organ in which the resource has taken on the
     *                     given amount
     * @return the number of points to be deducted from the player's score per
     *         turn
     */
    public function getPenalization($amount, $organ)
    {
        $pen = 0;
        $min = $this->getSoftMin($organ->id);
        $max = $this->getSoftMax($organ->id);
        if ($min !== null) {
            $pen += max(0, $this->penalization * ($min - $amount));
        }
        if ($max !== null) {
            $pen += max(0, $this->penalization * ($amount - $max));
        }
        return $pen;
    }

    /**
     * Gets the soft minimum of this ResourceLimit in the organ with the given
     *  ID.
     * If the limit has neither a soft minimum or relative soft minimum, null is
     *  returned, otherwise the larger of these two soft minimums is returned.
     *
     * @param organ_id number the ID of the Organ in which to get the soft min
     * @return the current soft minimum of this limit in the given organ
     */
    public function getSoftMin($organ_id)
    {
        if ($this->soft_min === null && $this->rel_soft_min === null) {
            return null;
        }

        if ($this->soft_min === null) {
            return $this->res_soft_min->getAmount($organ_id);
        }

        if ($this->rel_soft_min === null) {
            return $this->soft_min;
        }

        return max($this->res_soft_min->getAmount($organ_id), $this->soft_min);
    }

    /**
     * Gets the soft maximum of this ResourceLimit in the organ with the given
     *  ID.
     * If the limit has neither a soft maximum or relative soft maximum, null is
     *  returned, otherwise the smaller of these two soft maximums is returned.
     *
     * @param organ_id number the ID of the Organ in which to get the soft max
     * @return the current soft maximum of this limit in the given organ
     */
    public function getSoftMax($organ_id)
    {
        if ($this->soft_max === null && $this->rel_soft_max === null) {
            return null;
        }

        if ($this->soft_max === null) {
            return $this->res_soft_max->getAmount($organ_id);
        }

        if ($this->rel_soft_max === null) {
            return $this->soft_max;
        }

        return min($this->res_soft_max->getAmount($organ_id), $this->soft_max);
    }
}