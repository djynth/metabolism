<?php

class SiteController extends CController
{
    public function actionIndex()
    {
        Game::resetGame();

        $this->render('index');
    }

    public function actionResult()
    {
        $user = User::getCurrentUser();
        if ($user !== null || Game::isGameCompleted()) {
            $this->render('result', array(
                'game_id' => Game::getGameInstance()->id,
            ));
        }
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
        if (isset($_POST['pathway_id'], $_POST['organ'], $_POST['times'],
                  $_POST['reverse'])) {
            $pathway = Pathway::model()->findByPk($_POST['pathway_id']);
            $reverse = $_POST['reverse'] == 'true' ? true : false;

            $success = $pathway->run(
                $_POST['times'],
                Organ::model()->findByPk($_POST['organ']),
                null,
                $reverse
            );

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'pathway_name' => $pathway->name,
                'points' => Game::getScore(),
                'turn' => Game::getTurn(),
                'resources' => Resource::getAmounts(),
                'game_over' => Game::isGameCompleted(),
            ));
        }
    }

    public function actionEat()
    {
        if (isset($_POST['nutrients'])) {
            $success = Pathway::eat($_POST['nutrients']);

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'pathway_name' => Pathway::EAT_NAME,
                'points' => Game::getScore(),
                'turn' => Game::getTurn(),
                'resources' => Resource::getAmounts(),
                'game_over' => Game::isGameCompleted(),
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