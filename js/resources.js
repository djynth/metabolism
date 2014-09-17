var resources;

var _RESOURCE_SIZES = { };

$(document).ready(function() {
    var resourceHolders = $('.resources');
    _RESOURCE_SIZES.amount = parseInt(resourceHolders.find('.amount-holder').css('max-height'));
    _RESOURCE_SIZES.points = parseInt(resourceHolders.find('.points-holder').css('max-height'));
    _RESOURCE_SIZES.min = parseInt(resourceHolders.css('min-height'));
    _RESOURCE_SIZES.buffer = $('.resources-header').totalHeight() + (resourceHolders.length-1)*_RESOURCE_SIZES.min + _RESOURCE_SIZES.amount + _RESOURCE_SIZES.points;
});

function getRes(resource, organ)
{
    if (typeof organ === 'undefined') {
        var resources = $('.resources');
    } else {
        var resources = $('.resources[organ="' + organ + '"]');
    }
    return resources.find('.res[res="' + resource + '"]').first();
}

function refreshResources(refreshLimits)
{
    refreshLimits = typeof refreshLimits === 'undefined' ? true : refreshLimits;

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

            $(this).find('.level-bar')
                .attr('variance', variance)
                .attr('level-top', min(50, heightFromTop(amount)) + '%')
                .attr('level-bot', min(50, heightFromBot(amount)) + '%');
        }

        if (refreshLimits) {
            $(this).find('.limit-holder.hard.min').height(heightFromBot(limit.hard_min) + '%');
            $(this).find('.limit-holder.soft.min').height(heightFromBot(limit.soft_min) + '%');
            $(this).find('.limit-holder.soft.max').height(heightFromTop(limit.soft_max) + '%');
            $(this).find('.limit-holder.hard.max').height(heightFromTop(limit.hard_max) + '%');    
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
    if (resources.hasClass('active')) {
        if (animateTime) {
            resources.find('.name').velocity({ opacity : 1 }, { duration : animateTime, display : 'block' });
            resources.find('.limit').velocity({ height : '100%' }, { duration : animateTime });
            resources.find('.points-holder').velocity({ height : _RESOURCE_SIZES.points, opacity : 1 }, {duration : animateTime, display : 'block' });
            resources.find('.amount-holder').velocity({ height : _RESOURCE_SIZES.amount, opacity : 1 }, {duration : animateTime, display : 'block' });
            resources.find('.level-holder').velocity({ height : _RESOURCE_SIZES.max }, animateTime);
        } else {
            resources.find('.name, .points-holder, .amount-holder').css('opacity', 1).show();
            resources.find('.limit').height('100%');
            resources.find('.points-holder').height(_RESOURCE_SIZES.points);
            resources.find('.amount-holder').height(_RESOURCE_SIZES.amount);
            resources.find('.level-holder').height(_RESOURCE_SIZES.max);
        }
    } else {
        if (animateTime) {
            resources.find('.name').velocity({ opacity : 0 }, { duration : animateTime, display : 'none' });
            resources.find('.points-holder, .amount-holder').velocity({ height : 0, opacity : 0 }, { duration : animateTime, display : 'none' });
            resources.find('.limit').velocity({ height : 0 }, animateTime);
            resources.find('.level-holder').velocity({ height : _RESOURCE_SIZES.min }, animateTime);
        } else {
            resources.find('.name, .points-holder, .amount-holder').css('opacity', 0).hide();
            resources.find('.limit, .points-holder, .amount-holder').height(0);
            resources.find('.level-holder').height(_RESOURCE_SIZES.min);
        }
    }
}

function resizeResource(res, animateTime)
{
    var level = res.find('.level-bar');

    var levelTop = min(45, level.attr('level-top'));
    var levelBot = min(45, level.attr('level-bot'));
    var color = varianceToColor(parseFloat(level.attr('variance')));

    if (res.hasClass('compact')) {
        if (levelTop < parseInt(res.find('.soft.max').css('max-height'))) {
            var levelTop = 100;
        }

        if (levelBot < parseInt(res.find('.soft.min').css('max-height'))) {
            var levelBot = 0;
        }
    }

    var bottom = levelBot + '%';
    var height = (100 - (levelTop + levelBot)) + '%';
    if (animateTime) {
        level.velocity({
            bottom          : bottom,
            height          : height,
            backgroundColor : color
        }, animateTime);
    } else {
        level.css({ 'bottom' : bottom, 'height' : height, 'backgroundColor' : color });
    }
}

function varianceToColor(variance)
{
    if (typeof bad_color === 'undefined') {
        bad_color = $('.level-bar').find('.bad').css('background-color').match(/\d+/g);
    }
    if (typeof med_color === 'undefined') {
        med_color = $('.level-bar').find('.med').css('background-color').match(/\d+/g);
    }
    if (typeof good_color === 'undefined') {
        good_color = $('.level-bar').find('.good').css('background-color').match(/\d+/g);
    }

    if (variance > 0.5) {
        return mixColors(bad_color, med_color, 2*(variance - 0.5));
    } else {
        return mixColors(med_color, good_color, 2*variance)
    }
}