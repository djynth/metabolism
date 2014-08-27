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
