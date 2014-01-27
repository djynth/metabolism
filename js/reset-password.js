$(document).ready(function() {
    $('#code').focus();

    $('#submit').click(function(event) {
        event.preventDefault();

        var new_password = $('#new').val();
        var confirm = $('#confirm').val();

        if (new_password != confirm) {
            $('#message').addClass('error').removeClass('success').text('New password and confirmation do not match.');
        }

        $.ajax({
            url: 'resetPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#username').val(),
                verification: $('#code').val(),
                new_password: new_password,
            },
            success: function(data) {
                if (data.success) {
                    $('#message').addClass('success').removeClass('error').text(data.message);
                } else {
                    $('#message').addClass('error').removeClass('success').text(data.message);
                }
            },
            error: function() {
                $('#message').addClass('error').removeClass('success').text('An internal error occurred. Please try again.');
            }
        });
    });
});