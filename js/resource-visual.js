var RESOURCE_VISUAL;

$(document).ready(function() {
    RESOURCE_VISUAL = $('#resource-visual');

    RESOURCE_VISUAL.find('.fa-times').click(function() {
        updateResourceVisual();
        RESOURCE_VISUAL.fadeOut();
        PATHWAYS.removeClass('source destination');
    });

    RESOURCE_VISUAL.find('.filter').find('.btn').click(function() {
        if ($(this).hasClass('reactant')) {
            FILTER.find('.reactant').val(RESOURCE_VISUAL.find('.name').text());
        }
        if ($(this).hasClass('product')) {
            FILTER.find('.product').val(RESOURCE_VISUAL.find('.name').text());
        }
        onFilterChange();
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
            url: '/index.php/site/resourceInfo',
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

                if (data.hard_min !== null) {
                    RESOURCE_VISUAL.find('.hard_min').html(
                        'Hard Min: ' + data.hard_min
                    );
                }
                if (data.hard_max !== null) {
                    RESOURCE_VISUAL.find('.hard_max').html(
                        'Hard Max: ' + data.hard_max
                    );
                }
                if (data.soft_min !== null) {
                    RESOURCE_VISUAL.find('.soft_min').html(
                        'Soft Min: ' + data.soft_min
                    );
                }
                if (data.soft_max !== null) {
                    RESOURCE_VISUAL.find('.soft_max').html(
                        'Soft Max: ' + data.soft_max
                    );
                }

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
