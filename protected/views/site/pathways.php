<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<div class="sidebar-title header-text">
    <p>Cellular Pathways</p>
    <i id="pathway-filter-icon" class="icon-cog icon-white"></i>

    <div id="pathway-filter">
        <div id="filter-row-search" class="filter-row">
            <div class="input-dark-add-on input-prepend">
                <span class="add-on"><i class="icon-search icon-white"></i></span>
                <input type="text" placeholder="Filter By Name" id="filter-name">
            </div>
        </div>
        
        <div id="filter-row-buttons" class="filter-row">
            <table>
                <td>
                    <div class="btn-group" data-toggle="buttons-checkbox">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-available" value="Available">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-unavailable" value="Unavailable">
                    </div>
                </td>
                
                <td>
                    <div class="btn-group" data-toggle="buttons-checkbox">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-catabolic" value="Catabolic">
                        <input type="button" class="btn btn-mini btn-inverse" id="filter-anabolic" value="Anabolic">
                    </div>
                </td>
            </table>
        </div>

        <div id="filter-row-reaction" class="filter-row">
            <div class="input-dark-add-on input-prepend">
                <span class="add-on"><i class="icon-search icon-white"></i></span>
                <input type="text" placeholder="Reactant" id="filter-reactant">
            </div>

            <div class="input-dark-add-on input-prepend">
                <span class="add-on"><i class="icon-search icon-white"></i></span>
                <input type="text" placeholder="Product" id="filter-product">
            </div>
        </div>

        <div id="filter-row-clear" class="filter-row">
            <input type="button" class="btn btn-small btn-inverse" id="filter-clear" value="Clear Filter">
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

    <div class="accordian-content pathway-holder scrollbar-content" value="<?= $organ->id ?>">
        <?php
        $pathways = $organ->pathways;
        foreach ($pathways as $pathway) {
            $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
