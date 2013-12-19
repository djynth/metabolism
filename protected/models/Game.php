<?php

/**
 * @db id        int(11)     a unique game ID
 * @db completed tinyint(1)  whether the game has been finished
 * @db score     smallint(6) the current number of points earned by the player
 * @db name      varchar(20) a non-unique user-chosen name for the game
 * @db turn      smallint(6) the current turn, i.e. the number of times the
 *                           player has made a move (indexed from 0)
 * @db user_id   int(11)     the user ID of the owner of this game, -1 if the
 *                           owner has not signed in
 * @fk user      User
 * @fk moves     array(Move) ordered by turn, descending
 */
class Game extends CActiveRecord
{
    public $completed = 0;
    public $score = 0;
    public $name = "New Game";
    public $turn = 0;
    public $user_id = -1;
    /**
     * The maximum number of turns in a game.
     * The turn counter begins with this value and decrements to 0, at which
     *  point the game ends.
     */
    const MAX_TURNS = 100;

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

    public function relations()
    {
        return array(
            'user' => array(self::BELONGS_TO, 'User', array('user_id' => 'id')),
            'moves' =>  array(
                            self::HAS_MANY,
                            'Move',
                            array('id' => 'game_id'),
                            'order' => 'moves.turn desc',
                        ),
        );
    }

    /**
     * Gets the database record corresponding to the game currently being played
     *  by the user.
     * Returns null if no database record has been created for the current game.
     *
     * @return the current Game
     */
    public static function getGameInstance()
    {
        return Yii::app()->session['game'];
    }

    /**
     * Determines whether a database record for the game currently being played
     *  by the user has been created.
     * If this returns false, Game::getGameInstance() will return null.
     *
     * @return true if there is a database record for the current game, false
     *         otherwise
     */
    public static function gameExists()
    {
        return self::getGameInstance() !== null;
    }

    /**
     * Initializes a new game and sets it as the current game.
     * An empty database record for the game is created and saved.
     */
    public static function initGame()
    {
        Yii::app()->session['game'] = new Game;
        self::getGameInstance()->save();    // save the game so that the game_id
                                            // is set
        if (($user = User::getCurrentUser()) !== null) {
            self::getGameInstance()->user_id = $user->id;
        }

        self::createMove();
    }

    /**
     * Loads the game with the given ID from the database.
     * The most recent resource levels are set to be active.
     *
     * @param game_id number the ID of the game to be loaded
     * @return true if the game was loaded successfully, false otherwise
     */
    public static function loadGame($game_id)
    {
        $game = self::model()->findByPk($game_id);
        if ($game !== null && count($game->moves) > 0) {
            Yii::app()->session['game'] = $game;
            foreach ($game->moves[0]->levels as $level) {
                Resource::setResourceAmount(
                    $level->resource_id,
                    $level->organ_id,
                    $level->amount
                );
            }
            return true;
        }
        return false;
    }

    /**
     * Saves the current game to the database, including the associated moves
     *  and move levels.
     * Games with no owner (i.e. the user was not logged in when the game was
     *  created) cannot be saved.
     *
     * @return true if the game was saved sucessfully, false otherwise
     */
    public static function saveGame()
    {
        if (!self::hasOwner()) {
            return false;
        }

        self::getGameInstance()->save();

        foreach (Yii::app()->session['moves'] as $move_data) {
            $move = $move_data['move'];
            $amount_data = $move_data['amounts'];

            $move->save();
            $move_levels = array();
            foreach ($amount_data as $resource_id => $levels) {
                foreach ($levels as $organ_id => $amount) {
                    $move_levels[] = array(
                        'move_id' => $move->id,
                        'resource_id' => $resource_id,
                        'organ_id' => $organ_id,
                        'amount' => $amount,
                    );
                }
            }
            Yii::app()->db->getCommandBuilder()->createMultipleInsertCommand(
                'move_levels',
                $move_levels
            )->execute();
        }
        Yii::app()->session['moves'] = array();

        return true;
    }

    /**
     * Resets the current game to an empty state.
     * Note that and changes to the game state or moves that has not yet been
     *  saved will be lost.
     */
    public static function resetGame()
    {
        unset(Yii::app()->session['game']);
        Yii::app()->session['moves'] = array();
        Resource::initStartingValues();
    }

    /**
     * Determines whether the current game as an associated owner; that is,
     *  whether the user was logged in when the game was started or has logged
     *  in since.
     *
     * @return true if the current game exists and has an owner, false otherwise
     */
    public static function hasOwner()
    {
        if (!self::gameExists()) {
            return false;
        }

        return self::getGameInstance()->user_id !== -1;
    }

    /**
     * Gets the owner of the current game.
     *
     * @return the owner of the current game, or null if the game does not exist
     *         or does not have an owner
     */
    public static function getOwner()
    {
        if (!self::hasOwner()) {
            return null;
        }
        return self::getGameInstance()->user;
    }

    /**
     * Gets the turn of the current game.
     *
     * @return the turn, or 0 if the game does not exist
     */
    public static function getTurn()
    {
        if (!self::gameExists()) {
            return 0;
        }

        return self::getGameInstance()->turn;
    }

    /**
     * Sets the turn of the current game.
     *
     * @param turn number the new turn
     * @return true if the game exists and the turn was set, false otherwise
     */
    public static function setTurn($turn)
    {
        if (!self::gameExists()) {
            return false;
        }

        return self::getGameInstance()->turn = $turn;
    }

    /**
     * Increments the turn of the current game, increasing it by one.
     *
     * @return true if the game exists and the turn was incremented, false
     *         othwerise
     */
    public static function incrementTurn()
    {
        return self::setTurn(self::getTurn() + 1);
    }

    /**
     * Determines whether the current game has been completed; if so, no more
     *  actions can be taken.
     *
     * @return true if the current game exists and has been completed, false
     *         otherwise
     */
    public static function isGameCompleted()
    {
        if (!self::gameExists()) {
            return false;
        }

        return self::getGameInstance()->completed;
    }

    /**
     * Gets the score for the current game.
     * 
     * @return the score, or 0 if the game does not exist
     */
    public static function getScore()
    {
        if (!self::gameExists()) {
            return 0;
        }

        return self::getGameInstance()->score;
    }

    /**
     * Sets the score for the current game.
     *
     * @param score number the new score
     * @return true if the score was set successfully, false otherwise
     */
    public static function setScore($score)
    {
        if (!self::gameExists()) {
            return false;
        }

        self::getGameInstance()->score = $score;
        return true;
    }

    /**
     * Adds points to the current game.
     *
     * @param points number the number of points to be added
     * @return true if the points were added successfully, false otherwise
     */
    public static function addPoints($points)
    {
        return self::setScore(self::getScore() + $points);
    }

    /**
     * Gets the name of the current game.
     *
     * @return the name of the current game, or null if it does not exist
     */
    public static function getGameName()
    {
        if (!self::gameExists()) {
            return null;
        }

        return self::getGameInstance()->name;
    }

    /**
     * This function should be invoked whenever a turn is successfully
     *  completed and updates the game state based on the action taken by the
     *  player.
     */
    public static function onTurnSuccess($pathway, $organ, $times, $reverse)
    {
        if (!self::gameExists()) {
            self::initGame();
        }

        self::addPoints(($reverse ? -1 : 1) * $times * $pathway->points);
        self::incrementTurn();

        self::createMove($pathway, $organ, $times, $reverse);
    }

    /**
     * Creates a new Move for the given action and adds it to the array of moves
     *  held in the session.
     * The Move is not saved to the database.
     * 
     * @param pathway Pathway|null the Pathway which was run, null by default
     * @param organ   Organ|null   the Organ in which the Pathway was run, null
     *                             by default
     * @param times   number|null  the number of times the Pathway was run, null
     *                             by default
     * @param reverse boolean|null whether the Pathway was reversed, null by
     *                             default
     */
    private static function createMove($pathway=null, $organ=null,
                                       $times=null, $reverse=null)
    {
        $game = self::getGameInstance();
        $move = new Move;
        $move->game_id = $game->id;
        $move->score = $game->score;
        $move->turn = $game->turn;
        if ($pathway !== null) {
            $move->pathway_id = $pathway->id;
        }
        if ($organ !== null) {
            $move->organ_id = $organ->id;
        }
        if ($times !== null) {
            $move->times_run = $times;
        }
        if ($reverse !== null) {
            $move->reverse = $reverse;
        }

        $moves = Yii::app()->session['moves'];
        $moves[] = array(
            'move' => $move,
            'amounts' => Resource::getAmounts(),
        );
        Yii::app()->session['moves'] = $moves;
    }
}