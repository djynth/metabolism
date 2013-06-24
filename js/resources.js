/**
 * Defines the number of unique Resources that are created by default.
 * Note that Resource ID's are indexed from 0; that is, Resource ID's range from 0 to NUM_RESOURCES-1.
 * 
 * @type {Number}
 */
var NUM_RESOURCES = 23;

/**
 * Creates a new Resource with the given Parameters.
 * A Resource represents the level of a certain molecule or chemical in a particular organ and can be changed by running certain reactions, or Actions.
 *
 * @param {String} abbr      an abbreviated name for this resource, typically between 3 and 6 characters in length
 * @param {String} name      the common name for this resource that will typically be presented to the user
 * @param {String} full_name the full or scientific name for this resource, only shown to the user in rare cases
 * @param {Number} value     the amount of this resource that is to be contained in the given organ
 * @param {String} organ     the name of the organ holding this resource, i.e. BODY, MUSCLE, LIVER, BRAIN
 */
function Resource(abbr, name, full_name, value, max_value, organ)
{
    if (!name) {
        throw "no name given to the resource";
    }

    this.abbr = abbr;
    this.name = name;
    this.full_name = full_name;
    this.value = value;
    this.max_value = max_value;
    this.organ = organ;

    /**
     * Determines whether this Resource is in the Brain organ.
     *
     * @return {Boolean} true if this Resource is in the Brain, false otherwise
     */
    this.inBrain = function() {
        return this.organ == BRAIN;
    }

    /**
     * Determines whether this Resource is in the Muscle organ.
     *
     * @return {Boolean} true if this Resource is in the Muscle, false otherwise
     */
    this.inMuscle = function() {
        return this.organ == MUSCLE;
    }

    /**
     * Determines whether this Resource is in the Liver organ.
     *
     * @return {Boolean} true if this Resource is in the Liver, false otherwise
     */
    this.inLiver = function() {
        return this.organ == LIVER;
    }

    /**
     * Determines whether this Resource is in the Body (that is, whether it is global).
     *
     * @return {Boolean} true if this Resource is in the Body, false otherwise
     */
    this.inBody = function() {
        return this.organ == BODY;
    }

    /**
     * Determines whether this Resource is globally available.
     * This is equivalent to calling {@code inBody()}.
     *
     * @return {Boolean} true if this Resource is in the Body, false otherwise
     */
    this.isGlobal = function() {
        return this.inBody();
    }

    /**
     * Determines whether the given level is valid for this Resource.
     * This is equivalent to calling {@code isResourceLevelValid(level)}.
     *
     * @param  {Number} level the level to check for validity
     *
     * @return {Boolean}      true if the given level is valid for this Resource, false otherwise
     */
    this.isLevelValid = function(level) {
        return isResourceLevelValid(this, level);
    }

    /**
     * Determines whether the given name matches one of this Resource's names.
     *
     * @param  {String} name the name to check
     *
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
        return resource.isGlobal();
    }
    else if (typeof resource == "number") {
        try {
            getResourceById(resource, -1, BODY);    // if this succeeds, the resource must be global
            return true;
        } catch(err) {
            return false;
        }
    }

    for (var i = 0; i < NUM_RESOURCES; i++) {
        try {
            var res = getResourceById(i, -1, BODY);
            if (res.hasName(resource)) {
                return res.isGlobal();
            }
        } catch(err) {
            var res = getResourceById(i, -1, BRAIN);
            if (res.hasName(resource)) {
                return res.isGlobal();
            }
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

/**
 * Gets the value, or level, of the resource with the given name in the given list of resources.
 *
 * @param  {String} name      the name of the resource for whose value to check (can match any of the resource's names, i.e. abbreviation, name, or full name)
 * @param  {String} organ     the name of the organ containing the resource to check
 * @param  {Array}  resources a list of the current resources, as Resource objects
 *
 * @return {Number}           the level of the resource in the organ for the given resource levels, or -1 if it could not be found
 */
function getResourceValue(name, organ, resources)
{
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].hasName(name) && resources[i].organ == organ) {
            return resources[i].value;
        }
    }
    return -1;
}

/**
 * Sets the value for the resource level in the given list of resources.
 *
 * @param  {String} name      the name of the resource to set (can match any of the resource's names, i.e. abbreviation, name, or full name)
 * @param  {String} organ     the name of the organ containing the resource to set
 * @param  {Array}  resources a list of the current resources, as Resource objects
 * @param  {Number} value     the new value for the given resource
 *
 * @return {Boolean}          true if the resource was set, false if it was either not found or could not be set to the given level
 */
function setResourceValue(name, organ, resources, value)
{
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

/**
 * Modifies the value for the resource level in the given list of resources.
 *
 * @param  {String} name      the name of the resource to modify (can match any of the resource's names, i.e. abbreviation, name, or full name)
 * @param  {String} organ     the name of the organ containing the resource to change
 * @param  {Array}  resources a list of the current resources, as Resource objects
 * @param  {Number} change    the amount by which to modify the given resource (positive to increase it, negative to decrease)
 *
 * @return {Number}           returns the new value of the resource if it was changed, or -1 if it was not found or -2 if the resource level was invalid after the change
 */
function changeResourceValue(name, organ, resources, change)
{
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

function getAbbreviation(resource) {
    return getResourceByName(resource).abbr;
}

function getCommonName(resource) {
    return getResourceByName(resource).name;
}

function getFullName(resource) {
    return getResourceByName(resource).full_name;
}

function getResourceByName(name)
{
    for (var i = 0; i < NUM_RESOURCES; i++) {
        var res = getResourceById(i, -1, (isResourceGlobal(i) ? BODY : BRAIN));
        if (res.hasName(name)) {
            return res;
        }
    }
    return null;
}

/**
 * Returns the Resource assigned to the given ID, in the given organ, and with the given value.
 * If the given value is negative, the returned Resource is assigned its starting value (the value that the Resource is given when the game begins).
 *
 * @param  {Number} id    the ID used to identify the resource, in the range 0 to NUM_RESOURCES-1
 * @param  {Number} value the value to be given to the returned Resource, or a negative value to use the starting value
 * @param  {String} organ the name of the organ that the returned resource should be in
 *
 * @return {Object}       a Resource with the name and other data matching the given ID
 */
function getResourceById(id, value, organ)
{
    if ((id < 7 && organ != BODY) || (id > 6 && organ == BODY)) {
        throw "invalid organ " + organ + " for resource id " + id;
    }

    switch(id)
    {
    // Global Resources       Abbreviation     Common Name               Full (Scientific) Name                                           Starting Value  Max Value  Organ
    case 0:  return new Resource("O2",         "Oxygen",                 "Oxygen",                                                value >= 0 ? value : 0,   100, organ);
    case 1:  return new Resource("CO2",        "Carbon Dioxide",         "Carbon Dioxide",                                        value >= 0 ? value : 0,   100, organ);
    case 2:  return new Resource("NH3",        "Ammonia",                "Ammonia",                                               value >= 0 ? value : 0,   50,  organ);
    case 3:  return new Resource("Glc",        "Glucose",                "Glucose",                                               value >= 0 ? value : 0,   50,  organ);
    case 4:  return new Resource("Ala",        "Alanine",                "Alanine",                                               value >= 0 ? value : 0,   50,  organ);
    case 5:  return new Resource("FA",         "Palmitate (Fatty Acid)", "Palmitate (Fatty Acid)",                                value >= 0 ? value : 0,   50,  organ);
    case 6:  return new Resource("Lact",       "Lactate",                "Lactate",                                               value >= 0 ? value : 0,   50,  organ);
    // Local Resources        Abbreviation     Common Name               Full (Scientific) Name                                           Starting Value  Max Value  Organ
    case 7:  return new Resource("ADP",        "ADP",                    "Adenosine Diphosphate",                                 value >= 0 ? value : 200, 200, organ);
    case 8:  return new Resource("ATP",        "ATP",                    "Adenosine Triphosphate",                                value >= 0 ? value : 0,   200, organ);
    case 9:  return new Resource("Pi",         "Pi",                     "Phosphate Group",                                       value >= 0 ? value : 200, 200, organ);
    case 10: return new Resource("NAD+",       "NAD+",                   "Nicotinamide Adenine Dinucleotide",                     value >= 0 ? value : 200, 200, organ);
    case 11: return new Resource("NADH",       "NADH",                   "[Reduced] Nicotinamide Adenine Dinucleotide",           value >= 0 ? value : 0,   200, organ);
    case 12: return new Resource("FAD",        "FAD",                    "Flavin Adenine Dinucleotide",                           value >= 0 ? value : 100, 100, organ);
    case 13: return new Resource("FADH2",      "FADH2",                  "[Reduced] Flavin Adenine Dinucleotide",                 value >= 0 ? value : 0,   100, organ);
    case 14: return new Resource("NADP+",      "NADP+",                  "Nicotinamide Adenine Dinucleotide Phosphate",           value >= 0 ? value : 100, 100, organ);
    case 15: return new Resource("NADPH",      "NADPH",                  "[Reduced] Nicotinamide Adenine Dinucleotide Phosphate", value >= 0 ? value : 0,   100, organ);
    case 16: return new Resource("HSCoA",      "Coenzyme A",             "Coenzyme A",                                            value >= 0 ? value : 100, 100, organ);
    case 17: return new Resource("Protein",    "Protein",                "Protein",                                               value >= 0 ? value : 0,   50,  organ);
    case 18: return new Resource("RNA",        "RNA",                    "Ribonucleic Acid",                                      value >= 0 ? value : 0,   50,  organ);
    case 19: return new Resource("Gly",        "Glycogen",               "Glycogen",                                              value >= 0 ? value : 0,   50,  organ);
    case 20: return new Resource("Acetyl-CoA", "Acetyl-S-CoA",           "Acetyl Coenzyme A",                                     value >= 0 ? value : 0,   50,  organ);
    case 21: return new Resource("Pyr",        "Pyruvate",               "Pyruvate",                                              value >= 0 ? value : 0,   50,  organ);
    case 22: return new Resource("Rib",        "Ribose",                 "Ribose",                                                value >= 0 ? value : 0,   50,  organ);
    }
    throw "unknown resource id: " + id;
}

/**
 * Gets an Array of Resources initialized to their starting values.
 *
 * @return {Array} the resources that should be used to begin the game
 */
function getStartingResources()
{
    var organs = [BODY, BRAIN, MUSCLE, LIVER];
    var res = new Array();
    for (var i = 0; i < NUM_RESOURCES; i++) {
        for (var j = 0; j < organs.length; j++) {
            try {
                res.push(getResourceById(i, -1, organs[j]));
            } catch(err) { }
        }
    }
    return res;
}