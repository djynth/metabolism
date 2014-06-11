<?php
/**
 * @param verification
 * @param username
 */
?>

<div class="overlay">
    <div id="reset-password" class="window">
        <div class="header">
            <p class="title">Reset Password</p>
        </div>

        <form class="content">
            <input class="new-password" type="password"
                placeholder="New Password">
            <input class="confirm" type="password"
                placeholder="Confirm New Password">
            <input class="btn" type="submit" value="Submit">
            <p class="message"></p>
            <button class="btn continue">
                Continue to <?= Yii::app()->name ?>
            </button>
        </form>
    </div>
</div>

<script>
var resetPassword = $('#reset-password');
resetPassword.ready(function() {
    resetPassword.find('input[type=submit]').click(function(e) {
        e.preventDefault();
        resetPassword.find('.message').fadeOut();
        $.ajax({
            url: '/index.php/user/resetPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                username: <?= json_encode($username) ?>,
                verification: <?= json_encode($verification) ?>,
                new_password: resetPassword.find('.new-password').val()
            },
            success: function(data) {
                resetPassword.find('.message').promise().done(function() {
                    $(this).fadeIn().html(data.message);
                });
                if (data.success) {
                    resetPassword.find('.continue').fadeIn();
                }
            },
            error: function() {
                resetPassword.find('.message').promise().done(function() {
                    $(this).fadeIn().html(
                        'An internal error occurred. Please try again or '+
                        'contact us.'
                    );
                });
            }
        });
    });

    resetPassword.find('.continue').click(function() {
        $('.overlay').fadeOut();
    });
});
</script>