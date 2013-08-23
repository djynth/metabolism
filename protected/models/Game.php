<?php

class Game extends CActiveRecord
{
    const MAX_TURNS = 100;
    const STARTING_POINTS = 0;
    const STARTING_TURN = self::MAX_TURNS;

    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'games';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public static function initGame()
    {
        self::setTurn(self::STARTING_TURN);
        self::setPoints(self::STARTING_POINTS);
        self::setGameId(-1);
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

    public static function isGameOver()
    {
        return self::getTurn() === 0;
    }

    public static function isGameStarted()
    {
        return self::getTurn() !== self::STARTING_TURN;
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

    public static function getGameId()
    {
        return Yii::app()->session['game_id'];
    }

    private static function setGameId($id)
    {
        return Yii::app()->session['game_id'] = $id;
    }

    public static function onTurnSuccess($pathway, $organ, $times)
    {
        $points = $pathway->points * $times;

        if (self::getGameId() === -1) {     // the game has just begun, create db entries and assign a valid game id
            $game = new Game;
            $game->score = self::STARTING_POINTS;
            if (!$game->save()) {
                return false;
            }

            self::setGameId($game->id);

            if (($user = User::getCurrentUser()) !== null) {
                $userGame = new UserGame;
                $userGame->user_id = $user->id;
                $userGame->game_id = $game->id;
                if (!$userGame->save()) {
                    return false;
                }
            }

            $move = new Move;
            $move->game_id = $game->id;
            $move->score = self::STARTING_POINTS;
            if (!$move->save() || self::saveMoveLevels($move) === 0) {
                return false;
            }
        }

        $move = new Move;
        $move->game_id = self::getGameId();
        $move->move_number = self::getTurn();
        $move->pathway_id = $pathway->id;
        $move->times_run = $times;
        $move->organ_id = $organ->id;
        $move->score = self::getPoints();
        if (!$move->save() || self::saveMoveLevels($move) === 0) {
            return false;
        }

        self::incrementTurn();
        self::addPoints($points);

        return true;
    }

    private static function saveMoveLevels($move)
    {
        $data = array();
        $amounts = Resource::getAmounts();
        foreach ($amounts as $resource_id => $organs) {
            foreach ($organs as $organ_id => $amount) {
                $data[] = array(
                    'move_id'     => $move->id,
                    'resource_id' => $resource_id,
                    'organ_id'    => $organ_id,
                    'amount'      => $amount,
                );
            }
        }

        return Yii::app()->db->getCommandBuilder()->createMultipleInsertCommand('move_levels', $data)->execute();
    }
}