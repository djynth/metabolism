<?php
/**
 * @param resource
 * @param organ
 */
?>

<div class="res res-info-source <?= $resource->primary ? 'primary' : '' ?>" res="<?= $resource->id ?>" organ="<?= $organ->id ?>" max-shown="<?= $resource->max_shown_value ?>" name="<?= $resource->name ?>" names="<?= implode($resource->getNames(), ';') ?>">
    <div class="bar"></div>
    <span class="name"><?= $resource->name ?></span>
    <span class="amount"></span>

    <div class="limit soft min"></div>
    <div class="limit hard min"></div>
    <div class="limit soft max"></div>
    <div class="limit hard max"></div>
</div>
