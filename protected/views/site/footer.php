<?php
/**
 * @param primary_resources
 * @param non_global
 */
?>

<div id="footer">
    <div id="minimize-footer"></div>

    <div class="content">
        <?php $this->renderPartial('filter'); ?>

        <?php $this->renderPartial('tracker', array(
            'primary_resources' => $primary_resources,
            'non_global'        => $non_global,
        )); ?>

        <?php $this->renderPartial('resource-visual'); ?>
    </div>
</div>
