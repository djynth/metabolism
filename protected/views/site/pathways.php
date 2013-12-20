<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<div class="sidebar-title header-text">
    <p>Cellular Pathways</p>
    <button id="pathway-filter-toggle" class="btn btn-mini"><i class="icon-filter"> </i> Filter</button>

    <div id="pathway-filter">
        <div id="filter-row-search" class="filter-row">
            <div class="input-themed-add-on input-prepend">
                <span class="add-on"><i class="icon-search"></i></span>
                <input type="text" placeholder="Filter By Name" id="filter-name" class="help-tooltip"
                       data-placement="right" data-container="body" data-trigger="focus"
                       title="Only show pathways containing certain case-insensitive text.
                              Accepts regular expressions.">
            </div>
        </div>
        
        <div id="filter-row-buttons" class="filter-row">
            <table>
                <td>
                    <div class="btn-group help-tooltip" data-toggle="buttons-checkbox"
                         data-placement="bottom" data-container="body" data-trigger="hover"
                         title="Only show pathways that are currently available, unavailable, or both.">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-available" value="Available">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-unavailable" value="Unavailable">
                    </div>
                </td>
                
                <td>
                    <div class="btn-group help-tooltip" data-toggle="buttons-checkbox"
                         data-placement="bottom" data-container="body" data-trigger="hover"
                         title="Only show pathways that are catabolic, anabolic, or both.">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-catabolic" value="Catabolic">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-anabolic" value="Anabolic">
                    </div>
                </td>
            </table>
        </div>

        <div id="filter-row-reaction" class="filter-row">
            <div class="input-themed-add-on input-prepend">
                <span class="add-on"><i class="icon-search"></i></span>
                <input type="text" placeholder="Reactant" id="filter-reactant" class="help-tooltip"
                       data-placement="bottom" data-container="body" data-trigger="focus"
                       title="Only show pathways with a reactant whose name matches certain case-insensitive text.
                              Matches both resource names (i.e. Oxygen) and abbreviations (i.e. O2) and accepts regular expressions.">
            </div>

            <div class="input-themed-add-on input-prepend">
                <span class="add-on"><i class="icon-search"></i></span>
                <input type="text" placeholder="Product" id="filter-product" class="help-tooltip"
                       data-placement="bottom" data-container="body" data-trigger="focus"
                       title="Only show pathways with a product whose name matches certain case-insensitive text.
                              Matches both resource names (i.e. Oxygen) and abbreviations (i.e. O2) and accepts regular expressions.">
            </div>
        </div>

        <div id="filter-row-clear" class="filter-row">
            <input type="button" class="btn btn-small btn-inverse" id="filter-clear" value="Display All">
        </div>
    </div>
</div>

<?php
$this->renderPartial('organ-header', array('organ' => $global, 'right' => true));
?>

<div class="pathway-holder global" value="<?= $global->id ?>">
    <?php
    $pathways = $global->pathways;
    foreach ($pathways as $pathway) {
        $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $global));
    }
    ?>
</div>

<?php foreach($organs as $organ):
    $this->renderPartial('organ-header', array('organ' => $organ, 'right' => true));
    ?>

    <div class="accordian-content pathway-holder scrollbar-content" value="<?= $organ->id ?>" color="<?= $organ->color ?>">
        <?php
        $pathways = $organ->pathways;
        foreach ($pathways as $pathway) {
            $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
