var RESOURCES;

$(document).ready(function() {
    RESOURCES = $('.resources').find('.res');
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

function refreshResources(resources, limits)
{
    var changed = new Array();
    for (var resource in resources) {
        var limit = limits[resource];
        for (var organ in resources[resource]) {
            var amount = resources[resource][organ];
            var res = getRes(resource, organ);

            if (typeof res.attr('amount') !== 'undefined') {
                var change = amount - parseInt(res.attr('amount'));
                if (change === 0) {
                    continue;
                }

                changed.push(res.res());
                var increase = change > 0 ? 'increase' : 'decrease';
                res.addClass(increase).delay(1000).queue(function() {
                    $(this).removeClass('increase decrease').dequeue();
                });
            } else {
                changed.push(res.res());
            }

            updateRes(res, amount, limit);
        }
    }
    return changed;
}

function updateRes(res, amount, limit)
{
    res.attr('amount', amount);
    res.find('.amount').html(amount);

    var maxShown = parseInt(res.attr('max-shown'));
    res.find('.bar').width(100*min(1, amount/maxShown) + '%');

    if (limit.hard_min === null) {
        res.find('.hard.min').width(0);
    } else {
        res.find('.hard.min').width(100*min(1, limit.hard_min/maxShown)+"%");
    }

    if (limit.soft_min === null) {
        res.find('.soft.min').width(0);
    } else {
        res.find('.soft.min').width(100*min(1, limit.soft_min/maxShown)+"%");
    }

    if (limit.soft_max === null) {
        res.find('.soft.max').width(0);
    } else {
        res.find('.soft.max').width(100*min(1, 1-limit.soft_max/maxShown)+"%");
    }

    if (limit.hard_max === null) {
        res.find('.hard.max').width(0);
    } else {
        res.find('.hard.max').width(100*min(1, 1-limit.hard_max/maxShown)+"%");
    }
}
