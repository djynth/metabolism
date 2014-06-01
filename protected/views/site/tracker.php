<?php
/**
 * @param primary_resources
 * @param non_global
 */
?>

<div id="tracker">
    <?php foreach ($primary_resources as $resource): ?>
        <div class="tracker res-info-source" res="<?= $resource->id ?>">
            <div class="header">
                <p class="title"><?= $resource->name ?></p>
                <p class="total"></p>
            </div>

            <?php foreach ($non_global as $organ): ?>
                <div class="organ" organ="<?= $organ->id ?>">
                    <p class="amount"></p>
                    <p class="name"><?= $organ->name ?></p>
                    <div class="icons"></div>
                </div>
            <?php endforeach ?>
        </div>
    <?php endforeach ?>

    <div class="tracker actions">
        <div class="header">
            <p class="title">Organ-Specific Actions</p>
        </div>

        <?php foreach ($non_global as $organ): ?>
            <div class="organ" organ="<?= $organ->id ?>">
                <?php if ($organ->action_name !== null): ?>
                    <p class="amount"><?= $organ->getActionCount() ?></p>
                    <p class="name"><?= $organ->action_name ?></p>
                <?php endif ?>
            </div>
        <?php endforeach ?>
    </div>
</div>