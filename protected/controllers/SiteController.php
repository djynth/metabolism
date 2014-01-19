<?php

class SiteController extends Controller
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

    public function actionPathway($pathway_id, $times, $organ_id, $reverse)
    {
        $pathway = Pathway::model()->findByPk((int)$pathway_id);
        $organ = Organ::model()->findByPk((int)$organ_id);
        $reverse = ($reverse === "true");

        $success = $pathway->run((int)$times, $organ, $reverse);

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'pathway_name' => $pathway->name,
            'points' => Game::getScore(),
            'turn' => Game::getTurn(),
            'resources' => Resource::getAmounts(),
            'game_over' => Game::isGameCompleted(),
        ));
    }

    public function actionEat(array $nutrients)
    {
        $parsed_nutrients = array();
        foreach ($nutrients as $id => $amount) {
            if ($amount) {
                $parsed_nutrients[$id] = (int)$amount;
            }
        }

        $success = Pathway::eat($parsed_nutrients);

        echo CJavaScript::jsonEncode(array(
            'success' => $success,
            'pathway_name' => Pathway::EAT_NAME,
            'points' => Game::getScore(),
            'turn' => Game::getTurn(),
            'resources' => Resource::getAmounts(),
            'game_over' => Game::isGameCompleted(),
        ));
    }

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