<?php
/**
 * @param url
 * @param username
 * @param verification
 * @param email
 * @param verifyPage
 */
?>

<html>
<head></head>
<body>

<p>
Dear <?= $username ?>,<br>
You've registered an account on <a href="<?= $url ?>">metabolismfun.com</a> and
linked it with <?= $email ?>. To verify this email address so we can use it to
help you recover your password if you ever forget it, follow the link and enter
the verification code below:<br>
<br>
Verification Code: <?= $verification ?><br>
<a href="<?= $verifyPage ?>">Verify Your Email Address</a><br>
<br>
Sincerely,<br>
The Metabolism Fun Team<br>
<br>
If this was done by mistake or you did not register an account, ignore this
email.
</p>

</body>
</html>