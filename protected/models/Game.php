<?php

class Game
{
    const MAX_TURNS = 50;
    const STARTING_POINTS = 0;
    const STARTING_TURN = 50;
    const STARTING_PH = 7.3;
    const ACID_DEATH_PH = 7;
    const BASE_DEATH_PH = 7.5;
    const PH_PER_CO2 = -0.03;

    public static function initGame()
    {
        self::setTurn(self::STARTING_TURN);
        self::setPoints(self::STARTING_POINTS);
        self::setPh(self::STARTING_PH);
    }

    public static function getTurn()
    {
        return Yii::app()->session['turn'];
    }

    public static function setTurn($turn)
    {
        return Yii::app()->session['turn'] = $turn;
    }

    public static function incrementTurn()
    {
        return self::setTurn(self::getTurn() - 1);
    }

    public static function getPoints()
    {
        return Yii::app()->session['points'];
    }

    public static function setPoints($points)
    {
        return Yii::app()->session['points'] = $points;
    }

    public static function addPoints($points)
    {
        return self::setPoints(self::getPoints() + $points);
    }

    public static function setPh($ph)
    {
        return Yii::app()->session['ph'] = $ph;
    }

    public static function calculatePh()
    {
        $ph = self::STARTING_PH;

        $resources = Resource::model()->findAllByAttributes(array('global' => 1));
        foreach ($resources as $resource) {
            $ph += $resource->getAmount()*floatval($resource->ph);
        }

        return self::setPh($ph);
    }

    public static function getPh()
    {
        return Yii::app()->session['ph'];
    }
}