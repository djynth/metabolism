<?php
/**
 * @param organs
 * @param non_global
 * @param primary_resources
 * @param user
 * @param action
 * @param username
 * @param verification
 */
?>

<?php
switch($action)
{
    case "verify-email":
        $this->renderPartial('verify-email', array(
            'verification' => $verification,
            'username' => $username,
        ));
        break;
    case "reset-password":
        $this->renderPartial('reset-password', array(
            'verification' => $verification,
            'username' => $username,
        ));
        break;
}
?>

<?php $this->renderPartial('results'); ?>

<?php $this->renderPartial('header', array(
    'user'   => $user,
    'organs' => $organs,
)); ?>

<div class="sidebar left">
    <?php $this->renderPartial('pathways', array(
        'organs' => $organs,
    )); ?>
</div>

<div class="sidebar right">
    <?php $this->renderPartial('resources', array(
        'organs' => $organs,
    )); ?>
</div>

<div id="content-area">
    <div id="diagram"></div>
    <p id="copyright">Copyright 2014 Neocles B. Leontis</p>

    <?php $this->renderPartial('notifications'); ?>

    <?php $this->renderPartial('menu', array(
        'user' => $user
    )); ?>
</div>


<?php $this->renderPartial('footer', array(
    'primary_resources' => $primary_resources,
    'non_global'        => $non_global,
)); ?>
