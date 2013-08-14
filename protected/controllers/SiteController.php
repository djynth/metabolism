<?php

class SiteController extends CController
{
    public function actionIndex()
    {
        Game::initGame();
        Resource::initStartingValues();

        $this->render('index');
    }

    public function actionError()
    {
        if ($error = Yii::app()->errorHandler->error) {
            var_dump($error);
            die;
        }
    }

    public function actionPathway()
    {
        if (isset($_POST['pathway_id'], $_POST['organ'], $_POST['times'])) {
            $pathway = Pathway::model()->findByAttributes(array('id' => $_POST['pathway_id']));
            $organ = Organ::model()->findByAttributes(array('id' => $_POST['organ']));
            $times = $_POST['times'];

            if ($pathway->run($times, $organ)) {
                $success = true;
                $turn = Game::incrementTurn();
                $points = Game::addPoints($pathway->points * $times);
            } else {
                $success = false;
                $turn = Game::getTurn();
                $points = Game::getPoints();
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'pathway_name' => $pathway->name,
                'points' => $points,
                'turn' => $turn,
                'resources' => Resource::getAmounts(),
            ));
        }
    }

    public function actionEat()
    {
        if (isset($_POST['nutrients'])) {
            if (Pathway::eat($_POST['nutrients'])) {
                $success = true;
                $turn = Game::incrementTurn();
                $points = Game::addPoints(Pathway::getEat()->points);
            } else {
                $success = false;
                $turn = Game::getTurn();
                $points = Game::getPoints();
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'pathway_name' => Pathway::EAT_NAME,
                'points' => $points,
                'turn' => $turn,
                'resources' => Resource::getAmounts(),
            ));
        }
    }

    public function actionResourceVisual()
    {
        if (isset($_POST['resource'])) {
            $resource = Resource::model()->findByAttributes(array('id' => $_POST['resource']));
            echo CJavaScript::jsonEncode(array(
                'visual' => $this->renderPartial('resource-visual', array('resource' => $resource), true),
                'resource' => $resource->id,
                'resource_name' => $resource->name,
                'sources' => $resource->getSources(),
                'destinations' => $resource->getDestinations(),
            ));
        }
    }
}