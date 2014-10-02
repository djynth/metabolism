var resources;

var _RESOURCE_SIZES = {
    vertical : {
        amount        : 36,
        points        : 36,
        activeHeight  : null,       // set in onResize
        compactHeight : 20,
    },
    horizontal : {
        amount        : 35,
        points        : 35,
        activeHeight  : null,       // set in onResize
        compactHeight : 35,         // height of the entire resource bar when compact
        activeWidth   : null,       // set in onResize
        compactWidth  : null,       // set in onResize
    }
};
var resourceOrientation;
var resourceLevelStyle;

function getRes(resource, organ)
{
    if (typeof organ === 'undefined') {
        var resources = $('.resources');
    } else {
        var resources = $('.resources[organ="' + organ + '"]');
    }
    return resources.find('.res[res="' + resource + '"]').first();
}

function setResourceOrientation(orientation)
{
    resourceOrientation = orientation;

    if (resourceOrientation === 'Vertical') {
        RESOURCES.addClass('vertical').removeClass('horizontal');
    } else if (resourceOrientation === 'Horizontal') {
        RESOURCES.addClass('horizontal').removeClass('vertical');
    }

    refreshResources(true);
    $('.resources').each(function() {
        resizeResources($(this));
    });
    RESOURCES.each(function() {
        resizeResource($(this));
    });
}

function setResourceLevelStyle(style)
{
    resourceLevelStyle = style;
    RESOURCES.each(function() {
        resizeResource($(this), 450);
    });
}

function refreshResources(refreshLimits)
{
    refreshLimits = typeof refreshLimits === 'undefined' ? true : refreshLimits;

    if (typeof resources === 'undefined') {
        return null;
    }

    var changed = new Array();

    RESOURCES.each(function() {
        var resource = resources[$(this).res()];
        var limit = resource.limit;
        
        var amount = resource.amounts[$(this).organ()];
        var prevAmount = parseInt($(this).find('.amount').text());
        var change = amount - prevAmount;
        var recommended = parseInt($(this).find('.level-bar').attr('recommended'));

        function heightFromTop(amount) {
            if (amount === null || typeof amount === 'undefined') {
                return 0;
            }
            return 100*(1-max(0, min(1, amount/(2*recommended))));
        }

        function heightFromBot(amount) {
            if (amount === null || typeof amount === 'undefined') {
                return 0;
            }
            return 100*max(0, min(1, amount/(2*recommended)));
        }

        if (change !== 0) {
            changed.push($(this).res());

            $(this).find('.amount').html(amount);

            var variance = 0;
            var intensity = recommended/2;
            if (limit.soft_min !== null && amount < limit.soft_min + intensity) {
                variance = min(1, max(variance, Math.pow((amount - (limit.soft_min + intensity))/intensity, 2)));
            }
            if (limit.soft_max !== null && amount > limit.soft_max - intensity) {
                variance = min(1, max(variance, Math.pow((amount - (limit.soft_max - intensity))/intensity, 2)));
            }

            var fromBot = heightFromBot(amount);
            $(this).find('.level-bar')
                .attr('variance', variance)
                .attr('from-bot', fromBot + '%')
                .attr('level-top', min(50, heightFromTop(amount)) + '%')
                .attr('level-bot', min(50, fromBot) + '%');
        }

        if (refreshLimits) {
            var v = resourceOrientation === 'Vertical';

            $(this).find('.limit-holder').each(function() {
                if ($(this).hasClass('min')) {
                    if ($(this).hasClass('soft')) {
                        var lim = heightFromBot(limit.soft_min);
                    } else if ($(this).hasClass('hard')) {
                        var lim = heightFromBot(limit.hard_min);
                    }
                } else if ($(this).hasClass('max')) {
                    if ($(this).hasClass('soft')) {
                        var lim = heightFromTop(limit.soft_max);
                    } else if ($(this).hasClass('hard')) {
                        var lim = heightFromTop(limit.hard_max);
                    }
                }

                $(this)
                    .height(v ? lim + '%' : '100%')
                    .width(v ? '100%' : lim + '%')
                    .toggleClass('at-min at-max', lim <= 0);
            });
        }

        var points = 0;
        if (limit.soft_max !== null) {
            points -= limit.penalization * max(0, amount - limit.soft_max)
        }
        if (limit.soft_min !== null) {
            points -= limit.penalization * max(0, limit.soft_min - amount);
        }
        $(this).find('.points').text(formatPoints(points));
    });

    return changed;
}

function resizeResources(resources, animateTime)
{
    var vertical = resourceOrientation === 'Vertical';
    var active = resources.hasClass('active');

    var hori = _RESOURCE_SIZES.horizontal;
    var vert = _RESOURCE_SIZES.vertical;

    // res
    var numResources = resources.find('.res:not(.primary)').length;
    var h = vertical ? '100%' : (active ? (hori.activeHeight - (numResources-1))/numResources : hori.compactHeight/numResources) + 'px';
    var props = {
        height     : h,
        lineHeight : h
    };
    if (animateTime) {
        resources.find('.res').velocity(props, { duration : animateTime });
    } else {
        resources.find('.res').css(props);
    }

    // name
    var props = {
        opacity    : active ? 1 : 0
    };
    if (animateTime) {
        resources.find('.name').velocity(props, { duration : animateTime, display : (active ? 'block' : 'none') });
    } else {
        resources.find('.name').css(props).toggle(active);
    }

    // limit
    var props = {
        height : vertical ? (active ? '100%' : 0) : '100%',
        width  : vertical ? '100%' : (active ? '100%' : 0)
    };
    if (animateTime) {
        resources.find('.limit').velocity(props, { duration : animateTime });
    } else {
        resources.find('.limit').css(props);
    }

    // points holder
    var props = {
        height     : vertical ? (active ? vert.points : 0) : '100%',
        width      : vertical ? '100%' : (active ? hori.points : 0),
        opacity    : active ? 1 : 0
    };
    if (animateTime) {
        resources.find('.points-holder').velocity(props, { duration : animateTime, display : (active ? 'block' : 'none') });
    } else {
        resources.find('.points-holder').css(props).toggle(active);
    }

    // amount holder
    var props = {
        height     : vertical ? (active ? vert.amount : 0) : '100%',
        width      : vertical ? '100%' : (active ? hori.amount : 0),
        opacity    : active ? 1 : 0
    };
    if (animateTime) {
        resources.find('.amount-holder').velocity(props, { duration : animateTime, display : (active ? 'block' : 'none') });
    } else {
        resources.find('.amount-holder').css(props).toggle(active);
    }

    // level holder
    var props = {
        height : vertical ? (active ? vert.activeHeight : vert.compactHeight) : '100%',
        width  : vertical ? '100%' : (active ? hori.activeWidth : hori.compactWidth),
        left   : vertical ? 0 : (active ? hori.amount+1 : 0)
    };
    if (animateTime) {
        resources.find('.level-holder').velocity(props, { duration : animateTime });
    } else {
        resources.find('.level-holder').css(props);
    }
}

function resizeResource(res, animateTime)
{
    var level = res.find('.level-bar');
    var color = varianceToColor(parseFloat(level.attr('variance')));

    if (resourceLevelStyle === 'Relative') {
        var levelTop = min(45, level.attr('level-top'));
        var levelBot = min(45, level.attr('level-bot'));

        if (res.hasClass('compact')) {
            if (levelTop < parseInt(res.find('.soft.max').css('max-height'))) {
                var levelTop = 100;
            }

            if (levelBot < parseInt(res.find('.soft.min').css('max-height'))) {
                var levelBot = 0;
            }
        }

        var bottom = levelBot;
        var height = (100 - (levelTop + levelBot));
    }
    if (resourceLevelStyle === 'Absolute') {
        var bottom = 0;
        var height = parseFloat(level.attr('from-bot'));
    }
    
    var vertical = resourceOrientation === 'Vertical';
    var props = {
        bottom          : (vertical ? bottom :   0) + '%',
        height          : (vertical ? height : 100) + '%',
        lineHeight      : (vertical ? 100 : height) + '%',
        left            : (vertical ?   0 : bottom) + '%',
        width           : (vertical ? 100 : height) + '%',
        backgroundColor : color
    }

    level.toggleClass('at-max', bottom + height <= 0 || bottom + height >= 100);
    level.toggleClass('at-min', bottom <= 0);

    if (animateTime) {
        level.velocity(props, animateTime);
    } else {
        level.css(props);
    }
}

function varianceToColor(variance)
{
    if (typeof bad_color === 'undefined') {
        bad_color = RESOURCES.find('.bad').css('background-color').match(/\d+/g);
    }
    if (typeof med_color === 'undefined') {
        med_color = RESOURCES.find('.med').css('background-color').match(/\d+/g);
    }
    if (typeof good_color === 'undefined') {
        good_color = RESOURCES.find('.good').css('background-color').match(/\d+/g);
    }

    if (variance > 0.5) {
        return mixColors(bad_color, med_color, 2*(variance - 0.5));
    } else {
        return mixColors(med_color, good_color, 2*variance)
    }
}