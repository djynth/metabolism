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

<!-- <div class="pathway <?= $eat ? 'eat' : '' ?>" pathway="<?= $pathway->id ?>" organ="<?= $organ->id ?>">
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
            <?php foreach ($pathway->resource_amounts as $resource): ?>
                <div class="btn-group">
                    <button class="btn mini bottom">
                        <i class="fa fa-chevron-down"></i>
                    </button>
                    <button class="btn mini minus">
                        <i class="fa fa-minus"></i>
                    </button>
                    <button class="btn mini eat" res="<?= $resource->resource->id ?>" amount="<?= $resource->value ?>"></button>
                    <button class="btn mini plus">
                        <i class="fa fa-plus"></i>
                    </button>
                    <button class="btn mini top">
                        <i class="fa fa-chevron-up"></i>
                    </button>
                </div>
            <?php endforeach ?>
        </div>
    <?php else: ?>
        <table class="reaction">
            <tr class="header">
                <td colspan="4">
                    <p class="header-reactants">Reactants</p>
                    <i class="fa fa-long-arrow-right always-black"></i>
                    <p class="header-products">Products</p>
                </td>
            </tr>

            <?php for ($i = 0; $i < count($products); $i++): ?>
                <tr>
                    <?php if ($reactants[$i]): 
                        $resource = $reactants[$i]->resource; ?>
                        <td class="reactant amount"><?= $reactants[$i]->value ?></td>
                        <td class="reactant name res-info-source" res="<?= $resource->id ?>" organ="<?= $resource->getProperOrgan($organ)->id ?>">
                            <?= $resource->name ?>
                        </td>
                    <?php else: ?>
                        <td class="empty" colspan="2"></td>
                    <?php endif ?>

                    <?php if ($products[$i]):
                        $resource = $products[$i]->resource; ?>
                        <td class="product name res-info-source" res="<?= $resource->id ?>" organ="<?= $resource->getProperOrgan($organ)->id ?>">
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
            <button class="btn mini bottom disabled">
                <i class="fa fa-chevron-down"></i>
            </button>
            <button class="btn mini minus disabled">
                <i class="fa fa-minus"></i>
            </button>
            <button class="btn mini run" times="1">Run</button>
            <button class="btn mini plus disabled">
                <i class="fa fa-plus"></i>
            </button>
            <button class="btn mini top disabled">
                <i class="fa fa-chevron-up"></i>
            </button>
        </div>

        <?php if ($pathway->reversible): ?>
            <button class="btn mini reverse toggle">
                <i class="fa fa-random"></i>
            </button>
        <?php endif ?>
    <?php endif ?>
    
</div> -->


<div class="pathway" pathway="<?= $pathway->id ?>" organ="<?= $organ->id ?>">
    <div class="title">
        <p class="name"><?= $pathway->name ?></p>

        <div class="btn-group info">
            <?php if ($pathway->passive): ?>
                <div class="automatic btn mini inactive"><i class="fa fa-cogs"></i></div>
            <?php endif ?>

            <?php if ($pathway->catabolic): ?>
                <div class="catabolic btn mini inactive">
                    <i class="fa fa-bolt"></i>
                </div>
            <?php endif ?>

            <?php if ($pathway->anabolic): ?>
                <div class="anabolic btn mini inactive">
                    <i class="fa fa-leaf"></i>
                </div>
            <?php endif ?>

            <div class="points btn mini inactive"><?= $pathway->points ?></p></div>
        </div>
    </div>
    
    <?php if ($eat): ?>
        <div class="food" eat-max="<?= Pathway::EAT_MAX ?>">
            <?php foreach ($pathway->resource_amounts as $resource): ?>
                <div class="btn-group">
                    <div class="btn mini min"><i class="fa fa-chevron-down"></i></div>
                    <div class="btn mini dec"><i class="fa fa-minus"></i></div>
                    <div class="btn mini disabled eat" res="<?= $resource->resource->id ?>" amount="<?= $resource->value ?>"></div>
                    <div class="btn mini inc"><i class="fa fa-plus"></i></div>
                    <div class="btn mini max"><i class="fa fa-chevron-up"></i></div>
                </div>
            <?php endforeach ?>
        </div>
    <?php else: ?>
        <table class="reaction">
            <?php for ($i = 0; $i < count($products); $i++): ?>
                <tr>
                    <?php if ($reactants[$i]): 
                        $resource = $reactants[$i]->resource; ?>
                        <td class="reactant amount"><?= $reactants[$i]->value ?></td>
                        <td class="reactant name res-info-source" res="<?= $resource->id ?>" organ="<?= $resource->getProperOrgan($organ)->id ?>">
                            <?= $resource->name ?>
                        </td>
                    <?php else: ?>
                        <td class="empty" colspan="2"></td>
                    <?php endif ?>

                    <?php if ($products[$i]):
                        $resource = $products[$i]->resource; ?>
                        <td class="product name res-info-source" res="<?= $resource->id ?>" organ="<?= $resource->getProperOrgan($organ)->id ?>">
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

    <div class="focus">
        <div class="btn-group run-holder">
            <div class="btn mini min"><i class="fa fa-chevron-down"></i></div>
            <div class="btn mini dec"><i class="fa fa-minus"></i></div>
            <div class="btn mini run">Run</div>
            <div class="btn mini times">
                <input type="text">
            </div>
            <?php if ($pathway->reversible): ?>
                <div class="btn mini toggle rev"><i class="fa fa-random"></i></div>
            <?php else: ?>
                <div class="btn mini toggle rev disabled"><i class="fa fa-random"></i></div>
            <?php endif ?>
            <div class="btn mini inc"><i class="fa fa-plus"></i></div>
            <div class="btn mini max"><i class="fa fa-chevron-up"></i></div>
        </div>
    </div>

</div>
