var RESOURCE_VISUAL;

$(document).ready(function() {
    RESOURCE_VISUAL = $('#resource-visual');

    RESOURCE_VISUAL.find('.icon-remove').click(function() {
        updateResourceVisual();
        RESOURCE_VISUAL.fadeOut();
        PATHWAYS.removeClass('source destination');
    });

    $('.res-info-source').click(function() {
        var res = $(this).res();
        if (RESOURCE_VISUAL.res() !== res) {
            if (RESOURCE_VISUAL.res()) {
                RESOURCE_VISUAL.fadeOut(function() {
                    updateResourceVisual(res, function() {
                        RESOURCE_VISUAL.fadeIn();
                    });
                });
            } else {
                updateResourceVisual(res, function() {
                    RESOURCE_VISUAL.fadeIn();
                });
            }
            
            PATHWAYS.each(function() {
                $(this).toggleClass(
                    'destination',
                    $(this).find('.reactant[res="' + res + '"]').length > 0
                );
                $(this).toggleClass(
                    'source',
                    $(this).find('.product[res="' + res + '"]').length > 0
                );
            });
        }
    });
});

function updateResourceVisual(res, onComplete)
{
    if (typeof res === 'undefined') {
        RESOURCE_VISUAL.removeAttr('res');
    } else {
        $.ajax({
            url: 'index.php/site/resourceInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                resource_id: res
            },
            success: function(data) {
                RESOURCE_VISUAL.res(res);
                RESOURCE_VISUAL.find('.name').html(data.name);
                RESOURCE_VISUAL.find('.aliases').html(
                    'Aliases: ' + data.aliases.join(', ')
                );
                RESOURCE_VISUAL.find('.formula').html(
                    'Formula: ' + 
                        data.formula.replace(/(\d+)/g, "<sub>$1</sub>")
                );
                RESOURCE_VISUAL.find('.hard_min').html(
                    getLimitText('Hard Min: ', data.hard_min, data.rel_hard_min)
                );
                RESOURCE_VISUAL.find('.hard_max').html(
                    getLimitText('Hard Max: ', data.hard_max, data.rel_hard_max)
                );
                RESOURCE_VISUAL.find('.soft_min').html(
                    getLimitText('Soft Min: ', data.soft_min, data.rel_soft_min)
                );
                RESOURCE_VISUAL.find('.soft_max').html(
                    getLimitText('Soft Max: ', data.soft_max, data.rel_soft_max)
                );
                RESOURCE_VISUAL.find('.description').html(data.description);
                updateResourceVisualImage();
                if (typeof onComplete === 'function') {
                    onComplete();    
                }
            }
        });
    }
}

function updateResourceVisualImage()
{
    if (RESOURCE_VISUAL.res()) {
        RESOURCE_VISUAL.find('.image').attr(
            'src',
            '/img/resources/' + getColorTheme().type + '/' + 
                RESOURCE_VISUAL.find('.name').text().toLowerCase() + '.png'
        );
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
