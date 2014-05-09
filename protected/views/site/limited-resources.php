<?php
/**
 * @param organs
 * @param passive_pathways
 */

// TODO: add indication of automatic process' organ
?>

<table id="limited-resources">
    <tr class="organ-header" organ="-1">
        <td colspan="5"><b>Automatic Processes</b></td>
    </tr>

    <?php
    foreach ($passive_pathways as $pathway) {
        foreach ($pathway->organs as $organ) { ?>
            <tr organ="-1">
                <td colspan="4" pathway="<?= $pathway->id ?>" times="<?= $pathway->passive ?>" organ="<?= $organ->id ?>">
                    <?= $pathway->name ?> (x<?= $pathway->passive ?>) [<?= $organ->name ?>]
                </td>
                <td class="change"></td>
            </tr>
        <?php
        }
    }
    ?>

    <?php
    foreach ($organs as $organ) { ?>
        <tr class="organ-header" organ="<?= $organ->id ?>">
            <td colspan="5"><b><?= $organ->name ?></b></td>
        </tr>

        <?php
        foreach ($organ->getSoftLimitResources() as $resource) {
            $min = $resource->limit->soft_min;
            $max = $resource->limit->soft_max;
            $rel_min = $resource->limit->rel_soft_min;
            $rel_max = $resource->limit->rel_soft_max; ?>
            <tr organ="<?= $organ->id ?>">
                <td class="res res-info-source" res="<?= $resource->id ?>" organ="<?= $organ->id ?>"><?= $resource->name ?></td>

                <?php if ($min === null && $rel_min === null): ?>
                    <td class="center">-</td>
                <?php elseif ($min === null): ?>
                    <td class="min" rel-min="$rel_min"></td>
                <?php elseif ($rel_min === null): ?>
                    <td class="min" min="$min"></td>
                <?php else: ?>
                    <td class="min" min="$min" rel-min="rel_min"></td>
                <?php endif ?>

                <td class="amount"></td>

                <?php if ($max === null && $rel_max === null): ?>
                    <td class="center">-</td>
                <?php elseif ($max === null): ?>
                    <td class="max" rel-max="$rel_max"></td>
                <?php elseif ($rel_max === null): ?>
                    <td class="max" max="$max"></td>
                <?php else: ?>
                    <td class="max" max="$max" rel-max="rel_max"></td>
                <?php endif ?>

                <td class="change"></td>
            </tr>
        <?php
        }
    }
    ?>

    <tr>
        <td colspan="5">&nbsp;</td>
    </tr>
    <tr>
        <td colspan="4"><b>Total</b></td>
        <td class="total"></td>
    </tr>
</table>