<?php

/**
 * @db pathway_id  smallint(6) the ID of the associated Pathway 
 * @db resource_id smallint(6) the ID of the associated Resource
 * @db value       int(11)     the amount by which the associated Pathway
 *                             modifies the associated Resource each run
 * @fk pathway     Pathway
 * @fk resource    Resource
 */
class PathwayResource extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'pathway_resources';
    }

    public function primaryKey()
    {
        return 'pathway_id';
    }

    public function relations()
    {
        return array(
            'pathway' => array(
                self::BELONGS_TO,
                'Pathway',
                array('pathway_id' => 'id'),
            ),
            'resource' => array(
                self::BELONGS_TO,
                'Resource',
                array('resource_id' => 'id'),
            ),
        );
    }

    /**
     * Gets the organ in which the resource ought to be modified, if the given
     *  organ is invalid.
     * That is, if the resource held by this PathwayResource is not in the given
     *  organ, this method returns the global organ, otherwise it returns the
     *  given one.
     *
     * @param organ Organ the Organ in which this PathwayResource may be
     *                    modified, if possible
     * @return the proper Organ in which the resource can be found
     */
    public function getProperOrgan($organ)
    {
        foreach ($this->resource->organs as $valid_organ) {
            if ($valid_organ->id === $organ->id) {
                return $organ;
            }
        }
        return Organ::getGlobal();
    }

    /**
     * Determines whether running the associated Pathway in the given organ the
     *  given number of times is a valid aciton.
     * Note that if this PathwayResource does not exist in the given Organ, it
     *  will default to checking in the global organ.
     *
     * @param times   int     the number of times the Pathway in question would
     *                        be run
     * @param organ   Organ   the Organ in which the Pathway in question would
     *                        be run
     * @param reverse boolean whether the Pathway in question would be reversed,
     *                        default is false
     * @return true if the associated Pathway may be run with the given
     *         parameters, false otherwise
     */
    public function canModify($times, $organ, $reverse=false)
    {
        return $this->resource->isValidChange(
            $this->getProperOrgan($organ)->id,
            ($reverse ? -1 : 1) * $this->value * $times
        );
    }

    /**
     * Effects the change of running the associated Pathway in the given organ
     *  the given number of times.
     * Note that this function does not check whether the resulting resource
     *  level is valid, and so an appropriate call to
     *  PathwayResource::canModify() should be made before invoking this
     *  function.
     * Note also that if this PathwayResource does not exist in the given Organ,
     *  it will default to running in the global organ.
     *
     * @param times   int     the number of times to run the Pathway
     * @param organ   Organ   the Organ in which to run the Pathway
     * @param reverse boolean whether the Pathway should be reversed, default is
     *                        false
     * @return the new amount of the associated Resource in the given organ
     *         after the Pathway has been run
     */
    public function modify($times, $organ, $reverse=false)
    {
        return $this->resource->changeAmount(
            $this->getProperOrgan($organ)->id,
            ($reverse ? -1 : 1) * $this->value * $times
        );
    }
}