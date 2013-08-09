<!DOCTYPE html>
<html lang="en">

<head>

<!-- CSS -->
<link rel="stylesheet" tyle="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/lib/bootstrap.min.css">
<link rel="stylesheet" tyle="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/lib/jquery.mCustomScrollbar.css">
<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css">
<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/pathways.css">
<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/resources.css">
<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/trackers.css">

<!-- JavaScript -->
<script src="<?php echo Yii::app()->request->baseUrl; ?>/lib/jquery-1.10.1.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/lib/jquery.animate-colors-min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/lib/jquery.animate-shadow.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/lib/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/lib/jquery.hoverIntent.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/lib/bootstrap.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/main.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/resources.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/pathways.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/organs.js"></script>

<script>
var baseUrl = <?= json_encode(Yii::app()->request->baseUrl); ?>;
var GLOBAL_ORGAN = <?= json_encode(Organ::GLOBAL_ID); ?>;
var color_theme = null;

<?php if (!Yii::app()->user->isGuest):
    $user = User::model()->findByAttributes(array('username' => Yii::app()->user->id));
    if ($user): ?>
        color_theme = <?= json_encode($user->theme); ?>;
    <?php endif ?>
<?php endif ?>

var organColors = new Array;
<?php
$organs = Organ::getNotGlobal();
foreach ($organs as $organ): ?>
    organColors[<?= json_encode($organ->id) ?>] = <?= json_encode($organ->color) ?>;
<?php endforeach ?>
</script>

<meta name="description" content="Metabolism Fun">
<meta name="language" content="en">
<meta name="keywords" content="Metabolism,Education,Game,Visualization,Fun">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>

<?php echo $content; ?>

</body>
</html>

<script>

setPoints(<?= Game::STARTING_POINTS ?>);
setTurn(<?= Game::STARTING_TURN ?>, <?= Game::MAX_TURNS ?>);

</script>
