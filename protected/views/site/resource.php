<div class="resource-data resource-bar <?= $resource->primary ? 'primary' : '' ?>" value="<?= $resource->id ?>" max-shown="<?= $resource->max_shown_value ?>"
    init="no" abbr="<?= $resource->abbr ?>" name="<?= $resource->name ?>" full-name="<?= $resource->full_name ?>">
    <div class="progress">
        <span class="resource-name"><?= $resource->name ?></span>
        <span class="resource-value"><?= $resource->getAmount($organ) ?></span>
        <div class="bar"></div>
    </div>
</div>
