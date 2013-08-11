<?php
$guest = Yii::app()->user->getIsGuest();
$user = User::model()->findByAttributes(array('username' => Yii::app()->user->id));
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
                <button id="theme-dark"  value="dark"  class="btn btn-small btn-inverse active">Dark</button>
                <button id="theme-light" value="light" class="btn btn-small">Light</button>
            </div>

            <button id="settings-apply" class="btn btn-small btn-inverse">Apply</button>
        </div>
    </div>

    <div id="account">
        <div class="account-header">
            <p class="login-text"><?= $guest ? 'Not logged in' : 'Logged in as ' . $user->username ?></p>
            <i class="icon-user icon-white"></i>
        </div>

        <?php if ($guest): ?>
        <div class="login-dropdown">
            <div class="login-holder">
                <p>Login</p>
                <div class="control-group">
                    <input id="login-username" type="text"     placeholder="Username" class="input-themed">
                </div>
                <div class="control-group" id="login-control-group">
                    <input id="login-password" type="password" placeholder="Password" class="input-themed">
                    <div class="forgot-password">
                        <i class="icon-question-sign"> </i>
                        <button id="forgot-password-button" class="btn btn-mini">Forgot Password</button>
                    </div>
                </div>
                <div class="button-holder">
                    <input type="submit" id="login-submit" class="btn btn-inverse btn-small" value="Submit">
                </div>
            </div>
            <div class="create-account-holder">
                <p>Create Account</p>
                <div class="control-group">
                    <input id="create-account-username" type="text" placeholder="Username" class="input-themed check-username">
                </div>
                <div class="control-group">
                    <input id="create-account-email" type="text" placeholder="Email Address" class="input-themed check-email">
                </div>
                <div class="control-group">
                    <input id="create-account-password" type="password" placeholder="Password" class="input-themed check-password">
                </div>
                <div class="control-group">
                    <input id="create-account-confirm" type="password" placeholder="Confirm Password" class="input-themed">
                </div>
                <div class="button-holder">
                    <input type="submit" id="create-account-submit" class="btn btn-inverse btn-small" value="Submit">
                </div>
            </div>

            <p class="dropdown-footer">Logging in or creating an account will restart your game.</p>
        </div>

        <?php else: ?>
        <div class="login-dropdown">
            <div class="change-password-holder">
                <p>Change Password</p>
                <div class="control-group">
                    <input id="change-password-current" type="password" placeholder="Current Password" class="input-themed">
                </div>
                <div class="control-group">
                    <input id="change-password-new" type="password" placeholder="New Password" class="input-themed check-password">
                </div>
                <div class="control-group">
                    <input id="change-password-confirm" type="password" placeholder="Confirm New Password" class="input-themed">
                </div>
                <div class="button-holder">
                    <input type="submit" id="change-password-submit" class="btn btn-inverse btn-small" value="Submit">
                </div>
            </div>

            <div class="email-holder">
                <p>Email</p>
                <div class="control-group" id="email-control-group">
                    <input id="email-info" type="text" placeholder="Email" class="input-themed" value="<?= $user->email ?>" disabled="disabled">
                    <?php if ($user->email_verified): ?>
                        <div class="email-verified" verified="true">
                            <i class="icon-ok"> </i>
                            <p>Email Verified</p>
                        </div>
                    <?php else: ?>
                        <div class="email-verified" verified="false">
                            <i class="icon-remove"> </i>
                            <button id="resend-verification-email" class="btn btn-mini">Resend Verification Email</button>
                        </div>
                    <?php endif ?>
                    <div class="edit-email">
                        <i class="icon-edit"> </i>
                        <button id="edit-email" class="btn btn-mini">Edit</button>
                    </div>
                </div>
            </div>

            <div class="edit-email-holder">
                <p>Edit Email</p>
                <div class="control-group">
                    <input id="edit-email-password" type="password" placeholder="Current Password" class="input-themed">
                </div>
                <div class="control-group">
                    <input id="edit-email-email" type="text" placeholder="New Email" class="input-themed check-email">
                </div>
                <p id="edit-email-error" class="error-info"></p>
                <p id="edit-email-success" class="success-info"></p>
                <div class="button-holder">
                    <input type="submit" id="edit-email-submit" class="btn btn-inverse btn-small" value="Submit">
                </div>
            </div>

            <div class="logout-holder">
                <button id="logout" class="btn btn-small btn-inverse">Logout</button>
            </div>

            <p class="dropdown-footer">Logging out will restart your game.</p>
        </div>
        <?php endif ?>
    </div>
</div>

<div id="notification-top" class="notification-holder"></div>