var BRAIN_NAME = "brain";
var MUSCLE_NAME = "muscle";
var LIVER_NAME = "liver";
var starting_resources = new Array();

$(document).ready(function() {
    populateResourceTable();

    $('button#next_turn').click(function() {
        var resources = new Array();
        var i = 0;

        $('div#resources_column table.current_resources tr td.resource_name').each(function() {
            resources[i++] = new resource($(this).html(), $(this).siblings('.resource_value').html(),
                getOrgan($(this).parent().parent().parent().attr('id')));
        });

        // TODO get turn action choices

        // TODO verify turn action choices, print error and exit if they are invalid

        // TODO adjust resources
        for (i = 0; i < resources.length; i++) {
            console.log(i + ": " + resources[i].name + " - " + resources[i].value + ", " + resources[i].organ);
            if (isBrain(resources[i].organ)) {
                resources[i].value = Math.ceil(Math.random()*3);
            }
            else if (isMuscle(resources[i].organ)) {
                resources[i].value = 3 + Math.ceil(Math.random()*3);
            }
            else if (isLiver(resources[i].organ)) {
                resources[i].value = 6 + Math.ceil(Math.random()*3);
            }
            
        }

        for (i = 0; i < resources.length; i++) {
            $('div#resources_column table#' + resources[i].organ + ' tr')
                .filter(function() { return $(this).children().html() == resources[i].name; })
                .children('.resource_value')
                .html(resources[i].value);
        }
    });
});

/*
Called when the page is loaded, this function should insert the starting resource names and amounts into the resource table.
The resource table is empty (i.e. with no rows/cells) prior to calling this function.
*/
function populateResourceTable()
{
    // TODO load starting resources from file
    starting_resources[0] = new resource('ATP', 2.5, "brain");
    starting_resources[1] = new resource('ADP', 0.75, "brain");
    starting_resources[2] = new resource('ATP', 4.2, "muscle");
    starting_resources[3] = new resource('ADP', 1.0, "muscle");
    starting_resources[4] = new resource('ATP', 2.96, "liver");
    starting_resources[5] = new resource('ADP', 0.3, "liver");

    for (var i = 0; i < starting_resources.length; i++) {
        $('table.current_resources#' + getOrgan(starting_resources[i])).append('<tr><td class="resource_name">' + starting_resources[i].name + '</td>' + 
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
    this.organ = getOrgan(organ);

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

/*
Gets the organ name for the given resource.
If the given resource is a string, if it matches an organ name (ignoring case), that organ's proper name is returned, otherwise an error is thrown.
If the given resource is a resource object, its organ field is checked in the same was as a string and then the matching organ name is returned (or an error is thrown).
*/
function getOrgan(resource) {
    if (typeof resource == "undefined") {
        throw "undefined resource";
    }
    if (isBrain(resource)) { return BRAIN_NAME; }
    if (isMuscle(resource)) { return MUSCLE_NAME; }
    if (isLiver(resource)) { return LIVER_NAME; }
    throw "unknown organ: " + resource.toString();
}

/*
Determines whether the given resource corresponds to the brain organ.
If the resource is a string, it is compared to the brain's proper name (ignoring case), and the result is returned.
If the resource is a resource object, its organ field is run throught the same test.
Otherwise, false is returned.
*/
function isBrain(resource) {
    if (typeof resource == "string") {
        return resource.toUpperCase() == BRAIN_NAME.toUpperCase();
    } else if (typeof resource == "object") {
        return resource.organ.toUpperCase() == BRAIN_NAME.toUpperCase();
    }
    return false;
}

/*
Determines whether the given resource corresponds to the muscle organ.
If the resource is a string, it is compared to the muscle's proper name (ignoring case), and the result is returned.
If the resource is a resource object, its organ field is run throught the same test.
Otherwise, false is returned.
*/
function isMuscle(resource) {
    if (typeof resource == "string") {
        return resource.toUpperCase() == MUSCLE_NAME.toUpperCase();
    } else if (typeof resource == "object") {
        return resource.organ.toUpperCase() == MUSCLE_NAME.toUpperCase();
    }
    return false;
}

/*
Determines whether the given resource corresponds to the liver organ.
If the resource is a string, it is compared to the liver's proper name (ignoring case), and the result is returned.
If the resource is a resource object, its organ field is run throught the same test.
Otherwise, false is returned.
*/
function isLiver(resource) {
    if (typeof resource == "string") {
        return resource.toUpperCase() == LIVER_NAME.toUpperCase();
    } else if (typeof resource == "object") {
        return resource.organ.toUpperCase() == LIVER_NAME.toUpperCase();
    }
    return false;
}