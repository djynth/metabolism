<?php

class SiteController extends Controller
{
    public function actions()
    {
        return array();
    }

    public function actionIndex()
    {
        Game::initGame();
        Resource::initStartingValues();

        $this->render('index');
    }

    public function actionPathway()
    {
        if (isset($_POST) && count($_POST) > 0) {
            $times = $_POST['times'];
            $organ = Organ::model()->findByAttributes(array('id' => $_POST['organ']));

            $pathway = Pathway::model()->findByAttributes(array('id' => $_POST['pathway_id']));

            if ($pathway->run($times, $organ)) {
                $success = true;
                $turn = Game::incrementTurn();
                $points = Game::addPoints($pathway->points * $times);
            } else {
                $succress = false;
                $turn = Game::getTurn();
                $points = Game::getPoints();
            }

            echo CJavaScript::jsonEncode(array(
                'success' => $success,
                'pathway_name' => $pathway->name,
                'points' => $points,
                'turn' => $turn,
                'max_turns' => Game::MAX_TURNS,
                'ph' => Game::getPh(),
                'resources' => Resource::getAmounts(),
            ));
        }
    }

    public function actionEat()
    {
        if (isset($_POST) && count($_POST) > 0) {
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
                'max_turns' => Game::MAX_TURNS,
                'ph' => Game::getPh(),
                'resources' => Resource::getAmounts(),
            ));
        }
    }

    public function actionResourceVisual()
    {
        if (isset($_POST) && count($_POST) > 0) {
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