<?php
/**
 * @param verification
 * @param username
 */
?>

<div class="overlay">
    <div id="verify-email" class="window">
        <div class="header">
            <i class="fa fa-spinner fa-spin"></i>
            <p class="title">Verifying...</p>
        </div>

        <div class="content">
            <p class="message">
            </p>
            <button class="btn continue">Continue to <?= Yii::app()->name ?></button>
        </div>
    </div>
</div>

<script>
$('#verify-email').ready(function() {
    var verifyEmail = $('#verify-email');
    $.ajax({
        url: 'index.php/user/verifyEmail',
        type: 'POST',
        dataType: 'json',
        data: {
            username: <?= json_encode($username) ?>,
            verification: <?= json_encode($verification) ?>
        },
        success: function(data) {
            verifyEmail.find('.title').html(data.message);
            if (data.success) {
                verifyEmail.find('.message').html(
                    'Thank you for verifying your email address, '+
                    '<?= $username ?>. It can now be used to reset your '+
                    'password if you ever forget it. You can now close this '+
                    'window or use it to play <?= Yii::app()->name ?>.'
                );
            } else {
                verifyEmail.find('.message').html(
                    'Unfortunately, there was an error verifying your email '+
                    'address, <?= $username ?>. This is most likely because '+
                    'there have been too many failed attempts to verify this '+
                    'email address. Please request a new verification email '+
                    'from the account dropdown.'
                );
            }
            
        },
        error: function() {
            verifyEmail.find('.title').html('Error');
            verifyEmail.find('.message').html(
                'Unfortunately, there was an internal error verifying your '+
                'email address, <?= $username ?>. Please try again or contact '+
                'us.'
            );
        },
        complete: function() {
            verifyEmail.find('.header').find('.fa-spinner').fadeOut();
            verifyEmail.find('.content').fadeIn();
        }
    });

    verifyEmail.find('.continue').click(function() {
        $('.overlay').fadeOut();
    });
});
</script>
