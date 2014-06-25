<?php

/**
 * @db id         smallint(6)     a unique pathway ID
 * @db name       varchar(255)    the user-readable name of this Pathway
 * @db points     smallint(6)     the number of points awared to the player each
 *                                time the pathway is run
 * @db color      char(6)         the color associated with this Pathway
 * @db catabolic  tinyint(1)      whether the Pathway is catabolic
 * @db anabolic   tinyint(1)      whether the Pathway is anabolic
 * @db reversible tinyint(1)      whether the Pathway is reversible
 * @db action     int(1)          whether this Pathway is associated with an
 *                                organ-specific action
 * @db passive    int(1)          whether this Pathway is passive
 * @fk organs           array(Organ)
 * @fk resource_amounts array(PathwayResource)
 */
class Pathway extends CActiveRecord
{
    const EAT_MAX = 100;
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
            'organs' => array(
                self::MANY_MANY,
                'Organ',
                'pathway_organs(pathway_id, organ_id)',
            ),
            'resource_amounts' => array(
                self::HAS_MANY,
                'PathwayResource',
                array('pathway_id' => 'id'),
                'with' => 'resource',
                'order' => 'resource.group',
            ),
        );
    }

    public static function getEat()
    {
        return self::model()->findByAttributes(
            array('name' => self::EAT_NAME)
        );
    }

    public static function getPassivePathways()
    {
        return self::model()->findAllByAttributes(array(), 'passive <> 0');
    }

    public static function areValidNutrients($nutrients)
    {
        $eat = self::getEat();
        if (count($nutrients) !== count($eat->resource_amounts)) {
            return false;
        }
        $total = 0;
        foreach ($nutrients as $id => $nutrient) {
            $hasResource = false;
            foreach ($eat->resource_amounts as $resource) {
                if ($resource->resource->id == $id) {
                    $hasResource = true;
                    break;
                }
            }
            if (!$hasResource || $nutrient < 0) {
                return false;
            }
            $total += $nutrient;
        }
        return $total <= self::EAT_MAX;
    }

    public function isEat()
    {
        return $this->name === self::EAT_NAME;
    }

    public function getReactants()
    {
        $reactants = array();
        foreach ($this->resource_amounts as $resource) {
            if (intval($resource->value) < 0) {
                $reactants[] = $resource;
            }
        }
        return $reactants;
    }

    public function getProducts()
    {
        $products = array();
        foreach ($this->resource_amounts as $resource) {
            if (intval($resource->value) > 0) {
                $products[] = $resource;
            }
        }
        return $products;
    }

    public function canRun($challenge, $times, $organ, $reverse=false,
                           $nutrients=null)
    {
        if ($this->isEat()) {
            if ($nutrients === null) {
                return false;
            }

            foreach ($this->resource_amounts as $resource) {
                if (!$resource->canModify(
                    $challenge,
                    $times,
                    $organ,
                    $reverse,
                    $nutrients[$resource->resource_id]
                )) {
                    return false;
                }
            }

            return true;
        } else {
            foreach ($this->resource_amounts as $resource) {
                if (!$resource->canModify($challenge, $times, $organ, $reverse))
                {
                    return false;
                }

                if ($this->passive) {
                    $properOrgan = $resource->resource->getProperOrgan($organ);
                    $amount = $resource->resource->getAmount($properOrgan);
                    $currentPen = $resource->resource->getPenalization(
                        $challenge,
                        $amount
                    );
                    $potentionalPen = $resource->resource->getPenalization(
                        $challenge, 
                        $amount + $resource->value
                    );

                    if ($potentionalPen > $currentPen) {
                        return false;
                    }
                }
            }
            return true;    
        }
    }

    public static function eat($game, $nutrients)
    {
        return self::getEat()->run(
            $game,
            1,
            Organ::getGlobal(),
            false,
            false,
            $nutrients
        );
    }

    public function run($game, $times, $organ, $reverse, $passive=false,
                        $nutrients=null)
    {
        $restriction = ChallengeRestriction::model()->findByAttributes(array(
            'challenge_id' => $game->challenge_id,
            'pathway_id' => $this->id,
        ));

        if (!$this->passive && $game->completed) {
            return false;
        }
        if ($times < 1 || ($restriction && $times > $restriction->limit)) {
            return false;
        }
        if (!$this->reversible && $reverse) {
            return false;
        }
        if ($this->passive != $passive) {
            return false;
        }
        if (!$this->canRun($times, $organ, $reverse, $nutrients)) {
            return false;
        }

        $hasOrgan = false;
        foreach ($this->organs as $myOrgan) {
            if ($organ->id === $myOrgan->id) {
                $hasOrgan = true;
                break;
            }
        }

        if (!$hasOrgan) {
            return false;
        }

        $resources = $this->resource_amounts;

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
                $resource->value = $nutrients[$resource->resource->id];

                if ($resource->resource->name === 'Palmitate') {
                    $glycerol->value = floor(intval($resource->value)/3);
                }
            }

            $resources[] = $glycerol;
        }

        foreach ($resources as $resource) {
            $resource->modify($times, $organ, $reverse);
        }

        $game->onTurn($this, $organ, $times, $reverse);
        
        return true;
    }
}
