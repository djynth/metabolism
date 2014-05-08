<?php
/**
 * @param resource
 */

$aliases = null;
if ($resource->aliases) {
    $aliases = "Aliases: ";
    foreach ($resource->aliases as $alias) {
        $aliases .= $alias->alias . ", ";
    }
}
?>

<div class="resource-visual-content" value="<?= $resource->id ?>">
    <p class="resource-visual-text">Name: <?= $resource->name ?></p>
    <?php if ($aliases) { ?>
        <p class="resource-visual-text"><?= substr($aliases, 0, -2) ?></p>
    <?php } ?>
    <img class="resource-visual-image" alt="" src="<?= Yii::app()->request->baseUrl . 'img/molecules/' . strtolower($resource->name) . '.png' ?>">
    <p class="resource-visual-text">Formula: <?= $resource->getFormattedFormula() ?></p>
    <?= $resource->limit->toText() ?>
    <p class="resource-visual-text"><?= $resource->description ?></p>
</div>