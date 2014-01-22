<div class="header-text accordian-header" value="<?= $organ->id ?>">
    <p class="accordian-title help-tooltip" data-placement="top"
       title="Click here to switch to viewing the pathways and resources contained in this organ.">
        <?= $organ->name ?>
    </p>
    
    <i class="icon-info-sign organ-info"></i>

    <div class="organ-popup <?= $right ? 'right' : 'left' ?>">
        <div class="organ-cover"></div>
        <i class="icon-remove close-popup"> </i>
        <img class="organ-image" src="" alt="<?= $organ->name ?>">
        <p class="organ-description"><?= $organ->description ?></p>
    </div>
</div>