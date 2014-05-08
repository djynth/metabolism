<?php
/**
 * @param primary_resources
 * @param non_global
 */
?>

<div id="notification-bottom" class="notification-holder"></div>

<div id="footer">
    <div id="footer-minimize"></div>

    <div id="footer-content">
        <div id="pathway-filter">
            <div id="filter-row-search" class="filter-row">
                <div class="input-themed-add-on input-prepend">
                    <span class="add-on"><i class="icon-search"></i></span>
                    <input type="text" placeholder="Filter By Name" id="filter-name" class="help-tooltip" data-placement="right" data-container="body" data-trigger="focus" title="Only show pathways containing certain case-insensitive text. Accepts regular expressions.">
                </div>
            </div>
            
            <div id="filter-row-buttons" class="filter-row">
                <table>
                    <td>
                        <div class="btn-group help-tooltip" data-toggle="buttons-checkbox" data-placement="bottom" data-container="body" data-trigger="hover" title="Only show pathways that are currently available, unavailable, or both.">
                            <input type="button" class="btn btn-mini btn-inverse" id="filter-available" value="Available">
                            <input type="button" class="btn btn-mini btn-inverse" id="filter-unavailable" value="Unavailable">
                        </div>
                    </td>
                    
                    <td>
                        <div class="btn-group help-tooltip" data-toggle="buttons-checkbox" data-placement="bottom" data-container="body" data-trigger="hover" title="Only show pathways that are catabolic, anabolic, or both.">
                            <input type="button" class="btn btn-mini btn-inverse" id="filter-catabolic" value="Catabolic">
                            <input type="button" class="btn btn-mini btn-inverse" id="filter-anabolic" value="Anabolic">
                        </div>
                    </td>
                </table>
            </div>

            <div id="filter-row-reaction" class="filter-row">
                <div class="input-themed-add-on input-prepend">
                    <span class="add-on"><i class="icon-search"></i></span>
                    <input type="text" placeholder="Reactant" id="filter-reactant" class="help-tooltip" data-placement="bottom" data-container="body" data-trigger="focus" title="Only show pathways with a reactant whose name matches certain case-insensitive text. Matches both resource names (i.e. Oxygen) and abbreviations (i.e. O2) and accepts regular expressions.">
                </div>

                <div class="input-themed-add-on input-prepend">
                    <span class="add-on"><i class="icon-search"></i></span>
                    <input type="text" placeholder="Product" id="filter-product" class="help-tooltip" data-placement="bottom" data-container="body" data-trigger="focus" title="Only show pathways with a product whose name matches certain case-insensitive text. Matches both resource names (i.e. Oxygen) and abbreviations (i.e. O2) and accepts regular expressions.">
                </div>
            </div>

            <div id="filter-row-clear" class="filter-row">
                <label id="filter-passive-label"><input type="checkbox" id="filter-passive" checked>Show Automatic Processes</label>
                <input type="button" class="btn btn-small btn-inverse" id="filter-clear" value="Display All">
            </div>
        </div>

        <table id="trackers">
            <?php foreach ($primary_resources as $resource): ?>
            <td class="tracker" res-id="<?= $resource->id ?>">
                <div class="header">
                    <p class="title"><?= $resource->name ?></p>
                    <p class="total"><?= $resource->getTotal() ?></p>
                </div>

                <?php foreach ($non_global as $organ): ?>
                <div class="organ" organ-id="<?= $organ->id ?>">
                    <p class="amount"><?= $resource->getAmount($organ->id) ?></p>
                    <p class="organ-name"><?= $organ->name ?></p>
                    <div class="icons"></div>
                </div>
                <?php endforeach ?>
            </td>
            <?php endforeach ?>

            <td class="tracker actions">
                <div class="header">
                    <p class="title">Organ-Specific Actions</p>
                </div>

                <?php foreach ($non_global as $organ): ?>
                <div class="organ" organ-id="<?= $organ->id ?>">
                    <?php if ($organ->hasAction()): ?>
                    <p class="amount"><?= $organ->getActionCount() ?></p>
                    <p class="organ-name"><?= $organ->action_name ?></p>
                    <?php endif ?>
                </div>
                <?php endforeach ?>
            </td>
        </table>

        <div id="resource-visual">
            <i class="icon-remove" id="resource-visual-close"></i>
        </div>
    </div>
</div>
