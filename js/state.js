var STATE;
var LIMITED_RESOURCES;

$(document).ready(function() {
    STATE = $('#state');
    LIMITED_RESOURCES = $('#limited-resources');

    STATE.find('.tab').click(function() {
        STATE.find('.content').removeClass('active');
        STATE.find('.tab').removeClass('active');
        $(this).addClass('active');
        STATE.find('#' + $(this).attr('for')).addClass('active');
    });

    STATE.find('.tab').first().click();

    LIMITED_RESOURCES.find('.organ-header').click(function() {
        $(this).siblings(
            '[organ="' + $(this).attr('organ') + '"]:not(.hidden)'
        ).toggle();
    });
});

function refreshState(passivePathways, limits)
{
    var total = 0;
    LIMITED_RESOURCES.find('.limited-resource').each(function() {
        var limit = limits[$(this).res()];
        var organ = $(this).organ();
        var res = getRes($(this).res(), organ);
        var amount = res.attr('amount');
        var points = 0;

        if (limit === null || 
            (limit.soft_min === null && limit.soft_max === null)) {
            $(this).addClass('hidden');
            return;
        }

        $(this).removeClass('hidden');
        $(this).find('.max').each(function() {
            if (limit.soft_max === null) {
                $(this).addClass('center').html('-');
            } else {
                $(this).removeClass('center').html(limit.soft_max);
                points -= limit.penalization * max(0, amount - limit.soft_max);
            }
        });
        $(this).find('.min').each(function() {
            if (limit.soft_min === null) {
                $(this).addClass('center').html('-');
            } else {
                $(this).removeClass('center').html(limit.soft_min);
                points -= limit.penalization * max(0, limit.soft_min - amount);
            }
        });

        total += points;
        $(this).find('.amount')
            .html(amount)
            .toggleClass('good', points >= 0)
            .toggleClass('bad', points < 0);
        $(this).find('.change').html(formatPoints(points));
    });
    
    if (typeof passivePathways === "undefined") {
        LIMITED_RESOURCES.find('.process').addClass('hidden');
    }

    LIMITED_RESOURCES.find('.process').each(function() {
        var pathway = getPathway($(this).pathway(), $(this).organ());
        if (typeof passivePathways[pathway.pathway()] === 'undefined') {
            $(this).addClass('hidden');
            return;
        }

        $(this).parents('tr').removeClass('hidden');
        var points = 0;
        var available = passivePathways[pathway.pathway()][$(this).organ()];
        $(this).toggleClass('good', available).toggleClass('bad', !available);
        if (available) {
            var points = $(this).attr('times') * pathway.find('.points').text();
        }
        total += points;
        $(this).siblings('.change').html(formatPoints(points));
    });
    LIMITED_RESOURCES.find('.total').html(formatPoints(total));
}

function formatPoints(points)
{
    return (points < 0 ? '' : '+') + points.toFixed(2);
}
