<?php

/**
 * @db resource_id  smallint(6)     the ID of the resource whose limit is
 *                                  determined by this ResourceLimit
 * @db soft_max     int             the point above which points are deducted
 * @db hard_max     int             the point which the resource may not exceed
 * @db soft_min     int             the point below which points are deducted
 * @db hard_min     int             the point which the resource may not drop
 *                                  below
 * @db rel_soft_max smallint(6)     the resource for which points are deducted
 *                                  if exceeded by this resource
 * @db rel_hard_max smallint(6)     the resource for which this resource may not
 *                                  exceed
 * @db rel_soft_min smallint(6)     the resource for which points are deducted
 *                                  if this resource drops below
 * @db rel_hard_min smallint(6)     the resource for which this resource may not
 *                                  drop below
 * @db penalization decimal(10,4)   the points deducted per turn and per amount
 *                                  by which the soft limit was broken
 * @fk resource     Resource
 * @fk res_soft_max Resource
 * @fk res_hard_max Resource
 * @fk res_soft_min Resource
 * @fk res_hard_min Resource
 */
class ResourceLimit extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'resource_limits';
    }

    public function primaryKey()
    {
        return 'resource_id';
    }

    public function relations()
    {
        return array(
            'resource' => array(
                self::BELONGS_TO,
                'Resource',
                'resource_id',
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
     * Gets a user-readable HTML description of this ResourceLimit, in the
     *  format:
     *
     * <p>Soft Min: {soft_min} {rel_soft_min} [{penalization}]</p>
     * <p>Soft Max: {soft_max} {rel_soft_max} [{penalization}]</p>
     * <p>Hard Min: {hard_min} {rel_hard_min}</p>
     * <p>Hard Max: {hard_max} {rel_hard_max}</p>
     * 
     * If the limit, for example, does not incorporate a soft minimum (absolute
     *  or relative) the first line will not be displayed.
     */
    public function toText()
    {
        $text = '';

        if ($this->soft_min !== null || $this->rel_soft_min !== null) {
            $text .= '<p>Soft Min: ';
            if ($this->soft_min !== null) {
                $text .= $this->soft_min . ' ';
            }
            if ($this->rel_soft_min !== null) {
                $text .= $this->rel_soft_min_res->name . ' ';
            }
            $text .= '[' . $this->penalization . ']</p>';
        }

        if ($this->soft_max !== null || $this->rel_soft_max !== null) {
            $text .= '<p>Soft Max: ';
            if ($this->soft_max !== null) {
                $text .= $this->soft_max . ' ';
            }
            if ($this->rel_soft_max !== null) {
                $text .= $this->rel_soft_max_res->name . ' ';
            }
            $text .= '[' . $this->penalization . ']</p>';
        }

        if ($this->hard_min !== null || $this->rel_hard_min !== null) {
            $text .= '<p>Hard Min: ';
            if ($this->hard_min !== null) {
                $text .= $this->hard_min . ' ';
            }
            if ($this->rel_hard_min !== null) {
                $text .= $this->rel_hard_min_res->name . ' ';
            }
        }

        if ($this->hard_max !== null || $this->rel_hard_max !== null) {
            $text .= '<p>Hard Max: ';
            if ($this->hard_max !== null) {
                $text .= $this->hard_max . ' ';
            }
            if ($this->rel_hard_max !== null) {
                $text .= $this->rel_hard_max_res->name . ' ';
            }
        }

        return $text;

    /**
     * Determines whether the resource associated with this ResourceLimit is
     *  allowed to have the given amount in the given organ.
     *
     * @param amount int   the amount potentially taken on by the associated
     *                     resource
     * @param organ  Organ the Organ in which the resource would potentially be
     *                     taking on the given amount
     * @return true if the given amount is valid in the given Organ, false
     *         otherwise
     */
    public function isValidAmount($amount, $organ)
    {
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
        if ($this->soft_max !== null) {
            $pen += max(0, $this->penalization * ($amount - $this->soft_max));
        }
        if ($this->soft_min !== null) {
            $pen += max(0, $this->penalization * ($this->soft_max - $amount));
        }
        if ($this->res_soft_max !== null) {
            $pen += max(
                0,
                $this->penalization * 
                    ($amount - $this->res_soft_max->getAmount($organ->id))
            );
        }
        if ($this->res_soft_min) {
            $pen += max(
                0,
                $this->penalization * 
                    ($this->res_soft_min->getAmount($organ->id) - $amount)
            );
        }
        return $pen;
    }
}