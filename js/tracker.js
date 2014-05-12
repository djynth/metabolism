var TRACKER;

var TRACKER_ICONS = 5;
var TRACKER_WAIT = 250;         // the amount of time between tracker animations, in ms
var TRACKER_ANIMATION = 500;    // the duration of a tracker animtion, in ms

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

            var icons = $(this).find('.icons');
            updateTrackerIcons();

            function updateTrackerIcons() {
                if (change-- > 0) {
                    var level1 = createIcon(res, 1);

                    var left = 0;
                    icons.find('.icon').each(function() {
                        left += $(this).width();
                    });
                    
                    icons.append(level1);

                    level1.animate({ left: left, opacity: 1 }, TRACKER_ANIMATION, function() {
                        if (icons.find('.icon[level=1]').length >= TRACKER_ICONS) {
                            var left = 0;
                            icons.find('.icon[level=2],.icon[level=3]').each(function() {
                                left += $(this).width();
                            });

                            var level2 = createIcon(res, 2).css('left', left);

                            icons.append(level2);

                            level2.animate({ opacity: 1 }, TRACKER_ANIMATION);

                            $.when(icons.find('.icon[level=1]').animate({ left: left, opacity: 0.5 }, TRACKER_ANIMATION)).then(function() {
                                icons.find('.icon[level=1]').remove();
                                if (icons.find('.icon[level=2]').length >= TRACKER_ICONS) {
                                    var left = 0;
                                    icons.find('.icon[level=3]').each(function() {
                                        left += $(this).width();
                                    });

                                    var level3 = createIcon(res, 3).css('left', left);

                                    icons.append(level3);

                                    level3.animate({ opacity: 1 }, TRACKER_ANIMATION);

                                    $.when(icons.find('.icon[level=2]').animate({ left: left, opacity: 0.5 }, TRACKER_ANIMATION)).then(function() {
                                        icons.find('.icon[level=2]').remove();
                                        setTimeout(updateTrackerIcons, TRACKER_WAIT);
                                    });
                                } else {
                                    setTimeout(updateTrackerIcons, TRACKER_WAIT);
                                }
                            });
                        } else {
                            setTimeout(updateTrackerIcons, TRACKER_WAIT);
                        }
                    });
                }
            }
        });
        
        var total = 0;
        $(this).find('.amount').each(function() {
            total += parseInt($(this).text());
        });
        $(this).find('.total').text(total);
    });
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
        url: 'index.php/site/trackerIcon',
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
