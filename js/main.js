var DEFAULT_THEME = 'dark';

var DEFAULT_NOTIFICATION_DURATION = 5000;

var pathwayContentHeight = null;
var resourceContentHeight = null;

$(document).ready(function() {
    setColorTheme(color_theme);

    $(window).resize(function() { updateScrollbars(true); });

    $('.account-header').click(function() {
        var dropdown = $('.login-dropdown');
        if (dropdown.is(':visible')) {
            dropdown.slideUp();
        } else {
            dropdown.slideDown(function() {
                $('#change-password-current, #login-username').focus();
            });
        }
    });

    $('.settings-header').click(function() {
        $('.settings-dropdown').slideToggle();
    });

    $('#settings-apply').click(function() {
        var theme = $(this).siblings('#theme-holder').find('.btn.active').attr('value');

        setColorTheme(theme, true);
    });

    $('#create-account-username, #create-account-password, #create-account-confirm, #create-account-email').keypress(function(event) {
        if (event.which == 13) {
            $('#create-account-submit').click();
        }
    });

    $('#login-username, #login-password').keypress(function(event) {
        if (event.which == 13) {
            $('#login-submit').click();
        }
    });

    $('#change-password-current, #change-password-new, #change-password-confirm').keypress(function(event) {
        if (event.which == 13) {
            $('#change-password-submit').click();
        }
    });

    $('#create-account-username').change(function() {
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

    $('#create-account-email').change(function() {
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

    $('#create-account-password, #change-password-new').change(function() {
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
        $(this).find('#forgot-password-button').fadeIn();
    }, function() {
        $(this).animate({ width: $(this).css('min-width') });
        $(this).find('#forgot-password-button').fadeOut();
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
});

function initScrollbars()
{
    $('.scrollbar-content').each(function() {
        $(this).mCustomScrollbar({
            autoHideScrollbar: true,
            scrollInertia: 350,
            theme: "dark",
        });
    });
}

function getPathwayContentHeight()
{
    if (pathwayContentHeight === null) {
        pathwayContentHeight = $(window).height() - $('#pathway-holder').find('.accordian-header').first().offset().top;
        $('#pathway-holder .accordian-header').each(function() {
            pathwayContentHeight -= $(this).outerHeight();
        });
    }

    return pathwayContentHeight;
}

function getResourceContentHeight()
{
    if (resourceContentHeight === null) {
        resourceContentHeight = $(window).height() - 
            $('#resource-holder').find('.accordian-header').first().offset().top - $('#resource-visual').outerHeight();
        $('#resource-holder .accordian-header').each(function() {
            resourceContentHeight -= $(this).outerHeight();
        });
    }
    
    return resourceContentHeight;
}

function updateScrollbars(updateHeight)
{
    if (updateHeight) {
        pathwayContentHeight = null;
        resourceContentHeight = null;
    }

    $('.scrollbar-content').each(function() {
        if (updateHeight) {
            if ($(this).hasClass('active')) {
                if ($(this).hasClass('pathway-holder')) {
                    $(this).height(getPathwayContentHeight());
                } else {
                    $(this).height(getResourceContentHeight());
                }
            } else {
                $(this).height(0);
            }
        }
        
        $(this).mCustomScrollbar('update');
    });
}

function setTurn(turn, maxTurns)
{
    $('#turns').text(turn + '/' + maxTurns + ' Turns Remaining');
}

function setPoints(points)
{
    $('#points').text(points + ' Points');
}

function setColorTheme(theme, save)
{
    if (typeof theme === 'undefined' || theme === null) {
        theme = DEFAULT_THEME;
    }

    color_theme = theme;
    applyColorTheme($('body'));

    if (theme === 'light') {
        $('#theme-dark').addClass('btn-inverse').removeClass('active');
        $('#theme-light').addClass('active');
    } else if (theme === 'dark') {
        $('#theme-light').removeClass('btn-inverse').removeClass('active');
        $('#theme-dark').addClass('active');
    }

    if (save) {
        $.ajax({
            url: 'index.php/user/saveTheme',
            type: 'POST',
            dataType: 'json',
            data: {
                theme: theme
            }
        });
    }
}

function applyColorTheme(base)
{
    if (color_theme === 'light') {
        base.removeClass('theme_dark').addClass('theme_light');
        base.find('*').removeClass('theme_dark').addClass('theme_light');
        base.find('i').removeClass('icon-white');
        base.find('.btn').removeClass('btn-inverse');
    } else if (color_theme === 'dark') {
        base.removeClass('theme_light').addClass('theme_dark');
        base.find('*').removeClass('theme_light').addClass('theme_dark');
        base.find('i').addClass('icon-white');
        base.find('.btn').addClass('btn-inverse');
    }
    return base;
}

function notifyTop(html, duration)
{
    if (typeof duration === 'undefined') {
        duration = DEFAULT_NOTIFICATION_DURATION;
    }

    var elem = $('#notification-top');

    elem.empty().hide();

    applyColorTheme(elem.append(html)).slideDown(function() {
        setTimeout(function() {
            elem.slideUp(function() {
                elem.empty();
            });
        }, duration);
    });
}

function notifyBottom(html, duration)
{
    if (typeof duration === 'undefined') {
        duration = DEFAULT_NOTIFICATION_DURATION;
    }

    var elem = $('#notification-bottom');

    elem.empty().hide();

    applyColorTheme(elem.append(html)).slideDown(function() {
        setTimeout(function() {
            elem.slideUp(function() {
                elem.empty();
            });
        }, duration);
    });
}
