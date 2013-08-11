<?php
$url = Yii::app()->params['url'];
?>

<html>
<head></head>
<body>

<h2>Recover Your <a href="<?= $url ?>">Metabolism Fun</a> Password</a></h2>
<p>
Dear <?= $username ?>,<br>
You've requested to recover your password on <a href="<?= $url ?>">metabolismfun.com</a>.
</p>

<h3>Your password is: <?= $password ?></h3>

<p>
Sincerely,<br>
The Metabolism Fun Team
</p>

<p>If this was done by mistake or you did not initiate this request, please contact us.</p>

</body>
</html>