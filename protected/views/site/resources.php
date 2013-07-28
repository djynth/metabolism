<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<div class="sidebar-title header-text">
    <p>Molecular Resources</p>
</div>

<div class="header-text">
    <p><?= $global->name ?></p>
    <i class="icon-info-sign icon-white organ-info"></i>
</div>

<div class="resource-holder global" value="<?= $global->id ?>">
    <?php
    $resources = $global->getResources();
    foreach ($resources as $resource) {
        $this->renderPartial('resource', array('resource' => $resource, 'organ' => $global));
    }
    ?>
</div>

<?php foreach($organs as $organ): ?>
    <div class="accordian-header header-text" value="<?= $organ->id ?>">
        <p class="accordian-title"><?= $organ->name ?></p>
        <i class="icon-info-sign icon-white organ-info"></i>
    </div>

    <div class="accordian-content resource-holder scrollbar-content" value="<?= $organ->id ?>">
        <?php
        $resources = $organ->getResources();
        foreach ($resources as $resource) {
            $this->renderPartial('resource', array('resource' => $resource, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
