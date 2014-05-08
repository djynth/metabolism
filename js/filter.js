$(document).ready(function() {
    $('#filter-name, #filter-reactant, #filter-product').change(onFilterChange);

    $('#filter-available, #filter-unavailable, #filter-catabolic, #filter-anabolic, #filter-passive').click(function() {
        window.setTimeout(onFilterChange, 0);   // wait for other events bound to the button to finish so that the
                                                // 'active' property is accurately set
    });

    $('#filter-clear').click(function() {
        $('#filter-name, #filter-reactant, #filter-product').val('');
        $('#filter-available, #filter-unavailable, #filter-catabolic, #filter-anabolic').removeClass('active');
        onFilterChange();
    });
});

function resizeFilter()
{
    $('#filter-row-search').find('input').each(function() {
        var w = $(this).parent().outerWidth();
        $(this).siblings().each(function() {
            w -= $(this).outerWidth();
        });
        $(this).outerWidth(w);
    });

    $('#filter-row-reaction').each(function() {
        var rowWidth = $(this).outerWidth();
        var inputs = $(this).find('input');

        inputs.each(function() {
            var w = rowWidth/inputs.length;
            $(this).siblings().each(function() {
                w -= $(this).outerWidth() + parseInt($(this).css('border-left-width')) + 
                    parseInt($(this).css('border-right-width'));
            });
            $(this).outerWidth(w);
        });
    });
}

function onFilterChange()
{
    var name            = $('#filter-name').val();
    var showAvailable   = $('#filter-available').hasClass('active');
    var showUnavailable = $('#filter-unavailable').hasClass('active');
    var showCatabolic   = $('#filter-catabolic').hasClass('active');
    var showAnabolic    = $('#filter-anabolic').hasClass('active');
    var showPassive     = $('#filter-passive').is(':checked');
    var reactant        = $('#filter-reactant').val();
    var product         = $('#filter-product').val();

    if (name) {
        name = new RegExp(name, 'i');
    }
    if (reactant) {
        reactant = new RegExp(reactant, 'i');
    }
    if (product) {
        product = new RegExp(product, 'i');
    }
    if (!showAvailable && !showUnavailable) {
        showAvailable = true;
        showUnavailable = true;
    }

    $('.pathway').attr('filter', 'true').each(function() {
        var pathwayName = $(this).find('.title').text();
        var organ = $(this).parents('.pathway-holder').attr('value');
        if (name && !name.test(pathwayName)) {
            $(this).attr('filter', 'false');
            return;
        }

        if (!showPassive && $(this).children('.passive').length) {
            $(this).attr('filter', 'false');
            return;
        }

        var pathwayAvailable = $(this).attr('available') === 'true';
        if ((showAvailable && !showUnavailable && !pathwayAvailable) || (!showAvailable && showUnavailable && pathwayAvailable)) {
            $(this).attr('filter', 'false');
            return;
        }

        var pathwayCatabolic = $(this).attr('catabolic') !== undefined;
        var pathwayAnabolic = $(this).attr('anabolic') !== undefined;
        if ((showCatabolic && !pathwayCatabolic) || (showAnabolic && !pathwayAnabolic)) {
            $(this).attr('filter', 'false');
            return;
        }

        if (reactant) {
            var pathwayReactants = new Array;
            $(this).find('.reactant.name').each(function() {
                var global = $(this).hasClass('global');
                pathwayReactants.push(getResourceElement(
                    $(this).attr('res-id'),
                    global ? '1' : organ
                ));
            });

            var match = false;
            for (var i = 0; i < pathwayReactants.length; i++) {
                var names = pathwayReactants[i].attr('aliases').split(';');
                for (var j = 0; j < names.length; j++) {
                    if (reactant.test(names[j])) {
                        match = true;
                        break;
                    }
                }

                if (match) {
                    break;
                }
            }

            if (!match) {
                $(this).attr('filter', 'false');
                return;
            }
        }

        if (product) {
            var pathwayProducts = new Array;
            $(this).find('.product.name').each(function() {
                pathwayProducts.push(getResourceElement(
                    $(this).attr('res-id'),
                    global ? '1' : organ
                ));
            });

            var match = false;
            for (var i = 0; i < pathwayProducts.length; i++) {
                var names = pathwayProducts[i].attr('aliases').split(';');
                for (var j = 0; j < names.length; j++) {
                    if (product.test(names[j])) {
                        match = true;
                        break;
                    }
                }

                if (match) {
                    break;
                }
            }

            if (!match) {
                $(this).attr('filter', 'false');
                return;
            }
        }
    }).each(function() {
        if ($(this).attr('filter') == 'true') {
            $(this).slideDown();
        } else {
            $(this).slideUp();
        }
    });
}