<?php

/**
 * @db id         smallint(6)     a unique pathway ID
 * @db name       varchar(255)    the user-readable name of this Pathway
 * @db points     smallint(6)     the number of points awared to the player each
 *                                time the pathway is run
 * @db limit      tinyint(1)      whether the pathway is limited; if true, it
 *                                can only be run once per turn
 * @db color      char(6)         the color associated with this Pathway
 * @db catabolic  tinyint(1)      whether the Pathway is catabolic
 * @db anabolic   tinyint(1)      whether the Pathway is anabolic
 * @db reversible tinyint(1)      whether the Pathway is reversible
 * @db action     int(1)          whether this Pathway is associated with an
 *                                organ-specific action
 * @db passive    int(1)          whether this Pathway is passive
 * @fk organs     array(Organ)
 * @fk resource   array(Resource) ordered by resource group
 */
class Pathway extends CActiveRecord
{
    /**
     * The maximum total number of nutrients that can be consumed in one turn by
     *  eating.
     */
    const EAT_MAX = 100;
    /**
     * The name of the special eat pathway, used to locate it in the database.
     */
    const EAT_NAME = "Eat";
    private static $eat = null;
    private $reactants = null;
    private $products = null;

    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'pathways';
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
                'pathway_organs(pathway_id, organ_id)',
            ),
            'resources' => array(
                self::HAS_MANY,
                'PathwayResource',
                array('pathway_id' => 'id'),
                'with' => 'resource',
                'order' => 'resource.group',
            ),
        );
    }

    /**
     * Determines whether this Pathway operates in the organ with the given ID.
     *
     * @param organ_id number the ID of the organ to check
     * @return true if this Pathway runs in the organ with ID organ_id, false
     *         otherwise
     */
    public function hasOrgan($organ_id)
    {
        foreach ($this->organs as $organ) {
            if ($organ->id === $organ_id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determines whether this Pathway affects the reource with the given ID.
     *
     * @param resource_id number the ID of the resource to check
     * @return true if this Pathway modifies the resource with ID resource_id,
     *         false otherwise
     */
    public function hasResource($resource_id)
    {
        foreach ($this->resources as $resource) {
            if ($resource->resource->id == $resource_id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Finds and returns the special eat pathway.
     * Note that the result is memoized so this function can be safely called
     *  repeatedly without multiple database queries.
     *
     * @return the eat pathway
     */
    public static function getEat()
    {
        if (self::$eat === null) {
            self::$eat = self::model()->findByAttributes(
                array('name' => self::EAT_NAME)
            );
        }
        return self::$eat;
    }

    /**
     * Gets all the Pathways which are run passively.
     *
     * @return an array of the passive Pathways
     */
    public static function getPassivePathways()
    {
        return self::model()->findAllByAttributes(array(), 'passive <> 0');
    }

    /**
     * Determiens whether the given array of nutrients to be consumed are valid.
     * The nutrients should be formatted as an array of resource ID's to amounts
     *  eaten, and each amount must be non-negative, summing to at most
     *  Pathway::EAT_MAX.
     *
     * @return true if the given nutrients should be allowed to be eaten, false
     *         otherwise
     */
    public static function areValidNutrients($nutrients)
    {
        $eat = self::getEat();
        if (count($nutrients) > count($eat->resources)) {
            return false;
        }
        $total = 0;
        foreach ($nutrients as $id => $nutrient) {
            if (!$eat->hasResource($id) || $nutrient < 0) {
                return false;
            }
            $total += $nutrient;
        }
        return $total <= self::EAT_MAX;
    }

    /**
     * Determines whether this Pathway is the special eat Pathway.
     *
     * @return true if this is the eat Pathway, false otherwise
     */
    public function isEat()
    {
        return $this->name === self::EAT_NAME;
    }

    /**
     * Returns an array, ordered by resource group, of the reactants of this
     *  Pathway.
     * Note that the results are memoized so calling this function repeatedly
     *  does not involve multiple database queries.
     *
     * @return the reactants of this Pathway
     */
    public function getReactants()
    {
        if ($this->reactants === null) {
            $this->reactants = array();
            foreach ($this->resources as $resource) {
                if (intval($resource->value) < 0) {
                    $this->reactants[] = $resource;
                }
            }
        }
        
        return $this->reactants;
    }

    /**
     * Returns an array, ordered by resource group, of the products of this
     *  Pathway.
     * Note that the results are memoized so calling this function repeatedly
     *  does not involve multiple database queries.
     *
     * @return the products of this Pathway
     */
    public function getProducts()
    {
        if ($this->products === null) {
            $this->products = array();
            foreach ($this->resources as $resource) {
                if (intval($resource->value) > 0) {
                    $this->products[] = $resource;
                }
            }
        }
        
        return $this->products;
    }

    public function canRun($times, $organ, $reverse=false)
    {
        foreach ($this->resources as $resource) {
            if (!$resource->canModify($times, $organ, $reverse)) {
                return false;
            }
        }
        return true;
    }

    public function wouldIncurPenalization($times, $organ, $reverse=false)
    {
        foreach ($this->resources as $resource) {
            if ($resource->wouldIncurPenalization($times, $organ, $reverse)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Runs the special eat pathway with the given nutrients.
     *
     * @see Pathway::areValidNutrients() which specifies the proper format and
     *                                   requirements for the nutrients
     * @param nutrients array the combination of nutrients to be eaten
     * @return true if running the eat pathway was successfuly, false otherwise
     */
    public static function eat($nutrients)
    {
        return self::getEat()->run(
            1,
            Organ::getGlobal(),
            false,
            false,
            $nutrients
        );
    }

    /**
     * Runs this Pathway with the given parameters.
     *
     * @see Pathway::areValidNutrients() which specifies the proper format and
     *                                   requirements for the nutrients
     * @param times     int        the number of times to run this Pathway; the
     *                             action will count as a single turn regardless
     * @param organ     Organ      the Organ in which to run this Pathway
     * @param reverse   boolean    whether the Pathway should be reversed
     * @param passive   boolean    whether the Pathway was run passively
     * @param nutrients array|null for the eat pathway, the nutrients to be
     *                             consumed, ignored otherwise; default is null
     * @return true if the Pathway was run successfully, false otherwise
     */
    public function run($times, $organ, $reverse, $passive, $nutrients=null)
    {
        if (Game::isGameCompleted()) {
            return false;
        }
        if (!$this->hasOrgan($organ->id)) {
            return false;
        }
        if ($times < 1 || ($this->limit && $times !== 1)) {
            return false;
        }
        if (!$this->reversible && $reverse) {
            return false;
        }
        if ($this->passive != $passive) {
            return false;
        }
        if (!$this->canRun($times, $organ, $reverse)) {
            return false;
        }

        $resources = $this->resources;

        if ($this->isEat()) {
            if (!self::areValidNutrients($nutrients)) {
                return false;
            }

            $glycerol = new PathwayResource;
            $glycerol->pathway_id = $this->id;
            $glycerol->resource_id = Resource::model()->findByAttributes(
                array('name' => 'Glycerol')
            )->id;

            foreach ($resources as $resource) {
                if (array_key_exists($resource->resource->id, $nutrients)) {
                    $resource->value = $nutrients[$resource->resource->id];
                } else {
                    $resource->value = 0;
                }

                if ($resource->resource->name === 'Palmitate') {
                    $glycerol->value = floor(intval($resource->value)/3);
                }
            }

            $resources[] = $glycerol;
        }

        foreach ($resources as $resource) {
            $resource->modify($times, $organ, $reverse);
        }

        Game::onTurnSuccess($this, $organ, $times, $reverse);
        
        return true;
    }
}
