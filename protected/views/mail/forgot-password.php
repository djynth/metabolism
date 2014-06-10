<?php
/**
 * @param username
 * @param resetPage
 */
?>

<html>
<head></head>
<body>

<p>
Dear <?= $username ?>,
<br>
You've requested to recover your
<a href="<?= Yii::app()->params['url'] ?>"><?= Yii::app()->name ?></a> password.
To reset your password to a new one of your choosing, follow the link below:
<br>
<br>
<a href="<?= $resetPage ?>">Reset Your Password</a>
<br>
<br>
Sincerely,
<br>
The Metabolism Fun Team
<br>
<br>
Do not reply to this email. If this was done by mistake or you did not initiate
this request, ignore this email.
</p>

</body>
</html>