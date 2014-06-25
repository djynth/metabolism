<?php

class SiteController extends CController
{
    public function getActionParams()
    {
        return array_merge($_GET, $_POST);
    }

    public function actionIndex($action='main', $username=null,
                                $verification=null)
    {
        $this->render('index', array(
            'organs' => Organ::model()->findAll(),
            'non_global' => Organ::getNotGlobal(),
            'primary_resources' => Resource::model()->findAllByAttributes(
                array('primary' => true)
            ),
            'user' => User::getCurrentUser(),
            'action' => $action,
            'username' => $username,
            'verification' => $verification,
        ));
    }

    public function actionError()
    {
        if ($error = Yii::app()->errorHandler->error) {
            var_dump($error);
            die;
        }
    }

    public function actionNewGame()
    {
        $game = new Game;
        Yii::app()->session->clear();
        Yii::app()->session['game'] = $game;

        Organ::setActionCounts(Organ::getStartingActionCounts());
        Resource::setAmounts($game->challenge->getStartingAmounts());

        echo json_encode(self::getState($game));
    }

    public function actionPathway($pathway_id, $times, $organ_id, $reverse)
    {
        $game = Yii::app()->session['game'];

        if ($game !== null) {
            $pathway = Pathway::model()->findByPk((int)$pathway_id);
            $organ = Organ::model()->findByPk((int)$organ_id);
            $reverse = ($reverse === "true");
            $pathway->run($game, (int)$times, $organ, $reverse, false);

            echo CJavaScript::jsonEncode(self::getState($game));
        }
    }

    public function actionEat(array $nutrients)
    {
        $game = Yii::app()->session['game'];

        if ($game !== null) {
            Pathway::eat($game, $nutrients);
        
            echo CJavaScript::jsonEncode(self::getState($game));
        }
    }

    public function actionUndo()
    {
        $game = Yii::app()->session['game'];

        if ($game !== null) {
            $game->undo();

            echo CJavaScript::jsonEncode(self::getState($game));
        }
    }

    public function actionResourceInfo($resource_id)
    {
        $resource = Resource::model()->findByPk((int)$resource_id);
        $game = Yii::app()->session['game'];
        if ($resource !== null && $game !== null) {

            $limit = ChallengeLimit::model()->findByAttributes(array(
                'challenge_id' => $game->challenge_id,
                'resource_id' => $resource->id,
            ));

            echo CJavaScript::jsonEncode(array(
                'name' => $resource->name,
                'aliases' => $resource->getAliases(),
                'formula' => $resource->formula,
                'description' => $resource->description,
                'soft_min' => $limit->soft_min,
                'soft_max' => $limit->soft_max,
                'hard_min' => $limit->hard_min,
                'hard_max' => $limit->hard_max,
            ));
        }
    }

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

    private static function getState($game)
    {
        $state = $game->getState();
        $state['passive_pathways'] = Pathway::getPassivePathwayAvailability(
            $game->challenge
        );
        $state['limits'] = array();
        foreach ($game->challenge->limits as $limit) {
            $state['limits'][$limit->resource_id] = array(
                'hard_min' => $limit->hard_min,
                'soft_min' => $limit->soft_min,
                'soft_max' => $limit->soft_max,
                'hard_max' => $limit->hard_max,
                'penalization' => $limit->penalization,
            );
        }

        $state['restrictions'] = array();
        foreach ($game->challenge->restrictions as $restriction) {
            $state['restrictions'][$restriction->pathway_id] = 
                $restriction->limit;
        }

        return $state;
    }
}