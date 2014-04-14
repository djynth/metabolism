<?php
/**
 * @param resource
 */
?>

<div class="resource-visual-content" value="<?= $resource->id ?>">
    <img class="resource-visual-image" alt="" src="<?= Yii::app()->request->baseUrl . 'img/molecules/' . strtolower($resource->abbr) . '.png' ?>">
    <p class="resource-visual-formula">Formula: <?= $resource->getFormattedFormula() ?></p>
    <?= $resource->limit->toText() ?>
    <p class="resource-visual-description"><?= $resource->description ?></p>
</div>