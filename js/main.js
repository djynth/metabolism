var BRAIN = "brain";
var MUSCLE = "muscle";
var LIVER = "liver";
var BODY = "body";

var TURNS = 50;
var turn = 51;
var points = 0;
var resources;

$(document).ready(function() {
    resources = getStartingResources();
    setPoints(0);
    nextTurn();
    populateActions();
    populateResources();
    selectOrgan(BRAIN);

    $('button.run_action').click(function() {
        var id = $(this).parent().attr('value');
        var organ = $(this).parent().parent().attr('id');
        var action = getAction(id);
        action.run(organ, resources);

        refreshActions(resources);

        nextTurn();
        setPoints(points + action.points);
    });

    $('div.section_title').click(function() {
        selectOrgan($(this).attr('id'));
    });
});

function nextTurn() {
    turn--;
    $('p#turns').html(turn + '/' + TURNS + ' Turns Remaining');
}

function setPoints(pts) {
    points = pts;
    $('p#points').html(points + ' Points');
}

function selectOrgan(organ) {
    $('div.section_title').each(function() {
        if ($(this).attr('id') == organ) {      // select this tab
            $(this).addClass('active');
            $(this).children('div.cover#' + $(this).attr('id')).show();
            $('div.action_holder#' + $(this).attr('id')).show();
            $('div.resource_holder#' + $(this).attr('id')).show();
        } else {                                // unselect this tab
            $(this).removeClass('active');
            $(this).children('div.cover#' + $(this).attr('id')).hide();
            $('div.action_holder#' + $(this).attr('id')).hide();
            $('div.resource_holder#' + $(this).attr('id')).hide();
        }
    });
}

function populateActions() {
    var organs = [BODY, BRAIN, MUSCLE, LIVER];
    for (var i = 0; i < organs.length; i++) {
        var actions = getActions(organs[i]);
        for (var j = 0; j < actions.length; j++) {
            $('div.action_holder#' + organs[i]).append(actions[j].toHTML(resources, organs[i]));
        }
    }
    refreshActions(resources);
}

function populateResources() {
    for (var i = 0; i < resources.length; i++) {
        var res = resources[i];

        $('div.resource_holder#' + res.organ).append('<div class="resource_data"><div class="progress">' +
            '<span class="resource_name">' + res.abbr + '</span>' +
            '<span class="resource_value">' + res.value + '</span>' + 
            //'<div class="bar" style="width: ' + Math.min(100, 100*(res.value/res.max_value)) + ';"></div>' + 
            '<div class="bar" style="width: ' + Math.min(100, 100*(res.value/res.max_value)) + '%;"></div>' + 
            '</div></div>');
    }
}

function onResourceChange(resource, organ, value, change) {
    var color = change > 0 ? "72, 144, 229" : "232, 12, 15";
    var elem = $('div.resource_data').filter(function() {
        if($(this).parent().attr('id') != organ) {
            return false;
        }
        var isCorrectResource = false;
        $(this).find('.resource_name').each(function() {
            if (resource.hasName($(this).html())) {
                isCorrectResource = true;
            }
        });
        return isCorrectResource;
    });
    elem.animate({ boxShadow : "0 0 5px 5px rgb("+color+")" }, 250, function() {
        elem.animate({ boxShadow : "0 0 5px 5px rgba("+color+", 0)" }, 250);
    });
    elem.find('.resource_value').html(value);
    elem.find('.bar').css('width', Math.min(100, 100*(value/resource.max_value)) + '%')
}