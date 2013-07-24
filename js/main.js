$(document).ready(function() {
    $(window).resize(function() { updateScrollbars(true); });

    $('#alert-close').click(function() {
        notify(false);
    });
});

function initScrollbars()
{
    $('.scrollbar-content').each(function() {
        $(this).mCustomScrollbar({
            autoHideScrollbar: true,
            scrollInertia: 350,
            theme: "dark",
        });
    });
}

function getPathwayContentHeight()
{
    var h = $(window).height() - $('#pathway-holder').find('.accordian-header').first().offset().top;
    $('#pathway-holder .accordian-header').each(function() {
        h -= $(this).outerHeight();
    });
    return h;
}

function getResourceContentHeight()
{
    var h = $(window).height() - $('#resource-holder').find('.accordian-header').first().offset().top;
    $('#resource-holder .accordian-header').each(function() {
        h -= $(this).outerHeight();
    });
    return h;
}

function updateScrollbars(updateHeight)
{
    $('.scrollbar-content').each(function() {
        if (updateHeight) {
            if ($(this).hasClass('active')) {
                    if ($(this).hasClass('pathway-holder')) {
                    $(this).css('height', getPathwayContentHeight());
                } else {
                    $(this).css('height', getResourceContentHeight());
                }
            } else {
                $(this).css('height', 0);
            }
        }
        
        $(this).mCustomScrollbar('update');
    });
}

function setTurn(turn, maxTurns)
{
    $('#turns').html(turn + '/' + maxTurns + ' Turns Remaining');
}

function setPoints(points)
{
    $('#points').html(points + ' Points');
}

function setPh(ph)
{
    $('#ph-holder').find('.bar').css('width', Math.max(0, Math.min(100, 100*((ph-6)/2))) + '%')
                                .siblings('.resource-value').html(ph.toFixed(2));
}

function notify(message, type, duration)
{
    if (typeof duration === 'undefined') {
        duration = 3000;
    }

    if (message) {
        $('#notification').fadeOut();
    } else {
        $('#alert-message').html(message);
        $('#notification')
            .attr('class', 'alert alert-' + type)
            .fadeIn();

        setTimeout(function() {
            notify(false);
        }, duration);
    }
}
