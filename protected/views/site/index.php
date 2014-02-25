<?php
/**
 * @param organs
 * @param primary_resources
 * @param user
 */
?>

<div class="result-cover"></div>

<div class="sidebar" id="pathway-holder">
    <?php $this->renderPartial('pathways', array(
        'organs' => $organs,
    )); ?>
</div>

<?php $this->renderPartial('header', array(
    'user' => $user,
)); ?>

<div id="cell-canvas"></div>
<p id="copyright">Copyright 2014 Neocles B. Leontis</p>

<?php $this->renderPartial('trackers', array(
    'primary_resources' => $primary_resources,
)); ?>

<div class="sidebar" id="resource-holder">
    <?php $this->renderPartial('resources', array(
        'organs' => $organs,
    )); ?>
</div>
