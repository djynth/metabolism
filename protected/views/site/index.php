<?php
$this->pageTitle = Yii::app()->name;
?>

<div class="sidebar" id="pathway-holder">
    <?php $this->renderPartial('pathways'); ?>
</div>

<?php $this->renderPartial('header'); ?>

<canvas id="cell-canvas"></canvas>

<?php $this->renderPartial('trackers'); ?>

<div class="sidebar" id="resource-holder">
    <?php $this->renderPartial('resources'); ?>
</div>
