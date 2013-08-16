<?php

$this->pageTitle = Yii::app()->name;
Yii::app()->getClientScript()->registerScriptFile(Yii::app()->baseUrl . '/js/result.js');
Yii::app()->getClientScript()->registerCssFile(Yii::app()->baseUrl . '/css/result.css');
?>

<div class="result-cover"></div>

<p>Result!</p>