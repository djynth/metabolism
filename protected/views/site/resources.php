<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<h3 class="organ-title global-title" value="<?= $global->id ?>">Available Everywhere</h3>

<div class="resource-holder global" value="<?= $global->id ?>">
    <?php
    $resources = $global->getResources();
    foreach ($resources as $resource) {
        $this->renderPartial('resource', array('resource' => $resource, 'organ' => $global));
    }
    ?>
</div>

<div class="tab-holder">
    <?php foreach ($organs as $organ): ?>
        <div class="organ-title" value="<?= $organ->id ?>"><?= $organ->name ?><div class="cover"></div></div>
    <?php endforeach ?>
</div>

<?php foreach($organs as $organ): ?>
    <div class="resource-holder scrollbar-content" value="<?= $organ->id ?>">
        <?php
        $resources = $organ->getResources();
        foreach ($resources as $resource) {
            $this->renderPartial('resource', array('resource' => $resource, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
