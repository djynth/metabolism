var ORGAN_FADE_IN  = 450;
var ORGAN_FADE_OUT = 150;

$(document).ready(function() {
    selectOrgan(parseInt($('.tab-holder .organ-title').first().attr('value')));

    $('.organ-title').click(function() {
        selectOrgan($(this).attr('value'));
    });
});

function selectOrgan(organ)
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

    $('.organ-title').each(function() {
        if ($(this).hasClass('global-title')) {
            return;
        }
        var tabOrgan = $(this).attr('value');
        if (tabOrgan == organ) {                    // select this tab
            $(this).addClass('active');
            $(this).children('.cover').show();
            $('.pathway-holder[value="'  + tabOrgan + '"]').show();
            $('.resource-holder[value="' + tabOrgan + '"]').show();
        } else {                                    // unselect this tab
            $(this).removeClass('active');
            $(this).children('.cover').hide();
            $('.pathway-holder[value="'  + tabOrgan + '"]').hide();
            $('.resource-holder[value="' + tabOrgan + '"]').hide();
        }
    });

    updateScrollbars();

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