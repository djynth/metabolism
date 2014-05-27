var FILTER;

$(document).ready(function() {
    FILTER = $('#filter');

    FILTER.find('input[type=text]').change(function() {
        setTimeout(onFilterChange, 0);
    });
    FILTER.find('input[type=button]:not(.clear)').click(function() {
        setTimeout(onFilterChange, 0);
    });
    FILTER.find('input[type=checkbox]').click(function() {
        setTimeout(onFilterChange, 0);
    });
    FILTER.find('.clear').click(function() {
        FILTER.find('input[type=text]').val('');
        FILTER.find('input[type=button]').removeClass('active');
        FILTER.find('input[type=checkbox]').prop('checked', true);
        onFilterChange();
    });
});

function resizeFilter()
{
    FILTER.find('input[type=text]').each(function() {
        $(this).outerWidth($(this).parent().width());
    });
}

function isFilterActive()
{
    return FILTER.attr('active');
}

function onFilterChange()
{
    var name            = FILTER.find('.name').val();
    var showAvailable   = FILTER.find('.available').hasClass('active');
    var showUnavailable = FILTER.find('.unavailable').hasClass('active');
    var showCatabolic   = FILTER.find('.catabolic').hasClass('active');
    var showAnabolic    = FILTER.find('.anabolic').hasClass('active');
    var showPassive     = FILTER.find('.passive').is(':checked');
    var reactant        = FILTER.find('.reactant').val();
    var product         = FILTER.find('.product').val();

    name     = name     ? new RegExp(name,     'i') : name;
    reactant = reactant ? new RegExp(reactant, 'i') : reactant;
    product  = product  ? new RegExp(product,  'i') : product;
    if (!showAvailable && !showUnavailable) {
        showAvailable = true;
        showUnavailable = true;
    }
    if (!showCatabolic && !showAnabolic) {
        showCatabolic = true;
        showAnabolic = true;
    }

    if (!name && showAvailable && showUnavailable && showCatabolic && 
        showAnabolic && showPassive && !reactant && !product) {
        FILTER.removeAttr('active');
        PATHWAYS.slideDown();
    } else {
        FILTER.attr('active', true);
        var shown = $();
        var hidden = $();
        
        PATHWAYS.each(function() {
            if (name && !name.test($(this).find('.name').text())) {
                hidden = hidden.add($(this));
                return;
            }

            if (!showPassive && $(this).children('.passive').length) {
                hidden = hidden.add($(this));
                return;
            }

            var pathwayAvailable = $(this).attr('available');
            if ((showAvailable && !showUnavailable && !pathwayAvailable) || 
                (!showAvailable && showUnavailable && pathwayAvailable)) {
                hidden = hidden.add($(this));
                return;
            }

            var pathwayCatabolic = $(this).children('.catabolic').length;
            var pathwayAnabolic = $(this).children('.anabolic').length;
            if ((showCatabolic && !showAnabolic && !pathwayCatabolic) || 
                (showAnabolic && !showCatabolic && !pathwayAnabolic)) {
                hidden = hidden.add($(this));
                return;
            }

            if (reactant) {
                var match = false;
                $(this).find('.reactant.name').each(function() {
                    var names = getRes($(this).res(), $(this).organ()).attr(
                        'names'
                    ).split(';');
                    for (var i = 0; i < names.length; i++) {
                        if (reactant.test(names[i])) {
                            match = true;
                            return false;
                        }
                    }
                });

                if (!match) {
                    hidden = hidden.add($(this));
                    return;
                }
            }

            if (product) {
                var match = false;
                $(this).find('.product.name').each(function() {
                    var names = getRes($(this).res(), $(this).organ()).attr(
                        'names'
                    ).split(';');
                    for (var i = 0; i < names.length; i++) {
                        if (product.test(names[i])) {
                            match = true;
                            return false;
                        }
                    }
                });

                if (!match) {
                    hidden = hidden.add($(this));
                    return;
                }
            }

            shown = shown.add($(this));
        });

        shown.slideDown();
        hidden.slideUp();
    }
}