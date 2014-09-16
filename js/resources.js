var resources;
var AMOUNT_HEIGHT;
var POINTS_HEIGHT;

$(document).ready(function() {
    AMOUNT_HEIGHT = parseInt($('.amount-holder').first().css('max-height'));
    POINTS_HEIGHT = parseInt($('.points-holder').first().css('max-height'));
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

            var bad_color  = $(this).find('.level-bar').find('.bad').css('background-color').match(/\d+/g);
            var med_color  = $(this).find('.level-bar').find('.med').css('background-color').match(/\d+/g);
            var good_color = $(this).find('.level-bar').find('.good').css('background-color').match(/\d+/g);

            if (variance > 0.5) {
                var color = mixColors(bad_color, med_color, 2*(variance - 0.5));
            } else {
                var color = mixColors(med_color, good_color, 2*variance)
            }

            $(this).find('.level-bar')
                .css('background-color', color)     // TODO: animate this
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
    animateTime = typeof animateTime === 'undefined' ? false : animateTime;

    if (resources.hasClass('active')) {
        var levelHolderHeight = parseInt(resources.css('max-height')) - AMOUNT_HEIGHT - POINTS_HEIGHT;

        if (animateTime) {
            resources.find('.name').velocity({ opacity : 1}, animateTime);
            resources.find('.limit').velocity({ height : '100%' }, animateTime);
            resources.find('.points-holder').velocity({ height : POINTS_HEIGHT, opacity : 1 }, animateTime);
            resources.find('.amount-holder').velocity({ height : AMOUNT_HEIGHT, opacity : 1 }, animateTime);
        } else {
            resources.find('.name, .points-holder, .amount-holder').css('opacity', 1);
            resources.find('.limit').height('100%');
            resources.find('.points-holder').height(POINTS_HEIGHT);
            resources.find('.amount-holder').height(AMOUNT_HEIGHT);
        }
    } else {
        var levelHolderHeight = parseInt(resources.css('min-height'));

        if (animateTime) {
            resources.find('.name').velocity({ opacity : 0}, animateTime);
            resources.find('.points-holder, .amount-holder').velocity({ height : 0, opacity : 0 }, animateTime);
            resources.find('.limit').velocity({ height : 0 }, animateTime);
        } else {
            resources.find('.name, .points-holder, .amount-holder').css('opacity', 0);
            resources.find('.limit, .points-holder, .amount-holder').height(0);
        }
    }

    if (animateTime) {
        resources.find('.level-holder').velocity({ height : levelHolderHeight }, animateTime);
    } else {
        resources.find('.level-holder').height(levelHolderHeight);
    }
}

function resizeResource(res, animateTime)
{
    animateTime = typeof animateTime === 'undefined' ? false : animateTime;

    var level = res.find('.level-bar');

    if (res.hasClass('compact')) {
        var levelTop = parseInt(level.attr('level-top'));
        if (levelTop < parseInt(res.find('.soft.max').css('max-height'))) {
            var levelTop = 100;
        } else {
            var levelTop = min(45, levelTop);
        }

        var levelBot = parseInt(level.attr('level-bot'));
        if (levelBot < parseInt(res.find('.soft.min').css('max-height'))) {
            var levelBot = 0;
        } else {
            var levelBot = min(45, levelBot);    
        }
    } else {
        var levelTop = min(45, parseInt(level.attr('level-top')));
        var levelBot = min(45, parseInt(level.attr('level-bot')));
    }

    var bottom = levelBot + '%';
    var height = (100 - (levelTop + levelBot)) + '%';
    if (animateTime) {
        level.velocity({
            bottom : bottom,
            height : height
        }, animateTime);
    } else {
        level.css('bottom', bottom).height(height);
    }
}

function formatPoints(points)
{
    return (points < 0 ? '' : '+') + points.toFixed(1);
}

function mixColors(c1, c2, balance)
{
    return 'rgb(' +
        parseInt((balance*c1[0] + (1-balance)*c2[0])) + ',' +
        parseInt((balance*c1[1] + (1-balance)*c2[1])) + ',' +
        parseInt((balance*c1[2] + (1-balance)*c2[2])) + ')';
}