<?php
/**
 * @param organs
 */

$total = 64;
?>

<table id="point-dist">
    <tr class="organ-header" organ="-1">
        <td colspan="5"><b>Passive Processes</b></td>
    </tr>

    <tr organ="-1">
        <td colspan="4">Brain Activity</td>
        <td class="change">+64</td>
    </tr>

    <?php
    foreach ($organs as $organ) {
        $resources = $organ->getSoftLimitResources(); ?>

        <tr class="organ-header" organ="<?= $organ->id ?>">
            <td colspan="5"><b><?= $organ->name ?></b></td>
        </tr>

        <?php
        foreach ($resources as $resource) {
            $min = $resource->limit->getSoftMin($organ->id);
            $max = $resource->limit->getSoftMax($organ->id);
            $amount = $resource->getAmount($organ->id);
            $change = -$resource->limit->getPenalization($amount, $organ);
            $total += $change;
            $good = ($min === null || $amount >= $min) && ($max === null || $amount <= $max); ?>
            <tr organ="<?= $organ->id ?>" <?= $organ->isGlobal() ? '' : 'style="display:none"' ?>>
                <td class="res"><?= $resource->name ?></td>
                <td class="min <?= $min === null ? 'center' : '' ?>"><?= $min === null ? '-' : $min ?></td>
                <td class="amount <?= $good ? 'good' : 'bad' ?>"><?= $amount ?></td>
                <td class="max <?= $max === null ? 'center' : '' ?>"><?= $max === null ? '-' : $max ?></td>
                <td class="change"><?= sprintf('%+.2f', $change) ?></td>
            </tr>
        <?php
        }

        ?>
        </div>
        <?php
    }
    ?>

    <tr>
        <td colspan="5">&nbsp;</td>
    </tr>
    <tr>
        <td colspan="4"><b>Total</b></td>
        <td class="change"><?= sprintf('%+.2f', $total) ?></td>
    </tr>
</table>