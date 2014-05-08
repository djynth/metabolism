var ORGAN_FADE_IN  = 450;               // the time in ms for the fade in  section of an organ transition
var ORGAN_FADE_OUT = 150;               // the time in ms for the fade out section of an organ transition
var ORGAN_TRANSITION = ORGAN_FADE_OUT + ORGAN_FADE_IN;  // the total length of an organ transition in ms

// the minimum amount of space in px below a popup in order that it slides down rather than up
var ORGAN_INFO_PADDING_BOTTOM = 400;
var ORGAN_INFO_WIDTH = 350;             // the width of each organ info popup in px

var ORGAN_SLIDE_OUT_DURATION  = 200;    // the time for an organ info popup to slide in/out of the organ header in ms
var ORGAN_SLIDE_DOWN_DURATION = 300;    // the time for an organ info popup to slide down/up in ms

$(document).ready(function() {
    $('.accordian-title').click(function() {
        var header = $(this).parents('.accordian-header');
        if (!header.hasClass('active')) {
            selectOrgan(header.attr('value'));
        }
    });

    $('.organ-info').click(function() {
        var popup = $(this).siblings('.organ-popup');
        var content = popup.find('.organ-image, .organ-description');
        if (!popup.is(':visible')) {
            if ($(window).height() - $(this).offset().top > ORGAN_INFO_PADDING_BOTTOM) {
                popup.addClass('organ-popup-down').removeClass('organ-popup-up');
            } else {
                popup.addClass('organ-popup-up').removeClass('organ-popup-down');
            }

            popup.css('width', 0).show();
            content.hide();

            popup.animate({ width: ORGAN_INFO_WIDTH }, ORGAN_SLIDE_OUT_DURATION, function() {
                content.slideDown(ORGAN_SLIDE_DOWN_DURATION);
            });
        } else {
            content.slideUp(ORGAN_SLIDE_DOWN_DURATION, function() {
                popup.animate({ width: 0 }, ORGAN_SLIDE_OUT_DURATION, function() {
                    popup.hide();
                });
            });
        }
    });

    $('.close-popup').click(function() {
        $(this).parent().siblings('.organ-info').click();
    })
});

function selectOrgan(organ, firstTime)
{
    $('.accordian-header, .accordian-content').each(function() {
        $(this).toggleClass('active', $(this).attr('value') == organ);
    });

    $('.tracker').find('.organ').each(function() {
        $(this).toggleClass('active', $(this).attr('organ-id') == organ);
    })

    $('.accordian-content').each(function() {
        if ($(this).attr('value') == organ) {       // select this tab
            $(this).animate({ height: $(this).hasClass('pathway-holder') ? getPathwayContentHeight() : getResourceContentHeight() }, ORGAN_TRANSITION);
            $('#cell-canvas').animate({ backgroundColor: '#' + $(this).attr('color') }, ORGAN_TRANSITION);
        } else {                                    // unselect this tab
            if ($(this).height() > 0) {
                $(this).animate({ height: 0 }, ORGAN_TRANSITION);
            }
        }
    });
}

function updateActionCounts(counts)
{
    for (organ in counts) {
        $('.tracker.actions').find('.organ[organ-id=' + organ + ']').find('.amount').text(counts[organ]);
    }
}
