<?php
/**
 * @param user
 * @param organs
 * @param passive_pathways
 */
?>

<div id="header">
    <?php $this->renderPartial('state', array(
        'organs'           => $organs,
        'passive_pathways' => $passive_pathways
    )); ?>

    <div id="undo" class="header-element">
        <div class="title">
            <p>Undo</p>
        </div>
    </div>

    <?php $this->renderPartial('settings'); ?>

    <?php $this->renderPartial('account', array(
        'user' => $user,
    )); ?>
</div>
