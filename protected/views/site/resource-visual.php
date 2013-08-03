<div class="resource-visual-content" value="<?= $resource->id ?>">
    <img class="resource-visual-image" alt="" src="img/molecules/<?= $resource->id ?>">
    <p class="resource-visual-formula">Formula: <?= $resource->formula ?></p>
    <table class="resource-visual-pathways">
        <tr>
            <th>Sources</th>
            <th>Destinations</th>
        </tr>

        <?php
        $sources = $resource->getSources();
        $destinations = $resource->getDestinations();

        for ($i = 0; $i < max(count($sources), count($destinations)); $i++): ?>
            <tr>
                <?php if ($i < count($sources)): ?>
                    <td><?= $sources[$i]->name ?></td>
                <?php else: ?>
                    <td></td>
                <?php endif ?>

                <?php if ($i < count($destinations)): ?>
                    <td><?= $destinations[$i]->name ?></td>
                <?php else: ?>
                    <td></td>
                <?php endif ?>
            </tr>
        <?php endfor ?>
    </table>
    <p class="resource-visual-description"><?= $resource->description ?></p>
</div>