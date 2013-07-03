/**
 * Holds the current state of the resource levels.
 * @type {Array}
 */
var resources = [];
/**
 * The RGB color, flattened into a String, that should be used to highlight a resource bar when the value has increased.
 * @type {string}
 */
var COLOR_INCREASE = "72,144,229";
/**
 * The RGB color, flattened into a String, that should be used to highlight a resource bar when the value has decreased.
 * @type {string}
 */
var COLOR_DECREASE = "232,12,15";

/**
 * A Resource object, which holds all data about a specific, individual resource.
 * 
 * @param {number} id An ID which is unique to Resources with the same name(s); note that two Resources may have
 *                    identical ID's presuming they are in distinct organs.
 * @param {string} abbr This Resource's abbreviation, typically a chemica formula should not use spaces
 * @param {string} name The most commonly used name for this Resource.
 * @param {string} full_name The full or scientific name for this Resource, only used occassionally in detailed views.
 * @param {number} value The value of this Resource; that is, its current level.
 * @param {number} max_value The maximum value shown in the resource levels pane; this value does not constrict the
 *                           Resource's value, but at this level, the Resource bar is shown as completely full.
 * @param {string} organ The organ in which this Resource resides.
 * @param {string} color The color that should be used to depict this Resource when possible.
 * @param {string} imageFilename The filename (relative to the js/ directory) at which the image corresponding to this
 *                               Resource can be found.
 */
function Resource(id, abbr, name, full_name, value, max_value, organ, color, imageFilename)
{
    this.id = id;
    this.abbr = abbr;
    this.name = name;
    this.full_name = full_name;
    this.value = value;
    this.max_value = max_value;
    this.organ = organ;
    this.color = color;
    this.imageFilename = imageFilename;

    /**
     * Determines whether this Resource "has" the given name; that is, whether the given name is equal any of this
     *     Resource's names: <code>abbr</code>, <code>name</code>, or <code>full_name</code>.
     * @param {string} name The name for which to check.
     * @return {boolean} Returns true if the given name matches one of this Resource's names, false otherwise.
     */
    this.hasName = function(name) {
        return this.name == name || this.abbr == name || this.full_name == name;
    }

    /**
     * Flattens this Resource into an HTML element and returns it.
     * 
     * @return {jQuery} Returns a jQuery-type HTML element that can be used to represent this Resource in the UI.
     */
    this.toHTML = function() {
        return $('<div>')
            .addClass('resource-data')
            .append($('<div>')
                .addClass('progress')
                .append($('<span>')
                    .addClass('resource-name')
                    .html(this.name)
                ).append($('<span>')
                    .addClass('resource-value')
                    .html(this.value)
                ).append($('<div>')
                    .addClass('bar')
                    .css('width', Math.min(100, 100*(this.value/this.max_value)) + '%')
                )
            );
    }
}

/**
 * Determines whether the given resource is globally available.
 * 
 * @param {resource|string|number} resource The resource for which to check; may be a Resource object, name, or ID.
 * @return {boolean} Returns true if the resource matched with the given identifier is global, false otherwise.
 */
function isResourceGlobal(resource)
{
    if (typeof resource == "object") {
        return resource.organ == GLOBAL;
    }

    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(resource) || resources[i].id == resource) {
            return resources[i].organ == GLOBAL;
        }
    }
    return false;
}

/**
 * Returns the current value of the Resource with the given name in the given organ.
 * 
 * @param {string|number} resource Any name of the Resource whose value is to be found or the Resource's ID.
 * @param {string|null} organ The organ in which the Resource must be located, or null to allow any organ.
 * @return {number} The current value of the matched Resource, or -1 if it is not found.
 */
function getResourceValue(resource, organ)
{
    for (var i = 0; i < resources.length; i++) {
        if ((resources[i].hasName(resource) || resources[i].id == resource) && 
            (!organ || (organ && resources[i].organ == organ))) {
            return resources[i].value;
        }
    }
    return -1;
}

/**
 * Sets the value of the Resource matching the given resource name, id, and/or organ.
 * 
 * @param {string|number} resource Any name of the Resource whose value is to be set or the Resource's ID.
 * @param {string|null} organ The organ in which the modified Resource must be located. or null to allow any organ.
 * @param {number} value The new value for the matched resource.
 * @return {number} The new value of the matched resource, -1 if no Resource can be found, or -2 if the value is
 *                  invalid.
 */
function setResourceValue(resource, organ, value)
{
    return changeResourceValue(resource, organ, value - getResourceValue(name, organ));
}

/**
 * Modifies the value of the Resource matching the given resource name, id, and/or organ.
 * 
 * @param {string|number} resource Any name of the Resource whose value is to be set or the Resource's ID.
 * @param {string|null} organ The organ in which the modified Resource must be located. or null to allow any organ.
 * @param {number} change The amount by which to change the value.
 * @return {number} The new value of the modified Resource, -1 if no Resource can be found, or -2 if the new value
 *                  would be invalid.
 */
function changeResourceValue(resource, organ, change)
{
    for (var i = 0; i < resources.length; i++) {
        if ((resources[i].hasName(resource) || resources[i].id == resource) && 
            (!organ || (organ && resources[i].organ == organ))) {
            if (resources[i].value + change >= 0) {
                resources[i].value += change;
                return resources[i].value;
            } else {
                return -2;
            }
        }
    }
    return -1;
}

/**
 * Find the Resource matching the given resource name, id and/or organ.
 * 
 * @param {string|number} resource Any name or ID of the organ to be found.
 * @param {string|null} organ The organ in which the matched Resource must be located, or null for any organ.
 * @return {resource} The Resource matching the given name, ID and optionally organ, or null if no such Resource is
 *                    found.
 */
function getResource(resource, organ)
{
    for (var i = 0; i < resources.length; i++) {
        if ((resources[i].hasName(resource) || resources[i].id == resource) && 
            (!organ || (organ && resources[i].organ == organ))) {
            return resources[i];
        }
    }
    return null;
}

/**
 * Populates the Resource pane with all the resources.
 * Each Resource is depicted as a horizontal progress bar that measures its value.
 * Note that this function should typically only be invoked once, at initialization, but can in theory be called many
 *     times.
 */
function populateResources() {
    $('.resource-holder').empty();
    for (var i = 0; i < resources.length; i++) {
        $('.resource-holder[value="' + resources[i].organ + '"]').append(resources[i].toHTML());
    }
}

/**
 * This function should be invoked whenever a Resource's value is modified in order to reflect that change in the UI.
 * 
 * @param {resource} resource The Resource which has been modified.
 * @param {number} change The amount by which the Resource was changed.
 */
function onResourceChange(resource, change) {
    if (change == 0) {
        return;
    }
    var color = change > 0 ? COLOR_INCREASE : COLOR_DECREASE;
    var elem = $('.resource-data').filter(function() {
        return resource.hasName($(this).find('.resource-name').html()) && 
            resource.organ == $(this).parents('.resource-holder').attr('value');
    });
    elem.animate({ boxShadow : "0 0 5px 5px rgb("+color+")" }, function() {
        elem.animate({ boxShadow : "0 0 5px 5px rgba("+color+", 0)" });
    });

    elem.find('.resource-value').html(resource.value);
    elem.find('.bar').css('width', Math.min(100, 100*(resource.value/resource.max_value)) + '%')
}
