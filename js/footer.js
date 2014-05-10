$(document).ready(function() {
    $('#minimize-footer').click(function() {
        $(this).siblings('.content').slideToggle({
            progress: onResize
        });
    });

    $('#resource-visual').find('.icon-remove').click(function() {
        updateResourceVisual().fadeOut();
    });
});

function updateResourceVisual(res, visual, onComplete)
{
    visual = typeof visual === 'undefined' ? $('#resource-visual') : visual;

    if (typeof res === 'undefined') {
        return visual.removeAttr(res);
    } else {
        $.ajax({
            url: 'index.php/site/resourceInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                resource_id: res
            },
            success: function(data) {
                visual.res(res);
                visual.find('.name').html('Name: ' + data.name);
                visual.find('.aliases').html('Aliases: ' + data.aliases.join(', '));
                visual.find('.formula').html('Formula: ' + data.formula.replace(/(\d+)/g, "<sub>$1</sub>"));
                visual.find('.hard_min').html(getLimitText('Hard Min: ', data.hard_min, data.rel_hard_min));
                visual.find('.hard_max').html(getLimitText('Hard Max: ', data.hard_max, data.rel_hard_max));
                visual.find('.soft_min').html(getLimitText('Soft Min: ', data.soft_min, data.rel_soft_min));
                visual.find('.soft_max').html(getLimitText('Soft Max: ', data.soft_max, data.rel_soft_max));
                visual.find('.description').html(data.description);
                visual.find('.image').attr('src', '/img/resources/' + data.name.toLowerCase() + '.png');
                onComplete();
            }
        });

        return visual;
    }
}

function getLimitText(prefix, limit, rel_limit)
{
    if (limit && rel_limit) {
        return prefix + limit + ', ' + getResourceName(rel_limit);
    }
    if (limit) {
        return prefix + limit;
    }
    if (rel_limit) {
        return prefix + getResourceName(rel_limit);
    }
    return '';
}

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
        .attr('src', baseUrl + 'img/primary-icons/' + resource + '/' + filename)
        .attr('alt', '');
}

jQuery.fn.extend({
    addResourceInfoSources: function() {
        this.find('.res-info-source').click(function() {
            var visual = $('#resource-visual');
            var res = $(this).res();
            if (visual.res() !== res) {
                if (visual.res()) {
                    visual.fadeOut(function() {
                        updateResourceVisual(res, visual, function() {
                            visual.finish().fadeIn();
                        });
                    });
                } else {
                    updateResourceVisual(res, visual, function() {
                        visual.finish().fadeIn();
                    });
                }
            }
        });

        return this;
    }
});