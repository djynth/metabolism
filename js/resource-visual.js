$(document).ready(function() {
    $('#resource-visual').find('.icon-remove').click(function() {
        updateResourceVisual().fadeOut();
        $('.pathways').find('.pathway').removeClass('source destination');
    });

    $('.res-info-source').click(function() {
        var visual = $('#resource-visual');
        var res = $(this).res();
        if (visual.res() !== res) {
            if (visual.res()) {
                visual.fadeOut(function() {
                    updateResourceVisual(res, visual, function() {
                        visual.finish().fadeIn();
                    });
                });
            } else {
                updateResourceVisual(res, visual, function() {
                    visual.finish().fadeIn();
                });
            }
            
            $('.pathways').find('.pathway').each(function() {
                $(this).toggleClass('destination', $(this).find('.reactant[res="' + res + '"]').length > 0);
                $(this).toggleClass('source', $(this).find('.product[res="' + res + '"]').length > 0);
            });
        }
    });
});

function updateResourceVisual(res, visual, onComplete)
{
    visual = typeof visual === 'undefined' ? $('#resource-visual') : visual;

    if (typeof res === 'undefined') {
        return visual.removeAttr('res');
    } else {
        $.ajax({
            url: 'index.php/site/resourceInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                resource_id: res
            },
            success: function(data) {
                visual.res(res);
                visual.find('.name').html(data.name);
                visual.find('.aliases').html('Aliases: ' + data.aliases.join(', '));
                visual.find('.formula').html('Formula: ' + data.formula.replace(/(\d+)/g, "<sub>$1</sub>"));
                visual.find('.hard_min').html(getLimitText('Hard Min: ', data.hard_min, data.rel_hard_min));
                visual.find('.hard_max').html(getLimitText('Hard Max: ', data.hard_max, data.rel_hard_max));
                visual.find('.soft_min').html(getLimitText('Soft Min: ', data.soft_min, data.rel_soft_min));
                visual.find('.soft_max').html(getLimitText('Soft Max: ', data.soft_max, data.rel_soft_max));
                visual.find('.description').html(data.description);
                visual.find('.image').attr('src', '/img/resources/' + data.name.toLowerCase() + '.png');
                if (typeof onComplete === 'function') {
                    onComplete();    
                }
            }
        });

        return visual;
    }
}

function getLimitText(prefix, limit, rel_limit)
{
    if (limit && rel_limit) {
        return prefix + limit + ', ' + getRes(rel_limit).attr('name');
    }
    if (limit) {
        return prefix + limit;
    }
    if (rel_limit) {
        return prefix + getRes(rel_limit).attr('name');
    }
    return '';
}
