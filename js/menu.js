var MENU;
var INTERNAL_ERROR = 'An internal error occurred.';

$(document).ready(function() {
    MENU = $('#menu');

    MENU.find('.tab').click(function() {
        if (!$(this).hasClass('active')) {
            MENU.find('.tab.active').removeClass('active');
            MENU.find('.content.active').removeClass('active');

            $(this).addClass('active');
            MENU.find('.content.' + $(this).attr('for')).addClass('active');

            resizeModes();
        }
    });

    MENU.find('.theme').find('.select').click(function() {
        var theme = $(this).parents('.theme');
        setColorTheme(theme.attr('theme'), theme.attr('type'), true);
    });

    MENU.find('.form').find('input[type=text], input[type=password]')
        .focusin(function() {
            $(this).parents('.form').find('.form-info')
                .removeClass('error')
                .addClass('active')
                .html($(this).attr('info'));
        })
        .focusout(function() {
            $(this).parents('.form').find('.form-info')
                .removeClass('error')
                .removeClass('active')
                .html('');
        })
        .change(function() {
            if ($(this).hasClass('username') && $(this).attr('verify') !== 'no') {
                validate($(this), 'username');
            }
            if ($(this).hasClass('email') && $(this).attr('verify') !== 'no') {
                validate($(this), 'email');
            }
            if ($(this).hasClass('new-password') && $(this).attr('verify') !== 'no') {
                validate($(this), 'password');
            }

            if ($(this).hasClass('confirm') || $(this).hasClass('new-password')) {
                var password = $(this).parent().children('.new-password');
                var confirm = $(this).parent().children('.confirm');
                confirm.toggleClass('error', !match(confirm, password));
            }
        });

    MENU.find('.mode')
        .hover(
            function() {
                var details = $(this).find('.details');
                var t = setTimeout(function() {
                    details.slideDown();
                }, 500);
                $(this).data('timeout', t);
            },
            function() {
                clearTimeout($(this).data('timeout'));
                $(this).find('.details').slideUp();
            }
        )
        .click(function() {
            $(this).siblings('.mode').each(function() {
                $(this).removeClass('active');
                $(this).find('.label').slideDown();
            })

            $(this).toggleClass('active');
            $(this).find('.label').slideToggle();

            if ($(this).hasClass('active')) {
                var mode = $(this).attr('mode');
                $(this).parents('.content').find('.mode-info').each(function() {
                    $(this).toggle($(this).attr('mode') === mode);
                });
            } else {
                $(this).parents('.content').find('.mode-info').hide();
            }
        });

    MENU.find('.mode-info[mode=challenge]').find('.challenges').change(function() {
        $(this).siblings('.details').hide().filter('[challenge=' + $(this).val() + ']').show();
    });

    $('#login').submit(function() {
        var form = $(this);
        if (form.find('input.error').length === 0) {
            $.ajax({
                url: '/index.php/user/login',
                type: 'POST',
                dataType: 'json',
                data: {
                    username: $(this).find('.username').val(),
                    password: $(this).find('.password').val()
                },
                success: function(data) {
                    if (data.success) {
                        location.reload();
                    } else {
                        form.siblings('.form-info')
                            .addClass('active error')
                            .html(data.message);
                    }
                },
                error: function() {
                    form.siblings('.form-info')
                        .addClass('active error')
                        .html(INTERNAL_ERROR);
                }
            });
        }
        return false;
    });

    $('.forgot-password').find('input[type=button]').click(function() {
        var form = $(this).parents('form');
        $.ajax({
            url: '/index.php/user/forgotPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                username: form.find('.username').val()
            },
            success: function(data) {
                form.siblings('.form-info')
                    .addClass('active' + (data.success ? '' : ' error'))
                    .html(data.message);
            },
            error: function() {
                form.siblings('.form-info')
                    .addClass('active error')
                    .html(INTERNAL_ERROR);
            }
        });
    });

    $('#create-account').submit(function() {
        var form = $(this);
        if (form.find('input.error').length === 0) {
            var theme = getColorTheme();
            $.ajax({
                url: '/index.php/user/createAccount',
                type: 'POST',
                dataType: 'json',
                data: {
                    username:   $(this).find('.username').val(),
                    password:   $(this).find('.new-password').val(),
                    email:      $(this).find('.email').val(),
                    theme:      theme.theme,
                    theme_type: theme.type
                },
                success: function(data) {
                    if (data.success) {
                        location.reload();
                    } else {
                        form.siblings('.form-info')
                            .addClass('active error')
                            .html(data.message);
                    }
                },
                error: function() {
                    form.siblings('.form-info')
                        .addClass('active error')
                        .html(INTERNAL_ERROR);
                }
            });
        }
        return false;
    });

    $('#email-info').submit(function() {
        var form = $(this);
        if (form.find('input.error').length === 0) {
            var newEmail = form.find('#edit-email').find('.email').val();
            $.ajax({
                url: '/index.php/user/changeEmail',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: newEmail,
                    password: form.find('.password').val()
                },
                success: function(data) {
                    if (data.success) {
                        form.find('.email').val(newEmail);
                        form.find('#edit-email')
                            .slideUp()
                            .find('input[type=text]').val('');
                        form.siblings('.form-info')
                            .addClass('active')
                            .html(data.message);
                    } else {
                        form.siblings('.form-info')
                            .addClass('active error')
                            .html(data.message);
                    }
                },
                error: function() {
                    form.siblings('.form-info')
                        .addClass('active error')
                        .html(INTERNAL_ERROR);
                }
            });
            form.find('input[type=password]').val('');
        }
        return false;
    });

    $('.edit-email').find('input[type=button]').click(function() {
        $(this).parents('form').find('#edit-email').slideToggle();
    });

    $('.resend-email').click(function() {
        var form = $(this).parents('form');
        $.ajax({
            url: '/index.php/user/resendEmailVerification',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                form.siblings('.form-info')
                    .addClass('active' + (data.success ? '' : ' error'))
                    .html(data.message);
            },
            error: function() {
                form.siblings('.form-info')
                    .addClass('active error')
                    .html(INTERNAL_ERROR);
            }
        });
    });

    $('#logout').click(function() {
        $.ajax({
            url: '/index.php/user/logout',
            type: 'POST',
            dataType: 'json',
            complete: function() {
                location.reload();
            }
        });
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
            url: '/index.php/user/validate',
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

function resizeModes()
{
    MENU.find('.mode').each(function() {
        $(this).css('font-size', 0.8*$(this).width());
    });
}
