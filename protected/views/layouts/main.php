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
$baseUrl = Yii::app()->request->baseUrl;
$user = User::getCurrentUser();
?>

<script>
var baseUrl = <?= json_encode($baseUrl); ?>;

$(document).ready(function() {
    setPoints(<?= Game::getScore() ?>);
    setTurn(<?= Game::getTurn() ?>);
    setColorTheme(
        <?= json_encode($user !== null ? $user->theme      : User::DEFAULT_THEME) ?>,
        <?= json_encode($user !== null ? $user->theme_type : User::DEFAULT_THEME_TYPE) ?>
    );
});
</script>

<meta name="description" content="<?= Yii::app()->name ?>">
<meta name="language" content="en">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title><?= CHtml::encode($this->pageTitle); ?></title>
</head>

<body> <?= $content; ?> </body>

</html>
