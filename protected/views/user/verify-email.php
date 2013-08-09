<?php

// TODO render a page to verify an email:
//      input for username
//      input for verification code
//      text response whether the code was accepted or not

$this->pageTitle = 'Verify Email';
Yii::app()->getClientScript()->registerScriptFile(Yii::app()->baseUrl . '/js/verify-email.js');
Yii::app()->getClientScript()->registerCssFile(Yii::app()->baseUrl . '/css/verify-email.css');
?>

<div id="verify-email-holder">
    <h3 id="verify-email-title">Verify Your Email Address</h3>

    <form class="form-horizontal" id="verify-email-form">
        <div class="control-group">
            <label class="control-label" for="verify-email">Email</label>
            <div class="controls">
                <input type="text" id="verify-email" class="input-themed" placeholder="Email Address" value="<?= $email ?>" disabled='disabled'>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="verify-username">Username</label>
            <div class="controls">
                <input type="text" id="verify-username" class="input-themed" placeholder="Username" value="<?= $username ?>" disabled='disabled'>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="verify-code">Verification Code</label>
            <div class="controls">
                <input type="text" id="verify-code" class="input-themed" placeholder="Verification Code">
            </div>
        </div>
        <div class="control-group">
            <div class="controls">
                <input type="submit" id="verify-submit" class="btn" value="Submit">
            </div>
        </div>
    </form>

    <p class="verify-message"></p>
</div>
