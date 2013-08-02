<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
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

<div id="notification-holder">
    <div class="alert" id="notification">
        <button type="button" class="close" id="alert-close">&times;</button>
        <p id="alert-message"></p>
    </div>
</div>

<div class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3 id="modal-header"></h3>
    </div>
    <div class="modal-body">
        <p id="modal-content"></p>
    </div>
    <div class="modal-footer">
        <a class="btn" id="modal-cancel"></a>
        <a class="btn btn-primary" id="modal-confirm"></a>
    </div>
</div>

<script>

setPoints(<?= Game::STARTING_POINTS ?>);
setTurn(<?= Game::STARTING_TURN ?>, <?= Game::MAX_TURNS ?>);
setPh(<?= Game::STARTING_PH ?>);

</script>
