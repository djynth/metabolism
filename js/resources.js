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

    this.hasName = function(name) {
        return this.name == name || this.abbr == name || this.full_name == name;
    }
}

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

function getResourceValue(name, organ)
{
    if (typeof name != 'string') {
        name = name.name;
    }

    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(name) && resources[i].organ == organ) {
            return resources[i].value;
        }
    }
    return -1;
}

function setResourceValue(name, organ, value)
{
    return changeResourceValue(name, organ, value - getResourceValue(name, organ));
}

function changeResourceValue(name, organ, change)
{
    if (typeof name != 'string') {
        name = name.name;
    }

    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(name) && resources[i].organ == organ) {
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

function getResourceByName(name, organ)
{
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(name)) {
            if (!organ || (organ && resources[i].organ == organ)) {
                return resources[i];
            }
        }
    }
    return null;
}

function getResourceById(id, organ)
{
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].id == id) {
            if (!organ || (organ && resources[i].organ == organ)) {
                return resources[i];
            }
        }
    }
    return null;
}

function populateResources() {
    for (var i = 0; i < resources.length; i++) {
        var res = resources[i];

        $('.resource-holder[value="' + res.organ + '"]').append('<div class="resource-data">' + 
            '<div class="progress">' +
            '<span class="resource-name">' + res.name + '</span>' +
            '<span class="resource-value">' + res.value + '</span>' + 
            '<div class="bar" style="width: ' + Math.min(100, 100*(res.value/res.max_value)) + '%;"></div>' + 
            '</div></div>');
    }
}
