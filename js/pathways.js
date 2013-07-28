$(document).ready(function() {
    resizeFilter(true);

    $(window).resize(function() { resizeFilter(false); });

    $('.pathway-run').click(function() {
        var id = parseInt($(this).parents('.pathway').attr('value'));
        var organ = parseInt($(this).parents('.pathway-holder').attr('value'));
        var times = parseInt($(this).attr('value'));
        runPathway(id, times, organ);
    });

    $('.pathway-plus').click(function() {
        $(this).siblings('.pathway-run').attr('value', parseInt($(this).siblings('.pathway-run').attr('value')) + 1);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.pathway-minus').click(function() {
        $(this).siblings('.pathway-run').attr('value', parseInt($(this).siblings('.pathway-run').attr('value')) - 1);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.pathway-top').click(function() {
        $(this).siblings('.pathway-run').attr('value', -1);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.pathway-bottom').click(function() {
        $(this).siblings('.pathway-run').attr('value', 1);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.eat-run').click(function() {
        var foodHolder = $('.food-holder');
        var total = 0;
        var nutrients = new Array();
        foodHolder.find('.eat').each(function() {
            total += Math.max(0, parseInt($(this).attr('value')));
            nutrients[parseInt($(this).attr('id'))] = parseInt($(this).attr('value'));
        });
        var eatMax = parseInt(foodHolder.attr('eat-max'));

        if (total < eatMax) {
            $('#modal-header').html('Are You Sure?');
            $('#modal-content').html('You are eating less than you could! Your total nutrient intake of ' + 
                total + ' is less than the maximum of ' + eatMax);
            $('#modal-cancel').html('Cancel');
            $('#modal-confirm').html('Confirm');
            $('#modal-cancel').click(function() {
                $('.modal').modal('hide');
            });
            $('#modal-confirm').click(function() {
                $(this).unbind('click');
                $('.modal').modal('hide');
                eat(nutrients);
            });
            $('.modal').modal('show');
        } else {
            eat(nutrients);
        }
    });

    $('.eat-plus').click(function() {
        $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) + 1);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.eat-minus').click(function() {
        $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) - 1);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.eat-top').click(function() {
        $(this).siblings('.eat').attr('value', -1);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.eat-bottom').click(function() {
        $(this).siblings('.eat').attr('value', 0);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('#pathway-filter-icon').click(function() {
        $('#pathway-filter').slideToggle(function() {
            updateScrollbars(true);
        });
    });

    $('#filter-name, #filter-reactant, #filter-product').change(onFilterChange);
    $('#filter-available, #filter-unavailable, #filter-catabolic, #filter-anabolic').click(function() {
        window.setTimeout(onFilterChange, 0);       // wait for other events bound to the button to finish
    });

    $('#filter-clear').click(function() {
        $('#filter-name, #filter-reactant, #filter-product').val('');
        $('#filter-available, #filter-unavailable, #filter-catabolic, #filter-anabolic').removeClass('active');
        onFilterChange();
    });
});

function resizeFilter(hide)
{
    $('#filter-row-search input').each(function() {
        var w = $(this).parent().outerWidth();
        $(this).siblings().each(function() {
            w -= $(this).outerWidth();
        });
        $(this).outerWidth(w);
    });

    $('#filter-row-reaction').each(function() {
        var rowWidth = $(this).width();
        console.log(rowWidth);

        $(this).find('input').each(function() {
            var w = rowWidth/2;
            $(this).siblings().each(function() {
                w -= $(this).outerWidth();
            });
            $(this).outerWidth(w-2);    // subtract 2 for borders?
        });
    });

    if (hide) {
        $('#pathway-filter').hide();
    }
}

function refreshPathways()
{
    $('.pathway').each(function() {
        var lackingReactants = new Array();
        var organ = $(this).parents('.pathway-holder').attr('value');

        $(this).find('.reaction .reactant').each(function() {
            var resId = $(this).attr('res-id');
            var value = Math.abs(parseInt($(this).attr('value')));
            var actualOrgan = $(this).hasClass('global') ? '1' : organ;
            var amountAvailable = getResourceValue(resId, actualOrgan);

            if (value > amountAvailable) {
                $(this).addClass('lacking');
                lackingReactants.push(getResourceName(resId, actualOrgan));
            } else {
                $(this).removeClass('lacking');
            }
        });

        if (lackingReactants.length > 0) {
            $(this).find('.run-holder').hide();
            $(this).find('.lacking').show();

            var lackingList = 'Not enough ';
            for (var i = 0; i < lackingReactants.length; i++) {
                lackingList += lackingReactants[i];
                if (i != lackingReactants.length - 1) {
                    lackingList += ', ';
                }
            }
            $(this).find('p.lacking').html(lackingList + '.');

            $(this).css('box-shadow', '0px 0px');
            $(this).attr('available', 'false')
        } else {
            $(this).find('.run-holder').show();
            $(this).find('.lacking').hide();

            $(this).css('box-shadow', '0px 0px 7px #' + $(this).attr('color'));
            $(this).attr('available', 'true');
        }

        updatePathwayButtons($(this), organ);
    });

    updateEatButtons();
    updateScrollbars();
}

function updatePathwayButtons(pathway)
{
    if (pathway.attr('limit')) {
        return;
    }

    var organ = pathway.parents('.pathway-holder').attr('value');
    var runButton = pathway.find('.pathway-run');
    var times = parseInt(runButton.attr('value'));
    if (typeof times === 'undefined' || isNaN(times)) {
        times = 1;
    }
    
    var maxRuns = getMaxRuns(pathway.attr('value'), organ);
    var plus   = runButton.siblings('.pathway-plus');
    var minus  = runButton.siblings('.pathway-minus');
    var top    = runButton.siblings('.pathway-top');
    var bottom = runButton.siblings('.pathway-bottom');

    if (times == -1 || times > maxRuns) {
        times = maxRuns;
    } else if (times < 1) {
        times = 1;
    }

    runButton.attr('value', times);
    runButton.html('Run x' + times);

    if (times >= maxRuns) {
        plus.addClass('disabled').attr('disabled', 'disabled');
        top.addClass('disabled').attr('disabled', 'disabled');
    } else {
        plus.removeClass('disabled').removeAttr('disabled');
        top.removeClass('disabled').removeAttr('disabled');
    }

    if (times <= 1) {
        minus.addClass('disabled').attr('disabled', 'disabled');
        bottom.addClass('disabled').attr('disabled', 'disabled');
    } else {
        minus.removeClass('disabled').removeAttr('disabled');
        bottom.removeClass('disabled').removeAttr('disabled');
    }
}

function getMaxRuns(pathway, organ)
{
    var maxRuns = -1;
    $('.pathway[value="' + pathway + '"] .reactant').each(function() {
        var actualOrgan = $(this).hasClass('global') ? '1' : organ;
        var resId = parseInt($(this).attr('res-id'));
        var value = Math.abs(parseInt($(this).attr('value')));
        var amountAvailable = getResourceValue(resId, actualOrgan);
        var limit = Math.floor(amountAvailable/value);
        if (maxRuns == -1 || limit < maxRuns) {
            maxRuns = limit;
        }
    });
    return maxRuns;
}

function updateEatButtons()
{
    var foodHolder = $('.food-holder');
    var total = 0;
    foodHolder.find('.eat').each(function() { total += Math.max(0, parseInt($(this).attr('value'))); });
    var EAT_MAX = parseInt(foodHolder.attr('eat-max'));

    var full = total >= EAT_MAX;
    foodHolder.children('.btn-group').each(function() {
        var eat = $(this).find('.eat');

        if (eat.attr('value') == -1) {
            eat.attr('value', EAT_MAX - total);
            total = EAT_MAX;
            full = true;
        }

        eat.html(eat.attr('full-name') + ' x' + eat.attr('value'));

        if (eat.attr('value') <= 0) {
            $(this).find('.eat-minus').addClass('disabled').attr('disabled', 'disabled');
            $(this).find('.eat-bottom').addClass('disabled').attr('disabled', 'disabled');
        } else {
            $(this).find('.eat-minus').removeClass('disabled').removeAttr('disabled');
            $(this).find('.eat-bottom').removeClass('disabled').removeAttr('disabled');
        }
    });

    if (full) {
        foodHolder.find('.eat-plus').addClass('disabled').attr('disabled', 'disabled');
        foodHolder.find('.eat-top').addClass('disabled').attr('disabled', 'disabled');
    } else {
        foodHolder.find('.eat-plus').removeClass('disabled').removeAttr('disabled');
        foodHolder.find('.eat-top').removeClass('disabled').removeAttr('disabled');
    }

    foodHolder.siblings('.run-holder').find('.eat-run').html('Run [' + total + '/' + EAT_MAX + ']')
}

function eat(nutrients)
{
    $.ajax({
        url: 'index.php?r=site/eat',
        type: 'POST',
        dataType: 'json',
        data: {
            nutrients: nutrients,
        },
        success: function(data) {
            onPathwaySuccess(data);
        },
        error: function(xhr, status, error) {
            onPathwayError(xhr, error);
        }
    });
}

function runPathway(pathwayId, times, organ)
{
    $.ajax({
        url: 'index.php?r=site/pathway',
        type: 'POST',
        dataType: 'json',
        data: {
            pathway_id: pathwayId,
            times: times,
            organ: organ,
        },
        success: function(data) {
            onPathwaySuccess(data);
        },
        error: function(xhr, status, error) {
            onPathwayError(xhr, error);
        }
    });
}

function onPathwaySuccess(data)
{
    if (data.success) {
        setTurn(data.turn, data.max_turns);
        setPoints(data.points);
        refreshResources(data.resources);
        setPh(data.ph);
    } else {
        notify('Unable to run ' + data.pathway_name + '.', 'warning');
    }
}

function onPathwayError(xhr, error)
{
    notify('Internal error: ' + error, 'error');
    console.log(xhr);
}

function onFilterChange()
{
    var name            = $('#filter-name').val();
    var showAvailable   = $('#filter-available').hasClass('active');
    var showUnavailable = $('#filter-unavailable').hasClass('active');
    var showCatabolic   = $('#filter-catabolic').hasClass('active');
    var showAnabolic    = $('#filter-anabolic').hasClass('active');
    var reactant        = $('#filter-reactant').val();
    var product         = $('#filter-product').val();

    if (name) {
        name = new RegExp(name, 'i');
    }
    if (!showAvailable && !showUnavailable) {
        showAvailable = true;
        showUnavailable = true;
    }
    if (!showCatabolic && !showAnabolic) {
        showCatabolic = true;
        showAnabolic = true;
    }

    $('.pathway').each(function() {
        $(this).attr('filter', 'true')
    }).each(function() {
        var pathwayName = $(this).find('.title').html();
        var pathwayAvailable = $(this).attr('available') === 'true';
        var pathwayCatabolic = $(this).attr('catabolic') === 'true';

        var matchesReactant = true;
        var matchesProduct = true;

        if (reactant) {
            $.ajax({
                url: 'index.php?r=site/reactants',
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {
                    pathway: $(this).attr('value'),
                    reactant: reactant
                },
                success: function(data) {
                    console.log(data.match);
                    matchesReactant = data.match;
                }
            });
        }
        if (product) {
            $.ajax({
                url: 'index.php?r=site/products',
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {
                    pathway: $(this).attr('value'),
                    product: product
                },
                success: function(data) {
                    matchesProduct = data.match;
                }
            });
        }

        console.log('done: ' + matchesReactant);

        if ((name && !name.test(pathwayName)) || 
            (showAvailable && !showUnavailable && !pathwayAvailable) ||
            (!showAvailable && showUnavailable && pathwayAvailable)  || 
            (showCatabolic && !showAnabolic && !pathwayCatabolic) ||
            (!showCatabolic && showAnabolic && pathwayCatabolic) ||
            !matchesReactant || !matchesProduct)
        {
            $(this).attr('filter', 'false');
        }
    }).each(function() {
        if ($(this).attr('filter') == 'true') {
            $(this).slideDown();
        } else {
            $(this).slideUp();
        }
    }).promise().done(function() {
        updateScrollbars(true);
    });
}
