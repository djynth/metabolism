$(document).ready(function() {
    $('#verify-code').focus();

    $('#verify-submit').click(function(event) {
        event.preventDefault();
        var message = $('.verify-message');

        $.ajax({
            url: 'verifyEmail',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#verify-username').val(),
                verification: $('#verify-code').val()
            },
            success: function(data) {
                if (data.success) {
                    message.addClass('success').removeClass('error').text(data.message);
                } else {
                    message.addClass('error').removeClass('success').text(data.message);
                }
            },
            error: function() {
                message.addClass('error').removeClass('success').text('There was an unknown error trying to validate your email.');
            }
        });
    });
});