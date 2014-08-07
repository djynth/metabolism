$(document).ready(function() {
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

function refreshState(passivePathways)
{
    var total = 0;
    LIMITED_RESOURCES.find('.limited-resource').each(function() {
        var resource = resources[$(this).res()];
        var limit = resource.limit;
        var amount = resource.amounts[$(this).organ()];
        var points = 0;

        if (limit.soft_min === null && limit.soft_max === null) {
            $(this).addClass('hidden');
            return;
        }
        $(this).removeClass('hidden');

        if (limit.soft_max === null) {
            $(this).find('.max').addClass('center').html('-');
        } else {
            $(this).find('.max').removeClass('center').html(limit.soft_max);
            points -= limit.penalization * max(0, amount - limit.soft_max);
        }
        if (limit.soft_min === null) {
            $(this).find('.min').addClass('center').html('-');
        } else {
            $(this).find('.min').removeClass('center').html(limit.soft_min);
            points -= limit.penalization * max(0, limit.soft_min - amount);
        }

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
        var times = passivePathways[pathway.pathway()][$(this).organ()];
        var available = times !== 0;
        $(this).toggleClass('good', available).toggleClass('bad', !available);
        if (available) {
            var points = times * parseInt(pathway.find('.points').text());
        }
        total += points;
        $(this).html(pathway.children('.name').text() + ' (x' + times + ')');
        $(this).siblings('.change').html(formatPoints(points));
    });
    LIMITED_RESOURCES.find('.total').html(formatPoints(total));
}

function formatPoints(points)
{
    return (points < 0 ? '' : '+') + points.toFixed(2);
}
