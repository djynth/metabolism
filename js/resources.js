function getRes(resource, organ)
{
    if (typeof organ === 'undefined') {
        var resources = $('.resources');
    } else {
        var resources = $('.resources[organ="' + organ + '"]');
    }
    return resources.find('.res[res="' + resource + '"]').first();
}

function refreshResources(resources)
{
    for (var resource in resources) {
        for (var organ in resources[resource]) {
            var amount = resources[resource][organ];
            var res = getRes(resource, organ);

            if (typeof res.attr('amount') !== 'undefined') {
                var change = amount - parseInt(res.attr('amount'));
                if (change === 0) {
                    continue;
                }

                var increase = change > 0 ? 'increase' : 'decrease';
                res.addClass(increase).delay(1000).queue(function() {
                    $(this).removeClass('increase decrease').dequeue();
                });
            }

            updateRes(res, amount);
        }
    }
}

function updateRes(res, amount)
{
    res.attr('amount', amount);
    res.find('.amount').html(amount);
    res.find('.bar').css('width', Math.min(100, 100*(amount/parseInt(res.attr('max-shown')))) + '%');
}

function refreshResourceLimits()
{
    $('.resources').find('.res').each(function() {
        var maxShown = $(this).attr('max-shown');
        var organ = $(this).organ();
        $(this).find('.limit').each(function() {
            var val1 = null, val2 = null;
            if (typeof $(this).attr('rel-limit') !== "undefined") {
                val1 = getRes($(this).attr('rel-limit'), organ).attr('amount');
            }
            if (typeof $(this).attr('limit') !== "undefined") {
                val2 = $(this).attr('limit');
            }
            if (val1 === null && val2 === null) {
                return;
            }

            if ($(this).hasClass('max')) {
                $(this).width(min(100, 100*(maxShown - min(val1, val2))/maxShown) + "%");
            } else {
                $(this).width(max(0, 100*max(val1, val2)/maxShown) + "%");
            }
        });
    });
}
