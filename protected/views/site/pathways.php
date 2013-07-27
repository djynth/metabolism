<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<div class="sidebar-title header-text">
    <p>Cellular Pathways</p>
    <i id="filter-pathways" class="icon-cog icon-white"></i>
</div>

<div class="header-text">
    <?= $global->name ?>
    <i class="icon-info-sign icon-white organ-info"></i>
</div>

<div class="pathway-holder global" value="<?= $global->id ?>">
    <?php
    $pathways = $global->pathways;
    foreach ($pathways as $pathway) {
        $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $global));
    }
    ?>
</div>

<?php foreach($organs as $organ): ?>
    <div class="accordian-header header-text" value="<?= $organ->id ?>">
        <p class="accordian-title"><?= $organ->name ?></p>
        <i class="icon-info-sign icon-white organ-info"></i>
    </div>

    <div class="accordian-content pathway-holder scrollbar-content" value="<?= $organ->id ?>">
        <?php
        $pathways = $organ->pathways;
        foreach ($pathways as $pathway) {
            $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
