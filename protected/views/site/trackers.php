<?php
/**
 * @param primary_resources
 * @param non_global
 */
?>

<div id="notification-bottom" class="notification-holder"></div>

<table id="trackers">
    <?php foreach ($primary_resources as $resource): ?>
    <td class="tracker" res-id="<?= $resource->id ?>">
        <div class="header">
            <p class="title"><?= $resource->name ?></p>
            <p class="total"><?= $resource->getTotal() ?></p>
        </div>

        <?php foreach ($non_global as $organ): ?>
        <div class="organ" organ-id="<?= $organ->id ?>">
            <p class="amount"><?= $resource->getAmount($organ->id) ?></p>
            <p class="organ-name"><?= $organ->name ?></p>
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
        <div class="organ" organ-id="<?= $organ->id ?>">
            <p class="amount"><?= $organ->getActionCount() ?></p>
            <p class="organ-name"><?= $organ->action_name ?></p>
        </div>
        <?php endforeach ?>
    </td>
</table>
