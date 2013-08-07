<?php

class Game
{
    const MAX_TURNS = 50;
    const STARTING_POINTS = 0;
    const STARTING_TURN = 50;

    public static function initGame()
    {
        self::setTurn(self::STARTING_TURN);
        self::setPoints(self::STARTING_POINTS);
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
}