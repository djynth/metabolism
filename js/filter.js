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

    name     = name     ? new RegExp(name,     'i') : name;
    reactant = reactant ? new RegExp(reactant, 'i') : reactant;
    product  = product  ? new RegExp(product,  'i') : product;
    if (!showAvailable && !showUnavailable) {
        showAvailable = true;
        showUnavailable = true;
    }

    $('.pathway').each(function() {
        var organ = $(this).parents('.pathway-holder').attr('value');
        if (name && !name.test($(this).find('.title').text())) {
            return $(this).slideUp();
        }

        if (!showPassive && $(this).children('.passive').length) {
            return $(this).slideUp();
        }

        var pathwayAvailable = $(this).attr('available') === 'true';
        if ((showAvailable && !showUnavailable && !pathwayAvailable) || (!showAvailable && showUnavailable && pathwayAvailable)) {
            return $(this).slideUp();
        }

        var pathwayCatabolic = $(this).attr('catabolic') !== undefined;
        var pathwayAnabolic = $(this).attr('anabolic') !== undefined;
        if ((showCatabolic && !pathwayCatabolic) || (showAnabolic && !pathwayAnabolic)) {
            return $(this).slideUp();
        }

        if (reactant) {
            var match = false;
            $(this).find('.reactant.name').each(function() {
                if (match) {
                    return;
                }

                res = getResourceElement($(this).attr('res-id'), $(this).attr('organ-id'));
                var names = res.attr('aliases').split(';');
                for (var i = 0; i < names.length; i++) {
                    if (reactant.test(names[i])) {
                        match = true;
                        break;
                    }
                }
            });

            if (!match) {
                return $(this).slideUp();
            }
        }

        if (product) {
            var match = false;
            $(this).find('.product.name').each(function() {
                if (match) {
                    return;
                }

                res = getResourceElement($(this).attr('res-id'), $(this).attr('organ-id'));
                var names = res.attr('aliases').split(';');
                for (var i = 0; i < names.length; i++) {
                    if (product.test(names[i])) {
                        match = true;
                        break;
                    }
                }
            });

            if (!match) {
                return $(this).slideUp();
            }
        }

        return $(this).slideDown();
    })
}