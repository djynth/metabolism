var ACCOUNT_TOOLTIP_OFFSET = -10;       // move the tooltips associated with each text input by a certain px amount

$(document).ready(function() {
    $('.account-header').click(function() {
        $('.login-dropdown').slideToggle(function() {
            $(this).find('input').first().focus();
        });
    });

    $('.settings-header').click(function() {
        $('.settings-dropdown').slideToggle();
    });

    $('.theme-option').outerWidth(100/$('.theme-option').length + '%');

    $('.theme-option').click(function() {
        setColorTheme($(this).attr('value'), $(this).attr('theme-type'), true);
    });

    $('#tooltip-toggle').children().click(function() {
        setHelpTooltips($(this).attr('value') === 'on');
    });

    $('input[type=text], input[type=password]').keypress(function(event) {
        if (event.which == 13) {
            $(this).parent().siblings().find('input[type=submit]').click();
        }
    }).focus(function() {
        $(this).parent().tooltip('show');
        var tooltip = $(this).parent().next();      // gets the tooltip which was created in the previous line
        // adjusts the tooltip so that it is better placed relaitve to the edge of the account dropdown
        tooltip.css('left', parseInt(tooltip.css('left')) + ACCOUNT_TOOLTIP_OFFSET);
    }).blur(function() {
        $(this).parent().tooltip('hide');
    });

    $('.check-username').change(function() {
        $.ajax({
            url: 'index.php/user/validateUsername',
            type: 'POST',
            dataType: 'json',
            context: $(this),
            data: {
                username: $(this).val()
            },
            success: function(data) {
                $(this).parent().toggleClass('error', !data.valid);
            }
        });
    });

    $('.check-email').change(function() {
        $.ajax({
            url: 'index.php/user/validateEmail',
            type: 'POST',
            dataType: 'json',
            context: $(this),
            data: {
                email: $(this).val()
            },
            success: function(data) {
                $(this).parent().toggleClass('error', !data.valid);
            }
        });
    });

    $('.check-password').change(function() {
        var confirm = $($(this).attr('confirm'));
        confirm.parent().toggleClass('error', confirmMatch($(this), confirm));

        if ($(this).val()) {
            $.ajax({
                url: 'index.php/user/validatePassword',
                type: 'POST',
                dataType: 'json',
                context: $(this),
                data: {
                    password: $(this).val()
                },
                success: function(data) {
                    $(this).parent().toggleClass('error', !data.valid);
                }
            });    
        } else {
            $(this).parent().removeClass('error');
        }
    });

    $('.check-password').each(function() {
        var password = $(this);
        var confirm = $($(this).attr('confirm'));
        confirm.change(function() {
            confirm.parent().toggleClass('error', confirmMatch(password, confirm));
        });
    });

    $('#login-submit').click(function() {
        $.ajax({
            url: 'index.php/user/login',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#login-username').val(),
                password: $('#login-password').val()
            },
            success: function(data) {
                if (data.success) {
                    location.reload();
                } else {
                    notifyBottom(createNotification(data.message, false));
                }
            },
            error: function() {
                notifyInternalError();
            }
        });
    });

    $('#create-account-submit').click(function() {
        var password = $('#create-account-password').val();
        var confirm = $('#create-account-confirm').val();
        if (password != confirm) {
            notifyBottom(createNotification(
                'Password and confirmation do not match.',
                false
            ));
        } else {
            $.ajax({
                url: 'index.php/user/createAccount',
                type: 'POST',
                dataType: 'json',
                data: {
                    username: $('#create-account-username').val(),
                    password: password
                    email:    $('#create-account-email').val(),
                    theme:    colorTheme ? colorTheme : DEFAULT_THEME
                },
                success: function(data) {
                    if (data.success) {
                        location.reload();
                    } else {
                        notifyBottom(createNotification(data.message, false));
                    }
                },
                error: function() {
                    notifyInternalError();
                }
            });
        }
    });

    $('#logout').click(function() {
        $.ajax({
            url: 'index.php/user/logout',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                location.reload();
            },
            error: function() {
                notifyInternalError();
            }
        });
    });

    $('#change-password-submit').click(function() {
        var new_password = $('#change-password-new').val();
        var confirm = $('#change-password-confirm').val();
        if (new_password != confirm) {
            notifyBottom(createNotification(
                'New password and confirmation do not match.',
                false
            ));
        } else {
            $.ajax({
                url: 'index.php/user/changePassword',
                type: 'POST',
                dataType: 'json',
                data: {
                    current_password: $('#change-password-current').val(),
                    new_password: new_password,
                },
                success: function(data) {
                    notifyBottom(createNotification(data.message, data.success));
                    if (data.success) {
                        $('#change-password-current').val('');
                        $('#change-password-new').val('');
                        $('#change-password-confirm').val('');
                    }
                }
            });
        }
    });

    $('.forgot-password, .email-verified, .edit-email').hover(function() {
        var elem = $(this);
        $(this).data('timeout', setTimeout(function() {
            elem.animate({ width: elem.css('max-width') });
            elem.find('*').fadeIn();
        }, 250));
    }, function() {
        clearTimeout($(this).data('timeout'));
        $(this).animate({ width: $(this).css('min-width') });
        $(this).find('p, button').fadeOut();
    });

    $('#forgot-password-button').click(function() {
        $.ajax({
            url: 'index.php/user/forgotPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#login-username').val()
            },
            success: function(data) {
                notifyBottom(createNotification(data.message, data.success));
            },
            error: function() {
                notifyInternalError();
            }
        });
    });

    $('#resend-verification-email').click(function() {
        $.ajax({
            url: 'index.php/user/resendEmailVerification',
            type: 'POST',
            success: function(data) {
                notifyBottom(createNotification('A verification email was sent to your email address.', true));
            },
            error: function() {
                notifyInternalError();
            }
        });
    });

    $('#edit-email').click(function() {
        $('.edit-email-holder').slideToggle();
    });

    $('#edit-email-submit').click(function() {
        $.ajax({
            url: 'index.php/user/changeEmail',
            type: 'POST',
            dataType: 'json',
            data: {
                email: $('#edit-email-email').val(),
                password: $('#edit-email-password').val()
            },
            success: function(data) {
                notifyBottom(createNotification(data.message, data.success));
                if (data.success) {
                    $('#email-info').val($('#edit-email-email').val());
                }
            },
            error: function() {
                notifyInternalError();
            }
        });
    });
});

function notifyInternalError()
{
    notifyBottom(createNotification('An internal error occurred.', false));
}

function createNotification(message, success)
{
    return $('<p>').text(message).addClass(success ? 'success' : 'error');
}

function confirmMatch(password, confirm)
{
    return password.val() == confirm.val() || !password.val() || !confirm.val();
}
