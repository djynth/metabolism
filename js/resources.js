function getRes(resource, organ)
{
    if (typeof organ === 'undefined') {
        var resources = $('.resources');
    } else {
        var resources = $('.resources[organ="' + organ + '"]');
    }
    return resources.find('.res[res="' + resource + '"]').first();
}

function refreshResources()
{
    var changed = new Array();
    RESOURCES.each(function() {
        var res = $(this).res();
        var organ = $(this).organ();
        var amountElem = $(this).children('.amount');
        var amount = resources[res].amounts[organ];
        var prevAmount = parseInt(amountElem.text());
        var change = amount - prevAmount;

        if (change !== 0) {
            var maxShown = parseInt($(this).attr('max-shown'));
            amountElem.html(amount);
            $(this).children('.bar').width(100*min(1, amount/maxShown) + '%');

            changed.push(res);
            if (!isNaN(prevAmount)) {
                var increase = change > 0 ? 'increase' : 'decrease';
                $(this).addClass(increase).delay(1000).queue(function() {
                    $(this).removeClass('increase decrease').dequeue();
                });    
            }
        }
    });

    return changed;
}

function refreshLimits()
{
    RESOURCES.each(function() {
        var limit = resources[$(this).res()].limit;
        var maxShown = parseInt($(this).attr('max-shown'));
        if (limit.hard_min === null) {
            $(this).children('.hard.min').width(0);
        } else {
            $(this).children('.hard.min').width(100*min(1, limit.hard_min/maxShown)+"%");
        }

        if (limit.soft_min === null) {
            $(this).children('.soft.min').width(0);
        } else {
            $(this).children('.soft.min').width(100*min(1, limit.soft_min/maxShown)+"%");
        }

        if (limit.soft_max === null) {
            $(this).children('.soft.max').width(0);
        } else {
            $(this).children('.soft.max').width(100*min(1, 1-limit.soft_max/maxShown)+"%");
        }

        if (limit.hard_max === null) {
            $(this).children('.hard.max').width(0);
        } else {
            $(this).children('.hard.max').width(100*min(1, 1-limit.hard_max/maxShown)+"%");
        }
    });
}

function refreshResourceLevels()
{
    $('.res-level').each(function() {
        var res = $(this).res();
        var organ = $(this).organ();

        var amount = 0;
        var softMin = null;
        var softMax = null;

        if (typeof resources !== 'undefined') {
            var amount = resources[res].amounts[organ];
            var softMin = resources[res].limit.soft_min;
            var softMax = resources[res].limit.soft_max;
        }

        var min_variance = 0;
        var max_variance = 0;

        var intensity = parseInt($(this).attr('intensity'));
        if (softMin !== null) {
            if (amount < softMin + intensity) {
                min_variance = Math.pow((amount - (softMin + intensity))/intensity, 2);
            }
        }
        if (softMax !== null) {
            if (amount > softMax - intensity) {
                max_variance = Math.pow((amount - (softMax - intensity))/intensity, 2);
            }
        }

        var variance = min(1, max(0, max(min_variance, max_variance)));

        $(this).find('.bar').each(function() {
            var bad_color  = $(this).find('.bad').css('color').match(/\d+/g);
            var med_color  = $(this).find('.med').css('color').match(/\d+/g);
            var good_color = $(this).find('.good').css('color').match(/\d+/g);

            if (variance > 0.5) {
                var color = mixColors(bad_color, med_color, 2*(variance - 0.5));
            } else {
                var color = mixColors(med_color, good_color, 2*variance)
            }

            $(this).css({
                height          : 100*max(0.2, variance) + '%',
                top             : 100*(1-max(0.2, variance))/2 + '%',
                backgroundColor : color
            });
        });
    });
}

function mixColors(c1, c2, balance)
{
    return 'rgb(' +
        parseInt((balance*c1[0] + (1-balance)*c2[0])) + ',' +
        parseInt((balance*c1[1] + (1-balance)*c2[1])) + ',' +
        parseInt((balance*c1[2] + (1-balance)*c2[2])) + ')';
}