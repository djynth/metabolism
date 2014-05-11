var SOURCE_HIGHLIGHT_COLOR      = '82,117,255';
var DESTINATION_HIGHLIGHT_COLOR = '233,25,44';

$(document).ready(function() {
    $('.pathways').find('.pathway')
        .find('.run').each(function() {
            var run = $(this);
            run.click(function() {
                var pathway = run.parents('.pathway');
                $.ajax({
                    url: 'index.php/site/pathway',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        pathway_id: pathway.pathway(),
                        times: parseInt(run.attr('times')),
                        organ_id: pathway.organ(),
                        reverse: pathway.find('.reverse').hasClass('active')
                    },
                    success: onPathwaySuccess
                });
            });

            run.siblings('.top').click(function() {
                updateRun(run, run.attr('max-runs'));
            });
            run.siblings('.plus').click(function() {
                updateRun(run, parseInt(run.attr('times')) + 1);
            });
            run.siblings('.minus').click(function() {
                updateRun(run, parseInt(run.attr('times')) - 1);
            });
            run.siblings('.bottom').click(function() {
                updateRun(run, 1);
            });
        })
        .end()
        .find('.reverse').click(function() {

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

function getPathway(pathway, organ)
{
    if (typeof organ === 'undefined') {
        var resources = $('.pathways');
    } else {
        var resources = $('.pathways[organ="' + organ + '"]');
    }
    return resources.find('.pathway[pathway="' + pathway + '"]').first();
}

function refreshPathways()
{
    $('.pathways').find('.pathway').each(function() {
        var limiting = $();
        var maxRuns = Number.POSITIVE_INFINITY;

        $(this).find('.reactant.name').each(function() {
            $(this).removeClass('lacking limiting');
            var required = Math.abs(parseInt($(this).siblings('.reactant.amount').text()));
            var amount = parseInt(getRes($(this).res(), $(this).organ()).attr('amount'));

            var runs = Math.floor(amount/required);
            if (runs < maxRuns) {
                maxRuns = runs;
                limiting = $();
            }
            if (runs <= maxRuns) {
                limiting = limiting.add($(this));
            }
        });

        var canRun = maxRuns > 0;
        limiting.addClass(canRun ? 'limiting' : 'lacking');

        $(this).find('.run-holder').toggle(canRun);
        $(this).children('.lacking').toggle(!canRun);

        if (canRun) {
            $(this).attr('available', 'true');
        } else {
            $(this).removeAttr('available');
            $(this).find('p.lacking').show();

            var lackingList = 'Not enough ';
            limiting.each(function() {
                lackingList += $(this).text() + ', ';
            })
            $(this).find('p.lacking').text(lackingList.substring(0, lackingList.length - 2));
        }

        if (typeof $(this).attr('limit') === 'undefined') {
            var run = $(this).find('.run');
            var plus   = run.siblings('.plus');
            var minus  = run.siblings('.minus');
            var top    = run.siblings('.top');
            var bottom = run.siblings('.bottom');
            updateRun(run, maxRuns, maxRuns);

            plus.addClass('disabled').attr('disabled', 'disabled');
            top.addClass('disabled').attr('disabled', 'disabled');

            if (maxRuns <= 1) {
                minus.addClass('disabled').attr('disabled', 'disabled');
                bottom.addClass('disabled').attr('disabled', 'disabled');
            } else {
                minus.removeClass('disabled').removeAttr('disabled');
                bottom.removeClass('disabled').removeAttr('disabled');
            }
        }
    });
}

function updateRun(run, times, maxRuns)
{
    run.text('Run x' + times).attr('times', times);
    if (typeof maxRuns !== 'undefined') {
        run.attr('max-runs', maxRuns);
    }
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
        refreshLimitedResources();
        refreshPathways();
        onFilterChange();

        for (organ in data.action_counts) {
            $('.tracker.actions').find('.organ[organ=' + organ + ']').find('.amount').text(data.action_counts[organ]);
        }
    }
}
