var SOURCE_HIGHLIGHT_COLOR      = '82,117,255';
var DESTINATION_HIGHLIGHT_COLOR = '233,25,44';

$(document).ready(function() {
    $(window).resize(resizeFilter);

    $('.pathway-run').click(function() {
        var id = parseInt($(this).parents('.pathway').attr('value'));
        var organ = parseInt($(this).parents('.pathway-holder').attr('value'));
        var times = parseInt($(this).attr('value'));
        var reverse = $(this).parents('.pathway-holder').find('.pathway-reverse').hasClass('active');
        console.log(reverse);
        runPathway(id, times, organ, reverse);
    });

    $('.pathway-plus').click(function() {
        var run = $(this).siblings('.pathway-run');
        run.attr('value', parseInt(run.attr('value')) + 1);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.pathway-minus').click(function() {
        var run = $(this).siblings('.pathway-run');
        run.attr('value', parseInt(run.attr('value')) - 1);
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
            nutrients[parseInt($(this).attr('res-id'))] = parseInt($(this).attr('value'));
        });
        var eatMax = parseInt(foodHolder.attr('eat-max'));

        if (total < eatMax) {
            notifyBottom($('<div>')
                .addClass('eat-confirm')
                .append($('<p>')
                    .text('You are eating less than you could! Your total nutrient intake of ' + total + 
                          ' is less than the maximum of ' + eatMax))
                .append($('<button>')
                    .text('Cancel')
                    .addClass('btn')
                    .click(function() {
                        notifyBottom(false);
                    }))
                .append($('<button>')
                    .text('Confirm')
                    .addClass('btn')
                    .click(function() {
                        notifyBottom(false);
                        eat(nutrients);
                    })), -1);
        } else {
            eat(nutrients);
        }
    });

    $('.eat-plus').click(function() {
        var eat = $(this).siblings('.eat');
        eat.attr('value', parseInt(eat.attr('value')) + 1);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.eat-minus').click(function() {
        var eat = $(this).siblings('.eat');
        eat.attr('value', parseInt(eat.attr('value')) - 1);
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

    $('.pathway-reverse').click(function() {
        $(this).parents('.pathway').find('.points').each(function() {
            $(this).text(-parseInt($(this).text()));
        });
        $(this).parents('.pathway').find('.reaction').find('tr:not(.header)').each(function() {
            $(this).children().removeClass('limiting-reagent lacking');
            $(this).find('.reactant').removeClass('reactant').addClass('temp');
            $(this).find('.product').removeClass('product').addClass('reactant');
            $(this).find('.temp').removeClass('temp').addClass('product');
            $(this).find('.value').each(function() {
                $(this).text(-parseInt($(this).text()));
            });
            var children = $(this).children();

            $(this).empty();
            $(this).append(children.get().reverse());
        });

        refreshPathways();      // TODO: only refresh the pathway that was reversed
    });

    $('#pathway-filter-toggle').click(function() {
        var resizedFilter = false;
        $('#pathway-filter').slideToggle({
            progress: function() {
                updateScrollbars(true, false, false);
                if (!resizedFilter) {
                    resizeFilter();
                    resizedFilter = true;
                }
            },
            complete: function() {
                updateScrollbars(true, false, true);
            }
        });
    });

    $('#filter-name, #filter-reactant, #filter-product').change(onFilterChange);

    $('#filter-available, #filter-unavailable, #filter-catabolic, #filter-anabolic').click(function() {
        window.setTimeout(onFilterChange, 0);   // wait for other events bound to the button to finish so that buttons'
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

function refreshPathways()
{
    $('.pathway').each(function() {
        var limitingReagents = new Array();
        var limitingReagentMult;
        var lackingReactants = new Array();
        var organ = $(this).parents('.pathway-holder').attr('value');

        $(this).find('.reactant.name').each(function() {
            var resId = $(this).attr('res-id');
            var actualOrgan = $(this).hasClass('global') ? '1' : organ;
            var requiredAmount = Math.abs(parseInt($(this).siblings('.reactant.value').text()));
            var actualAmount = getResourceValue(resId, actualOrgan);

            var mult = Math.floor(actualAmount/requiredAmount);
            if (limitingReagents.length == 0 || mult < limitingReagentMult) {
                limitingReagents = new Array();
                limitingReagentMult = mult;
            }
            if (mult <= limitingReagentMult) {
                limitingReagents.push(resId);
            }

            if (requiredAmount > actualAmount) {
                $(this).addClass('lacking');
                lackingReactants.push(getResourceName(resId, actualOrgan));
            } else {
                $(this).removeClass('lacking');
            }

            $(this).removeClass('limiting-reagent');
        });

        for (var i = 0; i < limitingReagents.length; i++) {
            $(this).find('.reactant[res-id="' + limitingReagents[i] + '"]:not(.lacking)').addClass('limiting-reagent');
        }

        if (lackingReactants.length > 0) {
            $(this).find('.run-holder').hide();
            $(this).find('p.lacking').show();

            var lackingList = 'Not enough ';
            for (var i = 0; i < lackingReactants.length; i++) {
                lackingList += lackingReactants[i];
                if (i == lackingReactants.length - 1) {
                    lackingList += '.';
                } else {
                    lackingList += ', ';
                }
            }
            $(this).find('p.lacking').text(lackingList);

            $(this).css('box-shadow', '0 0');
            $(this).attr('available', 'false')
        } else {
            $(this).find('.run-holder').show();
            $(this).find('p.lacking').hide();

            $(this).css('box-shadow', '0 0 7px #' + $(this).attr('color'));
            $(this).attr('available', 'true');
        }

        updatePathwayButtons($(this));
    });

    updateEatButtons();
}

function updatePathwayButtons(pathway)
{
    if (pathway.attr('limit')) {
        return;
    }

    var organ = pathway.parents('.pathway-holder').attr('value');
    var runButton = pathway.find('.pathway-run');
    var times = parseInt(runButton.attr('value'));
    var maxRuns = getMaxRuns(pathway.attr('value'), organ);
    if (typeof times === 'undefined' || isNaN(times) || 
        times < 1 || times > maxRuns) {
        times = maxRuns;
    }
    
    var plus   = runButton.siblings('.pathway-plus');
    var minus  = runButton.siblings('.pathway-minus');
    var top    = runButton.siblings('.pathway-top');
    var bottom = runButton.siblings('.pathway-bottom');

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
    $('.pathway[value="' + pathway + '"]').find('.reactant.name').each(function() {
        var actualOrgan = $(this).hasClass('global') ? '1' : organ;
        var resId = parseInt($(this).attr('res-id'));
        var value = Math.abs(parseInt($(this).siblings('.reactant.value').text()));
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

        var resId = parseInt(eat.attr('res-id'));
        var resName = '';
        if (resId === 4) {
            resName = 'Carbohydrate (Glucose)';
        } else if (resId === 5) {
            resName = 'Protein (Alanine)';
        } else if (resId === 6) {
            resName = 'Fat (TAGs)';
        }

        eat.html(resName + ' x' + eat.attr('value'));

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
    if (!gameOver) {
        $.ajax({
            url: 'index.php/site/eat',
            type: 'POST',
            dataType: 'json',
            data: {
                nutrients: nutrients
            },
            success: function(data) {
                onPathwaySuccess(data);
            }
        });
    }
}

function runPathway(pathwayId, times, organ, reverse)
{
    if (!gameOver) {
        $.ajax({
            url: 'index.php/site/pathway',
            type: 'POST',
            dataType: 'json',
            data: {
                pathway_id: pathwayId,
                times: times,
                organ_id: organ,
                reverse: reverse,
            },
            success: function(data) {
                onPathwaySuccess(data);
            }
        });
    }
}

function onPathwaySuccess(data)
{
    if (data.success) {
        setTurn(data.turn);
        setPoints(data.points);
        refreshResources(data.resources);

        if (data.game_over) {
            gameOver = true;
            setTimeout(onGameOver, 1500);
        }
    }
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
    if (!showCatabolic && !showAnabolic) {
        showCatabolic = true;
        showAnabolic = true;
    }

    $('.pathway').attr('filter', 'true').each(function() {
        var pathwayName = $(this).find('.title').text();
        if (name && !name.test(pathwayName)) {
            $(this).attr('filter', 'false');
            return;
        }

        var pathwayAvailable = $(this).attr('available') === 'true';
        if ((showAvailable && !showUnavailable && !pathwayAvailable) || (!showAvailable && showUnavailable && pathwayAvailable)) {
            $(this).attr('filter', 'false');
            return;
        }
        var pathwayCatabolic = $(this).attr('catabolic') === 'true';
        if ((showCatabolic && !showAnabolic && !pathwayCatabolic) || (!showCatabolic && showAnabolic && pathwayCatabolic)) {
            $(this).attr('filter', 'false');
            return;
        }

        if (reactant) {
            var pathwayReactants = new Array;
            $(this).find('.reactant').each(function() {
                pathwayReactants.push(getResourceElement($(this).attr('res-id')));
            });

            var match = false;
            for (var i = 0; i < pathwayReactants.length; i++) {
                if (reactant.test(pathwayReactants[i].attr('abbr')) ||
                    reactant.test(pathwayReactants[i].attr('name')) ||
                    reactant.test(pathwayReactants[i].attr('full-name')))
                {
                    match = true;
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
            $(this).find('.product').each(function() {
                pathwayProducts.push(getResourceElement($(this).attr('res-id')));
            });

            var match = false;
            for (var i = 0; i < pathwayProducts.length; i++) {
                if (product.test(pathwayProducts[i].attr('abbr')) ||
                    product.test(pathwayProducts[i].attr('name')) ||
                    product.test(pathwayProducts[i].attr('full-name')))
                {
                    match = true;
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
    }).promise().done(function() {
        updateScrollbars(true, false, true);
    });
}

function highlightSource(pathwayId, highlight)
{
    var pathway = $('.pathway[value="' + pathwayId + '"]');
    pathway.addClass('source');
    if (highlight) {
        pathway.find('.pathway-inner').stop().animate({
            boxShadow: '0 0 9px rgb(' + SOURCE_HIGHLIGHT_COLOR + ') inset',
            borderColor: 'rgb(' + SOURCE_HIGHLIGHT_COLOR + ')'
        });
    } else {
        pathway.find('.pathway-inner').stop().animate({
            boxShadow: '0 0 9px rgba(' + SOURCE_HIGHLIGHT_COLOR + ',0) inset',
            borderColor: 'rgba(' + SOURCE_HIGHLIGHT_COLOR + ', 0)'
        });
    }
}

function highlightDestination(pathwayId, highlight)
{
    var pathway = $('.pathway[value="' + pathwayId + '"]');
    pathway.addClass('destination');
    if (highlight) {
        pathway.find('.pathway-inner').stop().animate({
            boxShadow: '0 0 9px rgb(' + DESTINATION_HIGHLIGHT_COLOR + ') inset',
            borderColor: 'rgb(' + DESTINATION_HIGHLIGHT_COLOR + ')'
        });
    } else {
        pathway.find('.pathway-inner').stop().animate({
            boxShadow: '0 0 9px rgba(' + DESTINATION_HIGHLIGHT_COLOR + ',0) inset',
            borderColor: 'rgba(' + DESTINATION_HIGHLIGHT_COLOR + ', 0)'
        });
    }   
}
