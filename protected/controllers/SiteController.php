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

    public function actionOrganColor()
    {
        if (isset($_POST) && count($_POST) > 0) {
            $organ = Organ::model()->findByAttributes(array('id' => $_POST['organ']));

            echo CJavaScript::jsonEncode(array(
                'color' => $organ->color
            ));
        }
    }

    public function actionProducts()
    {
        if (isset($_POST) && count($_POST) > 0) {
            $pathway = Pathway::model()->findByAttributes(array('id' => $_POST['pathway']));
            $resource = $_POST['product'];

            echo CJavaScript::jsonEncode(array(
                'match' => self::resourceMatch($pathway->getProducts(), $resource)
            ));
        }
    }

    public function actionReactants()
    {
        if (isset($_POST) && count($_POST) > 0) {
            $pathway = Pathway::model()->findByAttributes(array('id' => $_POST['pathway']));
            $resource = $_POST['reactant'];

            echo CJavaScript::jsonEncode(array(
                'match' => self::resourceMatch($pathway->getReactants(), $resource)
            ));
        }
    }

    private static function resourceMatch($resources, $key)
    {
        foreach ($resources as $resource) {
            if (intval($key) === intval($resource->resource_id) || 
                Resource::model()->findByAttributes(array('id' => $resource->resource_id))->matchesName($key))
            {
                return true;
            }
        }
        return false;
    }
}