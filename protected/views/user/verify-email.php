<?php

$this->pageTitle = 'Verify Email';
Yii::app()->getClientScript()->registerScriptFile(Yii::app()->baseUrl . '/js/verify-email.js');
Yii::app()->getClientScript()->registerCssFile(Yii::app()->baseUrl . '/css/verify-email.css');
?>

<div id="verify-email-holder">
    <h3 id="title">Verify Your Email Address</h3>

    <form class="form-horizontal" id="verify-email-form">
        <div class="control-group">
            <label class="control-label" for="email">Email</label>
            <div class="controls">
                <input type="text" id="email" placeholder="Email Address" value="<?= $email ?>" class="input-themed tooltip-holder"
                       data-placement="right" data-trigger="focus"
                       title="This is the email address being verified; do not edit it.
                              If it is incorrect it can be changed in the account dropdown when you log in to Metabolism Fun.">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="username">Username</label>
            <div class="controls">
                <input type="text" id="username" placeholder="Username" value="<?= $username ?>" class="input-themed tooltip-holder"
                       data-placement="right" data-trigger="focus"
                       title="If you would like to edit your username, do not change it here; rather, contact us.">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="code">Verification Code</label>
            <div class="controls">
                <input type="text" id="code" placeholder="Verification Code" class="input-themed tooltip-holder"
                       data-placement="right" data-trigger="focus"
                       title="Enter the verification code from the registration email we sent you when you created your account.">
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
