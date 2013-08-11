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
