$(document).ready(function() {
    $('.food').each(function() {
        var food = $(this);
        food.find('.eat').each(function() {
            updateEat(food, $(this));
        });
    });

    $('.pathways')
        .find('.pathway:not(.eat)')
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
                        success: onTurn
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
                var pathway = $(this).parents('.pathway');
                pathway.find('.points').each(function() {
                    $(this).text(-parseInt($(this).text()));
                });
                pathway.find('.reaction').find('tr:not(.header)').each(function() {
                    $(this).children().removeClass('limiting-reagent lacking');
                    $(this).find('.reactant').removeClass('reactant').addClass('temp');
                    $(this).find('.product').removeClass('product').addClass('reactant');
                    $(this).find('.temp').removeClass('temp').addClass('product');
                    $(this).find('.amount').each(function() {
                        $(this).text(-parseInt($(this).text()));
                    });
                    var children = $(this).children();

                    $(this).empty().append(children.get().reverse());
                });

                refreshPathway(pathway);
            })
            .end()
        .end()
        .find('.pathway.eat')
            .find('.food').each(function() {
                var food = $(this);
                var eatMax = food.attr('eat-max');

                food.find('.eat').each(function() {
                    var eat = $(this);
                    eat.siblings('.top').click(function() {
                        updateEat(food, eat, eatMax);
                    });
                    eat.siblings('.plus').click(function() {
                        updateEat(food, eat, parseInt(eat.attr('amount')) + 1);
                    });
                    eat.siblings('.minus').click(function() {
                        updateEat(food, eat, parseInt(eat.attr('amount')) - 1);
                    });
                    eat.siblings('.bottom').click(function() {
                        updateEat(food, eat, 0);
                    });
                });
            })
            .end()
            .find('.run').click(function() {
                var nutrients = new Array();
                $(this).parents('.pathway').find('.eat').each(function() {
                    console.log($(this).res());
                    nutrients[$(this).res()] = parseInt($(this).attr('amount'));
                });
                $.ajax({
                    url: 'index.php/site/eat',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        nutrients: nutrients
                    },
                    success: onTurn
                });
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

function refreshPathways(changedResources)
{
    $('.pathways').find('.pathway').each(function() {
        var pathway = $(this);
        $(this).find('.reaction').find('.name').each(function() {
            if ($.inArray($(this).res(), changedResources) !== -1) {
                refreshPathway(pathway);
                return false;
            }
        });
    });
}

function refreshPathway(pathway)
{
    var limiting = $();
    var maxRuns = Number.POSITIVE_INFINITY;

    pathway.find('.reactant.name').each(function() {
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

    pathway.find('.run-holder').toggle(canRun);
    pathway.children('.lacking').toggle(!canRun);

    if (canRun && !pathway.attr('available')) {
        pathway.attr('available', 'true');
    }
    if (!canRun && pathway.attr('available')) {
        pathway.removeAttr('available');
        pathway.find('p.lacking').show();

        var lackingList = 'Not enough ';
        limiting.each(function() {
            lackingList += $(this).text() + ', ';
        })
        pathway.find('p.lacking').text(lackingList.substring(0, lackingList.length - 2));
    }

    if (typeof pathway.attr('limit') === 'undefined') {
        updateRun(pathway.find('.run'), maxRuns, maxRuns);
    }
}

function updateRun(run, times, maxRuns)
{
    run.text('Run x' + times).attr('times', times);
    if (typeof maxRuns !== 'undefined') {
        run.attr('max-runs', maxRuns);
    }
    if (times >= run.attr('max-runs')) {
        run.siblings('.plus, .top').addClass('disabled').attr('disabled', 'disabled');
    } else {
        run.siblings('.plus, .top').removeClass('disabled').removeAttr('disabled');
    }

    if (times <= 1) {
        run.siblings('.minus, .bottom').addClass('disabled').attr('disabled', 'disabled');
    } else {
        run.siblings('.minus, .bottom').removeClass('disabled').removeAttr('disabled');
    }
}

function updateEat(food, eat, amount)
{
    amount = typeof amount === 'undefined' ? parseInt(eat.attr('amount')) : amount;

    var total = 0;
    food.find('.eat:not([res="' + eat.res() + '"])').each(function() {
        total += parseInt($(this).attr('amount'));
    });

    var eatMax = food.attr('eat-max');
    amount = min(amount, eatMax - total);
    eat.text(getRes(eat.res()).attr('name') + ' x' + amount).attr('amount', amount);
    total += amount;

    if (total >= eatMax) {
        food.find('.plus, .top').addClass('disabled').attr('disabled', 'disabled');
    } else {
        food.find('.plus, .top').removeClass('disabled').removeAttr('disabled');
    }

    if (amount <= 0) {
        eat.siblings('.minus, .bottom').addClass('disabled').attr('disabled', 'disabled');
    } else {
        eat.siblings('.minus, .bottom').removeClass('disabled').removeAttr('disabled');
    }
}
