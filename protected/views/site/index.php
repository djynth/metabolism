<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>

<div class="sidebar" id="pathway-holder">
    <?php $this->renderPartial('pathways'); ?>
</div>

<p class="bottom-info" id="points"></p>
<p class="bottom-info" id="turns" ></p>

<canvas id="cell-canvas"></canvas>

<div class="floating-visual" id="pathway-visual">
    <p class="visual-label">Pathway</p>
</div>
<div class="floating-visual" id="organ-visual">
    <p class="visual-label">Organ</p>
</div>
<div class="floating-visual" id="cell-visual">
    <p class="visual-label">Cell</p>
</div>
<div class="floating-visual" id="resource-visual">
    <p class="visual-label">Resource</p>
</div>

<div class="resource-bar" id="ph-holder">
    <div class="progress">
        <span class="resource-name">pH</span>
        <span class="resource-value"></span>
        <div class="bar"></div>
    </div>
</div>

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
            <a class="btn" id="modal-cancel">Cancel</a>
            <a class="btn btn-primary" id="modal-confirm">Confirm</a>
      </div>
</div>

<script>

setPoints(<?= Game::STARTING_POINTS ?>);
setTurn(<?= Game::STARTING_TURN ?>, <?= Game::MAX_TURNS ?>);
updatePh(<?= Game::STARTING_PH ?>);

</script>
