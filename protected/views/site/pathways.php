<?php
/**
 * @param organs
 */
?>

<?php foreach($organs as $organ): ?>
    <div class="pathways-header" organ="<?= $organ->id ?>">
        <p class="name" name="<?= $organ->name ?>"><?= $organ->name ?></p>
        
        <?php
        $this->renderPartial('organ-popup', array(
            'organ' => $organ,
            'right' => true,
        ));
        ?>
    </div>

    <div class="pathways" organ="<?= $organ->id ?>">
        <?php foreach ($organ->pathways as $pathway) {
            $this->renderPartial('pathway', array(
                'pathway' => $pathway,
                'organ' => $organ,
            ));
        } ?>
    </div>
<?php endforeach ?>
