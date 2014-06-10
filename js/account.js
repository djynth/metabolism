var LOGIN;
var CREATE_ACCOUNT;
var CHANGE_PASSWORD;
var EDIT_EMAIL_AUTHENTICATION;
var INTERNAL_ERROR = 'An internal error occurred.';

$(document).ready(function() {
    LOGIN = $('#login');
    CREATE_ACCOUNT = $('#create-account');
    CHANGE_PASSWORD = $('#change-password');
    EDIT_EMAIL_AUTHENTICATION = $('#edit-email-authentication');

    $('input[type=text], input[type=password]').keypress(function(event) {
        if (event.which == 13) {    // enter
            $(this).parents('form').find('input.submit').click();
        }
    });

    $('.username').change(function() {
        validate($(this), 'username');
    });

    $('.email').change(function() {
        validate($(this), 'email');
    });

    $('.new-password').change(function() {
        validate($(this), 'password');
    }).each(function() {
        var password = $(this);
        var confirm = $(this).siblings('.confirm');
        confirm.add(password).change(function() {
            confirm.toggleClass('error', !match(password, confirm));
        });
    });

    $('.forgot-password, .verified, .edit-email').hover(
        function() {
            var elem = $(this);
            $(this).data('timeout', setTimeout(function() {
                elem.animate({ width: elem.css('max-width') }, {
                    progress: function() {
                        $(this).nextAll('.add-on').css(
                            'right',
                            parseInt($(this).css('right')) + $(this).width()
                        );
                    }
                });
                elem.find('*').fadeIn();
            }, 250));
        },
        function() {
            clearTimeout($(this).data('timeout'));
            $(this).animate({ width: $(this).css('min-width') }, {
                    progress: function() {
                        $(this).nextAll('.add-on').css(
                            'right',
                            parseInt($(this).css('right')) + $(this).width()
                        );
                    }
                });
            $(this).find('*:not(i)').fadeOut();
        }
    );

    $('.forgot-password').find('input[type=button]').click(function() {
        $.ajax({
            url: 'index.php/user/forgotPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                username: LOGIN.find('.username').val()
            },
            success: function(data) {
                notify(data.message, data.success ? 'normal' : 'warning');
            },
            error: function() {
                notify(INTERNAL_ERROR, 'error');
            }
        });
    });

    $('.resend-email').click(function() {
        $.ajax({
            url: 'index.php/user/resendEmailVerification',
            type: 'POST',
            success: function(data) {
                notify(data.message, data.success ? 'normal' : 'warning');
            },
            error: function() {
                notify(INTERNAL_ERROR, 'error');
            }
        });
    });

    $('#logout').click(function() {
        $.ajax({
            url: 'index.php/user/logout',
            type: 'POST',
            dataType: 'json',
            complete: function() {
                location.reload();
            }
        });
    });

    $('#edit-email').click(function() {
        EDIT_EMAIL_AUTHENTICATION.slideToggle();
    });

    LOGIN.find('.submit').click(function() {
        $.ajax({
            url: 'index.php/user/login',
            type: 'POST',
            dataType: 'json',
            data: {
                username: LOGIN.find('.username').val(),
                password: LOGIN.find('.password').val()
            },
            success: function(data) {
                if (data.success) {
                    location.reload();
                } else {
                    notify(data.message, 'warning');
                }
            },
            error: function() {
                notify(INTERNAL_ERROR, 'error');
            }
        });
    });

    CREATE_ACCOUNT.find('.submit').click(function() {
        if (!hasError(CREATE_ACCOUNT)) {
            var theme = getColorTheme();
            $.ajax({
                url: 'index.php/user/createAccount',
                type: 'POST',
                dataType: 'json',
                data: {
                    username:   CREATE_ACCOUNT.find('.username').val(),
                    password:   CREATE_ACCOUNT.find('.new-password').val(),
                    email:      CREATE_ACCOUNT.find('.email').val(),
                    theme:      theme.theme,
                    theme_type: theme.type
                },
                success: function(data) {
                    if (data.success) {
                        location.reload();
                    } else {
                        notify(data.message, 'warning');
                    }
                },
                error: function() {
                    notify(INTERNAL_ERROR, 'error');
                }
            });
        }
    });

    CHANGE_PASSWORD.find('.submit').click(function() {
        if (!hasError(CHANGE_PASSWORD)) {
            $.ajax({
                url: 'index.php/user/changePassword',
                type: 'POST',
                dataType: 'json',
                data: {
                    current_password: 
                        CHANGE_PASSWORD.find('.current-password').val(),
                    new_password: CHANGE_PASSWORD.find('.new-password').val()
                },
                success: function(data) {
                    if (data.success) {
                        CHANGE_PASSWORD.find('input[type=password]').val('');
                        notify(data.message, 'normal');
                    } else {
                        notify(data.message, 'warning');
                    }
                },
                error: function() {
                    notify(INTERNAL_ERROR, 'error');
                }
            });
        }
    });

    EDIT_EMAIL_AUTHENTICATION.find('.submit').click(function() {
        if (!hasError(EDIT_EMAIL_AUTHENTICATION)) {
            $.ajax({
                url: 'index.php/user/changeEmail',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: EDIT_EMAIL_AUTHENTICATION.find('.email').val(),
                    password: EDIT_EMAIL_AUTHENTICATION.find('.password').val()
                },
                success: function(data) {
                    if (data.success) {
                        $('#email-info').find('.email').val(
                            EDIT_EMAIL_AUTHENTICATION.find('.email').val()
                        );
                        EDIT_EMAIL_AUTHENTICATION.slideUp();
                        notify(data.message, 'normal');
                    } else {
                        notify(data.message, 'warning');
                    }
                },
                error: function() {
                    notify(INTERNAL_ERROR, 'error');
                }
            });
        }
    });
});

function match(password, confirm)
{
    return password.val() == confirm.val() || password.val() == '' ||
           confirm.val() == '';
}

function validate(input, type)
{
    input.removeClass('error');
    if (input.val()) {
        $.ajax({
            url: 'index.php/user/validate',
            type: 'POST',
            dataType: 'json',
            context: $(this),
            data: {
                type: type,
                value: input.val()
            },
            success: function(data) {
                input.toggleClass('error', !data.valid);
            }
        });
    }
}

function hasError(form)
{
    var error = false;
    form.find('input:not(.submit)').each(function() {
        if ($(this).hasClass('error')) {
            error = true;
            return false;
        }
    });
    return error;
}
