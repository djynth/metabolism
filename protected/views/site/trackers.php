<table id="tracker-holder">
    <?php
    $primaries = Resource::model()->findAllByAttributes(array('primary' => true));
    $organs = Organ::getNotGlobal();
    foreach ($primaries as $primary): ?>
        <td class="tracker" value="<?= $primary->id ?>" name="<?= $primary->name ?>">
            <div class="tracker-header">
                <h3 class="tracker-title"><?= $primary->name ?></h3>
                <h3 class="tracker-amount" value="0">0</h3>
            </div>

            <?php foreach ($organs as $organ): ?>
                <div class="tracker-organ" value="<?= $organ->id ?>">
                    <p class="organ-amount" value="0">0</p>
                    <p class="organ-name"><?= $organ->name ?></p>
                    <div class="tracker-icon-holder"></div>
                </div>
            <?php endforeach ?>
        </td>
    <?php endforeach ?>
</table>
