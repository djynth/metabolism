var DEFAULT_NOTIFICATION_DURATION = 5000;

var pathwayContentHeight = null;
var resourceContentHeight = null;

var gameOver = false;

$(document).ready(function() {
    initScrollbars();
    initCenterGraphic()
    $('#notification-bottom').css('bottom', $('#tracker-holder').outerHeight(true));
    setColorTheme(colorTheme, colorThemeType);

    $(window).resize(function() {
        updateScrollbars(true, true, true);
        updateCenterGraphic();
    });
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
        
        if (updateScrollbars || typeof updateScrollbars === 'undefined') {
            $(this).mCustomScrollbar('update');
        }
    });
}

function initCenterGraphic()
{
    $('#cell-canvas').css('background-image', 'url(' + baseUrl + 'img/overview.png)');

    updateCenterGraphic();
}

function updateCenterGraphic()
{
    var top = $('#header').height();
    var bottom = $('#tracker-holder').height();
    $('#cell-canvas').height($(window).height() - top - bottom).offset({ top: top });
}

function setTurn(turn)
{
    $('#turns').text(turn + '/' + MAX_TURNS + ' Turns Remaining');
}

function setPoints(points)
{
    $('#points').text(points + ' Points');
}

function setColorTheme(theme, type, save)
{
    colorTheme = theme;
    colorThemeType = type;
    applyColorTheme($('body').attr('theme', colorTheme));

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
    if (colorThemeType === 'light') {
        base.find('i').removeClass('icon-white');
        base.find('.btn').removeClass('btn-inverse');
    } else /* colorThemeType === 'dark' */ {
        base.find('i').addClass('icon-white');
        base.find('.btn').addClass('btn-inverse');
    }

    base.find('button.theme-option').each(function() {
        $(this).toggleClass('active', $(this).attr('value') === colorTheme)
    });

    base.find('.organ-image').each(function() {
        $(this).attr('src', baseUrl + 'img/organs/' + colorThemeType + '/' + $(this).parents('.header-text').attr('value') + '.png');
    });

    return base;
}

function setHelpTooltips(active, save)
{
    $('#help-toggle').prop('checked', active)
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

        elem.append(html).slideDown(function() {
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
