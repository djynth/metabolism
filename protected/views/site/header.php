<?php
/**
 * @param user
 * @param organs
 */
?>

<div id="header">
    <div id="game-state" class="header-element">
        <div class="game-state-header">
            <p id="points" class="help-tooltip" data-placement="bottom" data-container="body" title="The number of points you have accumulated by running valuable pathways. Running some pathways earns points, so try to concentrate on them."></p>
            <p id="turns" class="help-tooltip" data-placement="bottom" data-container="body" max-turns="<?= Game::MAX_TURNS ?>" title="The number of turns you have remaining. Each time you run a pathway, even if you run it with a multiplier greater than 1, it consumes one turn."></p>
        </div>

        <div id="point-dropdown">
            <?php $this->renderPartial('limited_resources', array(
                'organs' => $organs,
            )); ?>
        </div>
    </div>
    <div id="undo" class="header-element">
        <p>Undo</p>
    </div>
    <div id="save" class="header-element">
        <p>Save/Load</p>
    </div>

    <div id="settings" class="header-element">
        <div class="settings-header">
            <p class="settings-text">Settings</p>
            <i class="icon-cog"></i>
        </div>

        <div class="settings-dropdown">
            <p>Color Theme</p>
            <div id="theme-holder" class="btn-group" data-toggle="buttons-radio">
                <?php foreach (glob("css/themes/light/*.css") as $css):
                    $theme = basename($css, '.css');
                    ?>
                <button value="<?= $theme ?>" theme-type="light" class="btn btn-small theme-option"><?= ucfirst($theme) ?></button>
                <?php endforeach ?>

                <?php foreach (glob("css/themes/dark/*.css") as $css):
                    $theme = basename($css, '.css');
                    ?>
                <button value="<?= $theme ?>" theme-type="dark" class="btn btn-small theme-option"><?= ucfirst($theme) ?></button>
                <?php endforeach ?>
            </div>

            <p>Help Tooltips</p>
            <div id="tooltip-toggle" class="btn-group" data-toggle="buttons-radio">
                <button value="on" class="btn btn-small">On</button>
                <button value="off" class="btn btn-small">Off</button>
            </div>
        </div>
    </div>

    <div id="account" class="header-element">
        <div class="account-header">
            <p class="login-text"><?= $user === null ? 'Not logged in' : 'Logged in as ' . $user->username ?></p>
            <i class="icon-user"></i>
        </div>

        <?php if ($user === null): ?>
        <div class="login-dropdown">
            <div class="login-holder">
                <p>Login</p>
                <div class="control-group">
                    <input id="login-username" type="text" placeholder="Username" class="input-themed">
                </div>
                <div class="control-group" id="login-control-group">
                    <input id="login-password" type="password" placeholder="Password" class="input-themed">
                    <div class="forgot-password">
                        <i class="icon-question-sign"> </i>
                        <button id="forgot-password-button" class="btn btn-mini help-tooltip" data-placement="bottom" title="If you've forgotten your password, enter your username above and press this button. A password recovery email will be sent the email address you have on file.">Forgot Password</button>
                    </div>
                </div>
                <div class="button-holder">
                    <input type="submit" id="login-submit" class="btn btn-inverse btn-small" value="Submit">
                </div>
            </div>
            <div class="create-account-holder">
                <p>Create Account</p>
                <div class="control-group account-tooltip-holder" data-placement="left" data-trigger="focus" title="A username uniquely identifies you to other players. Usernames must be 3-16 alphanumeric characters, dashes and underscores allowed. You may not change your username.">
                    <input id="create-account-username" type="text" placeholder="Username" class="input-themed check-username">
                </div>
                <div class="control-group account-tooltip-holder" data-placement="left" data-trigger="focus" title="Enter a valid email address which can be used to contact you. We will only use your email address to allow you to recover your password if you forget it.">
                    <input id="create-account-email" type="text" placeholder="Email Address" class="input-themed check-email">
                </div>
                <div class="control-group account-tooltip-holder" data-placement="left" data-trigger="focus" title="A password is used to authenticate your identity. Strong passwords contain a variety of characters and should not be repeated accross other services. Passwords must be 3-32 alphanumeric or punctuation characters.">
                    <input id="create-account-password" type="password" placeholder="Password" class="input-themed check-password" confirm="#create-account-confirm">
                </div>
                <div class="control-group account-tooltip-holder" data-placement="left" data-trigger="focus" title="Repeat your password to confirm that you typed it correctly.">
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
                    <input id="change-password-new" type="password" placeholder="New Password" class="input-themed check-password"
                           confirm="#change-password-confirm">
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
                        <p class="tooltip-holder" data-placement="bottom" data-container="#email-control-group" title="This email has been verified, so we can use it to help you recover your account if your password is lost or stolen.">Email Verified</p>
                    </div>

                    <?php else: ?>
                    <div class="email-verified" verified="false">
                        <i class="icon-remove"> </i>
                        <button id="resend-verification-email" class="btn btn-mini tooltip-holder" data-placement="bottom" data-container="#email-control-group" title="This email has not been verified as belonging to you, meaning we can't use it to help you recover your password if it is lost or stolen. You should have received a verification email when you signed up; click this button if you need another one.">Resend Verification Email</button>
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
