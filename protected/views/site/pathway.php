<?php
/**
 * @param pathway
 * @param organ
 */

$eat = $pathway->isEat();
if (!$eat) {
    $reactants = $pathway->getReactants();
    $products = $pathway->getProducts();

    // balance the reactants and products by filling blanks with the empty string (NULL will not splice into array correctly)
    for ($i = 0; $i < max(count($reactants), count($products)); $i++) {
        if ($i >= count($reactants)) {
            array_push($reactants, '');
        } else if ($i >= count($products)) {
            array_push($products, '');
        } elseif ($products[$i]->resource->group < $reactants[$i]->resource->group) {
            array_splice($reactants, $i, 0, '');
        } elseif ($products[$i]->resource->group > $reactants[$i]->resource->group) {
            array_splice($products, $i, 0, '');
        }
    }
}

?>

<div class="pathway" value="<?= $pathway->id ?>" <?= $pathway->limit ? ' limit="limit"' : '' ?> <?= $pathway->catabolic ? 'catabolic' : '' ?> <?= $pathway->anabolic ? 'anabolic' : '' ?>>
    <div class="pathway-inner"></div>
    <p class="title"><?= $pathway->name ?></p>

    <?php if ($pathway->catabolic): ?>
    <p class="catabolic">Catabolic</p>
    <?php endif ?>

    <?php if ($pathway->anabolic): ?>
    <p class="anabolic">Anabolic</p>
    <?php endif ?>

    <?php if ($pathway->passive): ?>
    <p class="passive">Automatic</p>
    <?php endif ?>

    <p class="points help-tooltip" data-placement="right" data-container="body" title="The number of points earned each time you run this reaction."><?= $pathway->points ?></p>

    <?php if ($eat): ?>
    <div class="food-holder" eat-max="<?= Pathway::EAT_MAX ?>">
        <?php foreach ($pathway->resources as $resource): ?>
        <div class="btn-group help-tooltip" data-placement="bottom" data-container="body" title="Adjust the amount of <?= $resource->resource->name ?> that you will eat this turn.">
            <button class="btn btn-mini btn-inverse eat-bottom"><i class="icon-chevron-down"></i> </button>;
            <button class="btn btn-mini btn-inverse eat-minus"><i class="icon-minus"></i> </button>;
            <button class="btn btn-mini btn-inverse eat" res-id="<?= $resource->resource->id ?>" value="<?= $resource->value ?>"> </button>;
            <button class="btn btn-mini btn-inverse eat-plus disabled"><i class="icon-plus"></i> </button>;
            <button class="btn btn-mini btn-inverse eat-top disabled"><i class="icon-chevron-up"></i> </button>;
        </div>
        <?php endforeach ?>
    </div>
    <?php else: ?>
    <table class="reaction">
        <tr class="header">
            <td colspan="4">
                <p class="header-reactants">Reactants</p>
                <i class="icon-arrow-right always-black"></i>
                <p class="header-products">Products</p>
            </td>
        </tr>

        <?php for ($i = 0; $i < count($products); $i++): ?>
        <tr>
            <?php if ($reactants[$i] !== ''): ?>
            <td class="reactant value"><?= $reactants[$i]->value ?></td>
            <td class="reactant resource-info-source name <?= $reactants[$i]->resource->isGlobal() ? 'global' : '' ?>" res-id="<?= $reactants[$i]->resource->id ?>" organ-id="<?= $reactants[$i]->resource->isGlobal() ? Organ::GLOBAL_ID : $organ->id ?>"><?= $reactants[$i]->resource->name ?></td>
            <?php else: ?>
            <td class="empty" colspan="2"></td>
            <?php endif ?>

            <?php if ($products[$i] !== ''): ?>
            <td class="product name <?= $products[$i]->resource->isGlobal() ? 'global' : '' ?>" res-id="<?= $products[$i]->resource->id ?>" organ-id="<?= $products[$i]->resource->isGlobal() ? Organ::GLOBAL_ID : $organ->id ?>"><?= $products[$i]->resource->name ?></td>
            <td class="product resource-info-source value"><?= $products[$i]->value ?></td>
            <?php else: ?>
            <td class="empty" colspan="2"></td>
            <?php endif ?>
        </tr>
        <?php endfor ?>
    </table>
    <?php endif ?>

    <?php if ($pathway->passive): ?>

    <?php else: ?>
    <p class="lacking"></p>
    <?php if ($pathway->limit): ?>
    <div class="btn-group run-holder">
        <button class="btn btn-mini btn-inverse <?= $pathway->isEat() ? 'eat-run' : 'pathway-run' ?>" value="1">Run</button>
    </div>
    <?php else: ?>
    <div class="btn-group run-holder help-tooltip" data-placement="top" data-container="body" title="Adjust the number of times to run this pathway. No matter how many times you run it, it counts as one turn. Click the center button to run it once you're ready.">
        <button class="btn btn-mini pathway-bottom"><i class="icon-chevron-down"></i></button>
        <button class="btn btn-mini pathway-minus"><i class="icon-minus"></i></button>
        <button class="btn btn-mini pathway-run"></button>
        <button class="btn btn-mini pathway-plus"><i class="icon-plus"></i></button>
        <button class="btn btn-mini pathway-top"><i class="icon-chevron-up"></i></button>
    </div>
    <?php endif ?>

    <?php if ($pathway->reversible): ?>
    <button type="button" class="btn btn-mini pathway-reverse" data-toggle="button"> <i class="icon-random"></i></button>
    <?php endif ?>
    <?php endif ?>
    
</div>
