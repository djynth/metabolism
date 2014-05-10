var SOURCE_HIGHLIGHT_COLOR      = '82,117,255';
var DESTINATION_HIGHLIGHT_COLOR = '233,25,44';

$(document).ready(function() {
    $('.pathway-run').click(function() {
        var id = parseInt($(this).parents('.pathway').attr('value'));
        var organ = parseInt($(this).parents('.pathway-holder').attr('value'));
        var times = parseInt($(this).attr('value'));
        var reverse = $(this).parents('.pathway').find('.pathway-reverse').hasClass('active');
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

            $(this).empty().append(children.get().reverse());
        });

        refreshPathways();      // TODO: only refresh the pathway that was reversed
    });
});

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

        updatePathwayButtons($(this), true);
    });

    updateEatButtons();
}

function updatePathwayButtons(pathway, reset)
{
    if (pathway.attr('limit')) {
        return;
    }

    var organ = pathway.parents('.pathway-holder').attr('value');
    var runButton = pathway.find('.pathway-run');
    var times = parseInt(runButton.attr('value'));
    var maxRuns = getMaxRuns(pathway.attr('value'), organ);
    if (reset || typeof times === 'undefined' || isNaN(times) || 
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
        if (resId === 5) {
            resName = 'Carbohydrate (Glucose)';
        } else if (resId === 6) {
            resName = 'Protein (Alanine)';
        } else if (resId === 7) {
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
        success: onPathwaySuccess
    });
}

function onPathwaySuccess(data)
{
    if (data.success) {
        setTurn(data.turn);
        setPoints(data.points);
        refreshResources(data.resources);
        updateLimitedResources($($.parseHTML(data.limited_resources)));
        onFilterChange();

        for (organ in data.action_counts) {
            $('.tracker.actions').find('.organ[organ=' + organ + ']').find('.amount').text(data.action_counts[organ]);
        }
    }
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
