<?php

/**
 * @db id              smallint(6)
 * @db abbr            varchar(10)
 * @db name            varchar(20)
 * @db full_name       varchar(80)
 * @db starting_value  int(11)
 * @db max_shown_value int(11)
 * @db color           char(6)
 * @db primary         tinyint(1)
 * @db formula         varchar(20)
 * @db description     text
 * @db group           smallint(6)
 * @fk organs          array(Organ)
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
        );
    }

    /**
     * Determines whether any of this Resource's names (i.e. abbreviate, name,
     *  or full name) are exactly equal to the given name.
     *
     * @param name string the name for which to test this Resource
     * @return true if any of this Resource's names are exactly equal to the
     *         given name, false otherwise
     */
    public function hasName($name)
    {
        return $name === $this->abbr ||
               $name === $this->name ||
               $name === $this->full_name;
    }

    /**
     * Determines whether the basic, non-case sensitive regular expression given
     *  by the given name matches any of this Resource's name (i.e.
     *  abbreviation, name, or full name).
     *
     * @param name string the base of the regular expression to text each of
     *                    this Resource's names
     * @return true if any of this Resource's names match the given name, false
     *         otherwise
     */
    public function matchesName($name)
    {
        $pattern = '/' . $name . '/i';
        return preg_match($pattern, $this->abbr) || 
               preg_match($pattern, $this->name) || 
               preg_match($pattern, $this->full_name);
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
     * Gets the first Resource with any name (i.e. abbreviation, name, or full
     *  name) exactly equal to the given name.
     *
     * @param name string the name for which to check
     * @return a Resource with a name equal to the given name, or null if none
     *         exist
     */
    public static function findResourceByName($name)
    {
        return self::model()->find(
            'abbr = :name or name = :name or full_name = :name',
            array(':name' => $name)
        );
    }

    /**
     * Determines whether the given value is a permissable amount for this
     *  Resource in the given Organ.
     *
     * @param organ_id int the ID of the Organ in which to check for validity
     * @param amount   int the potential value for this Resource
     * @return true if the given value is valid in the given organ, false
     *         otherwise
     */
    public function isValidAmount($organ_id, $amount)
    {
        foreach ($this->organs as $organ) {
            if ($organ_id === $organ->id) {
                return $amount >= 0;
            }
        }

        return false;
    }

    /**
     * Determines whether the level of this Resource in the given Organ after a
     *  change of the given amount if permissable.
     *
     * @param organ_id int the ID of the Organ in which to check for validity
     * @param change   int the potential change for this Resource
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
}