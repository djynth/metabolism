<?php
/**
 * @param user
 * @param organs
 */
?>

<div id="header">
    <div class="header-element left sidebar-title">
        <div class="title">
            <p>Metabolic Pathways</p>
        </div>
    </div>

    <?php $this->renderPartial('state', array(
        'organs'=> $organs
    )); ?>

    <div id="undo" class="header-element left">
        <div class="title">
            <p>Undo</p>
        </div>
    </div>

    <div class="header-element right sidebar-title">
        <div class="title">
            <p>Molecular Resources</p>
        </div>
    </div>

    <div id="open-menu" class="header-element right">
        <div class="title">
            <p>Menu</p>
        </div>
        <div class="cover"></div>
    </div>

    <?php $this->renderPartial('log'); ?>
</div>
