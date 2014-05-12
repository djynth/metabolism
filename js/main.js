$(document).ready(function() {
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

function onTurn(data)
{
    setTurn(data.turn);
    setPoints(data.points);
    var changedResources = refreshResources(data.resources);
    refreshLimitedResources(data.passive_pathways);
    refreshResourceLimits();
    refreshPathways(changedResources);
    refreshTrackers();
    onFilterChange();

    for (organ in data.action_counts) {
        $('.tracker.actions').find('.organ[organ=' + organ + ']').find('.amount').text(data.action_counts[organ]);
    }
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
    res: function(res) {
        if (typeof res !== 'undefined') {
            return $(this).attr('res', res);
        }
        return parseInt($(this).attr('res'));
    },

    organ: function(organ) {
        if (typeof organ !== 'undefined') {
            return $(this).attr('organ', organ);
        }
        return parseInt($(this).attr('organ'));
    },

    pathway: function(pathway) {
        if (typeof pathway !== 'undefined') {
            return $(this).attr('pathway', pathway);
        }
        return parseInt($(this).attr('pathway'));
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
            $(this).find('.image').attr('src', '/img/organs/' + type + '/' + $(this).organ() + '.png');
        });

        this.find('#trackers').find('.icon').each(function() {
            updateIcon($(this));
        })

        return this;
    }
});
