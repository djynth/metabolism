<?php
/**
 * @param primary_resources
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

        <?php foreach ($resource->organs as $organ): ?>
        <div class="organ" organ-id="<?= $organ->id ?>">
            <p class="amount"><?= $resource->getAmount($organ->id) ?></p>
            <p class="organ-name"><?= $organ->name ?></p>
            <div class="icons"></div>
        </div>
        <?php endforeach ?>
    </td>
    <?php endforeach ?>
</table>
