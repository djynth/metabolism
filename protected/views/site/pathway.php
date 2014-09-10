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

<div class="pathway <?= $eat ? 'eat' : '' ?>" pathway="<?= $pathway->id ?>" organ="<?= $organ->id ?>">
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

            <?php if ($pathway->reversible): ?>
                <div class="reversible btn mini inactive">
                    <i class="fa fa-random"></i>
                </div>
            <?php endif ?>

            <div class="points btn mini inactive"><?= $pathway->points ?></p></div>
        </div>
    </div>
    
    <?php if ($eat): ?>
        <div class="food" eat-max="<?= Pathway::EAT_MAX ?>">
            <?php foreach ($pathway->resource_amounts as $resource): ?>
                <div class="btn-group">
                    <button class="btn mini min"><i class="fa fa-chevron-down"></i></button>
                    <button class="btn mini dec"><i class="fa fa-minus"></i></button>
                    <input  class="btn inactive eat" type="text" placeholder="<?= $resource->resource->name ?> muliplicity" spellcheck="false" res="<?= $resource->resource->id ?>" amount="<?= $resource->value ?>">
                    <button class="btn mini inc"><i class="fa fa-plus"></i></button>
                    <button class="btn mini max"><i class="fa fa-chevron-up"></i></button>
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
            <button class="btn mini min"><i class="fa fa-chevron-down"></i></button>
            <button class="btn mini dec"><i class="fa fa-minus"></i></button>
            <button class="btn mini run">Run</button>
            <input  class="btn inactive times" type="text" placeholder="run muliplicity" spellcheck="false">
            <button class="btn mini toggle rev" <?= $pathway->reversible ? '' : 'disabled' ?>><i class="fa fa-random"></i></button>
            <button class="btn mini inc"><i class="fa fa-plus"></i></button>
            <button class="btn mini max"><i class="fa fa-chevron-up"></i></button>
        </div>
    </div>

</div>
