<div class="resource-data resource-bar" value="<?= $resource->id ?>" max-shown="<?= $resource->max_shown_value ?>" init="no">
    <div class="progress">
        <span class="resource-name"><?= $resource->name ?></span>
        <span class="resource-value"><?= $resource->getAmount($organ) ?></span>
        <div class="bar"></div>
    </div>
</div>
