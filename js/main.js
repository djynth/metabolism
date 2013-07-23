$(document).ready(function() {
    $(window).resize(function() { updateScrollbars(); });

    $('#alert-close').click(function() {
        notify(false);
    });
});

function updateScrollbars()
{
    $('.scrollbar-content').each(function() {
        $(this).css('height', $(window).height() - $(this).offset().top - ($(this).innerHeight() - $(this).height()));

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
