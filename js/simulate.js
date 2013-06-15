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
    populateTabs();
    showTab(1);

    $('.action_content').click(function() {
        var action = getAction($(this).attr('value'));
        var organ = getOrgan($(this).parent().attr('value'));
        var resources = new Array();
        var i = 0;

        $('div#resources_column table.current_resources tr td.resource_name').each(function() {
            resources[i++] = new resource($(this).html(), parseFloat($(this).siblings('.resource_value').html()),
                $(this).parent().parent().parent().attr('id'));
        });

        resources = action.run(organ, resources);
        if (typeof resources == "string") {
            $(this).siblings('p.error').html(resources);
            return;
        }

        for (i = 0; i < resources.length; i++) {
            $('div#resources_column table.current_resources#' + resources[i].organ + ' tr')
                .filter(function() { return $(this).children('.resource_name').html() == resources[i].name; })
                .children('.resource_value')
                .html(resources[i].value);
        }

        incrementTurn();
        addPoints(action.points);
    });

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
        resources = action.run(organ, resources);
        if (typeof resources == "string") {
            $(this).siblings('p.error').html(resources);
            return;
        }

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

    $('div.tab_header').click(function() {
        showTab($(this).attr('value'));
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

function setPoints(points)
{
    $('p#points').attr('value', points);
    $('p#points').html(points + ' Points');
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

function showTab(id)
{
    $('div.tab_content').addClass('hidden');
    $('div.tab_content').filter(function() { return $(this).attr('value') == id; }).removeClass('hidden');
}

function populateTabs()
{
    $('div.tab_header').each(function() {
        var organ = $(this).attr('id');
        var value = $(this).attr('value');

        $('div.tab_content').filter(function() { return $(this).attr('value') == value; }).each(function() {
            var actions = getActions(organ);

            for (var i = 0; i < actions.length; i++) {
                $(this).append(actions[i].toHTML());
            }
        });
    });
}

function getOrgan(id) {
    if (typeof id == "string") {
        id = parseInt(id);
    }

    switch(id)
    {
    case 1: return BODY;
    case 2: return BRAIN;
    case 3: return MUSCLE;
    case 4: return LIVER;
    default: throw "invalid organ id: " + id;
    }
}