<!DOCTYPE html>
<html lang="en">

<head>

<link rel="stylesheet" href="/lib/font-awesome-4.1.0/css/font-awesome.min.css">

<script src="/lib/jquery-1.11.0.min.js"></script>
<script src="/lib/velocity.min.js"></script>

<?php
$user = User::getCurrentUser();

foreach (Organ::model()->findAll() as $organ) {
    $organColors[$organ->id] = $organ->color;
}

function rglob($pattern, $flags = 0)
{
    $files = glob($pattern, $flags);
    
    foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
    {
        $files = array_merge($files, rglob($dir . '/' . basename($pattern), $flags));
    }
    
    return $files;
}
?>

<?php foreach (rglob('css/*.css') as $css): ?>
    <link type='text/css' rel='stylesheet' href='/<?= $css ?>'>
<?php endforeach; ?>
<?php foreach (rglob('js/*.js') as $js): ?>
    <script src='/<?= $js ?>'></script>
<?php endforeach; ?>

<meta name="description" content="<?= Yii::app()->name ?>">
<meta name="language" content="en">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<script>
organColors = <?= json_encode($organColors) ?>;

$(document).ready(function() {
    setWorking(false);
    $('.theme[theme=<?= User::getCurrentTheme($user)["theme"] ?>]').find('.select').click();
    setPreferences(<?= json_encode(Preference::getPreferences($user)) ?>);
    onResize();

    selectOrgan($('.pathways-header').first().organ(), false);
    $('.resources').each(function() {
        resizeResources($(this));
    });
    setTurn(0, -1);
    setPoints(0);
    
    setKeyboardShortcuts(<?= json_encode(KeyboardShortcut::getShortcuts($user)) ?>);
    log('Welcome to <?= Yii::app()->name ?>!');
});
</script>

<title><?= Yii::app()->name ?></title>
</head>

<body> <?= $content; ?> </body>

</html>
