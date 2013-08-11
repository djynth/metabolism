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
                <input type="text" id="email" class="input-themed" placeholder="Email Address" value="<?= $email ?>">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="username">Username</label>
            <div class="controls">
                <input type="text" id="username" class="input-themed" placeholder="Username" value="<?= $username ?>">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="code">Verification Code</label>
            <div class="controls">
                <input type="text" id="code" class="input-themed" placeholder="Verification Code">
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
