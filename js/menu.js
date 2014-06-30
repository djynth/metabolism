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
        }
    });

    MENU.find('.theme').find('.select').click(function() {
        var theme = $(this).parents('.theme');
        setColorTheme(theme.attr('theme'), theme.attr('type'), true);
    });

    MENU.find('.form').find('input[type=text], input[type=password]')
        .focusin(function() {
            $(this).parents('.form').find('.form-info')
                .addClass('active')
                .html($(this).attr('info'));
        })
        .focusout(function() {
            $(this).parents('.form').find('.form-info')
                .removeClass('active')
                .html('');
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

    $('#login').submit(function() {
        if ($(this).find('input.error').length === 0) {
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
                        notify(data.message, 'warning');
                    }
                },
                error: function() {
                    notify(INTERNAL_ERROR, 'error');
                }
            });
        }
        return false;
    });

    $('#create-account').submit(function() {
        if ($(this).find('input.error').length === 0) {
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
                        notify(data.message, 'warning');
                    }
                },
                error: function() {
                    notify(INTERNAL_ERROR, 'error');
                }
            });
        }
        return false;
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
