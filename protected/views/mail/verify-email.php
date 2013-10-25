<?php
$url = Yii::app()->params['url'];
?>

<html>
<head></head>
<body>

<h2>Welcome to <a href="<?= $url ?>">Metabolism Fun!</a></h2>
<p>
You've registered an account as <?= $username ?> on <a href="<?= $url ?>">metabolismfun.com</a> and linked it with <?= $email ?>.<br>
To complete your registration, follow the link below to the email verification page and enter the verification code below:
</p>

<h3>Verification Code: <?= $verification ?></h3>
<h3><a href="<?= $verifyPage ?>">Verification Page</a></h3>

<p>
Sincerely,<br>
The Metabolism Fun Team
</p>

<p>If this was done by mistake or you did not register an account, please contact us.</p>

</body>
</html>