<?php
/**
 * @param organ
 * @param right
 */
?>

<i class="fa fa-info-circle toggle-popup"></i>

<div class="organ-popup <?= $right ? 'right' : 'left' ?>" organ="<?= $organ->id ?>">
    <div class="cover"></div>
    <i class="fa fa-times toggle-popup"></i>
    <div class="content">
        <img class="image" src="" alt="">
        <p class="description"><?= $organ->description ?></p>
    </div>
</div>