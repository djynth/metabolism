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
                'soft_min' => $resource->soft_min,
                'soft_max' => $resource->soft_max,
                'hard_min' => $resource->hard_min,
                'hard_max' => $resource->hard_max,
                'rel_soft_min' => $resource->rel_soft_min,
                'rel_soft_max' => $resource->rel_soft_max,
                'rel_hard_min' => $resource->rel_hard_min,
                'rel_hard_max' => $resource->rel_hard_max,
            ));
        }
    }

    /**
     * Selects a random tracker icon for the given resource, level, and theme
     *  type and returns its URL to the client in a JSON packet.
     *
     * @param resource_id number the ID of the resource for which to get a 
     *                           tracker icon
     * @param level       number the level of the icon
     * @param theme_type  string the type of the current theme
     */
    public function actionTrackerIcon($resource_id, $level, $theme_type)
    {
        $resource = Resource::model()->findByPk((int)$resource_id);
        $files = glob(
            "img/primary-icons/" . $theme_type . "/" . 
                strtolower($resource->name) . "/level" . $level . "/*.png"
        );
        echo CJavaScript::jsonEncode(array(
            'src' => $files[rand(0, count($files)-1)]
        ));
    }
}