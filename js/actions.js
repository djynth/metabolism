/**
 * Defines the number of unique Actions that are created by default.
 * Note that Actions ID's are indexed from 0; that is, Action ID's range from 0 to NUM_ACTIONS-1.
 * 
 * @type {Number}
 */
var NUM_ACTIONS = 24;

/**
 * Creates a new Action object with the given parameters.
 * Each Action represents a unique cellular process that can be carried out in one or more organs
 *  and has reactants and products that affect the resource levels of its organ.
 * Additonally, some Actions earn points for the player upon their completion and some Actions have
 *  a limit on the number of times that they are able to be run in a single turn.
 * 
 * @param {String}  name      the full name of the Action, as shown to the user (cannot be empty)
 * @param {Number}  points    the number of points earned by completing this Action
 * @param {Number}  limit     the maximum number of times that this Action can be run in a single turn (-1 for unlimited times)
 * @param {Array}   organs    the organ(s) in which this action can take place
 * @param {Array}   resources a list of resource costs (objects with the fields 'res' and 'val')
 * @param {Boolean} catabolic whether this Action is catabolic (as opposed to anabolic)
 */
function Action(name, id, points, limit, organs, resources, catabolic)
{
    if (!name) {
        throw "attempted to create an action without a name";
    }

    this.name = name;
    this.id = id;
    this.points = points;
    this.limit = limit;
    this.organs = organs;
    this.resources = resources;
    this.catabolic = catabolic;
    this.anabolic = !catabolic;

    /**
     * Determines whether this Action can be run in the given organ.
     * 
     * @param  {String}  organ the organ for which to determine the operability of this Action
     * @return {Boolean}       true if this Action can be run in the given organ, false otherwise
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
     * Runs this Action in the given organ, modifying the given resources and returning the new levels.
     * 
     * @param  {String} organ     the organ in which to run this Action
     * @param  {Array}  resources the resources on which to base the results of this Action
     * @return {Array}            if the reaction was successful, returns the new resource levels; otherwise returns the abbreviated name of the resource that was not sufficient
     */
    this.run = function(organ, resources) {
        if (!this.hasOrgan(organ)) {
            throw "invalid organ " + organ + " for action id " + this.id;
        }

        for (var i = 0; i < this.resources.length; i++) {
            var res = this.resources[i].res;
            var val = this.resources[i].val;
            if (!isResourceLevelValid(res, changeResourceValue(res, isResourceGlobal(res) ? BODY : organ, resources, val))) {
                return res;
            }
        }

        return resources;
    }

    this.getReactants = function() {
        var reactants = new Array();
        for (var i = 0; i < resources.length; i++) {
            if (resources[i].val < 0) {
                reactants.push(resources[i]);
            }
        }
        return reactants;
    }

    this.getProducts = function() {
        var products = new Array();
        for (var i = 0; i < resources.length; i++) {
            if (resources[i].val > 0) {
                products.push(resources[i]);
            }
        }
        return products;
    }

    this.getMaxRuns = function(resource, value, resources, organ) {
        return Math.floor(getResourceValue(resource, (isResourceGlobal(resource) ? BODY : organ), resources)/value);
    }

    /**
     * Renders this Action as an HTML element and returns a String to be inserted into an HTML page.
     * 
     * @return {String} an HTML version of this Action
     */
    this.toHTML = function(resources, organ) {
        var s = '';
        s += '<div class="action" value="' + this.id + '">';

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
                s += ' title="' + getCommonName(reactants[i].res) + '"';
            }

            s += '>';

            if (i < reactants.length) {
                s += reactants[i].res + '\t' + reactants[i].val;
            }
            s += '</td>';

            s += '<td class="product"';

            if (i < products.length) {
                s += ' title="' + getCommonName(products[i].res) + '"';
            }

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
        s += '<button class="run_action">Run</button>';

        s += '</div>';
        return s;
    }
}

function refreshActions(resources) {
    for (var i = 0; i < NUM_ACTIONS; i++) {
        var action = getAction(i);
        for (var j = 0; j < action.organs.length; j++) {
            checkForLacking(action, action.organs[j], resources);
        }
    }
}

function checkForLacking(action, organ, resources) {
    $('div.action_holder#' + organ + ' div.action').filter(function() { return $(this).attr('value') == action.id; }).each(function() {
        var lackingReactants = new Array();
        var reactants = action.getReactants();
        for (var i = 0; i < reactants.length; i++) {
            var isLacking = action.getMaxRuns(reactants[i].res, Math.abs(reactants[i].val), resources, organ) <= 0;
            if (isLacking) {
                $(this).find('td.reactant').filter(function() { return $(this).attr('value') == reactants[i].res; }).addClass('lacking');
                lackingReactants.push(getCommonName(reactants[i].res))
            } else {
                $(this).find('td.reactant').filter(function() { return $(this).attr('value') == reactants[i].res; }).removeClass('lacking');
            }
        }

        if (lackingReactants.length > 0) {
            $(this).find('button.run_action').hide();
            $(this).find('p.lacking').show();

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
            $(this).find('button.run_action').show();
            $(this).find('p.lacking').hide();
        }
    });
}

/**
 * Returns an array of the Actions that can be run in the given organ.
 * 
 * @param  {String} organ the organ for which to check for compatible Actions
 * @return {Array}        a list of all default Actions which are able to be run in the given organ
 */
function getActions(organ)
{
    var actions = new Array();
    for (var i = 0; i < NUM_ACTIONS; i++) {
        var action = getAction(i);
        if (action.hasOrgan(organ)) {
            actions.push(action);
        }
    }
    return actions;
}

/**
 * Returns the Action corresponding to the given ID.
 * Valid ID's are in the range 0 to NUM_ACTIONS-1, and this function will attempt to parse Strings.
 * TODO update res names
 * 
 * @param  {Number,String} id the ID of the Action to return
 * @return {Action}        the Action matching the given ID
 */
function getAction(id)
{
    if (typeof id == "string") {
        id = parseInt(id);
    }

    switch(id)
    {   
    //                         Action name                               ID Points Limit Organ(s)             Resource Level Changes                                                                                                                                                                                                                                                 Is Catabolic
    case 0:  return new Action("Breath In",                               id, 0,   1, [BODY],                 [{res: 'O2',    val:  50}],                                                                                                                                                                                                                                                 true);
    case 1:  return new Action("Breath Out",                              id, 0,   1, [BODY],                 [{res: 'CO2',   val: -50}],                                                                                                                                                                                                                                                 true);
    case 2:  return new Action("Eat",                                     id, 0,   1, [BODY],                 [{res: 'Glc',   val:  20}, {res: 'Ala',   val:  10}, {res: 'FA',    val:  20}],                                                                                                                                                                                             true);
    case 3:  return new Action("Pump Na+ and K+ ions",                    id, 50, -1, [BRAIN],                [{res: 'ADP',   val:  50}, {res: 'ATP',   val: -50}, {res: 'Pi',    val:  50}],                                                                                                                                                                                             false);
    case 4:  return new Action("Pyruvate to Lactate",                     id, 0,  -1, [MUSCLE],               [{res: 'NAD+',  val:  1},  {res: 'NADH',  val: -1},  {res: 'Pyr',   val: -1}, {res: 'Lact',       val:  1}],                                                                                                                                                                true);
    case 5:  return new Action("Pyruvate to Alanine",                     id, 0,  -1, [MUSCLE],               [{res: 'NAD+',  val:  1},  {res: 'NADH',  val: -1},  {res: 'NH3',   val: -1}, {res: 'Ala',        val:  1},  {res: 'Pyr',     val: -1}],                                                                                                                                    true);
    case 6:  return new Action("Muscle Contraction",                      id, 50, -1, [MUSCLE],               [{res: 'ADP',   val:  50}, {res: 'ATP',   val: -50}, {res: 'Pi',    val:  50}],                                                                                                                                                                                             false);
    case 7:  return new Action("Urea Cycle",                              id, 4,  -1, [LIVER],                [{res: 'ADP',   val:  4},  {res: 'ATP',   val: -4},  {res: 'Pi',    val:  4}, {res: 'CO2',        val: -1},  {res: 'NH3',     val: -2}],                                                                                                                                    true);
    case 8:  return new Action("Fatty Acid Synthesis",                    id, 7,  -1, [LIVER],                [{res: 'ADP',   val:  7},  {res: 'ATP',   val: -7},  {res: 'Pi',    val:  7}, {res: 'NADP+',      val:  14}, {res: 'NADPH',   val: -14}, {res: 'HSCoA', val:  7}, {res: 'Acetyl-CoA', val: -8}],                                                                            false);
    case 9:  return new Action("Lactate to Pyruvate",                     id, 0,  -1, [LIVER],                [{res: 'NAD+',  val: -1},  {res: 'NADH',  val:  1},  {res: 'Pyr',   val:  1}, {res: 'Lact',       val: -1}],                                                                                                                                                                false);
    case 10: return new Action("Alanine to Pyruvate",                     id, 0,  -1, [LIVER],                [{res: 'NAD+',  val: -1},  {res: 'NADH',  val:  1},  {res: 'NH3',   val:  1}, {res: 'Ala',        val: -1},  {res: 'Pyr',     val: 1}],                                                                                                                                     false);
    case 11: return new Action("Gluconeogenesis",                         id, 6,  -1, [LIVER],                [{res: 'ADP',   val:  6},  {res: 'ATP',   val: -6},  {res: 'Pi',    val:  6}, {res: 'NAD+',       val:  2},  {res: 'NADH',    val: -2},  {res: 'Glc',   val:  1}, {res: 'Pyr',        val: -2}],                                                                            false);
    case 12: return new Action("Fatty Acid Degradation",                  id, 0,  -1, [LIVER, MUSCLE],        [{res: 'NAD+',  val: -7},  {res: 'NADH',  val:  7},  {res: 'FAD',   val: -7}, {res: 'FADH2',      val:  7},  {res: 'HSCoA',   val: -8},  {res: 'FA',    val: -1}, {res: 'Acetyl-CoA', val: 8}],                                                                             true);
    case 13: return new Action("Glycogen Degradation to Release Glucose", id, 0,  -1, [LIVER, MUSCLE],        [{res: 'Pi',    val: -1},  {res: 'Glc',   val:  1},  {res: 'Gly',   val: -1}],                                                                                                                                                                                              true);
    case 14: return new Action("Glycogen Synthesis",                      id, 2,  -1, [LIVER, MUSCLE],        [{res: 'ADP',   val:  2},  {res: 'ATP',   val: -2},  {res: 'Pi',    val:  2}, {res: 'Glc',        val: -1},  {res: 'Gly',     val: 1}],                                                                                                                                     false);
    case 15: return new Action("Glycolysis",                              id, 0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -2},  {res: 'ATP',   val:  2},  {res: 'Pi',    val: -2}, {res: 'NAD+',       val: -2},  {res: 'NADH',    val: 2},   {res: 'Glc',   val: -1}, {res: 'Pyr',        val: 2}],                                                                             true);
    case 16: return new Action("Pyruvate Dehydrogenase",                  id, 0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'NAD+',  val: -1},  {res: 'NADH',  val:  1},  {res: 'HSCoA', val: -1}, {res: 'Acetyl-CoA', val:  1},  {res: 'Pyr',     val: -1}],                                                                                                                                    true);
    case 17: return new Action("PPP (oxid)",                              id, 0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'NADP+', val: -2},  {res: 'NADPH', val:  2},  {res: 'CO2',   val:  1}, {res: 'Glc',        val: -1},  {res: 'Rib',     val: 1}],                                                                                                                                     true);
    case 18: return new Action("PPP (non-oxid) Reversible",               id, 0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'Glc',   val:  5},  {res: 'Rib',   val: -6}],                                                                                                                                                                                                                        true);
    case 19: return new Action("Kreb's Cycle",                            id, 0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -1},  {res: 'ATP',   val:  1},  {res: 'Pi',    val: -1}, {res: 'NAD+',       val: -3},  {res: 'NADH',    val: 3},   {res: 'FAD',   val: -1}, {res: 'FADH2',      val: 1}, {res: 'HSCoA', val: 1}, {res: 'CO2', val: 2}, {res: 'Acetyl-CoA', val: -1}], true);
    case 20: return new Action("Oxidative Phosphorylation FADH2",         id, 0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -3},  {res: 'ATP',   val:  3},  {res: 'Pi',    val: -3}, {res: 'FAD',        val:  2},  {res: 'FADH2',   val: -2},  {res: 'O2',    val: -1}],                                                                                                          true);
    case 21: return new Action("Oxidative Phosphorylation NADH",          id, 0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -5},  {res: 'ATP',   val:  5},  {res: 'Pi',    val: -5}, {res: 'NAD+',       val:  2},  {res: 'NADH',    val: -2},  {res: 'O2',    val: -1}],                                                                                                          true);
    case 22: return new Action("RNA Synthesis",                           id, 2,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val:  2},  {res: 'ATP',   val: -2},  {res: 'Pi',    val:  2}, {res: 'Rib',        val: -1},  {res: 'RNA',     val: 1}],                                                                                                                                     false);
    case 23: return new Action("Protein Synthesis",                       id, 4,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val:  4},  {res: 'ATP',   val: -4},  {res: 'Pi',    val:  4}, {res: 'Ala',        val: -1},  {res: 'Protein', val: 1}],                                                                                                                                     false);
    }
    throw "unknown action id: " + id;
}
