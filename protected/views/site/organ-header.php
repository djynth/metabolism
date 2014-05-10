<?php
/**
 * @param organ
 * @param right
 */
?>

<div class="accordian-header" organ="<?= $organ->id ?>" organ-color="<?= $organ->color ?>">
    <?= $organ->name ?>
    
    <i class="icon-info-sign toggle-popup"></i>

    <div class="popup <?= $right ? 'right' : 'left' ?>">
        <div class="cover"></div>
        <i class="icon-remove toggle-popup"></i>
        <div class="content">
            <img class="image" src="" alt="">
            <p class="description"><?= $organ->description ?></p>
        </div>
    </div>
</div>