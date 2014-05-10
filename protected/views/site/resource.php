<?php
/**
 * @param resource
 * @param organ
 */
?>

<div class="res res-info-source <?= $resource->primary ? 'primary' : '' ?>" res="<?= $resource->id ?>" organ="<?= $organ->id ?>" max-shown="<?= $resource->max_shown_value ?>" name="<?= $resource->name ?>" names="<?= $resource->getNames() ?>">
    <div class="progress">
        <div class="bar"></div>
        <span class="name"><?= $resource->name ?></span>
        <span class="amount"><?= $resource->getAmount($organ->id) ?></span>

        <div class="limit soft min" <?= $resource->limit->soft_min === null ? '' : 'min="' . $resource->limit->soft_min . '"' ?> <?= $resource->limit->rel_soft_min === null ? '' : 'rel-min="' . $resource->limit->rel_soft_min . '"' ?>></div>
        <div class="limit hard min" <?= $resource->limit->hard_min === null ? '' : 'min="' . $resource->limit->hard_min . '"' ?> <?= $resource->limit->rel_hard_min === null ? '' : 'rel-min="' . $resource->limit->rel_hard_min . '"' ?>></div>
        <div class="limit soft max" <?= $resource->limit->soft_max === null ? '' : 'max="' . $resource->limit->soft_max . '"' ?> <?= $resource->limit->rel_soft_max === null ? '' : 'rel-max="' . $resource->limit->rel_soft_max . '"' ?>></div>
        <div class="limit hard max" <?= $resource->limit->hard_max === null ? '' : 'max="' . $resource->limit->hard_max . '"' ?> <?= $resource->limit->rel_hard_max === null ? '' : 'rel-max="' . $resource->limit->rel_hard_max . '"' ?>></div>
    </div>
</div>
