<?php
/**
 * @param organ
 * @param right
 */
?>

<div class="accordian-header" organ="<?= $organ->id ?>">
    <p class="accordian-title"><?= $organ->name ?></p>
    
    <i class="icon-info-sign"></i>

    <div class="popup <?= $right ? 'right' : 'left' ?>">
        <div class="cover"></div>
        <i class="icon-remove"></i>
        <img class="image" src="" alt="">
        <p class="description"><?= $organ->description ?></p>
    </div>
</div>