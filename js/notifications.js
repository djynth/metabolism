var NOTIFICATIONS;

$(document).ready(function() {
    NOTIFICATIONS = $('#notifications');

    NOTIFICATIONS.find('.header').click(function() {
        NOTIFICATIONS.find('.content').slideToggle();
    });

    NOTIFICATIONS.find('.header').find('.fa').click(function(e) {
        $(this).toggleClass('fa-toggle-up').toggleClass('fa-toggle-down');
        e.stopPropagation();
    });
});

function notify(message, type)
{
    if (typeof type === 'undefined') {
        type = 'normal';
    }

    var now = new Date();
    var icon = 'fa-info-circle';
    if (type === 'warning') {
        icon = 'fa-exclamation-circle';
    }
    if (type === 'error') {
        icon = 'fa-exclamation-triangle';
    }

    NOTIFICATIONS.find('.content').prepend(
        $('<div>')
            .addClass('notification')
            .addClass(type)
            .append(
                $('<i>')
                    .addClass('fa')
                    .addClass(icon)
            )
            .append(
                $('<p>')
                    .addClass('message')
                    .html(message)
            )
            .append(
                $('<p>')
                    .addClass('time')
                    .html(now.toLocaleTimeString())
            )
    );
}