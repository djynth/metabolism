<?php
/**
 * @param user
 */
?>

<div id="account" class="header-element">
    <div class="title">
        <p><?= $user === null ? 'Not logged in' : 'Logged in as ' . $user->username ?></p>
        <i class="icon-user"></i>
    </div>

    <div class="dropdown">
        <?php if ($user === null): ?>
            <form id="login">
                <p>Login</p>
                <input class="username" type="text" placeholder="Username">
                
                <div>
                    <input class="password" type="password" placeholder="Password">
                    <div class="forgot-password add-on">
                        <i class="icon-question-sign"></i>
                        <input class="btn btn-mini" type="button" value="Forgot Password">
                    </div>
                </div>

                <div class="submit-holder">
                    <input class="submit btn btn-small" type="button" value="Submit">
                </div>
            </form>
            <form id="create-account">
                <p>Create Account</p>
                <input class="username" type="text" placeholder="Username">
                <input class="email" type="text" placeholder="Email Address">
                <input class="new-password" type="password" placeholder="Password">
                <input class="confirm" type="password" placeholder="Confirm Password">
                <div class="submit-holder">
                    <input class="submit btn btn-small" type="button" value="Submit">
                </div>
            </form>

            <p class="footer">Logging in or creating an account will restart your game.</p>
        <?php else: ?>
            <form id="change-password">
                <p>Change Password</p>
                <input class="current-password" type="password" placeholder="Current Password">
                <input class="new-password" type="password" placeholder="New Password">
                <input class="confirm" type="password" placeholder="Confirm New Password">
                <div class="submit-holder">
                    <input class="submit btn btn-small" type="button" value="Submit">
                </div>
            </form>

            <form id="email-info">
                <p>Email</p>
                <div>
                    <input class="email" type="text" placeholder="Email" value="<?= $user->email ?>" disabled>

                    <?php if ($user->email_verified): ?>
                        <div class="verified add-on" verified>
                            <i class="icon-ok"></i>
                            <p>Email Verified</p>
                        </div>
                    <?php else: ?>
                        <div class="verified add-on">
                            <i class="icon-remove"></i>
                            <button class="resend-email btn btn-mini">Resend Verification Email</button>
                        </div>
                    <?php endif ?>

                    <div class="edit-email add-on">
                        <i class="icon-edit"> </i>
                        <button id="edit-email" class="btn btn-mini">Edit</button>
                    </div>
                </div>
            </form>

            <form id="edit-email-authentication">
                <input class="password" type="password" placeholder="Current Password">
                <input class="email" type="text" placeholder="New Email">
                <div class="submit-holder">
                    <input class="submit btn btn-small" type="button" value="Submit">
                </div>
            </form>

            <button id="logout" class="btn btn-small">Logout</button>
            <p class="footer">Logging out will restart your game.</p>
        <?php endif ?>
    </div>
</div>
