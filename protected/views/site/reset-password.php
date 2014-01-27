<?php

$this->pageTitle = 'Reset Password';
Yii::app()->getClientScript()->registerScriptFile(Yii::app()->baseUrl . '/js/reset-password.js');
Yii::app()->getClientScript()->registerCssFile(Yii::app()->baseUrl . '/css/reset-password.css');
?>

<div id="reset-password-holder">
    <h3 id="title">Reset Your Password</h3>

    <form class="form-horizontal" id="reset-password-form">
        <div class="control-group">
            <label class="control-label" for="username">Username</label>
            <div class="controls">
                <input type="text" id="username" placeholder="Username" value="<?= $username ?>" class="input-themed tooltip-holder"
                        data-placement="right" data-trigger="focus"
                        title="Enter your username to identify yourself.">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="code">Verification Code</label>
            <div class="controls">
                <input type="text" id="code" placeholder="Verification Code" class="input-themed tooltip-holder"
                       data-placement="right" data-trigger="focus"
                       title="Enter the verification code from the password recovery email we sent you.">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="new">New Password</label>
            <div class="controls">
                <input type="password" id="new" placeholder="New Password" class="input-themed tooltip-holder"
                       data-placement="right" data-trigger="focus"
                       title="Enter the new password for your account. Passwords must be 3-32 alphanumeric or punctuation characters.">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="confirm">Confirm Password</label>
            <div class="controls">
                <input type="password" id="confirm" placeholder="Confirm Password" class="input-themed tooltip-holder"
                       data-placement="right" data-trigger="focus"
                       title="Repeat the password you entered above to confirm that it was entered correctly.">
            </div>
        </div>
        <div class="control-group">
            <div class="controls">
                <input type="submit" id="submit" class="btn" value="Submit">
            </div>
        </div>
    </form>

    <p id="message"></p>
</div>
