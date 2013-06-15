/**
 * Defines the number of unique Actions that are created by default.
 * Note that Actions ID's are indexed from 0; that is, Action ID's range from 0 to NUM_ACTIONS-1.
 * 
 * @type {Number}
 */
const var NUM_ACTIONS = 24;

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
function Action(name, points, limit, organs, resources, catabolic)
{
    if (!name) {
        throw "attempted to create an action without a name";
    }

    this.name = name;
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

    /**
     * Renders this Action as an HTML element and returns a String to be inserted into an HTML page.
     * 
     * @return {String} an HTML version of this Action
     */
    this.toHTML = function() {
        var s = '';
        s += '<div class="action_content" value="' + this.id + '">';

        s += '<p class="action_title">' + this.name + '</p>'
        s += '<p class="action_info">Points: ' + this.points + '</p>';
        s += '<p class="action_info">' + (this.catabolic ? 'Catabolic' : 'Anabolic') + '</p>';

        s += '<div class="action_resources_holder">';
        s += '<div class="action_costs_holder">';
        s += '<p class="action_costs_header">Costs</p>';
        for (var i = 0; i < this.resources.length; i++) {
            if (this.resources[i].val < 0) {
                s += '<p class="action_cost_info">' + this.resources[i].res + ': ' + this.resources[i].val + '</p>';
            }
        }
        s += '</div>';

        s += '<div class="action_gains_holder">';
        s += '<p class="action_gains_header">Gains</p>';
        for (var i = 0; i < this.resources.length; i++) {
            if (this.resources[i].val > 0) {
                s += '<p class="action_gain_info">' + this.resources[i].res + ': ' + this.resources[i].val + '</p>';
            }
        }
        s += '</div>';
        s += '</div>';

        s += '</div>';
        return s;
    }
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
    //                         Action name                           Points  Limit  Organ(s)              Resource Level Changes                                                                                                                                                                                                                                                                                           Is Catabolic
    case 0:  return new Action("Breath In",                               0,   1, [BODY],                 [{res: 'O2',    val:  50}],                                                                                                                                                                                                                                                                                           true);
    case 1:  return new Action("Breath Out",                              0,   1, [BODY],                 [{res: 'CO2',   val: -50}],                                                                                                                                                                                                                                                                                           true);
    case 2:  return new Action("Eat",                                     0,   1, [BODY],                 [{res: 'Glc',   val:  20}, {res: 'Ala',    val:  10}, {res: 'Palmitate (Fatty Acid)', val:  20}],                                                                                                                                                                                                                     true);
    case 3:  return new Action("Pump Na+ and K+ ions",                    50, -1, [BRAIN],                [{res: 'ADP',   val:  50}, {res: 'ATP',    val: -50}, {res: 'Pi',                     val:  50}],                                                                                                                                                                                                                     false);
    case 4:  return new Action("Pyruvate to Lactate",                     0,  -1, [MUSCLE],               [{res: 'NAD+',  val:  1},  {res: 'NADH',   val: -1},  {res: 'Pyr',                    val: -1}, {res: 'Lact',         val:  1}],                                                                                                                                                                                      true);
    case 5:  return new Action("Pyruvate to Alanine",                     0,  -1, [MUSCLE],               [{res: 'NAD+',  val:  1},  {res: 'NADH',   val: -1},  {res: 'NH3',                    val: -1}, {res: 'Ala',          val:  1},  {res: 'Pyr',      val: -1}],                                                                                                                                                         true);
    case 6:  return new Action("Muscle Contraction",                      50, -1, [MUSCLE],               [{res: 'ADP',   val:  50}, {res: 'ATP',    val: -50}, {res: 'Pi',                     val:  50}],                                                                                                                                                                                                                     false);
    case 7:  return new Action("Urea Cycle",                              4,  -1, [LIVER],                [{res: 'ADP',   val:  4},  {res: 'ATP',    val: -4},  {res: 'Pi',                     val:  4}, {res: 'CO2',          val: -1},  {res: 'NH3',      val: -2}],                                                                                                                                                         true);
    case 8:  return new Action("Fatty Acid Synthesis",                    7,  -1, [LIVER],                [{res: 'ADP',   val:  7},  {res: 'ATP',    val: -7},  {res: 'Pi',                     val:  7}, {res: 'NADP+',        val:  14}, {res: 'NADPH',    val: -14}, {res: 'HSCoA',                  val:  7}, {res: 'Acetyl-S-CoA', val: -8}],                                                                              false);
    case 9:  return new Action("Lactate to Pyruvate",                     0,  -1, [LIVER],                [{res: 'NAD+',  val: -1},  {res: 'NADH',   val:  1},  {res: 'Pyr',                    val:  1}, {res: 'Lact',         val: -1}],                                                                                                                                                                                      false);
    case 10: return new Action("Alanine to Pyruvate",                     0,  -1, [LIVER],                [{res: 'NAD+',  val: -1},  {res: 'NADH',   val:  1},  {res: 'NH3',                    val:  1}, {res: 'Ala',          val: -1},  {res: 'Pyr',      val: 1}],                                                                                                                                                          false);
    case 11: return new Action("Gluconeogenesis",                         6,  -1, [LIVER],                [{res: 'ADP',   val:  6},  {res: 'ATP',    val: -6},  {res: 'Pi',                     val:  6}, {res: 'NAD+',         val:  2},  {res: 'NADH',     val: -2},  {res: 'Glc',                    val:  1}, {res: 'Pyr',          val: -2}],                                                                              false);
    case 12: return new Action("Fatty Acid Degradation",                  0,  -1, [LIVER, MUSCLE],        [{res: 'NAD+',  val: -7},  {res: 'NADH',   val:  7},  {res: 'FAD',                    val: -7}, {res: 'FADH2',        val:  7},  {res: 'HSCoA',    val: -8},  {res: 'Palmitate (Fatty Acid)', val: -1}, {res: 'Acetyl-S-CoA', val: 8}],                                                                               true);
    case 13: return new Action("Glycogen Degradation to Release Glucose", 0,  -1, [LIVER, MUSCLE],        [{res: 'Pi',    val: -1},  {res: 'Glc',    val:  1},  {res: 'Glycogen',               val: -1}],                                                                                                                                                                                                                      true);
    case 14: return new Action("Glycogen Synthesis",                      2,  -1, [LIVER, MUSCLE],        [{res: 'ADP',   val:  2},  {res: 'ATP',    val: -2},  {res: 'Pi',                     val:  2}, {res: 'Glc',          val: -1},  {res: 'Glycogen', val: 1}],                                                                                                                                                          false);
    case 15: return new Action("Glycolysis",                              0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -2},  {res: 'ATP',    val:  2},  {res: 'Pi',                     val: -2}, {res: 'NAD+',         val: -2},  {res: 'NADH',     val: 2},   {res: 'Glc',                    val: -1}, {res: 'Pyr',          val: 2}],                                                                               true);
    case 16: return new Action("Pyruvate Dehydrogenase",                  0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'NAD+',  val: -1},  {res: 'NADH',   val:  1},  {res: 'HSCoA',                  val: -1}, {res: 'Acetyl-S-CoA', val:  1},  {res: 'Pyr',      val: -1}],                                                                                                                                                         true);
    case 17: return new Action("PPP (oxid)",                              0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'NADP+', val: -2},  {res: 'NADPH',  val:  2},  {res: 'CO2',                    val:  1}, {res: 'Glc',          val: -1},  {res: 'Ribose',   val: 1}],                                                                                                                                                          true);
    case 18: return new Action("PPP (non-oxid) Reversible",               0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'Glc',   val:  5},  {res: 'Ribose', val: -6}],                                                                                                                                                                                                                                                                 true);
    case 19: return new Action("Kreb's Cycle",                            0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -1},  {res: 'ATP',    val:  1},  {res: 'Pi',                     val: -1}, {res: 'NAD+',         val: -3},  {res: 'NADH',     val: 3},   {res: 'FAD',                    val: -1}, {res: 'FADH2',        val: 1}, {res: 'HSCoA', val: 1}, {res: 'CO2', val: 2}, {res: 'Acetyl-S-CoA', val: -1}], true);
    case 20: return new Action("Oxidative Phosphorylation FADH2",         0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -3},  {res: 'ATP',    val:  3},  {res: 'Pi',                     val: -3}, {res: 'FAD',          val:  2},  {res: 'FADH2',    val: -2},  {res: 'O2',                     val: -1}],                                                                                                              true);
    case 21: return new Action("Oxidative Phosphorylation NADH",          0,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -5},  {res: 'ATP',    val:  5},  {res: 'Pi',                     val: -5}, {res: 'NAD+',         val:  2},  {res: 'NADH',     val: -2},  {res: 'O2',                     val: -1}],                                                                                                              true);
    case 22: return new Action("RNA Synthesis",                           2,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val:  2},  {res: 'ATP',    val: -2},  {res: 'Pi',                     val:  2}, {res: 'Ribose',       val: -1},  {res: 'RNA',      val: 1}],                                                                                                                                                          false);
    case 23: return new Action("Protein Synthesis",                       4,  -1, [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val:  4},  {res: 'ATP',    val: -4},  {res: 'Pi',                     val:  4}, {res: 'Ala',          val: -1},  {res: 'Protein',  val: 1}],                                                                                                                                                          false);
    }
    throw "unknown action id: " + id;
}
