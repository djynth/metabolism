/**
 * Represents the brain organ.
 * @type {string}
 */
var BRAIN  = "brain";
/**
 * Represents the muscle organ.
 * @type {string}
 */
var MUSCLE = "muscle";
/**
 * Represents the liver organ.
 * @type {string}
 */
var LIVER  = "liver";
/**
 * Represents the global organ, which contains Pathways that are not associated with any particular organ and Resources
 *     that are available to any organ.
 * @type {string}
 */
var GLOBAL = "global";

/**
 * The maximum number of turns that can be taken in a single game.
 * @type {number}
 */
var TURNS = 50;
/**
 * The current turn, beginning at {@code TURNS}+1 and counting towards 0.
 * @type {[type]}
 */
var turn = TURNS+1;
/**
 * The current number of points earned by running Pathways.
 * @type {number}
 */
var points = 0;

/**
 * The normal blood pH.
 * @type {number}
 */
var NORMAL_PH  = 7.4;
/**
 * The lowest possible blood pH value; if the pH drops below this level, the player immediately dies.
 * @type {number}
 */
var MINIMUM_PH = 6.5;
/**
 * The current blood pH level, on the standard scale of 1-14.
 * The pH is affected by the CO2 levels, with the follow scaling:
 * <pre>
 * pH = NORMAL_PH - CO2*(4/1000)
 * </pre>
 * such that at 0 CO2 the pH is {@code NORMAL_PH}, and at 50 CO2 the pH is <code>NORMAL_PH - 0.2</code>.
 * When the pH drops below 7.2, only a fraction of the globally available resources are useable in the organs, with the
 *     following scaling:
 * <pre>
 * %useable = max(0, min(100, (7.2-pH)*250))
 * </pre>
 * such that the percentage of resources available drops to half when the pH is at 7.
 * Additionally, if the pH is below {@code MINIMUM_PH}, the player immediately dies.
 * @type {number}
 */
var ph = NORMAL_PH;

$(document).ready(function() {
    loadPathwayData();
    loadResourceData();

    setPoints(points);
    nextTurn();

    populatePh();
    populateResources();
    populatePathways();
    selectOrgan(BRAIN);

    $(window).resize(function() { $('.scrollbar-content').each(function() { updateScrollbar($(this)); }); });

    $('.organ-title').click(function() {
        selectOrgan($(this).attr('value'));
    });

    $('.pathway-run').click(function() {
        var id = $(this).parents('.pathway').attr('value');
        var organ = $(this).parents('.pathway-holder').attr('value');
        var times = $(this).attr('value');
        getPathway(id).run(organ, times);

        updatePathwayButtons($(this));
    });

    $('.pathway-plus').click(function() {
        if (!$(this).hasClass('disabled')) {
            var times = parseInt($(this).siblings('.pathway-run').attr('value')) + 1;
            $(this).siblings('.pathway-run').attr('value', times);
            updatePathwayButtons($(this).siblings('.pathway-run'));
        }
    });

    $('.pathway-minus').click(function() {
        if (!$(this).hasClass('disabled')) {
            var times = parseInt($(this).siblings('.pathway-run').attr('value')) - 1;
            $(this).siblings('.pathway-run').attr('value', times);
            updatePathwayButtons($(this).siblings('.pathway-run'));
        }
    });

    $('.pathway-top').click(function() {
        if (!$(this).hasClass('disabled')) {
            var times = parseInt($(this).siblings('.pathway-run').attr('max-value'));
            $(this).siblings('.pathway-run').attr('value', times);
            updatePathwayButtons($(this).siblings('.pathway-run'));
        }
    });

    $('.pathway-bottom').click(function() {
        if (!$(this).hasClass('disabled')) {
            var times = parseInt($(this).siblings('.pathway-run').attr('min-value'));
            $(this).siblings('.pathway-run').attr('value', times);
            updatePathwayButtons($(this).siblings('.pathway-run'));
        }
    });

    $('.eat-run').click(function() {
        var foodHolder = $(this).parent().siblings('.food-holder');
        var glc = parseInt(foodHolder.find('#glc').attr('value'));
        var ala = parseInt(foodHolder.find('#ala').attr('value'));
        var fa  = parseInt(foodHolder.find('#fa').attr('value'));

        if (glc + ala + fa < EAT_MAX) {
            $('#modal-header').html('Are You Sure?');
            $('#modal-content').html('You are eating less than you could! Your total nutrient intake of ' + 
                (glc+ala+fa) + ' is less than the maximum of ' + EAT_MAX);
            $('#modal-cancel').click(function() {
                $('.modal').modal('hide');
            });
            $('#modal-confirm').click(function() {
                $('.modal').modal('hide');
                eat(glc, ala, fa);
            });
            $('.modal').modal('show');
        } else {
            eat(glc, ala, fa);
        }
    });

    $('.eat-plus').click(function() {
        if (!$(this).hasClass('disabled')) {
            $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) + 1);
            updateEatButtons($(this).parents('.food-holder'));
        }
    });

    $('.eat-minus').click(function() {
        if (!$(this).hasClass('disabled')) {
            $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) - 1);
            updateEatButtons($(this).parents('.food-holder'));
        }
    });

    $('.eat-top').click(function() {
        if (!$(this).hasClass('disabled')) {
            $(this).siblings('.eat').attr('value', -1);
            updateEatButtons($(this).parents('.food-holder'));
        }
    });

    $('.eat-bottom').click(function() {
        if (!$(this).hasClass('disabled')) {
            $(this).siblings('.eat').attr('value', 0);
            updateEatButtons($(this).parents('.food-holder'));
        }
    });

    $('.resource-data').mouseenter(function() {
        var resource = getResource($(this).find('.resource-name').html());
        if (resource.imageFilename != 'none') {
            $('#resource-visual').append('<img name="' + resource.name + '" src="' + resource.imageFilename + '" alt="' + resource.name + 
                '" class="image-content hidden">');

            setTimeout(function() {
                $('#resource-visual img[name="' + resource.name + '"]').fadeIn(250);
            }, 300);  
        }
    });

    $('.resource-data').mouseleave(function() {
        var resource = getResource($(this).find('.resource-name').html());
        if (resource.imageFilename != 'none') {
            $('#resource-visual img[name="' + resource.name + '"]').fadeOut(100, function() {
                $(this).remove();
            });
        }
    });
});

/**
 * Updates the scrollbar in the given element.
 * This function should be invoked whenever the content in a scrollbar changes height or the window size changes.
 * 
 * @param {jQuery} elem The element containing the content encompassed by the scrollbar; that is, the scrollbar's
 *                      holder.
 */
function updateScrollbar(elem)
{
    elem.css('height', ($(window).height() - elem.offset().top - parseInt(elem.css('padding-top')) - parseInt(elem.css('padding-bottom'))) + 'px');

    if (elem.attr('scrollbar') != 'true') {
        elem.mCustomScrollbar({
            autoHideScrollbar: true,
            scrollInertia: 350,
            theme: "dark",
        });
        elem.attr('scrollbar', 'true')
    } else {
        elem.mCustomScrollbar('update');
    }
}

/**
 * Moves to the next turn and updates the turn counter element.
 * 
 * @return {number} Returns the current turn.
 */
function nextTurn()
{
    turn--;
    $('#turns').html(turn + '/' + TURNS + ' Turns Remaining');
    return turn;
}

/**
 * Adds the given number of points to the point counter and updates the points counter element.
 * @param {number} pts The number of points to be added.
 * @return {number} The total number of points after the addition.
 */
function addPoints(pts)
{
    return setPoints(points + pts);
}

/**
 * Sets the number of points to the given value and update the counter element.
 * @param {number} pts The new point total.
 * @return {number} The new points total.
 */
function setPoints(pts)
{
    points = pts;
    $('#points').html(points + ' Points');
    return points;
}

/**
 * Selects the given organ.
 * 
 * @param {string} organ The name of the organ to be selected.
 */
function selectOrgan(organ)
{
    $('.organ-title').each(function() {
        if ($(this).attr('value') == GLOBAL) {
            return;
        }
        if ($(this).attr('value') == organ) {       // select this tab
            $(this).addClass('active');
            $(this).children('.cover').show();
            updateScrollbar($('.pathway-holder[value="'  + $(this).attr('value') + '"]').show());
            updateScrollbar($('.resource-holder[value="' + $(this).attr('value') + '"]').show());
            $('#cell-canvas').addClass(organ);
        } else {                                    // unselect this tab
            $(this).removeClass('active');
            $(this).children('.cover').hide();
            $('.pathway-holder[value="'  + $(this).attr('value') + '"]').hide();
            $('.resource-holder[value="' + $(this).attr('value') + '"]').hide();
            $('#cell-canvas').removeClass($(this).attr('value'));
        }
    });
}

/**
 * Populates the pH counter.
 * This function should be called once, upon initialization.
 */
function populatePh()
{
    $('#ph-holder')
        .append($('<div>')
            .addClass('progress')
            .append($('<span>')
                .addClass('resource-name')
                .html('pH')
            ).append($('<span>')
                .addClass('resource-value')
            ).append($('<div>')
                .addClass('bar')
            )
        );
    updatePh();
}

/**
 * Updates the blood pH level and its on-screen counter.
 * This function should be called whenever the resources are modified, particularly if the level of CO2 is changed.
 */
function updatePh()
{
    ph = NORMAL_PH - getResource('CO2', GLOBAL).value * (4/1000);

    if (ph <= 6) {
        window.location.href = "death.html";
    }

    $('#ph-holder').find('.bar').css('width', Math.min(100, 100*((ph-6)/2)) + '%');
    $('#ph-holder').find('.resource-value').html(ph.toFixed(2));
}

/**
 * Returns the percentage of globally available resources that are available for use, based on the current pH level.
 * 
 * @return {number} The amount of resources available through the bloodstream, as a percentage in the range [0,1].
 */
function getAmountGloballyUseable()
{
    if (ph >= 7.2) {
        return 1;
    }
    return Math.max(0, Math.min(100, (7.2 - ph)*250))/100;
}
