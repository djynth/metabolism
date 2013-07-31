var COLOR_INCREASE = "72,144,229";
var COLOR_DECREASE = "232,12,15";
var TRACKER_ICONS = 5;

$(document).ready(function() {
    refreshResources();

    $('.resource-data').hover(function() {
        visualizeResource($(this).attr('value'), true);
    }, function() {
        visualizeResource($(this).attr('value'), false);
    });
});

function visualizeResource(resource, show)
{
    if (show) {
        var visualization = $('<img>')
            .attr('name', resource)
            .attr('alt', resource)
            .attr('src', baseUrl + 'img/molecules/' + resource)
            .addClass('image-content')
            .css('display', 'none');

        $('#resource-visual').append(visualization);

        setTimeout(function() {
            visualization.fadeIn(300);

            $.ajax({
                url: 'index.php?r=site/resourceFullName',
                type: 'POST',
                dataType: 'json',
                data: {
                    resource: resource
                },
                success: function(data) {
                    if ($('#resource-visual img[name="' + resource + '"]').length > 0) {
                        $('#resource-visual .visual-label').text(data.name);
                    }
                }
            });
        }, 350);
    } else {
        $('#resource-visual img[name="' + resource + '"]').fadeOut(150, function() {
            $(this).remove();

            $('#resource-visual .visual-label').text('Resource');
        });
    }
}

function refreshResources(resources)
{
    if (typeof resources === 'undefined') {
        $('.resource-holder .resource-data').each(function() {
            onResourceChange(
                $(this).attr('value'),
                $(this).parents('.resource-holder').attr('value'),
                parseInt($(this).find('.resource-value').html())
            );
        });
        refreshPathways();
        initScrollbars();
    } else {
        for (var resource in resources) {
            for (var organ in resources[resource]) {
                var value = resources[resource][organ];
                onResourceChange(resource, organ, value);
            }
        }
        refreshPathways();
    }
}

function onResourceChange(resource, organ, value)
{
    var change = value - getResourceValue(resource, organ);
    var elem = getResourceElement(resource, organ);
    var color = change > 0 ? COLOR_INCREASE : COLOR_DECREASE;
    if (change == 0) {
        if (elem.attr('init')) {
            color = false;
            elem.removeAttr('init');
        } else {
            return;
        }
    }
    
    if (color) {
        elem.animate({ boxShadow : "0 0 5px 5px rgb("+color+")" }, function() {
            elem.animate({ boxShadow : "0 0 5px 5px rgba("+color+", 0)" });
        });
    }

    elem.find('.resource-value').html(value);
    elem.find('.bar').css('width', Math.min(100, 100*(value/parseInt(elem.attr('max-shown')))) + '%');

    var tracker = $('.tracker[value="' + resource + '"]');
    if (tracker.length) {
        updateTracker(resource, organ, value, change, tracker);
    }
}

function getResourceElement(resource, organ)
{
    return $('.resource-holder[value="' + organ + '"] .resource-data[value="' + resource + '"]');
}

function getResourceValue(resource, organ)
{
    return parseInt(getResourceElement(resource, organ).find('.resource-value').html());
}

function getResourceName(resource, organ)
{
    return getResourceElement(resource, organ).find('.resource-name').html();
}

function updateTracker(resource, organ, amount, change, tracker)
{
    tracker.find('.tracker-organ[value="' + organ + '"] .organ-amount').attr('value', amount).text(amount);

    var total = 0;
    tracker.find('.organ-amount').each(function() {
        total += parseInt($(this).attr('value'));
    });

    tracker.find('.tracker-amount').attr('value', total).text(total);

    if (change > 0) {
        var counter = 0;

        function updateTrackerIcons() {
            if (counter++ < change) {
                var level1 = $('<img>')
                    .addClass('tracker-icon level1')
                    .attr('src', baseUrl + 'img/primary-icons/' + resource + '/level1.png')
                    .attr('alt', '');

                var left = 0;
                tracker.find('.tracker-organ[value="' + organ + '"]').find('.tracker-icon').each(function() {
                    left += parseInt($(this).width());
                });
                
                tracker.find('.tracker-organ[value="' + organ + '"]').find('.tracker-icon-holder').append(level1);

                level1.animate({ left: left, opacity: 1 }, 1000, function() {
                    if (tracker.find('.level1').length >= TRACKER_ICONS) {
                        var left = 0;
                        tracker.find('.tracker-organ[value="' + organ + '"]').find('.level3,.level2').each(function() {
                            left += parseInt($(this).width());
                        });

                        var level2 = $('<img>')
                            .addClass('tracker-icon level2')
                            .attr('src', baseUrl + 'img/primary-icons/' + resource + '/level2.png')
                            .attr('alt', '')
                            .css('left', left);

                        tracker.find('.tracker-organ[value="' + organ + '"]').find('.tracker-icon-holder').append(level2);

                        level2.animate({ opacity: 1 }, 1000);

                        tracker.find('.level1').animate({ left: left, opacity: 0 }, 1000, function() {
                            tracker.find('.level2').remove();
                            if (tracker.find('.level2').length >= TRACKER_ICONS) {
                                var left = 0;
                                tracker.find('.tracker-organ[value="' + organ + '"]').find('.level3').each(function() {
                                    left += parseInt($(this).width());
                                });

                                var level3 = $('<img>')
                                    .addClass('tracker-icon level3')
                                    .attr('src', baseUrl + 'img/primary-icons/' + resource + '/level3.png')
                                    .attr('alt', '')
                                    .css('left', left);

                                tracker.find('.tracker-organ[value="' + organ + '"]').find('.tracker-icon-holder').append(level3);

                                level3.animate({ opacity: 1 }, 1000);

                                tracker.find('.level2').animate({ left: left, opacity: 0 }, 1000, function() {
                                    tracker.find('.level2').remove();
                                    setTimeout(updateTrackerIcons, 1000);
                                });
                            } else {
                                setTimeout(updateTrackerIcons, 1000);
                            }
                        });
                    } else {
                        setTimeout(updateTrackerIcons, 1000);
                    }
                });
            }
        }
        updateTrackerIcons();
    }
}
