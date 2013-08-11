var DEFAULT_THEME = 'dark';

var DEFAULT_NOTIFICATION_DURATION = 5000;

var pathwayContentHeight = null;
var resourceContentHeight = null;

$(document).ready(function() {
    setColorTheme(color_theme);

    $(window).resize(function() { updateScrollbars(true); });
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

    base.find('.organ-image').each(function() {
        $(this).attr('src', baseUrl + 'img/organs/' + color_theme + '/' + $(this).parents('.header-text').attr('value') + '.png');
    });

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
