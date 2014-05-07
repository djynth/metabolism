<?php
/**
 * @param resource
 * @param organ
 */
?>

<div class="resource-data resource-info-source resource-bar <?= $resource->primary ? 'primary' : '' ?>" res-id="<?= $resource->id ?>" max-shown="<?= $resource->max_shown_value ?>" init="no" name="<?= $resource->name ?>" aliases="<?= $resource->getNames() ?>">
    <div class="progress">
        <span class="resource-name"><?= $resource->name ?></span>
        <span class="resource-value"><?= $resource->getAmount($organ->id) ?></span>
        <div class="bar"></div>

        <div class="res-limit soft min" <?= $resource->limit->soft_min === null ? '' : 'value="' . $resource->limit->soft_min . '"' ?> <?= $resource->limit->rel_soft_min === null ? '' : 'rel-value="' . $resource->limit->rel_soft_min . '"' ?>></div>
        <div class="res-limit hard min" <?= $resource->limit->hard_min === null ? '' : 'value="' . $resource->limit->hard_min . '"' ?> <?= $resource->limit->rel_hard_min === null ? '' : 'rel-value="' . $resource->limit->rel_hard_min . '"' ?>></div>
        <div class="res-limit soft max" <?= $resource->limit->soft_max === null ? '' : 'value="' . $resource->limit->soft_max . '"' ?> <?= $resource->limit->rel_soft_max === null ? '' : 'rel-value="' . $resource->limit->rel_soft_max . '"' ?>></div>
        <div class="res-limit hard max" <?= $resource->limit->hard_max === null ? '' : 'value="' . $resource->limit->hard_max . '"' ?> <?= $resource->limit->rel_hard_max === null ? '' : 'rel-value="' . $resource->limit->rel_hard_max . '"' ?>></div>
    </div>
</div>
