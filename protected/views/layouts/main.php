<!DOCTYPE html>
<html lang="en">

<head>

<?php
$baseUrl = Yii::app()->request->baseUrl;

// load all the CSS and JS assets
foreach (glob("lib/*.css") as $css): ?>
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

<script>
var baseUrl = <?= json_encode($baseUrl); ?>;

<?php if (($user = User::getCurrentUser()) !== null): ?>
    var colorTheme = <?= json_encode($user->theme) ?>;
    var colorThemeType = <?= json_encode($user->theme_type) ?>;
<?php else: ?>
    var colorTheme = <?= json_encode(User::DEFAULT_THEME) ?>;
    var colorThemeType = <?= json_encode(User::DEFAULT_THEME_TYPE) ?>;
<?php endif ?>

// TODO: embed these in the DOM
var organColors = new Array;
<?php
$organs = Organ::getNotGlobal();
foreach ($organs as $organ): ?>
    organColors[<?= json_encode($organ->id) ?>] = <?= json_encode($organ->color) ?>;
<?php endforeach ?>

$(document).ready(function() {
    setPoints(<?= Game::getScore() ?>);
    setTurn(<?= Game::getTurn() ?>);

    <?php if (($user = User::getCurrentUser()) !== null): ?>
        setHelpTooltips(parseInt(<?= json_encode($user->help); ?>));
    <?php else: ?>
        setHelpTooltips(<?= json_encode(User::DEFAULT_HELP) ?>);
    <?php endif ?>
});
</script>

<meta name="description" content="<?= Yii::app()->name ?>">
<meta name="language" content="en">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title><?= CHtml::encode($this->pageTitle); ?></title>
</head>

<body> <?= $content; ?> </body>

</html>
