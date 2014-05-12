var LIMITED_RESOURCES;

$(document).ready(function() {
    LIMITED_RESOURCES = $('#limited-resources');

    LIMITED_RESOURCES.find('.organ-header').click(function() {
        $(this).siblings('[organ="' + $(this).attr('organ') + '"]').toggle();
    });
});

function refreshLimitedResources(passivePathways)
{
    var total = 0;
    LIMITED_RESOURCES.find('.limited-resource').each(function() {
        var organ = $(this).organ();
        var res = getRes($(this).res(), organ);
        var amount = res.attr('amount');
        var points = 0;
        var pen = $(this).attr('pen');
        $(this).find('.max').each(function() {
            var max = min($(this).attr('max'), getRes($(this).attr('rel-max'), organ).attr('amount'));
            $(this).html(max);
            if (amount > max) {
                points -= pen * (amount - max);
            }
        });
        $(this).find('.min').each(function() {
            var min = max($(this).attr('min'), getRes($(this).attr('rel-min'), organ).attr('amount'));
            $(this).html(min);
            if (amount < min) {
                points -= pen * (min - amount);
            }
        });
        total += points;
        $(this).find('.amount').html(amount).toggleClass('good', points >= 0).toggleClass('bad', points < 0);
        $(this).find('.change').html(formatPoints(points));
    });
    LIMITED_RESOURCES.find('.process').each(function() {
        var pathway = getPathway($(this).pathway(), $(this).organ());
        var points = 0;
        if (passivePathways[pathway.pathway()][$(this).organ()]) {
            $(this).addClass('good').removeClass('bad');
            var points = $(this).attr('times') * pathway.find('.points').text();
        } else {
            $(this).addClass('bad').removeClass('good');
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
