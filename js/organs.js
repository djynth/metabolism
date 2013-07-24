var ORGAN_FADE_IN  = 450;
var ORGAN_FADE_OUT = 150;
var ORGAN_TRANSITION = ORGAN_FADE_OUT + ORGAN_FADE_IN;

$(document).ready(function() {
    selectOrgan(parseInt($('.accordian-header').first().attr('value')), true);

    $('.accordian-header').click(function() {
        selectOrgan($(this).attr('value'));
    });
});

function selectOrgan(organ, firstTime)
{
    $('#organ-visual').find('img').fadeOut(ORGAN_FADE_OUT, function() {
        $(this).remove();
    });

    var organImage = $('<img>')
        .attr('name', organ)
        .attr('src', baseUrl + 'img/organs/' + organ)
        .attr('alt', organ)
        .addClass('image-content')
        .css('display', 'none');
    $('#organ-visual').append(organImage);

    setTimeout(function() {
        organImage.fadeIn(ORGAN_FADE_IN);
    }, ORGAN_FADE_OUT);

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