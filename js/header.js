$(document).ready(function() {
    $('.account-header').click(function() {
        var dropdown = $('.login-dropdown');
        if (dropdown.is(':visible')) {
            dropdown.slideUp();
        } else {
            dropdown.slideDown(function() {
                dropdown.find('input').first().focus();
            });
        }
    });

    $('.settings-header').click(function() {
        $('.settings-dropdown').slideToggle();
    });

    $('#settings-apply').click(function() {
        setColorTheme($('#theme-holder').find('.btn.active').attr('value'), true);
        setHelpTooltips($('#help-toggle').find('input[type="checkbox"]').is(':checked'), true);
    });

    $('input[type=text], input[type=password]').keypress(function(event) {
        if (event.which == 13) {
            $(this).parent().siblings().find('input[type=submit]').click();
        }
    }).focus(function() {
        $(this).parent().tooltip('show');
        var tooltip = $(this).parent().next();
        tooltip.css('left', parseInt(tooltip.css('left')) - 10);
    }).blur(function() {
        $(this).parent().tooltip('hide');
    });

    $('.check-username').change(function() {
        var elem = $(this);
        $.ajax({
            url: 'index.php/user/validateUsername',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $(this).val()
            },
            success: function(data) {
                if (data.valid) {
                    elem.parent().removeClass('error');
                } else {
                    elem.parent().addClass('error');
                }
            }
        });
    });

    $('.check-email').change(function() {
        var elem = $(this);
        $.ajax({
            url: 'index.php/user/validateEmail',
            type: 'POST',
            dataType: 'json',
            data: {
                email: elem.val()
            },
            success: function(data) {
                if (data.valid) {
                    elem.parent().removeClass('error');
                } else {
                    elem.parent().addClass('error');
                }
            }
        });
    });

    $('.check-password').change(function() {
        var elem = $(this);
        $.ajax({
            url: 'index.php/user/validatePassword',
            type: 'POST',
            dataType: 'json',
            data: {
                password: $(this).val()
            },
            success: function(data) {
                if (data.valid) {
                    elem.parent().removeClass('error');
                } else {
                    elem.parent().addClass('error');
                }
            }
        });
    });

    $('#create-account-password').change(function() {
        var confirm = $('#create-account-confirm');
        if (confirm.val() && $(this).val() != confirm.val()) {
            confirm.parent().addClass('error');
        } else {
            confirm.parent().removeClass('error');
        }
    });

    $('#change-password-new').change(function() {
        var confirm = $('#change-password-confirm');
        if (confirm.val() && $(this).val() != confirm.val()) {
            confirm.parent().addClass('error');
        } else {
            confirm.parent().removeClass('error');
        }
    });

    $('#create-account-confirm').change(function() {
        if ($(this).val() && $(this).val() != $('#create-account-password').val()) {
            $(this).parent().addClass('error');
        } else {
            $(this).parent().removeClass('error');
        }
    });

    $('#change-password-confirm').change(function() {
        if ($(this).val() && $(this).val() != $('#change-password-new').val()) {
            $(this).parent().addClass('error');
        } else {
            $(this).parent().removeClass('error');
        }
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
                notifyBottom(createNotification('An internal error occurred.', false));
            }
        });
    });

    $('#create-account-submit').click(function() {
        $.ajax({
            url: 'index.php/user/createAccount',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#create-account-username').val(),
                password: $('#create-account-password').val(),
                confirm:  $('#create-account-confirm').val(),
                email:    $('#create-account-email').val(),
                theme:    color_theme ? color_theme : DEFAULT_THEME
            },
            success: function(data) {
                if (data.success) {
                    location.reload();
                } else {
                    notifyBottom(createNotification(data.message, false));
                }
            },
            error: function() {
                notifyBottom(createNotification('An internal error occurred.', false));
            }
        });
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
                notifyBottom(createNotification('An internal error occurred.', false));
            }
        });
    });

    $('#change-password-submit').click(function() {
        $.ajax({
            url: 'index.php/user/changePassword',
            type: 'POST',
            dataType: 'json',
            data: {
                current: $('#change-password-current').val(),
                new_password: $('#change-password-new').val(),
                confirm:  $('#change-password-confirm').val()
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
    });

    $('.forgot-password, .email-verified, .edit-email').hover(function() {
        var elem = $(this);
        var t = setTimeout(function() {
            console.log(elem);
            elem.animate({ width: elem.css('max-width') });
            elem.find('*').fadeIn();
        }, 250);
        $(this).data('timeout', t);
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
                notifyBottom(createNotification('An internal error occurred.', false));
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
                notifyBottom(createNotification('An internal error occurred.', false));
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
                notifyBottom(createNotification('An internal error occurred.', false));
            }
        });
    });
});

function createNotification(message, success)
{
    return $('<p>').text(message).addClass(success ? 'success' : 'error');
}
