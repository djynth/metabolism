$(document).ready(function() {
    selectOrgan(parseInt($('.tab-holder .organ-title').first().attr('value')));

    updateResources();

    $(window).resize(function() { updateScrollbars(); });

    $('.organ-title').click(function() {
        selectOrgan($(this).attr('value'));
    });

    $('.pathway-run').click(function() {
        var id = parseInt($(this).parents('.pathway').attr('value'));
        var organ = parseInt($(this).parents('.pathway-holder').attr('value'));
        var times = parseInt($(this).attr('value'));
        runPathway(id, times, organ);
    });

    $('.pathway-plus').click(function() {
        var times = parseInt($(this).siblings('.pathway-run').attr('value')) + 1;
        $(this).siblings('.pathway-run').attr('value', times);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.pathway-minus').click(function() {
        var times = parseInt($(this).siblings('.pathway-run').attr('value')) - 1;
        $(this).siblings('.pathway-run').attr('value', times);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.pathway-top').click(function() {
        var times = -1;
        $(this).siblings('.pathway-run').attr('value', times);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.pathway-bottom').click(function() {
        var times = 1;
        $(this).siblings('.pathway-run').attr('value', times);
        updatePathwayButtons($(this).parents('.pathway'));
    });

    $('.eat-run').click(function() {
        var foodHolder = $('.food-holder');
        var total = 0;
        var nutrients = new Array();
        foodHolder.find('.eat').each(function() {
            total += Math.max(0, parseInt($(this).attr('value')));
            nutrients[parseInt($(this).attr('id'))] = parseInt($(this).attr('value'));
        });
        var EAT_MAX = parseInt(foodHolder.attr('eat-max'));

        if (total < EAT_MAX) {
            $('#modal-header').html('Are You Sure?');
            $('#modal-content').html('You are eating less than you could! Your total nutrient intake of ' + 
                total + ' is less than the maximum of ' + EAT_MAX);
            $('#modal-cancel').click(function() {
                $('.modal').modal('hide');
            });
            $('#modal-confirm').click(function() {
                $('.modal').modal('hide');
                eat(nutrients);
            });
            $('.modal').modal('show');
        } else {
            eat(nutrients);
        }
    });

    $('.eat-plus').click(function() {
        $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) + 1);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.eat-minus').click(function() {
        $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) - 1);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.eat-top').click(function() {
        $(this).siblings('.eat').attr('value', -1);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.eat-bottom').click(function() {
        $(this).siblings('.eat').attr('value', 0);
        updateEatButtons($(this).parents('.food-holder'));
    });

    $('.resource-data').mouseenter(function() {
        var resource = $(this).attr('value');

        $('#resource-visual').append('<img name="' + resource + '" src="' + baseUrl + 'img/molecules/' + resource + '"'
            + 'alt="' + resource + '" class="image-content hidden">');

        setTimeout(function() {
            $('#resource-visual img[name="' + resource + '"]').fadeIn(250);
        }, 300);
    });

    $('.resource-data').mouseleave(function() {
        var resource = $(this).attr('value');

        $('#resource-visual img[name="' + resource + '"]').fadeOut(100, function() {
            $(this).remove();
        });
    });

    $('#alert-close').click(function() {
        closeNotification();
    });
});

function updateScrollbars()
{
    $('.scrollbar-content').each(function() {
        $(this).css('height', ($(window).height() - $(this).offset().top - parseInt($(this).css('padding-top')) - parseInt($(this).css('padding-bottom'))) + 'px');

        if ($(this).attr('scrollbar') != 'true') {
            $(this).mCustomScrollbar({
                autoHideScrollbar: true,
                scrollInertia: 350,
                theme: "dark",
            });
            $(this).attr('scrollbar', 'true')
        } else {
            $(this).mCustomScrollbar('update');
        }
    });
}

function setTurn(turn, max_turns)
{
    $('#turns').html(turn + '/' + max_turns + ' Turns Remaining');
}

function setPoints(points)
{
    $('#points').html(points + ' Points');
}

function selectOrgan(organ)
{
    $('.organ-title').each(function() {
        if ($(this).hasClass('global-title')) {
            return;
        }
        var tabOrgan = $(this).attr('value');
        if (tabOrgan == organ) {       // select this tab
            if ($(this).hasClass('active')) {
                return;
            }
            $(this).addClass('active');
            $(this).children('.cover').show();

            $('.pathway-holder[value="'  + tabOrgan + '"]').show();
            $('.resource-holder[value="' + tabOrgan + '"]').show();

            $('#organ-visual').find('img[name="' + tabOrgan + '"]').remove();

            $('#organ-visual').append('<img name="' + tabOrgan + '" src="' + baseUrl + 'img/organs/' + tabOrgan + '"'
                + 'alt="' + tabOrgan + '" class="image-content hidden">');
            setTimeout(function() {
                $('#organ-visual img[name="' + tabOrgan + '"]').fadeIn(250);
            }, 100);
        } else {                                    // unselect this tab
            $(this).removeClass('active');
            $(this).children('.cover').hide();
            $('.pathway-holder[value="'  + tabOrgan + '"]').hide();
            $('.resource-holder[value="' + tabOrgan + '"]').hide();

            $('#organ-visual img[name="' + tabOrgan + '"]').fadeOut(100, function() {
                $(this).remove();
            });
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
            $('#cell-canvas').animate({ backgroundColor: '#' + data.color });
        }
    });
}

function notify(message, type, duration)
{
    $('#alert-message').html(message);
    $('#notification')
        .attr('class', 'alert alert-' + type)
        .fadeIn();

    setTimeout(closeNotification, duration);
}

function closeNotification()
{
    $('#notification').fadeOut();
}

function updatePh(ph)
{
    $('#ph-holder').find('.bar').css('width', Math.min(100, 100*((ph-6)/2)) + '%');
    $('#ph-holder').find('.resource-value').html(ph.toFixed(2));
}
