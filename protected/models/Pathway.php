<?php

/**
 * @property id
 * @property name
 * @property points
 * @property limit
 * @property color
 * @property catabolic
 * @property organs
 */
class Pathway extends CActiveRecord
{
    const EAT_MAX = 50;
    const EAT_NAME = "Eat";

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
            'organs' => array(self::MANY_MANY, 'Organ', 'pathway_organs(pathway_id, organ_id)'),
            'resources' => array(self::HAS_MANY, 'PathwayResource', 'pathway_id', 'with'=>'resource', 'order'=>'resource.group'),
        );
    }

    public function isGlobal()
    {
        return $this->hasOrgan(Organ::GLOBAL_ID);
    }

    public function hasOrgan($organ)
    {
        foreach ($this->organs as $myOrgan) {
            if ($myOrgan->matches($organ)) {
                return true;
            }
        }
        return false;
    }

    public static function getEat()
    {
        return self::model()->findByAttributes(array('name' => self::EAT_NAME));
    }

    // nutrients: id => value
    public static function eat($nutrients)
    {
        return self::getEat()->run(1, Organ::getGlobal(), $nutrients, false);
    }

    public static function areValidNutrients($nutrients)
    {
        $total = 0;
        foreach ($nutrients as $nutrient) {
            $total += $nutrient;
        }
        return $total >= 0 && $total <= self::EAT_MAX;
    }

    public function isEat()
    {
        return $this->name == self::EAT_NAME;
    }

    public function getReactants()
    {
        $reactants = array();
        foreach ($this->resources as $resource) {
            if (intval($resource->value) < 0) {
                $reactants[] = $resource;
            }
        }
        return $reactants;
    }

    public function getProducts()
    {
        $products = array();
        foreach ($this->resources as $resource) {
            if (intval($resource->value) > 0) {
                $products[] = $resource;
            }
        }
        return $products;
    }

    public function run($times, $organ, $nutrients=null, $reverse=false)
    {
        if (Game::isGameCompleted()) {
            return false;
        }
        if (!$this->hasOrgan($organ)) {
            return false;
        }
        if ($this->limit && $times > 1) {
            return false;
        }
        if (!$this->reversible && $reverse) {
            return false;
        }

        $resources = $this->resources;

        if ($this->isEat()) {
            if (!self::areValidNutrients($nutrients)) {
                return false;
            }

            $glycerol = new PathwayResource;
            $glycerol->pathway_id = $this->id;
            $glycerol->resource_id = Resource::model()->findByAttributes(array('name' => 'Glycerol'))->id;

            foreach ($resources as $resource) {
                $resource->value = $nutrients[$resource->resource->id];

                if ($resource->resource->name === 'Palmitate') {
                    $glycerol->value = floor(intval($resource->value)/3);
                }
            }

            $resources[] = $glycerol;
        }

        foreach ($resources as $resource) {
            if (!$resource->canModify($times, $organ, $reverse)) {
                return false;
            }
        }

        foreach ($resources as $resource) {
            $resource->modify($times, $organ, $reverse);
        }

        Game::onTurnSuccess($this, $organ, $times, $reverse);
        
        return true;
    }
}
