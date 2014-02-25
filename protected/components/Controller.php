<?php

class Controller extends CController
{
    public function getActionParams()
    {
        return array_merge($_GET, $_POST);
    }
}