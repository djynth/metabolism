<!DOCTYPE html>
<html lang="en">

<head>

<?php
$baseUrl = Yii::app()->request->baseUrl;

// TODO: combine these for loops

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
var MAX_TURNS = <?= json_encode(Game::MAX_TURNS); ?>;
var colorTheme = 'light';
var colorThemeType = 'light';

<?php if (($user = User::getCurrentUser()) !== null): ?>
    colorTheme = <?= json_encode($user->theme); ?>;
<?php endif ?>

var organColors = new Array;
<?php
$organs = Organ::getNotGlobal();
foreach ($organs as $organ): ?>
    organColors[<?= json_encode($organ->id) ?>] = <?= json_encode($organ->color) ?>;
<?php endforeach ?>

$(document).ready(function() {
    setPoints(<?= Game::STARTING_POINTS ?>);
    setTurn(<?= Game::STARTING_TURN ?>);

    <?php if (($user = User::getCurrentUser()) !== null): ?>
        setHelpTooltips(parseInt(<?= json_encode($user->help); ?>));
    <?php else: ?>
        setHelpTooltips(true);
    <?php endif ?>
});
</script>

<meta name="description" content="<?= Yii::app()->name ?>">
<meta name="language" content="en">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body> <?php echo $content; ?> </body>

</html>
