var BODY;
var TURNS;
var POINTS;
var DIAGRAM;
var COPYRIGHT;

$(document).ready(function() {
    BODY = $('body');
    TURNS = $('#turns');
    POINTS = $('#points');
    DIAGRAM = $('#diagram');
    COPYRIGHT = $('#copyright');

    $(window).resize(onResize);
});

function onResize()
{
    var contentHeight = $(window).height() - FOOTER.outerHeight();
    $('.sidebar').first().children('.accordian-header, .sidebar-title').each(
        function() {
            contentHeight -= $(this).outerHeight();
        }
    );

    $('.accordian-content.active').height(contentHeight);
    $('.accordian-content').css('max-height', contentHeight);
    DIAGRAM.height(
        $(window).height() - FOOTER.outerHeight() - HEADER.outerHeight()
    );
    COPYRIGHT.css('bottom', FOOTER.outerHeight());

    resizeFilter();
}

function onTurn(data)
{
    setTurn(data.turn);
    setPoints(data.score);
    refreshPathways(refreshResources(data.resources));
    refreshLimitedResources();
    refreshResourceLimits();
    refreshTrackers();
    if (isFilterActive()) {
        onFilterChange();    
    }

    TRACKER.find('.actions').find('.organ').each(function() {
        $(this).find('.amount').text(data.action_counts[$(this).organ()]);
    });
}

function setTurn(turn)
{
    var maxTurns = TURNS.attr('max-turns');
    TURNS.text((maxTurns - turn) + '/' + maxTurns + ' Turns Remaining');
}

function setPoints(points)
{
    POINTS.text(points + ' Points');
}

function getColorTheme()
{
    return {
        theme : BODY.attr('theme'),
        type  : BODY.attr('type')
    };
}

function setColorTheme(theme, type, save)
{
    BODY.attr({ theme : theme, type : type }).applyColorTheme(theme, type);

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
    res: function(res) {
        if (typeof res !== 'undefined') {
            return this.attr('res', res);
        }
        return parseInt(this.attr('res'));
    },

    organ: function(organ) {
        if (typeof organ !== 'undefined') {
            return this.attr('organ', organ);
        }
        return parseInt(this.attr('organ'));
    },

    pathway: function(pathway) {
        if (typeof pathway !== 'undefined') {
            return this.attr('pathway', pathway);
        }
        return parseInt(this.attr('pathway'));
    },

    formSiblings: function(selector) {
        return this.parents('form').find(selector);
    },

    applyColorTheme: function(theme, type) {
        if (type === 'light') {
            this.find('i:not(.always-white)').removeClass('icon-white');
            this.find('.btn').removeClass('btn-inverse');
        } else /* type === 'dark' */ {
            this.find('i:not(.always-black)').addClass('icon-white');
            this.find('.btn').addClass('btn-inverse');
        }

        this.find('.accordian-header').each(function() {
            $(this).find('.image').attr(
                'src',
                '/img/organs/' + type + '/' + $(this).organ() + '.png'
            );
        });

        TRACKER.find('.icon').each(function() {
            updateIcon($(this));
        })

        updateResourceVisualImage();

        return this;
    }
});
