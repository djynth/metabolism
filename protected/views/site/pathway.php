<div class="pathway" value="<?= $pathway->id ?>" <?= $pathway->limit ? ' limit="limit"' : '' ?> color="<?= $pathway->color ?>" catabolic="<?= $pathway->catabolic ? 'true' : 'false' ?>">
    <p class="title"><?= $pathway->name ?></p>
    <?php if (!$pathway->isGlobal()): ?>
        <p class="catabolic"><?= $pathway->catabolic ? 'Catabolic' : 'Anabolic' ?></p>
    <?php endif ?>
    <p class="points"><?= $pathway->points ?></p>

    <?php if ($pathway->isEat()): ?>
        <div class="food-holder" eat-max="<?= Pathway::EAT_MAX ?>">
            <?php foreach ($pathway->resources as $resource): ?>
                <div class="btn-group">
                    <button class="btn btn-mini btn-inverse eat-bottom"><i class="icon-chevron-down icon-white"></i> </button>;
                    <button class="btn btn-mini btn-inverse eat-minus"><i class="icon-minus icon-white"></i> </button>;
                    <button class="btn btn-mini btn-inverse eat" id="<?= $resource->getResource()->id ?>" value="<?= $resource->value ?>" full-name="<?= $resource->getResource()->name ?>"> </button>;
                    <button class="btn btn-mini btn-inverse eat-plus disabled"><i class="icon-plus icon-white"></i> </button>;
                    <button class="btn btn-mini btn-inverse eat-top disabled"><i class="icon-chevron-up icon-white"></i> </button>;
                </div>
            <?php endforeach ?>
        </div>
    <?php else: ?>
        <table class="reaction">
            <?php
            $reactants = $pathway->getReactants();
            $products = $pathway->getProducts();
            for ($i = 0; $i < max(count($reactants), count($products)); $i++): ?>
                <tr>
                    <?php if ($i < count($reactants)): ?>
                        <td class="reactant<?= $reactants[$i]->getResource()->global ? ' global' : '' ?>" value="<?= $reactants[$i]->value ?>" res-id="<?= $reactants[$i]->getResource()->id ?>" abbr="<?= $reactants[$i]->getResource()->abbr ?>"><?= $reactants[$i]->getResource()->name . ' ' . $reactants[$i]->value ?></td>
                    <?php else: ?>
                        <td></td>
                    <?php endif ?>

                    <?php if ($i < count($products)): ?>
                        <td class="product<?= $products[$i]->getResource()->global ? ' global' : '' ?>" value="<?= $products[$i]->value ?>" res-id="<?= $products[$i]->getResource()->id ?>" abbr="<?= $products[$i]->getResource()->abbr ?>"><?= $products[$i]->getResource()->name . ' ' . $products[$i]->value ?></td>
                    <?php else: ?>
                        <td></td>
                    <?php endif ?>
                </tr>
            <?php endfor ?>
        </table>
    <?php endif ?>

    <p class="lacking"></p>
    <div class="btn-group run-holder">
        <?php if ($pathway->limit): ?>
            <button class="btn btn-mini btn-inverse <?= $pathway->isEat() ? 'eat-run' : 'pathway-run' ?>" value="1">Run</button>
        <?php else: ?>
            <button class="btn btn-mini btn-inverse pathway-bottom"><i class="icon-chevron-down icon-white"></i></button>
            <button class="btn btn-mini btn-inverse pathway-minus"><i class="icon-minus icon-white"></i></button>
            <button class="btn btn-mini btn-inverse pathway-run"></button>
            <button class="btn btn-mini btn-inverse pathway-plus"><i class="icon-plus icon-white"></i></button>
            <button class="btn btn-mini btn-inverse pathway-top"><i class="icon-chevron-up icon-white"></i></button>
        <?php endif ?>
    </div>
</div>
