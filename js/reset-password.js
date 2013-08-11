$(document).ready(function() {
    $('#code').focus();

    $('#submit').click(function(event) {
        event.preventDefault();

        $.ajax({
            url: 'resetPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#username').val(),
                verification: $('#code').val(),
                new_password: $('#new').val(),
                confirm: $('#confirm').val() 
            },
            success: function(data) {
                if (data.success) {
                    $('#message').addClass('success').removeClass('error').text(data.message);
                } else {
                    $('#message').addClass('error').removeClass('success').text(data.message);
                }
            },
            error: function() {
                $('#message').addClass('error').removeClass('success').text('There was an unknown error trying to reset your password.');
            }
        });
    });
});