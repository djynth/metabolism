<?php
/**
 * @param organs
 * @param non_global
 * @param primary_resources
 * @param user
 */
?>

<div class="sidebar left">
    <?php $this->renderPartial('pathways', array(
        'organs' => $organs,
    )); ?>
</div>

<?php $this->renderPartial('header', array(
    'user'             => $user,
    'organs'           => $organs,
    'passive_pathways' => $passive_pathways,
)); ?>

<div id="diagram"></div>
<p id="copyright">Copyright 2014 Neocles B. Leontis</p>

<?php $this->renderPartial('footer', array(
    'primary_resources' => $primary_resources,
    'non_global'        => $non_global,
)); ?>

<div class="sidebar right">
    <?php $this->renderPartial('resources', array(
        'organs' => $organs,
    )); ?>
</div>
