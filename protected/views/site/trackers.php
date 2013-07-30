<div id="tracker-holder">
    <?php
    $primaries = Resource::model()->findAllByAttributes(array('primary' => true));
    $organs = Organ::getNotGlobal();
    foreach ($primaries as $primary): ?>
        <div class="tracker" value="<?= $primary->id ?>" name="<?= $primary->name ?>">
            <h3 class="tracker-header"><?= $primary->name ?></h3>
            <h3 class="tracker-amount" value="0">0</h3>

            <?php foreach ($organs as $organ): ?>
                <div class="tracker-organ" value="<?= $organ->id ?>">
                    <p class="organ-amount" value="0">0</p>
                    <p class="organ-name"><?= $organ->name ?></p>
                </div>
            <?php endforeach ?>
        </div>
    <?php endforeach ?>
</div>
