<?php

/**
 * @db id           int(11)     a unique game ID
 * @db completed    tinyint(1)  whether the game has been finished
 * @db score        smallint(6) the number of points earned by the player
 * @db name         varchar(20) a non-unique user-chosen name for the game
 * @db turn         smallint(6) the current turn, i.e. the number of times the
 *                              player has made a move (indexed from 0)
 * @db user_id      int(11)     the user ID of the owner of this game, -1 if the
 *                              owner has not signed in
 * @db mode         int(11)     the mode of this game
 * @db challenge_id int(11)     the ID of the challenge dictating the parameters
 *                              of this game
 * @fk user      User
 * @fk state     array(GameState)
 * @fk challenge Challenge
 */
class Game extends CActiveRecord
{
    public $completed = 0;
    public $score = 0;
    public $name = "New Game";
    public $turn = 0;
    public $user_id = -1;
    public $max_turns = -1;
    public $mode = 1;
    
    const MODE_FREE_PLAY = 1;
    const MODE_CHALLENGE = 2;
    const MODE_CAMPAIGN = 3;

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
            'user' => array(
                self::BELONGS_TO,
                'User',
                array('user_id' => 'id'),
            ),
            'state' => array(
                self::HAS_MANY,
                'GameState',
                array('id' => 'game_id'),
            ),
            'challenge' => array(
                self::BELONGS_TO,
                'Challenge',
                array('challenge_id' => 'id'),
            ),
        );
    }

    function Game($mode, $challenge_id=null)
    {
        parent::__construct();

        if (($user = User::getCurrentUser()) !== null) {
            $this->user_id = $user->id;
        }

        $this->mode = $mode;
        if ($mode === self::MODE_CHALLENGE) {
            if ($challenge_id === null || 
                $challenge_id === Challenge::FREE_PLAY_ID) {
                $challenge_id = Challenge::getChallenges()[0]->id;
            } else {
                $this->challenge_id = $challenge_id;
            }
        } else {
            $this->challenge_id = Challenge::FREE_PLAY_ID;
        }

        $this->appendState();
    }

    public function save()
    {
        parent::save();

        $state = array();
        foreach (Resource::getAmounts() as $resource => $organs) {
            foreach ($organs as $organ => $amount) {
                $state[] = array(
                    'game_id' => $this->id,
                    'resource_id' => $resource,
                    'organ_id' => $organ,
                    'amount' => $amount,
                );
            }
        }

        foreach (Organ::getActionCounts() as $organ => $count) {
            $state[] = array(
                'game_id' => $this->id,
                'resource_id' => null,
                'organ_id' => $organ,
                'amount' => $count,
            );
        }

        Yii::app()->db->getCommandBuilder()->createMultipleInsertCommand(
            'game_state',
            $state
        )->execute();
    }

    public static function load($id)
    {
        $game = self::model()->findByPk($id);
        $amounts = array();
        $actionCounts = array();
        foreach ($game->state as $state) {
            if ($state->resource !== null) {
                $amounts[$state->resource->id][$state->organ->id] = 
                    $state->amount;
            } else {
                $actionCounts[$state->organ->id] = $state->amount;
            }
        }
        Resource::setAmounts($amounts);
        Organ::setActionCounts($actionCounts);
        $this->appendState();
        return $game;
    }

    public function getState()
    {
        return array(
            'score' => $this->score,
            'turn' => $this->turn,
            'max_turns' => $this->challenge->max_turns,
            'resources' => Resource::getAmounts(),
            'action_counts' => Organ::getActionCounts(),
            'completed' => $this->completed,
            'challenge_id' => $this->challenge_id,
        );
    }

    public function setState($state)
    {
        $this->score = $state['score'];
        $this->turn = $state['turn'];
        $this->max_turns = $state['max_turns'];
        Resource::setAmounts($state['resources']);
        Organ::setActionCounts($state['action_counts']);
        $this->completed = $state['completed'];
        $this->challenge_id = $state['challenge_id'];
    }

    public function isOver()
    {
        switch($this->mode)
        {
            case self::MODE_CAMPAIGN:
                return false;
            case self::MODE_FREE_PLAY:
            case self::MODE_CHALLENGE:
                return ($this->challenge->max_turns !== -1 &&
                        $this->turn >= $this->challenge->max_turns) || 
                       $this->challenge->areGoalsMet();
            default:
                return false;
        }
    }

    public function onTurn($pathway, $organ, $times, $reverse)
    {
        if ($pathway->action) {
            $organ->setActionCount($organ->getActionCount() + $times);
        }

        $this->score += ($reverse ? -1 : 1) * $times * $pathway->points;
        if (!$pathway->passive) {
            $this->score -= Resource::getPenalizations($this->challenge);
            foreach (Pathway::getPassivePathways() as $pathway) {
                $restriction = $pathway->getRestriction($this->challenge);
                if ($restriction !== null) {
                    foreach ($pathway->organs as $organ) {
                        $pathway->run(
                            $this,
                            $restriction->limit,
                            $organ,
                            false,
                            true
                        );    
                    }
                }
            }

            $this->turn++;
            $this->completed = $this->isOver();
            $this->appendState();
        }
    }

    private function appendState()
    {
        if (Yii::app()->session['states'] === null) {
            Yii::app()->session['states'] = array();
        }
        $states = Yii::app()->session['states'];
        $states[] = $this->getState();
        Yii::app()->session['states'] = $states;
    }

    public function undo()
    {
        $states = Yii::app()->session['states'];
        if (count($states) > 1) {
            array_pop($states);
            Yii::app()->session['states'] = $states;
            $this->setState($states[count($states) - 1]);
        }
    }
}