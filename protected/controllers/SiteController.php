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
            'passive_pathways' => Pathway::getPassivePathways(),
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
        $pathway->run((int)$times, $organ, $reverse, false);

        echo CJavaScript::jsonEncode(Game::getState());
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
        Pathway::eat($nutrients);
        
        echo CJavaScript::jsonEncode(Game::getState());
    }

    /**
     * Undoes the most recently run pathway.
     * The game's state after the undo is completed is returned to the client by
     *  means of a JSON packet.
     */
    public function actionUndo()
    {
        Game::undo();

        echo CJavaScript::jsonEncode(Game::getState());
    }

    /**
     * Gets all the information associated with a resource and returns it to the
     *  client as a JSON packet.
     *
     * @param resource_id number the ID of the resource
     */
    public function actionResourceInfo($resource_id)
    {
        $resource = Resource::model()->findByPk((int)$resource_id);
        if ($resource !== null) {
            echo CJavaScript::jsonEncode(array(
                'name' => $resource->name,
                'aliases' => $resource->getAliases(),
                'formula' => $resource->formula,
                'description' => $resource->description,
                'soft_min' => $resource->limit->soft_min,
                'soft_max' => $resource->limit->soft_max,
                'hard_min' => $resource->limit->hard_min,
                'hard_max' => $resource->limit->hard_max,
                'rel_soft_min' => $resource->limit->rel_soft_min,
                'rel_soft_max' => $resource->limit->rel_soft_max,
                'rel_hard_min' => $resource->limit->rel_hard_min,
                'rel_hard_max' => $resource->limit->rel_hard_max,
            ));
        }
    }

    public function actionTrackerIcon($resource_id, $level, $theme_type)
    {
        $resource = Resource::model()->findByPk((int)$resource_id);
        $files = glob("img/primary-icons/" . $theme_type . "/" . strtolower($resource->name) . "/level" . $level . "/*.png");
        echo CJavaScript::jsonEncode(array(
            'src' => $files[rand(0, count($files)-1)]
        ));
    }
}