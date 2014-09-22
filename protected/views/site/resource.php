<?php
/**
 * @param resource
 * @param organ
 */
?>

<div class="res res-info-source compact <?= $resource->primary ? 'primary' : '' ?>" res="<?= $resource->id ?>" organ="<?= $organ->id ?>">
    <div class="amount-holder">
        <div class="amount rotate"></div>
    </div>
    
    <div class="level-holder">
        <div class="level-bar" recommended="<?= $resource->recommended_amount ?>">
            <div class="bad"></div>
            <div class="med"></div>
            <div class="good"></div>
        </div>

        <div class="limit-holder hard max">
            <div class="limit hard max"></div>
        </div>
        <div class="limit-holder soft max">
            <div class="limit soft max"></div>
        </div>
        <div class="limit-holder soft min">
            <div class="limit soft min"></div>
        </div>
        <div class="limit-holder hard min">
            <div class="limit hard min"></div>
        </div>

        <div class="name rotate" names="<?= implode($resource->getNames(), ';') ?>"><?= $resource->name ?></div>
    </div>

    <div class="points-holder">
        <div class="points rotate"></div>
    </div>
</div>
