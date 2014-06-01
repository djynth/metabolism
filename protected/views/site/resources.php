<?php
/**
 * @param organs
 */
?>

<?php foreach($organs as $organ):
    $this->renderPartial('organ-header', array(
        'organ' => $organ,
        'right' => false,
    )); ?>

    <div class="accordian-content resources" organ="<?= $organ->id ?>">
        <?php foreach ($organ->resources as $resource) {
            $this->renderPartial('resource', array(
                'resource' => $resource,
                'organ' => $organ
            ));
        } ?>
    </div>
<?php endforeach ?>
