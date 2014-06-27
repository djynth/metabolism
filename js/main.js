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

    $('.accordian-content').jScrollPane();

    $('.btn-group.checkbox').find('.btn').click(function() {
        $(this).toggleClass('active');
    });

    $('.btn-group.radio').find('.btn').click(function() {
        $(this).siblings('.btn').removeClass('active');
        $(this).addClass('active');
    });

    $('.btn.toggle').click(function() {
        $(this).toggleClass('active');
    });

    $('input[type=text], input[type=password], input[type=email]')
        .focusin(function() {
            $(this).siblings('.add-on').addClass('focus');
        })
        .focusout(function() {
            $(this).siblings('.add-on').removeClass('focus');
        })
});

function onResize()
{
    var contentHeight = 
        $(window).height() - HEADER.outerHeight() - FOOTER.outerHeight();
    DIAGRAM.height(contentHeight);
    $('.sidebar').first().children('.accordian-header').each(
        function() {
            contentHeight -= $(this).outerHeight();
        }
    );
    
    $('.accordian-content').each(function() {
        $(this).css('max-height', contentHeight);
        if ($(this).hasClass('active')) {
            $(this).height(contentHeight).data('jsp').reinitialise();
        }
    });

    COPYRIGHT.css('bottom', FOOTER.outerHeight());
    NOTIFICATIONS.css('bottom', FOOTER.outerHeight() - 1);

    FILTER.find('input[type=text]').each(function() {
        $(this).outerWidth($(this).parent().width());
    });
}

function newGame()
{
    $.ajax({
        url: '/index.php/site/newGame',
        type: 'POST',
        dataType: 'json',
        success: onGameStart
    });
}

function onGameStart(data)
{
    DIAGRAM.css(
        'background-image',
        'url(\'img/diagrams/diagram' + data.challenge_id + '.png\')'
    );
    onTurn(data);
}

function onTurn(data)
{
    setTurn(data.turn, data.max_turns);
    setPoints(data.score);
    refreshPathways(
        refreshResources(data.resources, data.limits),
        data.restrictions
    );
    refreshState(data.passive_pathways, data.limits);
    refreshTrackers();
    if (isFilterActive()) {
        onFilterChange();    
    }

    TRACKER.find('.actions').find('.organ').each(function() {
        $(this).find('.amount').text(data.action_counts[$(this).organ()]);
    });

    if (data.completed) {
        setTimeout(function() {
            onGameOver(data);
        }, 1500);
    }
}

function setTurn(turn, maxTurns)
{
    if (maxTurns == -1) {
        TURNS.text(turn + ' Turns');
    } else {
        TURNS.text((maxTurns - turn) + '/' + maxTurns + ' Turns');
    }
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
            url: '/index.php/user/saveTheme',
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
            this.find('.fa:not(.always-white)').removeClass('fa-inverse');
        } else /* type === 'dark' */ {
            this.find('.fa:not(.always-black)').addClass('fa-inverse');
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
