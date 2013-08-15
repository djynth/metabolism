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
            $pathway = Pathway::model()->findByPk($_POST['pathway_id']);
            $success = $pathway->run($_POST['times'], Organ::model()->findByPk($_POST['organ']));

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'pathway_name' => $pathway->name,
                'points' => Game::getPoints(),
                'turn' => Game::getTurn(),
                'resources' => Resource::getAmounts(),
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
                'points' => Game::getPoints(),
                'turn' => Game::getTurn(),
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