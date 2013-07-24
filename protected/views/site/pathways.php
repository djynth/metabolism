<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<h3 class="organ-title global-title">Cellular Pathways</h3>

<div class="pathway-holder global" value="<?= $global->id ?>">
    <?php
    $pathways = $global->pathways;
    foreach ($pathways as $pathway) {
        $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $global));
    }
    ?>
</div>

<?php foreach($organs as $organ): ?>
    <div class="accordian-header" value="<?= $organ->id ?>"><?= $organ->name ?></div>
    <div class="accordian-content pathway-holder scrollbar-content" value="<?= $organ->id ?>">
        <?php
        $pathways = $organ->pathways;
        foreach ($pathways as $pathway) {
            $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
