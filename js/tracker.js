var TRACKER;

var TRACKER_ICONS = 5;
var ICON_MAX_LEVEL = 3;
var TRACKER_ANIMATION = 500;

$(document).ready(function() {
    TRACKER = $('#tracker');
});

function refreshTrackers()
{
    TRACKER.find('.tracker:not(.actions)').each(function() {
        var resource = $(this).res();
        $(this).find('.organ').each(function() {
            var res = getRes(resource, $(this).organ());
            var amount = $(this).find('.amount');
            var change = parseInt(res.attr('amount')) - parseInt(amount.text());
            amount.text(res.attr('amount'));

            updateTrackerIcons($(this).find('.icons'), res, change);
        });
        
        var total = 0;
        $(this).find('.amount').each(function() {
            total += parseInt($(this).text());
        });
        $(this).find('.total').text(total);
    });
}

function updateTrackerIcons(icons, res, change, level) {
    if (typeof level === 'undefined') {
        if (change > 0) {
            var icon = createIcon(res, 1);

            var left = 0;
            icons.find('.icon').each(function() {
                left += $(this).width();
            });

            icons.append(icon);
            icon.animate(
                { left: left, opacity: 1 },
                TRACKER_ANIMATION,
                function() {
                    updateTrackerIcons(icons, res, change, 1);
                }
            );
        }
    } else {
        if (level < ICON_MAX_LEVEL && 
            icons.find('[level=' + level + ']').length >= TRACKER_ICONS) {
            var left = 0;
            icons.find('[level!=' + level + ']').each(function() {
                left += $(this).width();
            });

            var icon = createIcon(res, level + 1).css('left', left);
            icons.append(icon);
            icon.animate({ opacity: 1 }, TRACKER_ANIMATION);

            $.when(icons.find('[level=' + level + ']').animate(
                { left : left, opacity: 0 },
                TRACKER_ANIMATION)
            ).then(function() {
                icons.find('[level=' + level + ']').remove();
                updateTrackerIcons(icons, res, change, level + 1);
            });
        } else {
            updateTrackerIcons(icons, res, change - 1);
        }
    }
}

function createIcon(res, level)
{
    return $('<img>')
        .addClass('icon')
        .attr('alt', '')
        .attr('res', res.res())
        .attr('level', level)
        .each(function() {
            updateIcon($(this));
        });
}

function updateIcon(icon)
{
    $.ajax({
        url: '/index.php/site/trackerIcon',
        type: 'POST',
        dataType: 'json',
        data: {
            resource_id: icon.res(),
            level: icon.attr('level'),
            theme_type: getColorTheme().type
        },
        success: function(data) {
            icon.attr('src', data.src);
        }
    });
    return icon;
}
