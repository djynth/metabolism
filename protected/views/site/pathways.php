<?php
/**
 * @param organs
 */
?>

<div class="sidebar-title header-text">
    <p>Metabolic Pathways</p>
</div>

<?php foreach($organs as $organ):
    $this->renderPartial('organ-header', array('organ' => $organ, 'right' => true));
    ?>

    <div class="accordian-content pathway-holder scrollbar-content" value="<?= $organ->id ?>" color="<?= $organ->color ?>">
        <?php
        $pathways = $organ->pathways;
        foreach ($pathways as $pathway) {
            $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
