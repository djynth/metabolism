var BRAIN = "brain";
var MUSCLE = "muscle";
var LIVER = "liver";
var BODY = "body";
var starting_resources = new Array();

var MAX_TURNS = 50;
var turn = 0;
var points = 0;

$(document).ready(function() {
    populateResourceTable();
    incrementTurn();
    setPoints(0);

    $('button#next_turn').click(function() {
        var resources = new Array();
        var i = 0;

        $('div#resources_column table.current_resources tr td.resource_name').each(function() {
            resources[i++] = new resource($(this).html(), parseFloat($(this).siblings('.resource_value').html()),
                $(this).parent().parent().parent().attr('id'));
        });

        try {
            var action = getAction($('select#actions option:selected').attr('value'));
            $(this).siblings('p.error').html('');
        }
        catch (err) {
            console.log(err);
            $(this).siblings('p.error').html('Select an Action');
            return;
        }

        var organ = $('input[name=organ]:checked', '#organ_selector').val();
        var result = runAction(action.id, organ, resources);
        if (typeof result == "string") {
            $(this).siblings('p.error').html(result);
            return;
        }

        resources = result;

        for (i = 0; i < resources.length; i++) {
            $('div#resources_column table.current_resources#' + resources[i].organ + ' tr')
                .filter(function() { return $(this).children('.resource_name').html() == resources[i].name; })
                .children('.resource_value')
                .html(resources[i].value);
        }

        incrementTurn();
        addPoints(action.points);
    });

    $('form#organ_selector').change(function() {
        var organ = $('input[name=organ]:checked', '#organ_selector').val();
        var actions = getActions(organ);

        var actionsHTML = "";

        for (var i = 0; i < actions.length; i++)
        {
            actionsHTML += '<option value="' + actions[i].id + '">' + actions[i].name + '</option>';
        }

        $('select#actions').html(actionsHTML);
    });
});

/*
Called when the page is loaded, this function should insert the starting resource names and amounts into the resource table.
The resource table is empty (i.e. with no rows/cells) prior to calling this function.
*/
function populateResourceTable()
{
    starting_resources = getStartingResources();

    for (var i = 0; i < starting_resources.length; i++) {
        $('table.current_resources#' + starting_resources[i].organ).append('<tr><td class="resource_name">' + starting_resources[i].name + '</td>' + 
            '<td class="resource_value">' + starting_resources[i].value + '</td></tr>');
    }
}

/*
Creates a resource object with the given name, value and organ.
If the name is empty or the organ is not recognized, an exception is thrown (the value is not checked).
*/
function resource(name, value, organ)
{
    if (!name) {
        //throw "no name";
    }

    this.name = name;
    this.value = value;
    this.organ = organ;

    this.inBrain = function() {
        return this.organ == BRAIN;
    }

    this.inMuscle = function() {
        return this.organ == MUSCLE;
    }

    this.inLiver = function() {
        return this.organ == LIVER;
    }

    this.inBody = function() {
        return this.organ == BODY;
    }

    this.toString = function() {
        return this.name + ": " + this.value + ", " + this.organ;
    }
}

/*
Gets the value of the resource in the given resource list with the given name and organ.
This function performs a linear search on the given resources and returns the value of the first element which has matching (case sensitive) name and organ.
*/
function getResourceValue(name, organ, resources)
{
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].name == name && resources[i].organ == organ) {
            return resources[i].value;
        }
    }
    return null;
}

function setResourceValue(name, organ, resources, value)
{
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].name == name && resources[i].organ == organ) {
            resources[i].value = value;
            return true;
        }
    }
    return false;
}

function changeResourceValue(name, organ, resources, change)
{
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].name == name && resources[i].organ == organ) {
            resources[i].value += change;
            return resources[i].value;
        }
    }
    return false;
}

function setPoints(points)
{
    $('p#points').attr('value', points);
    $('p#points').html('Points: ' + points);
}

function addPoints(points)
{
    setPoints(points + points);
}

function incrementTurn()
{
    turn = parseInt($('p#turn').attr('value')) + 1;
    $('p#turn').html('Turn: ' + turn + "/" + MAX_TURNS);
    $('p#turn').attr('value', turn);

    if (turn > MAX_TURNS) {
        // TODO link to score page
    }
}