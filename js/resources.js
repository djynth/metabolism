var COLOR_INCREASE = "72,144,229";
var COLOR_DECREASE = "232,12,15";
var TRACKER_ICONS = 5;
var TRACKER_WAIT = 300;         // the amount of time between tracker animations, in ms
var TRACKER_ANIMATION = 600;    // the duration of a tracker animtion, in ms

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
