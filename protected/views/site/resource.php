<?php
/**
 * @param resource
 * @param organ
 */
?>

<div class="res res-info-source <?= $resource->primary ? 'primary' : '' ?>" res="<?= $resource->id ?>" organ="<?= $organ->id ?>">
    <div class="amount-holder">
        <div class="amount rotate"></div>
    </div>
    
    <div class="level-holder">
        <div class="level" recommended="<?= $resource->recommended_amount ?>">
            <div class="bad"></div>
            <div class="med"></div>
            <div class="good"></div>
        </div>

        <div class="limit hard max"></div>
        <div class="limit soft max"></div>
        <div class="limit soft min"></div>
        <div class="limit hard min"></div>

        <div class="name rotate" names="<?= implode($resource->getNames(), ';') ?>"><?= $resource->name ?></div>
    </div>

    <div class="points-holder">
        <div class="points rotate"></div>
    </div>
</div>
