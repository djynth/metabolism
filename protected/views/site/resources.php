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

<div id="resource-visual-header">
    <h3 class="resource-visual-title">Resource</h3>
    <p class="resource-visual-amount"></p>
    <i id="resource-visual-close" class="icon-remove"> </i>
</div>

<div id="resource-visual"></div>
