<?php
/**
 * @param organs
 */
?>

<div id="state" class="header-element left">
    <div class="title">
        <p id="points"></p>
        <p id="turns"></p>
        <i class="fa fa-dashboard"></i>
    </div>

    <div class="dropdown">
        <table id="limited-resources">
            <tr class="organ-header" organ="-1">
                <td colspan="5"><b>Automatic Processes</b></td>
            </tr>

            <?php
            foreach (Pathway::getPassivePathways() as $pathway) {
                foreach ($pathway->organs as $organ) { ?>
                    <tr organ="-1">
                        <td class="process" colspan="4" pathway="<?= $pathway->id ?>" times="<?= $pathway->passive ?>" organ="<?= $organ->id ?>">
                            <?= $pathway->name ?> (x<?= $pathway->passive ?>) [<?= $organ->name ?>]
                        </td>
                        <td class="change"></td>
                    </tr>
                <?php
                }
            }
            ?>

            <?php foreach ($organs as $organ): ?>
                <tr class="organ-header" organ="<?= $organ->id ?>">
                    <td colspan="5"><b><?= $organ->name ?></b></td>
                </tr>

                <?php foreach ($organ->resources as $resource): ?>
                    <tr class="limited-resource res-info-source" res="<?= $resource->id ?>" organ="<?= $organ->id ?>">
                        <td><?= $resource->name ?></td>
                        <td class="min"></td>
                        <td class="amount"></td>
                        <td class="max"></td>
                        <td class="change"></td>
                    </tr>
                <?php endforeach ?>
            <?php endforeach ?>

            <tr>
                <td colspan="5">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="4"><b>Total</b></td>
                <td class="total"></td>
            </tr>
        </table>
    </div>
</div>
