var ACCOUNT_TOOLTIP_OFFSET = -10;       // move the tooltips associated with each text input by a certain px amount

$(document).ready(function() {
    $('input[type=text], input[type=password]').keypress(function(event) {
        if (event.which == 13) {    // enter
            $(this).siblings('input[type=submit]').click();
        }
    });

    $('.username').change(function() {
        if ($(this).val()) {
            $.ajax({
                url: 'index.php/user/validateUsername',
                type: 'POST',
                dataType: 'json',
                context: $(this),
                data: {
                    username: $(this).val()
                },
                success: function(data) {
                    $(this).toggleClass('error', !data.valid);
                }
            });
        } else {
            $(this).removeClass('error');
        }
    });

    $('.email').change(function() {
        if ($(this).val()) {
            $.ajax({
                url: 'index.php/user/validateEmail',
                type: 'POST',
                dataType: 'json',
                context: $(this),
                data: {
                    email: $(this).val()
                },
                success: function(data) {
                    $(this).toggleClass('error', !data.valid);
                }
            });
        } else {
            $(this).removeClass('error');
        }
    });

    $('.new-password').change(function() {
        var confirm = $($(this).attr('confirm'));
        confirm.toggleClass('error', !match($(this), confirm));

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
                    $(this).toggleClass('error', !data.valid);
                }
            });    
        } else {
            $(this).removeClass('error');
        }
    }).each(function() {
        var password = $(this);
        var confirm = $(this).siblings('.confirm');
        confirm.change(function() {
            confirm.parent().toggleClass('error', !match(password, confirm));
        });
    });

    $('#login').find('.submit').click(function() {
        var login = $('#login');
        $.ajax({
            url: 'index.php/user/login',
            type: 'POST',
            dataType: 'json',
            data: {
                username: login.find('.username').val(),
                password: login.find('.password').val()
            },
            success: function(data) {
                if (data.success) {
                    location.reload();
                }
            }
        });
    });

    $('#create-account').find('.submit').click(function() {
        var createAccount = $('#create-account');
        var password = createAccount.find('.new-password').val();
        var confirm = createAccount.find('.confirm').val();
        if (password === confirm) {
            var theme = getColorTheme();
            $.ajax({
                url: 'index.php/user/createAccount',
                type: 'POST',
                dataType: 'json',
                data: {
                    username:   createAccount.find('.username').val(),
                    password:   password,
                    email:      createAccount.find('.email').val(),
                    theme:      theme.theme,
                    theme_type: theme.type
                },
                success: function(data) {
                    if (data.success) {
                        location.reload();
                    }
                }
            });
        }
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

    $('#change-password').find('.submit').click(function() {
        var changePassword = $('#change-password');
        var password = changePassword.find('.new-password').val();
        var confirm = changePassword.find('.confirm').val();
        if (password === confirm) {
            $.ajax({
                url: 'index.php/user/changePassword',
                type: 'POST',
                dataType: 'json',
                data: {
                    current_password: changePassword.find('.current_password').val(),
                    new_password: new_password
                },
                success: function(data) {
                    if (data.success) {
                        $('.change-password').find('input[type=password]').val('');
                    }
                }
            });
        }
    });

    $('.forgot-password, .verified, .edit-email').hover(function() {
        var elem = $(this);
        $(this).data('timeout', setTimeout(function() {
            elem.animate({ width: elem.css('max-width') });
            elem.find('*').fadeIn();
        }, 250));
    }, function() {
        clearTimeout($(this).data('timeout'));
        $(this).animate({ width: $(this).css('min-width') });
        $(this).find('*:not(i)').fadeOut();
    });

    $('.forgot-password').find('input[type=button]').click(function() {
        $.ajax({
            url: 'index.php/user/forgotPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#login').find('.username').val()
            },
            success: function(data) {
                
            }
        });
    });

    $('.resend-email').click(function() {
        $.ajax({
            url: 'index.php/user/resendEmailVerification',
            type: 'POST',
            success: function(data) {
                
            }
        });
    });

    $('#edit-email').click(function() {
        $('.edit-email-authentication').slideToggle();
    });

    $('#edit-email-authentication').find('.submit').click(function() {
        var editEmailAuthentication = $('#edit-email-authentication');
        $.ajax({
            url: 'index.php/user/changeEmail',
            type: 'POST',
            dataType: 'json',
            data: {
                email: editEmailAuthentication.find('.email').val(),
                password: editEmailAuthentication.find('.password').val()
            },
            success: function(data) {
                if (data.success) {
                    $('.email-info').find('.email').val(editEmailAuthentication.find('.email').val());
                }
            }
        });
    });
});

function match(password, confirm)
{
    return password.val() == confirm.val() || password.val() == '' ||
           confirm.val() == '';
}
