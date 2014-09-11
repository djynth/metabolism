<?php
/**
 * @param organ
 * @param right
 * @param resLevels
 */
?>

<div class="accordian-header" organ="<?= $organ->id ?>" organ-color="#<?= $organ->color ?>">
    <p class="name" name="<?= $organ->name ?>"><?= $organ->name ?></p>
    
    <i class="fa fa-info-circle toggle-popup"></i>

    <?php if ($resLevels): ?>
        <div class="res-levels">
            <?php foreach ($organ->resources as $resource): ?>
                <div class="res-level" res="<?= $resource->id ?>" organ="<?= $organ->id ?>" intensity="<?= $resource->max_shown_value/4 ?>">
                    <div class="bar">
                        <div class="bad"></div>
                        <div class="med"></div>
                        <div class="good"></div>
                    </div>
                </div>
            <?php endforeach ?>
        </div>
    <?php endif ?>

    <div class="popup <?= $right ? 'right' : 'left' ?>">
        <div class="cover"></div>
        <i class="fa fa-times toggle-popup"></i>
        <div class="content">
            <img class="image" src="" alt="">
            <p class="description"><?= $organ->description ?></p>
        </div>
    </div>
</div>