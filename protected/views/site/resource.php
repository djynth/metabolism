<?php
/**
 * @param resource
 * @param organ
 */
$amount = $resource->getAmount($organ);
?>

<div class="res res-info-source <?= $resource->primary ? 'primary' : '' ?>" res="<?= $resource->id ?>" organ="<?= $organ->id ?>" max-shown="<?= $resource->max_shown_value ?>" name="<?= $resource->name ?>" names="<?= implode($resource->getNames(), ';') ?>">
    <div class="bar"></div>
    <span class="name"><?= $resource->name ?></span>
    <span class="amount"></span>

    <div class="limit soft min" <?= $resource->soft_min === null ? '' : 'limit="' . $resource->soft_min . '"' ?> <?= $resource->rel_soft_min === null ? '' : 'rel-limit="' . $resource->rel_soft_min . '"' ?>></div>
    <div class="limit hard min" <?= $resource->hard_min === null ? '' : 'limit="' . $resource->hard_min . '"' ?> <?= $resource->rel_hard_min === null ? '' : 'rel-limit="' . $resource->rel_hard_min . '"' ?>></div>
    <div class="limit soft max" <?= $resource->soft_max === null ? '' : 'limit="' . $resource->soft_max . '"' ?> <?= $resource->rel_soft_max === null ? '' : 'rel-limit="' . $resource->rel_soft_max . '"' ?>></div>
    <div class="limit hard max" <?= $resource->hard_max === null ? '' : 'limit="' . $resource->hard_max . '"' ?> <?= $resource->rel_hard_max === null ? '' : 'rel-limit="' . $resource->rel_hard_max . '"' ?>></div>
</div>
