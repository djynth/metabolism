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
            theme: "dark",
            advanced: {
                updateOnBrowserResize: false,
                updateOnContentResize: false
            },
            callbacks: {
                onScroll: function() {
                    console.log('scrolled');
                }
            }
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
        resourceContentHeight = $(window).height() - headers.first().offset().top - $('#resource-visual').outerHeight() - $('#resource-visual-header').outerHeight();
        headers.each(function() {
            resourceContentHeight -= $(this).outerHeight();
        });
    }
    
    return resourceContentHeight-1;
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
    var bottom = $('#trackers').height();
    $('#cell-canvas').height($(window).height() - top - bottom).offset({ top: top });
}

function setTurn(turn)
{
    var turns = $('#turns');
    var maxTurns = turns.attr('max-turns');
    turns.text((maxTurns-turn) + '/' + maxTurns + ' Turns Remaining');
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
                theme: theme,
                type: type
            }
        });
    }
}

function applyColorTheme(base)
{
    if (colorThemeType === 'light') {
        base.find('i:not(.always-white)').removeClass('icon-white');
        base.find('.btn').removeClass('btn-inverse');
    } else /* colorThemeType === 'dark' */ {
        base.find('i:not(.always-black)').addClass('icon-white');
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
    $('#tooltip-toggle').children().each(function() {
        if ($(this).attr('value') === 'on') {
            $(this).toggleClass('active', active);
        } else {
            $(this).toggleClass('active', !active);
        }
    });
    if (active) {
        $('.help-tooltip').tooltip({
            delay: { show: 1500, hide: 60 }
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
