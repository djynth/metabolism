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
     * Determines whether this Game has an owner associated with it.
     *
     * @return true if this Game has an owner, false otherwise
     */
    public function hasOwner()
    {
        return $this->user_id !== -1;
    }

    /**
     * Sets the turn of this Game to the given value, if it is a valid turn.
     *
     * @param turn number the new turn for this game, in the range between 0 and
     *                    Game::MAX_TURNS, inclusive
     * @return true if the turn was successfully set, false otherwise
     */
    public function setTurn($turn)
    {
        if ($turn > self::MAX_TURNS || $turn < 0) {
            return false;
        }
        $this->turn = $turn;
        if ($this->turn == self::MAX_TURNS) {
            $this->completed = true;
        }
        return true;
    }

    /**
     * Gets the database record corresponding to the game currently being played
     *  by the user.
     * Returns null if no database record has been created for the current game
     *  (although note that this can return a value if a record has been created
     *  but has not yet been saved to the database).
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
        $game = Yii::app()->session['game'] = new Game;
        if (($user = User::getCurrentUser()) !== null) {
            $game->user_id = $user->id;
        }
        $game->save();    // save the game so that the game_id is set

        Yii::app()->session['moves'] = array();
        Resource::initStartingValues();
        Organ::initActionCounts();

        self::createMove();
    }

    /**
     * Loads the game with the given ID from the database.
     * The current resource levels are set to the levels from the most recent
     *  move.
     * TODO: load the previous moves into the session moves variable
     *
     * @param game_id number the ID of the game to be loaded
     * @return true if the game was loaded successfully, false otherwise
     */
    public static function loadGame($game_id)
    {
        $game = self::model()->findByPk($game_id);
        if ($game !== null && !$game->completed) {
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
        if (($game = self::getGameInstance()) !== null && $game->hasOwner()) {
            $game->save();

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

        return false;
    }

    /**
     * Increments the turn of the current game, increasing it by one.
     *
     * @return true if the game exists and the turn was incremented, false
     *         othwerise
     */
    public static function incrementTurn()
    {
        if (($game = self::getGameInstance()) !== null) {
            return $game->setTurn($game->turn + 1);
        }

        return false;
    }

    /**
     * Adds the given number of points to the current game.
     *
     * @param points number the number of points to add
     * @return true if the game's points were updated, false otherwise
     */
    public static function addPoints($points) {
        if (($game = self::getGameInstance()) !== null) {
            $game->score += $points;
            return true;
        }
        return false;
    }

    /**
     * Gets the current score of the current game, or 0 if no game exists.
     *
     * @return the current game's score, or 0 if no game has yet been created
     */
    public static function getScore() {
        if (($game = self::getGameInstance()) !== null) {
            return $game->score;
        }
        return 0;
    }

    /**
     * Gets the current turn of the current game, or 0 if no game exists.
     *
     * @return the current game's turn, or 0 if no game has yet been created
     */
    public static function getTurn() {
        if (($game = self::getGameInstance()) !== null) {
            return $game->turn;
        }
        return 0;   
    }

    /**
     * Determines whether the current game has been completed.
     *
     * @return the completion state of the current game, true if the game is
     *         ongoing; defaults to false if no game has yet been created
     */
    public static function isGameCompleted() {
        if (($game = self::getGameInstance()) !== null) {
            return $game->completed;
        }
        return false;
    }

    /**
     * This function should be invoked whenever a turn is successfully
     *  completed and updates the game state based on the action taken by the
     *  player.
     *
     * @param pathway Pathway the Pathway that has been run
     * @param organ   Organ   the Organ in which the Pathway has been run
     * @param times   int     the number of times the Pathway was run this turn
     * @param reverse boolean whether the Pathway was run in reverse
     */
    public static function onTurnSuccess($pathway, $organ, $times, $reverse)
    {
        if (!self::gameExists()) {
            self::initGame();
        }

        if ($pathway->action) {
            $organ->incrementActionCount($times);
        }

        self::addPoints(($reverse ? -1 : 1) * $times * $pathway->points);
        self::addPoints(-Resource::getPenalizations());
        self::incrementTurn();

        self::createMove($pathway, $organ, $times, $reverse);
    }

    /**
     * Undoes the most recently run pathway.
     *
     * @return true if the move was successfully redacted, false otherwise
     */
    public static function undo()
    {
        $game = self::getGameInstance();
        if ($game === null) {
            return false;
        }

        $moves = Yii::app()->session['moves'];

        if (count($moves) < 2) {
            return false;
        }

        array_pop($moves);
        Yii::app()->session['moves'] = $moves;
        $move_data = end($moves);

        $move = $move_data['move'];
        $amounts = $move_data['amounts'];

        Resource::setAmounts($amounts);
        $game->setTurn($move->turn);
        $game->score = $move->score;
        return true;
    }

    /**
     * Creates a new Move for the given action and adds it to the array of moves
     *  held in the session.
     * The Move is not saved to the database.
     * 
     * @param pathway Pathway|null the Pathway which was run, null by default
     * @param organ   Organ|null   the Organ in which the Pathway was run, null
     *                             by default
     * @param times   int|null     the number of times the Pathway was run, null
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