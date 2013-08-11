<!DOCTYPE html>
<html lang="en">

<head>

<?php
$baseUrl = Yii::app()->request->baseUrl;
?>

<!-- CSS -->
<link rel="stylesheet" tyle="text/css" href="<?= $baseUrl ?>/lib/bootstrap.min.css">
<link rel="stylesheet" tyle="text/css" href="<?= $baseUrl ?>/lib/jquery.mCustomScrollbar.css">
<link rel="stylesheet" type="text/css" href="<?= $baseUrl ?>/css/main.css">
<link rel="stylesheet" type="text/css" href="<?= $baseUrl ?>/css/pathways.css">
<link rel="stylesheet" type="text/css" href="<?= $baseUrl ?>/css/resources.css">
<link rel="stylesheet" type="text/css" href="<?= $baseUrl ?>/css/trackers.css">
<link rel="stylesheet" type="text/css" href="<?= $baseUrl ?>/css/header.css">

<!-- JavaScript -->
<script src="<?= $baseUrl ?>/lib/jquery-1.10.1.min.js"></script>
<script src="<?= $baseUrl ?>/lib/jquery.animate-colors-min.js"></script>
<script src="<?= $baseUrl ?>/lib/jquery.animate-shadow.js"></script>
<script src="<?= $baseUrl ?>/lib/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<?= $baseUrl ?>/lib/jquery.hoverIntent.min.js"></script>
<script src="<?= $baseUrl ?>/lib/bootstrap.min.js"></script>
<script src="<?= $baseUrl ?>/js/main.js"></script>
<script src="<?= $baseUrl ?>/js/resources.js"></script>
<script src="<?= $baseUrl ?>/js/pathways.js"></script>
<script src="<?= $baseUrl ?>/js/organs.js"></script>
<script src="<?= $baseUrl ?>/js/header.js"></script>

<script>
var baseUrl = <?= json_encode($baseUrl); ?>;
var MAX_TURNS = <?= json_encode(Game::MAX_TURNS); ?>;
var color_theme = null;

<?php if (($user = User::getCurrentUser()) !== null): ?>
    color_theme = <?= json_encode($user->theme); ?>;
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
});
</script>

<meta name="description" content="<?= Yii::app()->name ?>">
<meta name="language" content="en">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body> <?php echo $content; ?> </body>

</html>
