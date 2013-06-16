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

        for (i = 0; i < resources.length; i++) {
            $('table.resource_data#' + resources[i].organ + ' tr')
                .filter(function() { return resources[i].hasName($(this).children('.name').html()); })
                .children('.value')
                .html(resources[i].value);
        }
        refreshActions(resources);

        nextTurn();
        setPoints(points + action.points);
    });

    $('h3.section_title').click(function() {
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
    $('h3.section_title').each(function() {
        if ($(this).attr('id') == organ) {      // select this tab
            $('div.action_holder#' + $(this).attr('id')).show();
            $('div.resource_holder#' + $(this).attr('id')).show();
        } else {                                // unselect this tab
            $('div.action_holder#' + $(this).attr('id')).hide();
            $('div.resource_holder#' + $(this).attr('id')).hide();
        }
    });
}

function notify(message) {

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

        $('table.resource_data#' + res.organ).append('<tr>'+
            '<td class="name">' + res.abbr + '</td>'+
            '<td class="value">' + res.value + '</td>'+
            '</tr>');
    }
}