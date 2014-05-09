var ORGAN_TRANSITION = 600;  // length of an organ transition in ms

// the minimum amount of space in px below a popup in order that it slides down rather than up
var ORGAN_INFO_PADDING_BOTTOM = 500;

var ORGAN_SLIDE_OUT_DURATION  = 200;    // the time for an organ info popup to slide in/out of the organ header in ms
var ORGAN_SLIDE_DOWN_DURATION = 300;    // the time for an organ info popup to slide down/up in ms

$(document).ready(function() {
    $('.accordian-title').click(function() {
        var header = $(this).parents('.accordian-header');
        if (!header.hasClass('active')) {
            selectOrgan(header.attr('value'));
        }
    });

    $('.organ-info, .close-popup').click(function() {
        var popup = $(this).parents('.accordian-header').children('.organ-popup');
        var content = popup.find('.organ-image, .organ-description');
        popup.finish();
        content.finish();
        if (popup.is(':visible')) {
            content.slideUp(ORGAN_SLIDE_DOWN_DURATION, function() {
                popup.animate({ width : 0 }, ORGAN_SLIDE_OUT_DURATION, function() {
                    popup.hide();
                });
            });
        } else {
            if ($(window).height() - $(this).offset().top > ORGAN_INFO_PADDING_BOTTOM) {
                popup.addClass('organ-popup-down').removeClass('organ-popup-up');
            } else {
                popup.addClass('organ-popup-up').removeClass('organ-popup-down');
            }

            content.hide();

            popup.show().animate({ width: popup.css('max-width') }, ORGAN_SLIDE_OUT_DURATION, function() {
                content.slideDown(ORGAN_SLIDE_DOWN_DURATION);
            });
        }
    });
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
        if ($(this).attr('value') == organ) {
            $(this).animate({ height: getSidebarContentHeight() }, ORGAN_TRANSITION);
            $('#cell-canvas').animate({ backgroundColor: '#' + $(this).attr('color') }, ORGAN_TRANSITION);
        } else {
            $(this).animate({ height: 0 }, ORGAN_TRANSITION);
        }
    });
}

function updateActionCounts(counts)
{
    for (organ in counts) {
        $('.tracker.actions').find('.organ[organ-id=' + organ + ']').find('.amount').text(counts[organ]);
    }
}
