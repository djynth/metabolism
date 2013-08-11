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
        setColorTheme($(this).siblings('#theme-holder').find('.btn.active').attr('value'), true);
    });

    $('input[type=text], input[type=password]').keypress(function(event) {
        if (event.which == 13) {
            $(this).parent().siblings().find('input[type=submit]').click();
        }
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
                    if (!data.message) {
                        data.message = 'Unknown Error';
                    }
                    $('#login-error').text(data.message);
                }
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
                    if (!data.message) {
                        data.message = 'Unknown Error';
                    }
                    $('#create-account-error').text(data.message);
                }
            }
        });
    });

    $('#logout').click(function() {
        $.ajax({
            url: 'index.php/user/logout',
            type: 'POST',
            dataType: 'json',
            complete: function(data) {
                location.reload();
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
                newPassword: $('#change-password-new').val(),
                confirm:  $('#change-password-confirm').val()
            },
            success: function(data) {
                if (data.success) {
                    $('#change-password-success').text(data.message);
                    $('#change-password-error').text('');
                    $('#change-password-current').val('');
                    $('#change-password-new').val('');
                    $('#change-password-confirm').val('');
                } else {
                    $('#change-password-error').text(data.message);
                    $('#change-password-success').text('');
                }
            }
        });
    });

    $('.forgot-password').hover(function() {
        $(this).animate({ width: $(this).css('max-width') });
        $(this).find('*').fadeIn();
    }, function() {
        $(this).animate({ width: $(this).css('min-width') });
        $(this).find('p, button').fadeOut();
    });

    $('.email-verified').hover(function() {
        $(this).animate({ width: $(this).css('max-width') });
        $(this).find('*').fadeIn();
    }, function() {
        $(this).animate({ width: $(this).css('min-width') });
        $(this).find('p, button').fadeOut();
    });

    $('.edit-email').hover(function() {
        $(this).animate({ width: $(this).css('max-width') });
        $(this).find('*').fadeIn();
    }, function() {
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
                var notification = $('<p>')
                    .text(data.message)
                    .addClass(data.success ? 'success' : 'error');
                notifyBottom(notification);
            }
        });
    });

    $('#resend-verification-email').click(function() {
        $.ajax({
            url: 'index.php/user/resendEmailVerification',
            type: 'POST',
            success: function(data) {
                var notification = $('<p>')
                    .text('Sent a verification email.')
                    .addClass('success');
                notifyBottom(notification);
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
                var notification = $('<p>')
                    .text(data.message)
                    .addClass(data.success ? 'success' : 'error');
                notifyBottom(notification);
                if (data.success) {
                    $('#email-info').val($('#edit-email-email').val());
                }
            }
        });
    });
});