$(document).ready(function() {
    updateTrackerSize();

    setColorTheme(color_theme);

    $(window).resize(function() { updateScrollbars(true); updateTrackerSize(); });

    $('.account-header').click(function() {
        $('.login-dropdown').slideToggle();
    });

    $('.settings-header').click(function() {
        $('.settings-dropdown').slideToggle();
    });

    $('#settings-apply').click(function() {
        var theme = $(this).siblings('#theme-holder').find('.btn.active').attr('value');

        setColorTheme(theme);
    });

    $('#create-account-username').change(function() {
        var elem = $(this);
        $.ajax({
            url: 'index.php?r=user/validateUsername',
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

    $('#create-account-password,#change-password-new').change(function() {
        var elem = $(this);
        $.ajax({
            url: 'index.php?r=user/validatePassword',
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

        var confirm = $('#create-account-confirm');
        if (confirm.val() && $(this).val() != confirm.val()) {
            confirm.parent().addClass('error');
        } else {
            confirm.parent().removeClass('error');
        }
    });

    $('#create-account-confirm').change(function() {
        var password = $('#create-account-password');

        if ($(this).val() && $(this).val() != password.val()) {
            $(this).parent().addClass('error');
        } else {
            $(this).parent().removeClass('error');
        }
    });

    $('#change-password-confirm').change(function() {
        var password = $('#change-password-new');

        if ($(this).val() && $(this).val() != password.val()) {
            $(this).parent().addClass('error');
        } else {
            $(this).parent().removeClass('error');
        }
    });

    $('#login-submit').click(function() {
        $.ajax({
            url: 'index.php?r=user/login',
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
            url: 'index.php?r=user/createAccount',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#create-account-username').val(),
                password: $('#create-account-password').val(),
                confirm:  $('#create-account-confirm').val()
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
            url: 'index.php?r=user/logout',
            type: 'POST',
            dataType: 'json',
            complete: function(data) {
                location.reload();
            }
        });
    });

    $('#change-password-submit').click(function() {
        $.ajax({
            url: 'index.php?r=user/changePassword',
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
    var h = $(window).height() - $('#pathway-holder').find('.accordian-header').first().offset().top;
    $('#pathway-holder .accordian-header').each(function() {
        h -= $(this).outerHeight();
    });
    return h;
}

function getResourceContentHeight()
{
    var h = $(window).height() - $('#resource-holder').find('.accordian-header').first().offset().top - $('#resource-visual').outerHeight();
    $('#resource-holder .accordian-header').each(function() {
        h -= $(this).outerHeight();
    });
    return h;
}

function updateScrollbars(updateHeight)
{
    $('.scrollbar-content').each(function() {
        if (updateHeight) {
            if ($(this).hasClass('active')) {
                    if ($(this).hasClass('pathway-holder')) {
                    $(this).css('height', getPathwayContentHeight());
                } else {
                    $(this).css('height', getResourceContentHeight());
                }
            } else {
                $(this).css('height', 0);
            }
        }
        
        $(this).mCustomScrollbar('update');
    });
}

function setTurn(turn, maxTurns)
{
    $('#turns').html(turn + '/' + maxTurns + ' Turns Remaining');
}

function setPoints(points)
{
    $('#points').html(points + ' Points');
}

function setPh(ph)
{
    $('#ph-holder').find('.bar').css('width', Math.max(0, Math.min(100, 100*((ph-6)/2))) + '%')
        .siblings('.resource-value').html(ph.toFixed(2));
}

function updateTrackerSize()
{
    var trackers = $('.tracker');
    var width = $('#tracker-holder').width()/trackers.length;
    trackers.width(width);
}

function setColorTheme(theme)
{
    if (typeof theme === 'undefined' || theme === null) {
        theme = 'dark';
    }

    if (theme === 'light') {
        $('#content').find('*').removeClass('theme_dark').addClass('theme_light');
        $('i').removeClass('icon-white');
        $('.btn').removeClass('btn-inverse');
        $('#theme-dark').addClass('btn-inverse');
    } else if (theme === 'dark') {
        $('#content').find('*').removeClass('theme_light').addClass('theme_dark');
        $('i').addClass('icon-white');
        $('.btn').addClass('btn-inverse');
        $('#theme-light').removeClass('btn-inverse');
    }
}
