/* FROM PHP:
var baseUrl
*/

$(document).ready(function() {
    refreshResources();
    $(document).addResourceInfoSources();
    updateLimitedResources($('#point-dropdown').children());
    onResize();
    selectOrgan($('.accordian-header').first().organ());

    $(window).resize(onResize);
});

function onResize()
{
    var contentHeight = $(window).height() - $('#header').outerHeight() - $('#footer').outerHeight();
    $('.sidebar').first().find('.accordian-header').each(function() {
        contentHeight -= $(this).outerHeight();
    });

    $('.accordian-content.active').height(contentHeight);
    $('.accordian-content').css('max-height', contentHeight);

    var top = $('#header').outerHeight();
    var bottom = $('#footer').outerHeight();
    $('#diagram').height($(window).height() - top - bottom);
    $('#copyright').css('bottom', bottom);

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
    res: function() {
        return $(this).attr('res');
    },

    organ: function() {
        return $(this).attr('organ');
    },

    pathway: function() {
        return $(this).attr('pathway');
    },

    applyColorTheme: function(theme, type) {
        if (type === 'light') {
            this.find('i:not(.always-white)').removeClass('icon-white');
            this.find('.btn').removeClass('btn-inverse');
        } else /* type === 'dark' */ {
            this.find('i:not(.always-black)').addClass('icon-white');
            this.find('.btn').addClass('btn-inverse');
        }

        // this is only necessary on loading the page
        // TODO: set the selected theme to active in HTML or something
        this.find('.theme').each(function() {
            $(this).toggleClass('active', $(this).attr('theme') === theme);
        });

        this.find('.accordian-header').each(function() {
            $(this).find('.image').attr('src', '/img/organs/' + type + '/' + $(this).organ() + '.png');
        });

        return this;
    },

    addResourceInfoSources: function() {
        this.find('.res-info-source').click(function() {
            if ($('#resource-visual').res() !== $(this).res()) {
                updateResourceVisual($(this).res());
            }
        });

        return this;
    }
});
