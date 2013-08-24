var ORGAN_FADE_IN  = 450;               // the time in ms for the fade in  section of an organ transition
var ORGAN_FADE_OUT = 150;               // the time in ms for the fade out section of an organ transition
var ORGAN_TRANSITION = ORGAN_FADE_OUT + ORGAN_FADE_IN;  // the total length of an organ transition in ms

// the minimum amount of space in px below a popup in order that it slides down rather than up
var ORGAN_INFO_PADDING_BOTTOM = 400;
var ORGAN_INFO_WIDTH = 350;             // the width of each organ info popup in px

var ORGAN_SLIDE_OUT_DURATION  = 200;    // the time for an organ info popup to slide in/out of the organ header in ms
var ORGAN_SLIDE_DOWN_DURATION = 300;    // the time for an organ info popup to slide down/up in ms

$(document).ready(function() {
    selectOrgan($('.accordian-header').first().attr('value'), true);

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
});

function selectOrgan(organ, firstTime)
{
    $('.accordian-header, .accordian-content, .tracker-organ').each(function() {
        $(this).toggleClass('active', $(this).attr('value') == organ);
    });

    $('.accordian-content').each(function() {
        var height = $(this).hasClass('pathway-holder') ? getPathwayContentHeight() : getResourceContentHeight();
        if ($(this).attr('value') == organ) {       // select this tab
            if (firstTime) {
                $(this).height(height);
                $(this).mCustomScrollbar('update');
            } else {
                $(this).animate({ height: height }, {
                    duration: ORGAN_TRANSITION,
                    complete: function() {
                        $(this).mCustomScrollbar('update');
                    }
                });
            }
        } else {                                    // unselect this tab
            if (firstTime) {
                $(this).height(0);
            } else if ($(this).height() > 0) {
                $(this).animate({ height: 0 }, ORGAN_TRANSITION);
            }
        }
    });

    updateResourceVisual(organ);

    if (firstTime) {
        $('#cell-canvas').css('backgroundColor', '#' + organColors[organ]);
    } else {
        $('#cell-canvas').animate({ backgroundColor: '#' + organColors[organ] }, ORGAN_TRANSITION);
    }
}
