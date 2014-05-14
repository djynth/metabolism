<!DOCTYPE html>
<html lang="en">

<head>

<!-- load all the CSS and JS assets -->
<?php foreach (glob("lib/*.css") as $css): ?>
    <link type='text/css' rel='stylesheet' href='<?= $css ?>'>
<?php endforeach;
foreach (glob("css/*.css") as $css): ?>
    <link type='text/css' rel='stylesheet' href='<?= $css ?>'>
<?php endforeach;
foreach (glob("css/themes/*/*.css") as $css): ?>
    <link type='text/css' rel='stylesheet' href='<?= $css ?>'>
<?php endforeach;
foreach (glob("lib/*.js") as $js): ?>
    <script src='<?= $js ?>'></script>
<?php endforeach;
foreach (glob("js/*.js") as $js): ?>
    <script src='<?= $js ?>'></script>
<?php endforeach; ?>

<?php
$user = User::getCurrentUser();
$theme      = json_encode($user !== null ? $user->theme      : User::DEFAULT_THEME);
$theme_type = json_encode($user !== null ? $user->theme_type : User::DEFAULT_THEME_TYPE);
?>

<script>
$(document).ready(function() {
    $('.accordian-header').first().addClass('active');
    onResize();
    selectOrgan($('.accordian-header.active').organ());
    onTurn(<?= json_encode(Game::getInitialState()) ?>);
    $('.theme[type=<?= $theme_type ?>][theme=<?= $theme ?>]').click();
});
</script>

<meta name="description" content="<?= Yii::app()->name ?>">
<meta name="language" content="en">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title><?= CHtml::encode($this->pageTitle); ?></title>
</head>

<body> <?= $content; ?> </body>

</html>
