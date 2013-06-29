/**
 * Creates a new Pathway object with the given parameters.
 * Each Pathway represents a unique cellular process that can be carried out in one or more organs
 *  and has reactants and products that affect the resource levels of its organ.
 * Additonally, some Pathways earn points for the player upon their completion and some Pathways have
 *  a limit on the number of times that they are able to be run in a single turn.
 *
 * @param {Number}  id        a unique number used to identify this Pathway
 * @param {String}  name      the full name of the Pathway, as shown to the user (cannot be empty)
 * @param {Number}  points    the number of points earned by completing this Pathway
 * @param {Boolean} limit     true if this Pathway is limited to being run once per turn, false otherwise
 * @param {String}  color     the color associated with this Pathway
 * @param {Boolean} catabolic whether this Pathway is catabolic (as opposed to anabolic)
 * @param {Array}   organs    the organ(s) in which this Pathway can take place
 * @param {Array}   resources a list of resource costs (objects with the fields 'res' and 'val')
 */
function Pathway(id, name, points, limit, color, catabolic, organs, resources)
{
    if (!name) {
        throw "attempted to create a pathway without a name";
    }

    this.id = id;
    this.name = name;
    this.points = points;
    this.limit = limit;
    this.color = color;
    this.catabolic = catabolic;
    this.organs = organs;
    this.resources = resources;

    /**
     * Determines whether this Pathway can be run in the given organ.
     * 
     * @param  {String}  organ the organ for which to determine the operability of this Pathway
     * @return {Boolean}       true if this Pathway can be run in the given organ, false otherwise
     */
    this.hasOrgan = function(organ) {
        for (var i = 0; i < organs.length; i++) {
            if (organs[i] == organ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Runs this Pathway in the given organ, modifying the resources and returning the new levels.
     * 
     * @param  {String} organ     the organ in which to run this Pathway
     * @return {Array}            if the reaction was successful, returns the new resource levels; otherwise returns the Resource that was not sufficient
     */
    this.run = function(organ) {
        if (!this.hasOrgan(organ)) {
            throw "invalid organ " + organ + " for pathway id " + this.id;
        }

        for (var i = 0; i < this.resources.length; i++) {
            var res = this.resources[i].res;
            var val = this.resources[i].val;
            var actualOrgan = isResourceGlobal(res) ? GLOBAL : organ;
            if (isResourceLevelValid(res, changeResourceValue(res, actualOrgan, val))) {
                onResourceChange(getResourceByName(res), val);
            }
        }

        refreshPathways();

        nextTurn();
        setPoints(points + this.points);
    }

    /**
     * Gets a list of all the reactants of this Pathway; that is, all resources that are decreased when the Pathway is run.
     * 
     * @return {Array} the reactants associated with this Pathway
     */
    this.getReactants = function() {
        var reactants = new Array();
        for (var i = 0; i < resources.length; i++) {
            if (resources[i].val < 0) {
                reactants.push(resources[i]);
            }
        }
        return reactants;
    }

    /**
     * Gets a list of all the products of this Pathway; that is, all resource that are increased when the Pathway is run.
     * 
     * @return {Array} the products associated with this Pathway
     */
    this.getProducts = function() {
        var products = new Array();
        for (var i = 0; i < resources.length; i++) {
            if (resources[i].val > 0) {
                products.push(resources[i]);
            }
        }
        return products;
    }

    /**
     * Gets the maximum number of times that this Pathway can be run based on the given values.
     * 
     * @param  {Resource} resource
     * @param  {[type]} value
     * @param  {[type]} organ
     * @return {[type]}
     */
    this.getMaxRuns = function(resource, value, organ) {
        return Math.floor(getResourceValue(resource, (isResourceGlobal(resource) ? GLOBAL : organ), resources)/value);
    }

    /**
     * Renders this Pathway as an HTML element and returns a String to be inserted into an HTML page.
     * 
     * @return {String} an HTML version of this Pathway
     */
    this.toHTML = function(resources, organ) {
        var s = '';
        s += '<div class="pathway" value="' + this.id + '">';

        s += '<p class="title">' + this.name + '</p>'
        s += '<p class="catabolic">(' + (this.catabolic ? 'Catabolic' : 'Anabolic') + ')</p>';
        s += '<p class="points">' + this.points + ' points</p>';

        s += '<table class="reaction">';
        s += '<tr><td class="reactant header">Reactants</td><td class="product header">Products</td></tr>';

        var reactants = this.getReactants();
        var products = this.getProducts();

        for (var i = 0; i < Math.max(reactants.length, products.length); i++) {
            s += '<tr>';

            s += '<td class="reactant"';

            if (i < reactants.length) {
                s += ' value="' + reactants[i].res + '"';
            }

            s += '>';

            if (i < reactants.length) {
                s += reactants[i].res + '\t' + reactants[i].val;
            }
            s += '</td>';

            s += '<td class="product"';

            s += '>';
            if (i < products.length) {
                s += products[i].val + '\t' + products[i].res;
            }
            s += '</td>';

            s += '</tr>';
        }

        s += '</table>';

        var actual_limit = this.limit;
        var lacking = null;
        for (var i = 0; i < reactants.length; i++) {
            var max_runs = this.getMaxRuns(reactants[i].res, Math.abs(reactants[i].val), resources, organ)

            if (max_runs <= 0) {
                lacking = reactants[i].res;
                break;
            }

            if (actual_limit == -1) {
                actual_limit = max_runs;
            } else {
                actual_limit = Math.min(actual_limit, max_runs);
            }
        }

        s += '<p class="lacking">Not enough ' + lacking + '</p>';
        s += '<button class="run-pathway btn btn-small btn-inverse">Run</button>';

        s += '</div>';
        return s;
    }
}

function refreshPathways() {
    for (var i = 0; i < pathways.length; i++) {
        for (var j = 0; j < pathways[i].organs.length; j++) {
            checkForLacking(pathways[i], pathways[i].organs[j]);
        }
    }
}

function checkForLacking(pathway, organ) {
    $('.pathway').filter(function() { return $(this).attr('value') == pathway.id; }).each(function() {
        var lackingReactants = new Array();
        var reactants = pathway.getReactants();
        for (var i = 0; i < reactants.length; i++) {
            var isLacking = pathway.getMaxRuns(reactants[i].res, Math.abs(reactants[i].val), organ) <= 0;
            if (isLacking) {
                $(this).find('.reactant').filter(function() { return $(this).attr('value') == reactants[i].res; }).addClass('lacking');
                lackingReactants.push(getCommonName(reactants[i].res))
            } else {
                $(this).find('.reactant').filter(function() { return $(this).attr('value') == reactants[i].res; }).removeClass('lacking');
            }
        }

        if (lackingReactants.length > 0) {
            $(this).find('.run-pathway').hide();
            $(this).find('.lacking').show();

            var lackingList = 'Not enough ';
            for (var i = 0; i < lackingReactants.length; i++) {
                lackingList += lackingReactants[i];
                if (i != lackingReactants.length-1) {
                    lackingList += ', ';
                }
            }
            lackingList += '.';
            $(this).find('p.lacking').html(lackingList);
        } else {
            $(this).find('.run-pathway').show();
            $(this).find('.lacking').hide();
        }
    });
}

/**
 * Returns an array of the Pathways that can be run in the given organ.
 * 
 * @param  {String} organ the organ for which to check for compatible Pathways
 * @return {Array}        a list of all default Pathways which are able to be run in the given organ
 */
function getPathways(organ)
{
    var organPathways = new Array();
    for (var i = 0; i < pathways.length; i++) {
        var pathway = pathways[i];
        if (pathway.hasOrgan(organ)) {
            organPathways.push(pathway);
        }
    }
    return organPathways;
}

function getPathwayById(id) {
    for (var i = 0; i < pathways.length; i++) {
        if (pathways[i].id == id) {
             return pathways[i];
        }
    }
    return null;
}

function getPathwayByName(name) {
    for (var i = 0; i < pathways.length; i++) {
        if (pathways[i].name == name) {
             return pathways[i];
        }
    }
    return null;
}
