<?php

class SiteController extends CController
{
    public function getActionParams()
    {
        return array_merge($_GET, $_POST);
    }

    public function actionIndex($action='main', $username=null, $verification=null)
    {
        Yii::app()->session->clear();
        Yii::app()->session['game'] = new Game;

        $this->render('index', array(
            'organs' => Organ::model()->findAll(),
            'non_global' => Organ::getNotGlobal(),
            'primary_resources' => Resource::model()->findAllByAttributes(
                array('primary' => true)
            ),
            'user' => User::getCurrentUser(),
            'passive_pathways' => Pathway::getPassivePathways(),
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

    public function actionPathway($pathway_id, $times, $organ_id, $reverse)
    {
        $game = Yii::app()->session['game'];

        if ($game !== null) {
            $pathway = Pathway::model()->findByPk((int)$pathway_id);
            $organ = Organ::model()->findByPk((int)$organ_id);
            $reverse = ($reverse === "true");
            $pathway->run($game, (int)$times, $organ, $reverse, false);

            echo CJavaScript::jsonEncode($game->getState());
        }
    }

    public function actionEat(array $nutrients)
    {
        $game = Yii::app()->session['game'];

        if ($game !== null) {
            Pathway::eat($game, $nutrients);
        
            echo CJavaScript::jsonEncode($game->getState());
        }
    }

    public function actionUndo()
    {
        $game = Yii::app()->session['game'];

        if ($game !== null) {
            $game->undo();

            echo CJavaScript::jsonEncode($game->getState());
        }
    }

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