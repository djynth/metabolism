<?php
$organs = Organ::getNotGlobal();
$global = Organ::getGlobal();
?>

<div class="sidebar-title header-text">
    <p>Cellular Pathways</p>
    <i id="pathway-filter-icon" class="icon-cog icon-white"></i>

    <div id="pathway-filter">
        <div id="filter-row-search" class="filter-row">
            <div class="input-dark input-prepend">
                <span class="add-on"><i class="icon-search icon-white"></i></span>
                <input type="text" placeholder="Filter By Name">
            </div>
        </div>
        
        <div id="filter-row-buttons" class="filter-row">
            <table>
                <td>
                    <div class="btn-group" data-toggle="buttons-checkbox">
                        <button class="btn btn-small btn-inverse active">Available</button>
                        <button class="btn btn-small btn-inverse active">Unavailable</button>
                    </div>
                </td>
                
                <td>
                    <div class="btn-group" data-toggle="buttons-checkbox">
                        <button class="btn btn-small btn-inverse active">Catabolic</button>
                        <button class="btn btn-small btn-inverse active">Anabolic</button>
                    </div>
                </td>
            </table>
        </div>

        <div id="filter-row-reaction" class="filter-row">
                <div class="input-dark input-prepend">
                    <span class="add-on"><i class="icon-search icon-white"></i></span>
                    <input type="text" placeholder="Reactant">
                </div>

                <div class="input-dark input-prepend">
                    <span class="add-on"><i class="icon-search icon-white"></i></span>
                    <input type="text" placeholder="Product">
                </div>
        </div>
    </div>
</div>

<div class="header-text">
    <p><?= $global->name ?></p>
    <i class="icon-info-sign icon-white organ-info"></i>
</div>

<div class="pathway-holder global" value="<?= $global->id ?>">
    <?php
    $pathways = $global->pathways;
    foreach ($pathways as $pathway) {
        $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $global));
    }
    ?>
</div>

<?php foreach($organs as $organ): ?>
    <div class="accordian-header header-text" value="<?= $organ->id ?>">
        <p class="accordian-title"><?= $organ->name ?></p>
        <i class="icon-info-sign icon-white organ-info"></i>
    </div>

    <div class="accordian-content pathway-holder scrollbar-content" value="<?= $organ->id ?>">
        <?php
        $pathways = $organ->pathways;
        foreach ($pathways as $pathway) {
            $this->renderPartial('pathway', array('pathway' => $pathway, 'organ' => $organ));
        }
        ?>
    </div>
<?php endforeach ?>
