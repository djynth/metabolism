<div class="resource-visual-content" value="<?= $resource->id ?>">
    <img class="resource-visual-image" alt="" src="<?= Yii::app()->request->baseUrl . 'img/molecules/' . $resource->id . '.png' ?>">
    <p class="resource-visual-formula">Formula: <?= $resource->formula ?></p>
    <p class="resource-visual-description"><?= $resource->description ?></p>
</div>