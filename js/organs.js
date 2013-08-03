var ORGAN_FADE_IN  = 450;
var ORGAN_FADE_OUT = 150;
var ORGAN_TRANSITION = ORGAN_FADE_OUT + ORGAN_FADE_IN;

$(document).ready(function() {
    selectOrgan(parseInt($('.accordian-header').first().attr('value')), true);

    $('.accordian-title').click(function() {
        var header = $(this).parents('.accordian-header');
        if (!header.hasClass('active')) {
            selectOrgan(header.attr('value'));
        }
    });

    $('.organ-info').click(function() {
        var popup = $(this).siblings('.organ-popup');
        var content = popup.find('.organ-image,.organ-description');
        if (!popup.is(':visible')) {
            if ($(window).height() - $(this).offset().top > 400) {
                popup.addClass('organ-popup-down');
            } else {
                popup.addClass('organ-popup-up');
            }

            popup.css('width', 0).show();
            content.hide();

            popup.animate({ width: 350 }, 200, function() {
                content.slideDown(300);
            });
        } else {
            content.slideUp(300, function() {
                popup.animate({ width: 0 }, 200, function() {
                    popup.removeClass('organ-popup-up organ-popup-down');
                    popup.hide();
                });
            });
        }
    });
});

function selectOrgan(organ, firstTime)
{
    $('.tracker-organ').each(function() {
        if ($(this).attr('value') == organ) {
            $(this).addClass('selected-organ');
        } else {
            $(this).removeClass('selected-organ');
        }
    })

    $('.accordian-content').each(function() {
        var tabOrgan = $(this).attr('value');
        var height = $(this).hasClass('pathway-holder') ? getPathwayContentHeight() : getResourceContentHeight();
        if (tabOrgan == organ) {                    // select this tab
            $(this).addClass('active');
            if (firstTime) {
                $(this).css('height', height);
                $(this).mCustomScrollbar('update');
            } else {
                $(this).animate({ height: height }, ORGAN_TRANSITION, function() {
                    $(this).mCustomScrollbar('update');
                });
            }
            
        } else {                                    // unselect this tab
            $(this).removeClass('active');
            if (firstTime) {
                $(this).css('height', 0);
            } else {
                $(this).animate({ height: 0 }, ORGAN_TRANSITION);
            }
        }
    });

    $('.accordian-header').each(function() {
        if ($(this).attr('value') == organ) {
            $(this).addClass('active');
            $(this).find('.filter-icon-holder').addClass('active').click(function() {
                var organ = $(this).parents('.accordian-header').attr('value');
                $(this).parents('.accordian-header').siblings('.filter[value="' + organ + '"]').slideToggle();
            });
        } else {
            $(this).removeClass('active');
            $(this).find('.filter-icon-holder').removeClass('active').unbind('click');
        }
    });

    $.ajax({
        url: 'index.php?r=site/organColor',
        type: 'POST',
        dataType: 'json',
        data: {
            organ: organ
        },
        success: function(data) {
            $('#cell-canvas').animate({ backgroundColor: '#' + data.color }, ORGAN_FADE_IN + ORGAN_FADE_OUT);
        }
    });
}

function getSelectedOrgan()
{
    return parseInt($('.accordian-content.active').attr('value'));
}
