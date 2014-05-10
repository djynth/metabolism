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

<div class="pathway" pathway="<?= $pathway->id ?>">
    <div class="inner"></div>
    <p class="name"><?= $pathway->name ?></p>

    <?php if ($pathway->catabolic): ?>
        <p class="catabolic">Catabolic</p>
    <?php endif ?>
    <?php if ($pathway->anabolic): ?>
        <p class="anabolic">Anabolic</p>
    <?php endif ?>
    <?php if ($pathway->passive): ?>
        <p class="passive">Automatic</p>
    <?php endif ?>

    <p class="points"><?= $pathway->points ?></p>

    <?php if ($eat): ?>
        <div class="food" eat-max="<?= Pathway::EAT_MAX ?>">
            <?php foreach ($pathway->resources as $resource): ?>
                <div class="btn-group" res="<?= $resource->resource->id ?>" amount="<?= $resource->value ?>">
                    <button class="btn btn-mini bottom">
                        <i class="icon-chevron-down"></i>
                    </button>
                    <button class="btn btn-mini minus">
                        <i class="icon-minus"></i>
                    </button>
                    <button class="btn btn-mini eat"></button>
                    <button class="btn btn-mini plus">
                        <i class="icon-plus"></i>
                    </button>
                    <button class="btn btn-mini top">
                        <i class="icon-chevron-up"></i>
                    </button>
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
                    <?php if ($reactants[$i]): 
                        $resource = $reactants[$i]->resource; ?>
                        <td class="reactant amount"><?= $reactants[$i]->value ?></td>
                        <td class="reactant name res-info-source" res="<?= $resource->id ?>" organ="<?= $resource->getOrgan($organ)->id ?>">
                            <?= $resource->name ?>
                        </td>
                    <?php else: ?>
                        <td class="empty" colspan="2"></td>
                    <?php endif ?>

                    <?php if ($products[$i]):
                        $resource = $products[$i]->resource; ?>
                        <td class="product name res-info-source" res="<?= $resource->id ?>" organ="<?= $resource->getOrgan($organ)->id ?>">
                            <?= $resource->name ?>
                        </td>
                        <td class="product amount"><?= $products[$i]->value ?></td>
                    <?php else: ?>
                        <td class="empty" colspan="2"></td>
                    <?php endif ?>
                </tr>
            <?php endfor ?>
        </table>
    <?php endif ?>

    <?php if (!$pathway->passive): ?>
        <p class="lacking"></p>
        <div class="btn-group run-holder">
            <?php if (!$pathway->limit): ?>
                <button class="btn btn-mini bottom">
                    <i class="icon-chevron-down"></i>
                </button>
                <button class="btn btn-mini minus">
                    <i class="icon-minus"></i>
                </button>
            <?php endif ?>
            <button class="btn btn-mini <?= $pathway->isEat() ? 'eat-run' : 'pathway-run' ?>" times="1">Run</button>
            <?php if (!$pathway->limit): ?>
                <button class="btn btn-mini plus">
                    <i class="icon-plus"></i>
                </button>
                <button class="btn btn-mini top">
                    <i class="icon-chevron-up"></i>
                </button>
            <?php endif ?>
        </div>

        <?php if ($pathway->reversible): ?>
            <button class="btn btn-mini reverse" type="button" data-toggle="button">
                <i class="icon-random"></i>
            </button>
        <?php endif ?>
    <?php endif ?>
    
</div>
