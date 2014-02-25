<?php

class SiteController extends Controller
{
    /**
     * Renders the main page.
     * The Game is reset to the initial state.
     */
    public function actionIndex()
    {
        Game::initGame();

        $this->render('index', array(
            'organs' => Organ::model()->findAll(),
            'non_global' => Organ::getNotGlobal(),
            'primary_resources' => Resource::model()->findAllByAttributes(
                array('primary' => true)
            ),
            'user' => User::getCurrentUser(),
        ));
    }

    /**
     * Renders the result page, which displays statistics and information to the
     *  player upon the completion of a game.
     */
    public function actionResult()
    {
        $user = User::getCurrentUser();
        if ($user !== null || Game::isGameCompleted()) {
            $this->render('result', array(
                'game_id' => Game::getGameInstance()->id,
            ));
        }
    }

    /**
     * Renders the error page, simply dumping the error and exiting.
     */
    public function actionError()
    {
        if ($error = Yii::app()->errorHandler->error) {
            var_dump($error);
            die;
        }
    }

    /**
     * Renders the email verification page, inserting the email address and
     *  username if they are given.
     */
    public function actionVerifyEmail($email='', $username='')
    {
        $this->render('verify-email', array(
            'email' => $email,
            'username' => $username,
        ));
    }

    /**
     * Renders the password reset page, inserting the username if it is given.
     */
    public function actionResetPassword($username='')
    {
        $this->render('reset-password', array(
            'username' => $username,
        ));
    }

    /**
     * Runs a pathway besides the special Eat pathway.
     * This action, if successfully completed, will result in the progression of
     *  the game by a single turn.
     * The game's state after the Pathway is run is returned to the client by
     *  means of a JSON packet.
     * 
     * @param pathway_id string|int the ID of the Pathway to be run
     * @param times      string|int the number of times to run the Pathway
     * @param organ_id   string|int the ID of the Organ in which to run the
     *                              Pathway
     * @param reverse    string     whether the Pathway should be reversed,
     *                              either "true" or "false"
     */
    public function actionPathway($pathway_id, $times, $organ_id, $reverse)
    {
        $pathway = Pathway::model()->findByPk((int)$pathway_id);
        $organ = Organ::model()->findByPk((int)$organ_id);
        $reverse = ($reverse === "true");

        $success = $pathway->run((int)$times, $organ, $reverse);

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'points' => Game::getScore(),
            'turn' => Game::getTurn(),
            'resources' => Resource::getAmounts(),
            'game_over' => Game::isGameCompleted(),
            'action_counts' => Organ::getActionCounts(),
        ));
    }

    /**
     * Runs the special Eat pathway.
     * This action, if successfully completed, will result in the progression of
     *  the game by a single turn.
     * The game's state after Eat is run is returned to the client by means of a
     *  JSON packet.
     *
     * @param nutrients array the nutrients to be eaten, in the format
     *                        resource_id => amount
     */
    public function actionEat(array $nutrients)
    {
        $parsed_nutrients = array();
        foreach ($nutrients as $id => $amount) {
            if ($amount) {  // parsing $nutrients into an array results in the
                            // insertion of empty values at the keys 0 to the
                            // lowest nutrient ID
                $parsed_nutrients[$id] = (int)$amount;
            }
        }

        $success = Pathway::eat($parsed_nutrients);

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'points' => Game::getScore(),
            'turn' => Game::getTurn(),
            'resources' => Resource::getAmounts(),
            'game_over' => Game::isGameCompleted(),
            'action_counts' => Organ::getActionCounts(),
        ));
    }

    /**
     * Undoes the most recently run pathway.
     * The game's state after the undo is completed is returned to the client by
     *  means of a JSON packet.
     */
    public function actionUndo()
    {
        $success = Game::undo();

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'points' => Game::getScore(),
            'turn' => Game::getTurn(),
            'resources' => Resource::getAmounts(),
            'game_over' => Game::isGameCompleted(),
            'action_counts' => Organ::getActionCounts(),
        ));
    }

    /**
     * Renders a resource visual.
     * The visual and some metadata are returned to the client in a JSON packet.
     * 
     * @param resource_id string|int the ID of the Resource whose visual should
     *                               be created
     */
    public function actionResourceVisual($resource_id)
    {
        $resource = Resource::model()->findByPk((int)$resource_id);
        echo CJavaScript::jsonEncode(array(
            'visual' => $this->renderPartial(
                'resource-visual',
                array('resource' => $resource),
                true
            ),
            'resource' => $resource->id,
            'resource_name' => $resource->name,
            'sources' => $resource->getSources(),
            'destinations' => $resource->getDestinations(),
        ));
    }
}