$(document).ready(function() {
    $('#filter')
        .find('input[type=text]').change(function() {
            setTimeout(onFilterChange, 0);
        })
        .end()
        .find('input[type=button]:not(.clear)').click(function() {
            setTimeout(onFilterChange, 0);
        })
        .end()
        .find('input[type=checkbox]').click(function() {
            setTimeout(onFilterChange, 0);
        })
        .end()
        .find('.clear').click(function() {
            $('#filter')
                .find('input[type=text]').val('')
                .end()
                .find('input[type=button]').removeClass('active')
                .end()
                .find('input[type=checkbox]').prop('checked', true);
            onFilterChange();
        });
});

function resizeFilter()
{
    $('#filter')
        .find('.name').each(function() {
            var w = $(this).parent().outerWidth();
            $(this).siblings().each(function() {
                w -= $(this).outerWidth();
            });
            $(this).outerWidth(w);
        })
        .end()
        .find('.product, .reactant').each(function() {
            var row = $(this).parents('.row');
            var w = row.outerWidth()/row.find('.product, .reactant').length;
            $(this).siblings().each(function() {
                w -= $(this).outerWidth() + parseInt($(this).css('border-left-width')) + 
                    parseInt($(this).css('border-right-width'));
            });
            $(this).outerWidth(w);
        });
}

function onFilterChange()
{
    var filter = $('#filter');
    var name            = filter.find('.name').val();
    var showAvailable   = filter.find('.available').hasClass('active');
    var showUnavailable = filter.find('.unavailable').hasClass('active');
    var showCatabolic   = filter.find('.catabolic').hasClass('active');
    var showAnabolic    = filter.find('.anabolic').hasClass('active');
    var showPassive     = filter.find('.passive').is(':checked');
    var reactant        = filter.find('.reactant').val();
    var product         = filter.find('.product').val();

    name     = name     ? new RegExp(name,     'i') : name;
    reactant = reactant ? new RegExp(reactant, 'i') : reactant;
    product  = product  ? new RegExp(product,  'i') : product;
    if (!showAvailable && !showUnavailable) {
        showAvailable = true;
        showUnavailable = true;
    }

    $('.pathway').each(function() {
        var organ = $(this).parents('.pathway-holder').attr('value');
        if (name && !name.test($(this).find('.name').text())) {
            return $(this).slideUp();
        }

        if (!showPassive && $(this).children('.passive').length) {
            return $(this).slideUp();
        }

        var pathwayAvailable = $(this).attr('available');
        if ((showAvailable && !showUnavailable && !pathwayAvailable) || (!showAvailable && showUnavailable && pathwayAvailable)) {
            return $(this).slideUp();
        }

        var pathwayCatabolic = $(this).children('.catabolic').length;
        var pathwayAnabolic = $(this).children('.anabolic').length;
        if ((showCatabolic && !pathwayCatabolic) || (showAnabolic && !pathwayAnabolic)) {
            return $(this).slideUp();
        }

        if (reactant) {
            var match = false;
            $(this).find('.reactant.name').each(function() {
                if (match) {
                    return;
                }

                var names = getRes($(this).res(), $(this).organ()).attr('names').split(';');
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

                var names = getRes($(this).res(), $(this).organ()).attr('names').split(';');
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