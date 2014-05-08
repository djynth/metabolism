var DEFAULT_NOTIFICATION_DURATION = 5000;
/* FROM PHP:
var baseUrl
*/

$(document).ready(function() {
    selectOrgan($('.accordian-header').first().attr('value'));
    refreshResources();
    addResourceInfoSources($(document));
    onResize();

    $(window).resize(onResize);
});

function getPathwayContentHeight()
{
    var pathwayHeaders = $('#pathway-holder').find('.accordian-header');
    pathwayContentHeight = $(window).height() - pathwayHeaders.first().offset().top - $('#footer').outerHeight();
    pathwayHeaders.each(function() {
        pathwayContentHeight -= $(this).outerHeight();
    });

    return pathwayContentHeight;
}

function getResourceContentHeight()
{
    var resourceHeaders = $('#resource-holder').find('.accordian-header');
    resourceContentHeight = $(window).height() - resourceHeaders.first().offset().top - $('#footer').outerHeight();
    resourceHeaders.each(function() {
        resourceContentHeight -= $(this).outerHeight();
    });
    return resourceContentHeight;
}

function onResize()
{
    $('.pathway-holder.active').height(getPathwayContentHeight());
    $('.resource-holder.active').height(getResourceContentHeight());

    var top = $('#header').height();
    var bottom = $('#footer').outerHeight();
    $('#cell-canvas').height($(window).height() - top - bottom).offset({ top: top });
    $('#copyright').css('bottom', bottom);
    $('#notification-bottom').css('bottom', bottom);

    resizeFilter();
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

function getColorTheme()
{
    return {
        theme : $('body').attr('theme'),
        type  : $('body').attr('type')
    };
}

function setColorTheme(theme, type, save)
{
    $('body').attr({ theme : theme, type : type }).applyColorTheme(theme, type);

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

jQuery.fn.extend({
    applyColorTheme: function(theme, type) {
        if (type === 'light') {
            this.find('i:not(.always-white)').removeClass('icon-white');
            this.find('.btn').removeClass('btn-inverse');
        } else /* type === 'dark' */ {
            this.find('i:not(.always-black)').addClass('icon-white');
            this.find('.btn').addClass('btn-inverse');
        }

        this.find('button.theme-option').each(function() {
            $(this).toggleClass('active', $(this).attr('value') === theme)
        });

        this.find('.organ-image').each(function() {
            $(this).attr('src', baseUrl + 'img/organs/' + type + '/' + $(this).parents('.header-text').attr('value') + '.png');
        });

        return this;
    }
});

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

function createNotification(message, success)
{
    return $('<p>').text(message).addClass(success ? 'success' : 'error');
}

function notifyInternalError()
{
    notifyBottom(createNotification('An internal error occurred.', false));
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