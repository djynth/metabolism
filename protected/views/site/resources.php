<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<div class="sidebar-title header-text">
    <p>Molecular Resources</p>
</div>

<?php
$this->renderPartial('organ-header', array('organ' => $global, 'right' => false));
?>

<div class="resource-holder global" value="<?= $global->id ?>">
    <?php
    $resources = $global->getResources();
    foreach ($resources as $resource) {
        $this->renderPartial('resource', array('resource' => $resource, 'organ' => $global));
    }
    ?>
</div>

<div class="resource-holder global" id="ph-holder">
    <div class="resource-data resource-bar">
        <div class="progress">
            <span class="resource-name">pH</span>
            <span class="resource-value"></span>
            <div class="bar"></div>
        </div>
    </div>
</div>

<?php foreach($organs as $organ):
    $this->renderPartial('organ-header', array('organ' => $organ, 'right' => false)); ?>

    <div class="accordian-content resource-holder scrollbar-content" value="<?= $organ->id ?>">
        <?php
        $resources = $organ->getResources();
        foreach ($resources as $resource) {
            $this->renderPartial('resource', array('resource' => $resource, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
