function Resource(id, abbr, name, full_name, value, max_value, organ, color)
{
    if (!name) {
        throw "no name given to the resource";
    }

    this.id = id;
    this.abbr = abbr;
    this.name = name;
    this.full_name = full_name;
    this.value = value;
    this.max_value = max_value;
    this.organ = organ;
    this.color = color;

    /**
     * Determines whether the given name matches one of this Resource's names.
     *
     * @param  {String} name the name to check
     * @return {Boolean}     true if the given name is one of the names applied to this Resource, false otherwise
     */
    this.hasName = function(name) {
        return this.name == name || this.abbr == name || this.full_name == name;
    }
}

/**
 * Determines whether the given resource is globally available.
 *
 * @param  {Object,Number,String} resource the resource to be checked for global availability
 *
 * @return {Boolean}                       true if the given resource has the same level across all organs, false otherwise
 */
function isResourceGlobal(resource)
{
    if (typeof resource == "object") {
        return resource.organ == GLOBAL;
    }
    else if (typeof resource == "number") {
        try {
            return resources[resource].organ == GLOBAL;
        } catch(err) {
            return false;
        }
    }

    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(resource)) {
            return resources[i].organ == GLOBAL;
        }
    }

    return false;
}

/**
 * Determines whether the given resource amount is valid for the given resource.
 *
 * @param  {Object}  resource the resource for which to check the given level
 * @param  {Number}  level    the amount of the given resource to check
 *
 * @return {Boolean}          true if the given level is valid for the given resource, false otherwise
 */
function isResourceLevelValid(resource, level)
{
    return level > 0;
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
    if (typeof name != 'string') {
        name = name.name;
    }

    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(name) && resources[i].organ == organ) {
            if (isResourceLevelValid(resources[i], value)) {
                resources[i].value = value;
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}

function changeResourceValue(name, organ, change)
{
    if (typeof name != 'string') {
        name = name.name;
    }

    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(name) && resources[i].organ == organ) {
            if (isResourceLevelValid(resources[i], resources[i].value + change)) {
                resources[i].value += change;
                return resources[i].value;
            } else {
                return -2;
            }
        }
    }
    return -1;
}

function getAbbreviation(resource)
{
    if (typeof resource == 'string') {
        return getResourceByName(resource).abbr;
    }
    return resource.abbr;
}

function getCommonName(resource)
{
    if (typeof resource == 'string') {
        return getResourceByName(resource).name;
    }
    return resource.name;
}

function getFullName(resource)
{
    if (typeof resource == 'string') {
        return getResourceByName(resource).full_name;
    }
    return resource.full_name;
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
