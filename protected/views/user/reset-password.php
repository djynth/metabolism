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
            <label class="control-label" for="new">New Password</label>
            <div class="controls">
                <input type="password" id="new" class="input-themed" placeholder="New Password">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label" for="confirm">Confirm Password</label>
            <div class="controls">
                <input type="password" id="confirm" class="input-themed" placeholder="Confirm Password">
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
