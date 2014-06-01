<?php
/**
 * @param user
 * @param organs
 * @param passive_pathways
 */
?>

<div id="header">
    <div class="header-element left sidebar-title">
        <div class="title">
            <p>Molecular Resources</p>
        </div>
    </div>

    <?php $this->renderPartial('state', array(
        'organs'           => $organs,
        'passive_pathways' => $passive_pathways
    )); ?>

    <div id="undo" class="header-element left">
        <div class="title">
            <p>Undo</p>
        </div>
    </div>

    <div class="header-element right sidebar-title">
        <div class="title">
            <p>Metabolic Pathways</p>
        </div>
    </div>

    <?php $this->renderPartial('account', array(
        'user' => $user,
    )); ?>

    <?php $this->renderPartial('settings'); ?>
</div>
