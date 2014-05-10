function updateTracker(resource, organ, amount, change, tracker)
{
    tracker.find('.organ[organ-id="' + organ + '"]').find('.amount').text(amount);

    var total = 0;
    tracker.find('.amount').each(function() {
        total += parseInt($(this).text());
    });

    tracker.find('.total').text(total);

    if (change > 0) {
        var counter = 0;

        var trackerOrgan = tracker.find('.organ[organ-id="' + organ + '"]');
        var iconHolder = trackerOrgan.find('.icons');

        function updateTrackerIcons() {
            if (counter++ < change) {
                var level1 = createIcon(resource, 1, iconHolder.find('.level1').length + 1);

                var left = 0;
                iconHolder.find('.tracker-icon').each(function() {
                    left += $(this).width();
                });
                
                iconHolder.append(level1);

                level1.animate({ left: left, opacity: 1 }, TRACKER_ANIMATION, function() {
                    if (iconHolder.find('.level1').length >= TRACKER_ICONS) {
                        var left = 0;
                        iconHolder.find('.level3,.level2').each(function() {
                            left += $(this).width();
                        });

                        var level2 = createIcon(resource, 2, iconHolder.find('.level2').length + 1).css('left', left);

                        iconHolder.append(level2);

                        level2.animate({ opacity: 1 }, TRACKER_ANIMATION);

                        $.when(iconHolder.find('.level1').animate({ left: left, opacity: 0.5 }, TRACKER_ANIMATION)).then(function() {
                            iconHolder.find('.level1').remove();
                            if (iconHolder.find('.level2').length >= TRACKER_ICONS) {
                                var left = 0;
                                iconHolder.find('.level3').each(function() {
                                    left += $(this).width();
                                });

                                var level3 = createIcon(resource, 3, iconHolder.find('.level3').length + 1).css('left', left);

                                iconHolder.append(level3);

                                level3.animate({ opacity: 1 }, TRACKER_ANIMATION);

                                $.when(iconHolder.find('.level2').animate({ left: left, opacity: 0.5 }, TRACKER_ANIMATION)).then(function() {
                                    iconHolder.find('.level2').remove();
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
        updateTrackerIcons();
    }
}

function createIcon(resource, level, count)
{
    var filename = 'level' + level + '.png';

    return $('<img>')
        .addClass('tracker-icon level' + level)
        .attr('src', '/img/primary-icons/' + resource + '/' + filename)
        .attr('alt', '');
}