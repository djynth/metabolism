<?php
/**
 * @param organs
 */
?>

<?php foreach($organs as $organ): ?>
    <div class="resources-header" organ="<?= $organ->id ?>">
        <p class="name" name="<?= $organ->name ?>"><?= $organ->name ?></p>
        
        <?php
        $this->renderPartial('organ-popup', array(
            'organ' => $organ,
            'right' => false,
        ));
        ?>
    </div>

    <div class="resources" organ="<?= $organ->id ?>">
        <?php foreach ($organ->resources as $resource) {
            $this->renderPartial('resource', array(
                'resource' => $resource,
                'organ' => $organ
            ));
        } ?>
    </div>
<?php endforeach ?>
