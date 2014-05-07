<?php
/**
 * @param organs
 */

$passivePathways = Pathway::getPassivePathways();
$total = 0;
?>

<table id="point-dist">
    <tr class="organ-header" organ="-1">
        <td colspan="5"><b>Automatic Processes</b></td>
    </tr>

    <?php
    foreach ($passivePathways as $pathway) {
        foreach ($pathway->organs as $organ) {
            $canRun = false;
            $points = 0;
            if (!$pathway->wouldIncurPenalization($pathway->passive, $organ)) {
                $canRun = true;
                $points = $pathway->points*$pathway->passive;
            }
            $total += $points; ?>
            <tr organ="-1">
                <td colspan="4" class="<?= $canRun ? 'good' : 'bad' ?>"><?= $pathway->name ?> (x<?= $pathway->passive ?>)</td>
                <td class="change"><?= sprintf('%+.2f', $points) ?></td>
            </tr>
        <?php
        }
    }
    ?>

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
            <tr organ="<?= $organ->id ?>">
                <td class="res resource-info-source" res-id="<?= $resource->id ?>" organ-id="<?= $organ->id ?>"><?= $resource->name ?></td>
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