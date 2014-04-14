<?php

/**
 * @db resource_id      smallint(6)
 * @db soft_max         int(11)
 * @db hard_max         int(11)
 * @db soft_min         int(11)
 * @db hard_min         int(11)
 * @db rel_soft_max     smallint(6)
 * @db rel_hard_max     smallint(6)
 * @db rel_soft_min     smallint(6)
 * @db rel_hard_min     smallint(6)
 * @db penalization     decimal(10,4)
 * @fk resource         Resource
 * @fk rel_soft_max_res Resource
 * @fk rel_hard_max_res Resource
 * @fk rel_soft_min_res Resource
 * @fk rel_hard_min_res Resource
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
                self::HAS_ONE,
                'Resource',
                array('id' => 'resource_id'),
            ),
            'rel_soft_max_res' => array(
                self::HAS_ONE,
                'Resource',
                array('id' => 'rel_soft_max'),
            ),
            'rel_hard_max_res' => array(
                self::HAS_ONE,
                'Resource',
                array('id' => 'rel_hard_max'),
            ),
            'rel_soft_min_res' => array(
                self::HAS_ONE,
                'Resource',
                array('id' => 'rel_soft_min'),
            ),
            'rel_hard_min_res' => array(
                self::HAS_ONE,
                'Resource',
                array('id' => 'rel_hard_min'),
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
    }
}