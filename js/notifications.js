var NOTIFICATIONS;
var NOTIFICATION_CONTENT;

$(document).ready(function() {
    NOTIFICATIONS = $('#notifications');
    NOTIFICATION_CONTENT = NOTIFICATIONS.find('.content');
    var maxHeight = 350;

    NOTIFICATIONS.find('.header').click(function() {
        NOTIFICATION_CONTENT
            .animate({
                height: NOTIFICATION_CONTENT.hasClass('active') ? 0 : maxHeight
            })
            .toggleClass('active');
    });

    NOTIFICATIONS.find('.minimize-notify').click(function(e) {
        $(this).toggleClass('fa-toggle-up').toggleClass('fa-toggle-down');
        e.stopPropagation();
    });

    $('.pathways').find('.pathway').click(function() {
        notify('really super long text more text and longer message notifications are so cool this is really annoying to type but should be long enough now');
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

    var notification = 
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
                    .addClass('time')
                    .html(now.toLocaleTimeString())
            )
            .append(
                $('<p>')
                    .addClass('message')
                    .html(message)
            )

    NOTIFICATIONS.find('.content').prepend(notification);

    if (!NOTIFICATION_CONTENT.hasClass('active') &&
        NOTIFICATIONS.find('.minimize-notify').hasClass('fa-toggle-up')) {
        NOTIFICATION_CONTENT.animate({
            height: NOTIFICATION_CONTENT.height() + notification.outerHeight()
        }, function() {
            setTimeout(function() {
                if (!NOTIFICATION_CONTENT.hasClass('active')) {
                    NOTIFICATION_CONTENT.animate({
                        height: NOTIFICATION_CONTENT.height() - notification.outerHeight()
                    });
                }
            }, 5000);
        });
    }
}