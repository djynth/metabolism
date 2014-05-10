<?php
/**
 * @param organs
 */
?>

<div class="sidebar-title">
    <p>Metabolic Pathways</p>
</div>

<?php foreach($organs as $organ):
    $this->renderPartial('organ-header', array(
        'organ' => $organ,
        'right' => true,
    )); ?>

    <div class="accordian-content pathways" organ="<?= $organ->id ?>">
        <?php foreach ($organ->pathways as $pathway) {
            $this->renderPartial('pathway', array(
                'pathway' => $pathway,
                'organ' => $organ,
            ));
        } ?>
    </div>
<?php endforeach ?>
