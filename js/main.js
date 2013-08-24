var DEFAULT_THEME = 'dark';

var DEFAULT_NOTIFICATION_DURATION = 5000;

var pathwayContentHeight = null;
var resourceContentHeight = null;

var gameOver = false;

$(document).ready(function() {
    initScrollbars();
    $('#notification-bottom').css('bottom', $('#tracker-holder').outerHeight(true));
    setColorTheme(color_theme);

    $(window).resize(function() { updateScrollbars(true, true, true); });
});

function initScrollbars()
{
    $('.scrollbar-content').each(function() {
        $(this).mCustomScrollbar({
            autoHideScrollbar: true,
            scrollInertia: 200,
            theme: "dark"
        });
    });
}

function getPathwayContentHeight(reset)
{
    if (reset || pathwayContentHeight === null) {
        var headers = $('#pathway-holder').find('.accordian-header');
        pathwayContentHeight = $(window).height() - headers.first().offset().top;
        headers.each(function() {
            pathwayContentHeight -= $(this).outerHeight();
        });
    }

    return pathwayContentHeight;
}

function getResourceContentHeight(reset)
{
    if (reset || resourceContentHeight === null) {
        var headers = $('#resource-holder').find('.accordian-header');
        resourceContentHeight = $(window).height() - headers.first().offset().top - $('#resource-visual').outerHeight();
        headers.each(function() {
            resourceContentHeight -= $(this).outerHeight();
        });
    }
    
    return resourceContentHeight;
}

function updateScrollbars(updatePathwayHeight, updateResourceHeight, updateScrollbars)
{
    updateScrollbars = updateScrollbars || typeof updateScrollbars === 'undefined';
    if (updatePathwayHeight) {
        getPathwayContentHeight(true);
    }
    if (updateResourceHeight) {
        getResourceContentHeight(true);
    }

    $('.scrollbar-content').each(function() {
        if (updatePathwayHeight && $(this).hasClass('pathway-holder') && $(this).hasClass('active')) {
            $(this).height(getPathwayContentHeight());
        }
        if (updateResourceHeight && $(this).hasClass('resource-holder') && $(this).hasClass('active')) {
            $(this).height(getResourceContentHeight());
        }
        
        if (updateScrollbars) {
            $(this).mCustomScrollbar('update');
        }
    });
}

function setTurn(turn)
{
    $('#turns').text(turn + '/' + MAX_TURNS + ' Turns Remaining');
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
        base.find('*').addBack().removeClass('theme_dark').addClass('theme_light');
        base.find('i').removeClass('icon-white');
        base.find('.btn').removeClass('btn-inverse');
    } else if (color_theme === 'dark') {
        base.find('*').addBack().removeClass('theme_light').addClass('theme_dark');
        base.find('i').addClass('icon-white');
        base.find('.btn').addClass('btn-inverse');
    }

    base.find('.organ-image').each(function() {
        $(this).attr('src', baseUrl + 'img/organs/' + color_theme + '/' + $(this).parents('.header-text').attr('value') + '.png');
    });

    return base;
}

function setHelpTooltips(active, save)
{
    $('#help-toggle').bootstrapSwitch('setState', active);
    if (active) {
        $('.help-tooltip').tooltip({
            delay: { show: 600, hide: 100 }
        });
    } else {
        $('.help-tooltip').tooltip('destroy');
    }

    if (save) {
        $.ajax({
            url: 'index.php/user/saveHelp',
            type: 'POST',
            dataType: 'json',
            data: {
                help: active
            }
        });
    }
}

function notifyTop(html, duration)
{
    notify($('#notification-top'), html, duration);
}

function notifyBottom(html, duration)
{
    notify($('#notification-bottom'), html, duration);
}

function notify(elem, html, duration)
{
    if (typeof duration === 'undefined') {
        duration = DEFAULT_NOTIFICATION_DURATION;
    }

    if (html) {
        elem.empty().hide();

        applyColorTheme(elem.append(html)).slideDown(function() {
            if (duration > 0) {
                setTimeout(function() {
                    elem.slideUp(function() {
                        elem.empty();
                    });
                }, duration);
            }
        });
    } else {
        elem.slideUp(function() {
            elem.empty();
        });
    }
}

function onGameOver()
{
    $('.result-cover').fadeIn(function() {
        window.location.replace(baseUrl + 'index.php/site/result');
    });
}
