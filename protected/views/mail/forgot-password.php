<?php
/**
 * @param url
 * @param username
 * @param verification
 * @param resetPage
 */
?>

<html>
<head></head>
<body>

<p>
Dear <?= $username ?>,<br>
You've requested to recover your password on
<a href="<?= $url ?>">metabolismfun.com</a>. To reset your password to a new one
of your choosing, follow the link and enter the verification code given below:
<br>
<br>
Verification Code: <?= $verification ?><br>
<a href="<?= $resetPage ?>">Reset Your Password</a><br>
<br>
Sincerely,<br>
The Metabolism Fun Team<br>
<br>
If this was done by mistake or you did not initiate this request, ignore this
email.
</p>

</body>
</html>