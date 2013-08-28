<?php
$this->pageTitle = Yii::app()->name;
?>

<div class="result-cover"></div>

<div class="sidebar" id="pathway-holder">
    <?php $this->renderPartial('pathways'); ?>
</div>

<?php $this->renderPartial('header'); ?>

<div id="cell-canvas"></div>

<?php $this->renderPartial('trackers'); ?>

<div class="sidebar" id="resource-holder">
    <?php $this->renderPartial('resources'); ?>
</div>
