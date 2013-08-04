<?php
$guest = Yii::app()->user->getIsGuest();
?>

<div id="header">
    <p id="points"></p>
    <p id="turns" ></p>

    <div id="settings">
        <div class="settings-header">
            <p class="settings-text">Settings</p>
            <i class="icon-cog icon-white"></i>
        </div>

        <div class="settings-dropdown">
            <p>Color Theme</p>
            <div id="theme-holder" class="btn-group" data-toggle="buttons-radio">
                <button id="theme-dark"  class="btn btn-small btn-inverse active">Dark</button>
                <button id="theme-light" class="btn btn-small">Light</button>
            </div>

            <button id="settings-apply" class="btn btn-small btn-inverse">Apply</button>
        </div>
    </div>

    <div id="account">
        <div class="account-header">
            <p class="login-text"><?= $guest ? 'Not logged in' : 'Logged in as ' . Yii::app()->user->name ?></p>
            <i class="icon-user icon-white"></i>
        </div>

        <?php if ($guest): ?>
        <div class="login-dropdown">
            <div class="login-holder">
                <p>Login</p>
                <div class="control-group">
                    <input id="login-username" type="text"     placeholder="Username" class="input-dark">
                </div>
                <div class="control-group">
                    <input id="login-password" type="password" placeholder="Password" class="input-dark">
                </div>
                <p id="login-error" class="error-info"></p>
                <div class="button-holder">
                    <button id="login-submit" class="btn btn-inverse btn-small">Submit</button>
                </div>
            </div>
            <div class="create-account-holder">
                <p>Create Account</p>
                <div class="control-group">
                    <input id="create-account-username" type="text" placeholder="Username" class="input-dark">
                </div>
                <div class="control-group">
                    <input id="create-account-password" type="password" placeholder="Password" class="input-dark">
                </div>
                <div class="control-group">
                    <input id="create-account-confirm" type="password" placeholder="Confirm Password" class="input-dark">
                </div>
                <p id="create-account-error" class="error-info"></p>
                <div class="button-holder">
                    <button id="create-account-submit" class="btn btn-inverse btn-small">Submit</button>
                </div>
            </div>

            <p class="dropdown-footer">Note: logging in or creating an account will restart your game</p>
        </div>

        <?php else: ?>
        <div class="login-dropdown">
            <div class="change-password-holder">
                <p>Change Password</p>
                <div class="control-group">
                    <input id="change-password-current" type="password" placeholder="Current Password" class="input-dark">
                </div>
                <div class="control-group">
                    <input id="change-password-new" type="password" placeholder="New Password" class="input-dark">
                </div>
                <div class="control-group">
                    <input id="change-password-confirm" type="password" placeholder="Confirm New Password" class="input-dark">
                </div>
                <p id="change-password-error" class="error-info"></p>
                <p id="change-password-success" class="success-info"></p>
                <div class="button-holder">
                    <button id="change-password-submit" class="btn btn-inverse btn-small">Submit</button>
                </div>
            </div>

            <div class="logout-holder">
                <button id="logout" class="btn btn-small btn-inverse">Logout</button>
            </div>

            <p class="dropdown-footer">Note: logging out will restart your game</p>
        </div>
        <?php endif ?>
    </div>
</div>