<?php
$organs = Organ::model()->findAll();
?>

<div class="sidebar-title header-text">
    <p>Molecular Resources</p>
</div>

<?php foreach($organs as $organ):
    $this->renderPartial('organ-header', array('organ' => $organ, 'right' => false)); ?>

    <div class="accordian-content resource-holder scrollbar-content" value="<?= $organ->id ?>" color="<?= $organ->color ?>">
        <?php
        $resources = $organ->resources;
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
