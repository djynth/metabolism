<?php
/**
 * @param user
 */
?>

<?php if ($user === null): ?>
    <h2>Log In</h2>

    <div class="form">
        <form id="login">
            <input type="text" class="username" placeholder="Username" verify="no" info="">

            <div class="add-on-holder">
                <input class="password" type="password" placeholder="Password" verify="no" info="">
                <div class="forgot-password add-on right">
                    <i class="fa fa-question-circle"></i>
                    <input class="btn mini" type="button" value="Forgot Password">
                </div>
            </div>

            <input class="submit btn small" type="submit" value="Submit">
        </form>

        <div class="form-info"></div>
    </div>

    <h2>Create Account</h2>

    <div class="form">
        <form id="create-account">
            <input type="text" class="username" placeholder="Username" info="Your username identifies you and is used to log in.<br>Requirements:<ul><li>3-16 alphanumeric characters, including - and _</li><li>not taken by another player</li></ul>">
            <input type="text" class="email" placeholder="Email Address" info="Your email address can be used to recover your account if you forget your password.<br>Requirements:<ul><li>valid email address, i.e. me@example.com</li><li>not used by another player</li></ul>">
            <input type="password" class="new-password" placeholder="Password" info="A password is used to verify yourself when logging in. Use a strong password and keep it secret.<br>Requirements:<ul><li>3-32 alphanumeric or punctuation characters</li></ul>">
            <input type="password" class="confirm" placeholder="Confirm Password" info="Repeat the password given above to make sure it's correct.">
            <input type="submit" class="submit btn small" value="Submit">
        </form>

        <div class="form-info"></div>
    </div>

    <p class="footer">Logging in or creating an account will restart your game.<br><br>You don't need an account to play the game, but it will allow you to access your saved games and settings from anywhere. Read about our policies on your data in the <a class="interior" href="about">About Us</a> section.</p>
    
<?php else: ?>
    <h2>Account</h2>

    <div id="account-info" username="<?= $user->username ?>">
        <p>Welcome, <?= $user->username ?></p>
        <button class="btn small" id="logout">Log Out</button>
    </div>

    <h2>Change Password</h2>

    <div class="form">
        <form id="change-password">
            <input type="password" class="password" placeholder="Current Password" verify="no" info="Enter your current password for authentication.">
            <input type="password" class="new-password" placeholder="New Password" info="Enter your new password.<br>Requirements:<ul><li>3-32 alphanumeric or punctuation characters</li></ul>">
            <input type="password" class="confirm" placeholder="Confirm New Password" info="Repeat the new password above to make sure it's correct.">
            <input type="submit" class="submit btn small" value="Submit">
        </form>

        <div class="form-info"></div>
    </div>

    <h2>Edit Email</h2>

    <div class="form">
        <form id="email-info" class="add-on-holder">
            <div class="add-on-holder">
                <input class="email" type="text" placeholder="Email" value="<?= $user->email ?>" disabled>

                <?php if ($user->email_verification->verified): ?>
                    <div class="verified add-on right" verified>
                        <i class="fa fa-check"></i>
                        <p>Email Verified</p>
                    </div>
                <?php else: ?>
                    <div class="verified add-on right">
                        <i class="fa fa-exclamation"></i>
                        <input type="button" class="resend-email btn mini" value="Resend Verification Email">
                    </div>
                <?php endif ?>

                <div class="edit-email add-on right">
                    <i class="fa fa-edit"> </i>
                    <input type="button" class="btn mini" value="Edit">
                </div>
            </div>

            <div id="edit-email">
                <input class="password" type="password" placeholder="Current Password" verify="no" info="Enter your current password for authentication.">
                <input class="email" type="text" placeholder="New Email" info="Enter your new email address.<br>Requirements:<ul><li>valid email address, i.e. me@example.com</li><li>not used by another player</li></ul>">
                <input class="submit btn small" type="submit" value="Submit">
            </div>
        </form>

        <div class="form-info"></div>
    </div>

    <h2>Delete Account</h2>

    <div class="form">
        <form id="delete-account">
            <input class="current-username" type="text" placeholder="Username" info="Enter your username to confirm that you want to permanently delete your account. All of your data (including settings and saved games) will be immediately deleted.">
            <input class="password" type="password" placeholder="Current Password" verify="no" info="Enter your current password for authentication.">
            <input class="submit btn small" type="submit" value="Delete">
        </form>

        <div class="form-info"></div>
    </div>
<?php endif ?>