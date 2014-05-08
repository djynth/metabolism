var COLOR_INCREASE = "72,144,229";
var COLOR_DECREASE = "232,12,15";
var TRACKER_ICONS = 5;
var TRACKER_WAIT = 300;         // the amount of time between tracker animations, in ms
var TRACKER_ANIMATION = 600;    // the duration of a tracker animtion, in ms

var activeResource = null;

$(document).ready(function() {
    refreshResources();
    addResourceInfoSources($(document));
    
    $('#resource-visual-close').click(function(e) {
        activeResource = null;
        updateResourceVisual();
    });
});

function addResourceInfoSources(parent)
{
    parent.find('.resource-info-source').click(function() {
        if (activeResource === null || activeResource != $(this).attr('res-id')) {
            activeResource = $(this).attr('res-id');
            updateResourceVisual();
        }
    });
}

function refreshResources(resources)
{
    if (typeof resources === 'undefined') {
        $('.resource-holder').find('.resource-data').each(function() {
            onResourceChange(
                $(this).attr('res-id'),
                $(this).parents('.resource-holder').attr('value'),
                parseInt($(this).find('.resource-value').html())
            );
        });
    } else {
        for (var resource in resources) {
            for (var organ in resources[resource]) {
                var value = resources[resource][organ];
                onResourceChange(resource, organ, value);
            }
        }
    }
    refreshResourceLimits();
    refreshPathways();
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

    elem.find('.resource-value').text(value);
    elem.find('.bar').css('width', Math.min(100, 100*(value/parseInt(elem.attr('max-shown')))) + '%');

    var tracker = $('.tracker[res-id="' + resource + '"]');
    if (tracker.length) {
        updateTracker(resource, organ, value, change, tracker);
    }
}

function getResourceElement(resource, organ)
{
    return $('.resource-holder[value="' + organ + '"]').find('.resource-data[res-id="' + resource + '"]');
}

function getResourceValue(resource, organ)
{
    return parseInt(getResourceElement(resource, organ).find('.resource-value').html());
}

function getResourceName(resource, organ)
{
    return getResourceElement(resource, organ).find('.resource-name').html();
}

function isResourceGlobal(resource)
{
    return $('.resource-holder.global').find('.resource-data[res-id="' + resource + '"]').length > 0;
}

function updateResourceVisual()
{
    $('.pathway.source').each(function() {
        highlightSource($(this).attr('value'), false);
    });

    $('.pathway.destination').each(function() {
        highlightDestination($(this).attr('value'), false);
    });

    var visual = $('.resource-visual-content');
    if (visual.length) {
        visual.fadeOut(function() {
            $(this).remove();
            getNewResourceVisual();
        })
    } else {
        getNewResourceVisual();
    }
}

function getNewResourceVisual()
{
    $.ajax({
        url: 'index.php/site/resourceVisual',
        type: 'POST',
        dataType: 'json',
        data: {
            resource_id: activeResource
        },
        success: function(data) {
            if (activeResource == data.resource) {
                $('#resource-visual').append(data.visual);
                $('.resource-visual-content[value="' + data.resource + '"]').fadeIn();

                for (var i = 0; i < data.sources.length; i++) {
                    highlightSource(data.sources[i].id, true);
                }

                for (var i = 0; i < data.destinations.length; i++) {
                    highlightDestination(data.destinations[i].id, true);
                }
            }
        }
    });
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

function refreshResourceLimits()
{
    $('.resource-data').each(function() {
        var maxShown = $(this).attr('max-shown');
        var organ = $(this).parents('.resource-holder').attr('value');
        $(this).find('.res-limit').each(function() {
            if (typeof $(this).attr('value') === "undefined" && typeof $(this).attr('rel-value') === "undefined") {
                return;
            }
            var val1 = null;
            var val2 = null;
            var value = null;
            if (typeof $(this).attr('value') === "undefined") {
                val1 = getResourceValue(parseInt($(this).attr('rel-value')), organ);
            }
            if (typeof $(this).attr('rel-value') === "undefined") {
                val2 = parseInt($(this).attr('value'));
            }

            if ($(this).hasClass('max')) {
                if (val1 === null) {
                    value = val2;
                } else if (val2 === null) {
                    value = val1;
                } else {
                    value = Math.min(val1, val2);
                }

                if (value <= maxShown) {
                    $(this).width(100*Math.abs(maxShown - value)/maxShown + "%");
                }
            } else {
                if (val1 === null) {
                    value = val2;
                } else if (val2 === null) {
                    value = val1;
                } else {
                    value = Math.max(val1, val2);
                }

                if (value >= 0) {
                    $(this).width(100*value/maxShown + "%");
                }
            }
        });
    });
}
