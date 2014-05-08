<?php
/**
 * @param organs
 */
?>

<div class="sidebar-title header-text">
    <p>Molecular Resources</p>
</div>

<?php foreach($organs as $organ):
    $this->renderPartial('organ-header', array('organ' => $organ, 'right' => false));
    ?>

    <div class="accordian-content resource-holder scrollbar-content" value="<?= $organ->id ?>" color="<?= $organ->color ?>">
    <?php
    foreach ($organ->resources as $resource) {
        $this->renderPartial('resource', array('resource' => $resource, 'organ' => $organ));
    }
    ?>
</div>
<?php endforeach ?>
