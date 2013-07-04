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

$(document).ready(function() {
    loadPathwayData();
    loadResourceData();

    setPoints(points);
    nextTurn();

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
function nextTurn() {
    turn--;
    $('#turns').html(turn + '/' + TURNS + ' Turns Remaining');
    return turn;
}

/**
 * Adds the given number of points to the point counter and updates the points counter element.
 * @param {number} pts The number of points to be added.
 * @return {number} The total number of points after the addition.
 */
function addPoints(pts) {
    return setPoints(points + pts);
}

/**
 * Sets the number of points to the given value and update the counter element.
 * @param {number} pts The new point total.
 * @return {number} The new points total.
 */
function setPoints(pts) {
    points = pts;
    $('#points').html(points + ' Points');
    return points;
}

/**
 * Selects the given organ.
 * 
 * @param {string} organ The name of the organ to be selected.
 */
function selectOrgan(organ) {
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
