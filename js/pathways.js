$(document).ready(function() {
    PATHWAYS.find('.title').click(function() {
        selectPathway($(this).parents('.pathway'));
    });

    PATHWAYS.find('.food').each(function() {
        var pathway = $(this).parents('.pathway');
        pathway.find('.eat').each(function() {
            updateEat(pathway, $(this).res());
        });
    });

    PATHWAYS.each(function() {
        var pathway = $(this);
        var run = pathway.find('.run');
        var reverse = pathway.find('.rev');

        if (pathway.hasClass('eat')) {
            pathway.find('.food').each(function() {
                $(this).find('.eat').each(function() {
                    var eat = $(this);
                    eat.siblings('.top').click(function() {
                        updateEat(pathway, eat.res(), parseInt(food.attr('eat-max')));
                    });
                    eat.siblings('.plus').click(function() {
                        updateEat(pathway, eat.res(), parseInt(eat.attr('amount')) + 1);
                    });
                    eat.siblings('.minus').click(function() {
                        updateEat(pathway, eat.res(), parseInt(eat.attr('amount')) - 1);
                    });
                    eat.siblings('.bottom').click(function() {
                        updateEat(pathway, eat.res(), 0);
                    });
                });

                $(this).find('.eat').focus(function() {
                    $(this).val($(this).attr('amount'));
                }).blur(function() {
                    updateEat(pathway, $(this).res(), parseInt($(this).val()));
                }).keypress(function(event) {
                    if (event.which === 13) {
                        $(this).blur();    
                    }
                });
            });
        }

        run.click(function() {
            runPathway(pathway);
        });

        run.siblings('.times').focus(function() {
            $(this).val(pathway.attr('times'));
        }).blur(function() {
            updateRun(pathway, parseInt($(this).val()));
        }).keypress(function(event) {
            if (event.which === 13) {
                $(this).blur();    
            }
        });

        run.siblings('.max').click(function() {
            updateRun(pathway, parseInt(pathway.attr('max-runs')));
        });
        run.siblings('.inc').click(function() {
            updateRun(pathway, parseInt(pathway.attr('times')) + 1);
        });
        run.siblings('.dec').click(function() {
            updateRun(pathway, parseInt(pathway.attr('times')) - 1);
        });
        run.siblings('.min').click(function() {
            updateRun(pathway, 1);
        });

        reverse.click(function() {
            pathway.find('.points').each(function() {
                $(this).text(-parseInt($(this).text()));
            });
            pathway.find('.reaction').find('tr').each(function() {
                $(this).children().removeClass('limiting-reagent lacking');
                $(this).find('.reactant')
                    .removeClass('reactant')
                    .addClass('temp');
                $(this).find('.product')
                    .removeClass('product')
                    .addClass('reactant');
                $(this).find('.temp')
                    .removeClass('temp')
                    .addClass('product');
                $(this).find('.amount').each(function() {
                    $(this).text(-parseInt($(this).text()));
                });
                var children = $(this).children();

                $(this).empty().append(children.get().reverse());
            });

            refreshPathway(pathway);
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

function refreshPathways(changedResources, restrictions)
{
    PATHWAYS.each(function() {
        var pathway = $(this);
        var limit = restrictions[pathway.pathway()];
        if (limit === 0) {
            pathway.addClass('hidden');
        } else {
            pathway.removeClass('hidden');
            if (pathway.hasClass('eat')) {
                refreshPathway(pathway, limit);
            } else {
                pathway.find('.reaction').find('.name').each(function() {
                    if ($.inArray($(this).res(), changedResources) !== -1) {
                        refreshPathway(pathway, limit);
                        return false;
                    }
                });
            }
        }
    });
}

function refreshPathway(pathway, limit)
{
    var maxRuns = Number.POSITIVE_INFINITY;

    pathway.find('.reactant.name').removeClass('lacking limiting').each(function() {
        var required = Math.abs(parseInt(
            $(this).siblings('.reactant.amount').text()
        ));
        var amount = resources[$(this).res()].amounts[$(this).organ()];

        var runs = Math.floor(amount/required);
        if (runs < maxRuns) {
            pathway.find('.limiting').removeClass('limiting');
            maxRuns = runs;
        }
        if (runs === maxRuns) {
            $(this).addClass('limiting');
        }
    });

    maxRuns = min(maxRuns, limit);
    var canRun = maxRuns > 0;

    if (canRun) {
        pathway.attr('available', 'true');
    } else {
        pathway.find('.limiting').addClass('lacking').removeClass('limiting');
        pathway.removeAttr('available');
    }

    pathway.attr('max-runs', maxRuns);
    pathway.attr('times', maxRuns);
}

function updateRun(pathway, times)
{
    times = typeof times === 'undefined' ? parseInt(pathway.attr('times')) : times;
    var maxRuns = parseInt(pathway.attr('max-runs'));
    times = max(1, min(maxRuns, times));
    pathway.attr('times', times);

    var runHolder = pathway.find('.run-holder');
    runHolder.find('.inc, .max').prop('disabled', times >= maxRuns);
    runHolder.find('.dec, .min').prop('disabled', times <= 1);
    runHolder.find('.times').val('x' + times + ' [' + (isNaN(maxRuns) ? 0 : maxRuns) + ']');
}

function updateEat(pathway, res, amount)
{
    var eat = pathway.find('.eat[res=' + res + ']');
    amount = typeof amount === 'undefined' ? parseInt(eat.attr('amount')) : amount;
    var total = 0;
    pathway.find('.eat:not([res=' + res + '])').each(function() {
        total += parseInt($(this).attr('amount'));
    });

    var eatMax = pathway.find('.food').attr('eat-max');
    amount = max(0, min(amount, eatMax - total));

    eat.val(getRes(res).attr('name') + ' x' + amount).attr('amount', amount);

    pathway.find('.food').find('.inc, .max').prop('disabled', total + amount >= eatMax);
    pathway.find('.food').find('.dec, .min').prop('disabled', amount <= 0);
}

function selectPathway(pathway)
{
    if (!pathway.length) {
        return;
    }

    PATHWAYS.removeClass('active');
    pathway.addClass('active');
    updateRun(pathway);

    var runHolder = pathway.find('.run-holder');
    timesWidth = runHolder.outerWidth();
    runHolder.children(':not(.times)').each(function() {
        timesWidth -= $(this).outerWidth();
    });

    runHolder.find('.times').outerWidth(timesWidth);

    var container = pathway.parents('.pathways');

    if (pathway.offset().top < container.offset().top) {
        container.animate({
            scrollTop: pathway.offset().top - container.offset().top + container.scrollTop() - parseInt(pathway.css('marginTop'))
        }, 125);
    }
    
    if (pathway.offset().top + pathway.outerHeight(true) > container.offset().top + container.height()) {
        console.log(pathway.outerHeight());
        container.animate({
            scrollTop: pathway.offset().top + pathway.outerHeight(true) - container.offset().top - container.height() + container.scrollTop() - parseInt(pathway.css('marginTop'))
        }, 125);
    }
}

function runPathway(pathway)
{
    setWorking('Working...');
    if (pathway.hasClass('eat')) {
        var nutrients = { };
        pathway.find('.eat').each(function() {
            nutrients[$(this).res().toString()] = 
                parseInt($(this).attr('amount'));
        });
        $.ajax({
            url: '/index.php/site/eat',
            type: 'POST',
            dataType: 'json',
            data: {
                nutrients: nutrients
            },
            success: function(data) {
                onTurn(data);
                setWorking(false);
            }
        });
    } else {
        $.ajax({
            url: '/index.php/site/pathway',
            type: 'POST',
            dataType: 'json',
            data: {
                pathway_id: pathway.pathway(),
                times:      parseInt(pathway.attr('times')),
                organ_id:   pathway.organ(),
                reverse:    pathway.find('.rev').hasClass('active')
            },
            success: function(data) {
                onTurn(data);
                setWorking(false);
            }
        });
    }
}
