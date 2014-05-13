<?php
/**
 * @param primary_resources
 * @param non_global
 */
?>

<table id="tracker">
    <?php foreach ($primary_resources as $resource): ?>
        <td class="tracker res-info-source" res="<?= $resource->id ?>">
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
        </td>
    <?php endforeach ?>

    <td class="tracker actions">
        <div class="header">
            <p class="title">Organ-Specific Actions</p>
        </div>

        <?php foreach ($non_global as $organ): ?>
            <div class="organ" organ="<?= $organ->id ?>">
                <?php if ($organ->hasAction()): ?>
                    <p class="amount"><?= $organ->getActionCount() ?></p>
                    <p class="name"><?= $organ->action_name ?></p>
                <?php endif ?>
            </div>
        <?php endforeach ?>
    </td>
</table>