<div class="pathway" value="<?= $pathway->id ?>" <?= $pathway->limit ? ' limit="limit"' : '' ?> color="<?= $pathway->color ?>" catabolic="<?= $pathway->catabolic ? 'true' : 'false' ?>">
    <div class="pathway-inner"></div>
    <p class="title"><?= $pathway->name ?></p>
    <?php if (!$pathway->isGlobal()): ?>
        <p class="catabolic"><?= $pathway->catabolic ? 'Catabolic' : 'Anabolic' ?></p>
    <?php endif ?>
    <p class="points help-tooltip" data-placement="right" data-container="body"
       title="The number of points earned each time you run this reaction.">
        <?= $pathway->points ?>
    </p>

    <?php if ($pathway->isEat()): ?>
        <div class="food-holder" eat-max="<?= Pathway::EAT_MAX ?>">
            <?php foreach ($pathway->resources as $resource): ?>
                <div class="btn-group help-tooltip" data-placement="bottom" data-container="body"
                     title="Adjust the amount of <?= $resource->getResource()->name ?> that you will eat this turn.">
                    <button class="btn btn-mini btn-inverse eat-bottom"><i class="icon-chevron-down"></i> </button>;
                    <button class="btn btn-mini btn-inverse eat-minus"><i class="icon-minus"></i> </button>;
                    <button class="btn btn-mini btn-inverse eat" res-id="<?= $resource->getResource()->id ?>" value="<?= $resource->value ?>"> </button>;
                    <button class="btn btn-mini btn-inverse eat-plus disabled"><i class="icon-plus"></i> </button>;
                    <button class="btn btn-mini btn-inverse eat-top disabled"><i class="icon-chevron-up"></i> </button>;
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
                        <td class="reactant<?= $reactants[$i]->getResource()->global ? ' global' : '' ?>" value="<?= $reactants[$i]->value ?>" res-id="<?= $reactants[$i]->getResource()->id ?>">
                            <?= $reactants[$i]->getResource()->name . ' ' . $reactants[$i]->value ?>
                        </td>
                    <?php else: ?>
                        <td></td>
                    <?php endif ?>

                    <?php if ($i < count($products)): ?>
                        <td class="product<?= $products[$i]->getResource()->global ? ' global' : '' ?>" value="<?= $products[$i]->value ?>" res-id="<?= $products[$i]->getResource()->id ?>">
                            <?= $products[$i]->getResource()->name . ' ' . $products[$i]->value ?>
                        </td>
                    <?php else: ?>
                        <td></td>
                    <?php endif ?>
                </tr>
            <?php endfor ?>
        </table>
    <?php endif ?>

    <p class="lacking"></p>
    <?php if ($pathway->limit): ?>
        <div class="btn-group run-holder">
            <button class="btn btn-mini btn-inverse <?= $pathway->isEat() ? 'eat-run' : 'pathway-run' ?>" value="1">Run</button>
        </div>
    <?php else: ?>
        <div class="btn-group run-holder help-tooltip" data-placement="top" data-container="body"
             title="Adjust the number of times to run this pathway.
                    No matter how many times you run it, it counts as one turn.
                    Click the center button to run it once you're ready.">
            <button class="btn btn-mini btn-inverse pathway-bottom"><i class="icon-chevron-down"></i></button>
            <button class="btn btn-mini btn-inverse pathway-minus"><i class="icon-minus"></i></button>
            <button class="btn btn-mini btn-inverse pathway-run"></button>
            <button class="btn btn-mini btn-inverse pathway-plus"><i class="icon-plus"></i></button>
            <button class="btn btn-mini btn-inverse pathway-top"><i class="icon-chevron-up"></i></button>
        </div>
    <?php endif ?>
</div>
