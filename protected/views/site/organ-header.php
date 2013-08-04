<div class="header-text <?= $organ->isGlobal() ? '' : 'accordian-header' ?>" value="<?= $organ->id ?>">
    <p class="<?= $organ->isGlobal() ? '' : 'accordian-title' ?>"><?= $organ->name ?></p>
    <i class="icon-info-sign icon-white organ-info"></i>

    <div class="organ-popup <?= $right ? 'right' : 'left' ?>">
        <div class="organ-cover"></div>
        <img class="organ-image" src="<?= Yii::app()->request->baseUrl . 'img/organs/' . $organ->id ?>" alt="<?= $organ->name ?>">
        <p class="organ-description"><?= $organ->description ?></p>
    </div>
</div>