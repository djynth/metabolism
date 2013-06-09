function getActions(organ)
{
    var actions = new Array();
    for (var i = 0; i < 24; i++) {
        var action = getAction(i);
        if (action.hasOrgan(organ)) {
            actions.push(action);
        }
    }
    return actions;
}

function action(name, id, points, organs, resources, catabolic)
{
    this.name = name;
    this.id = id;
    this.points = points;
    this.organs = organs;
    this.resources = resources;
    this.catabolic = catabolic;
    this.anabolic = !catabolic;

    this.hasOrgan = function(organ) {
        for (var i = 0; i < organs.length; i++) {
            if (organs[i] == organ) {
                return true;
            }
        }
        return false;
    }

    this.run = function(organ, resources) {
        if (!this.hasOrgan(organ)) {
            throw "invalid organ " + organ + " for action id " + this.id;
        }

        for (var i = 0; i < this.resources.length; i++) {
            var res = this.resources[i].res;
            var val = this.resources[i].val;
            if (!isResourceLevelValid(res, changeResourceValue(res, isResourceGlobal(res) ? BODY : organ, resources, val))) {
                return "Not enough " + res + ".";
            }
        }

        return resources;
    }

    this.toHTML = function() {
        var s = '';
        s += '<div class="action_content">';

        s += '<h5 class="action_title">' + this.name + '</h5>'
        s += '<p class="action_info">Points: ' + this.points + '</p>';
        s += '<p class="action_info">' + (this.catabolic ? 'Catabolic' : 'Anabolic') + '</p>';

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
        return s;
    }

    this.toString = function() {
        return this.name + " [" + this.id + "]";
    }
}

function isResourceGlobal(resource)
{
    return resource == "O2" || resource == "CO2" || resource == "NH3" || resource == "Glc" || resource == "Ala" || 
        resource == "Palmitate (Fatty Acid)" || resource == "Lact";
}

function getAction(id)
{
    if (typeof id == "string") {
        id = parseInt(id);
    }

    switch(id)
    {   
    //                         Action name                               ID Points  Organ(s)              Resource Level Changes                                                                                                                                                                                                                                                                                          Is Catabolic
    case 0:  return new action("Breath In",                               0,  0,  [BODY],                 [{res: 'O2',    val:  50}],                                                                                                                                                                                                                                                                                           true);
    case 1:  return new action("Breath Out",                              1,  0,  [BODY],                 [{res: 'CO2',   val: -50}],                                                                                                                                                                                                                                                                                           true);
    case 2:  return new action("Eat",                                     2,  0,  [BODY],                 [{res: 'Glc',   val:  20}, {res: 'Ala',    val:  10}, {res: 'Palmitate (Fatty Acid)', val:  20}],                                                                                                                                                                                                                     true);
    case 3:  return new action("Pump Na+ and K+ ions",                    3,  50, [BRAIN],                [{res: 'ADP',   val:  50}, {res: 'ATP',    val: -50}, {res: 'Pi',                     val:  50}],                                                                                                                                                                                                                     false);
    case 4:  return new action("Pyruvate to Lactate",                     4,  0,  [MUSCLE],               [{res: 'NAD+',  val:  1},  {res: 'NADH',   val: -1},  {res: 'Pyr',                    val: -1}, {res: 'Lact',         val:  1}],                                                                                                                                                                                      true);
    case 5:  return new action("Pyruvate to Alanine",                     5,  0,  [MUSCLE],               [{res: 'NAD+',  val:  1},  {res: 'NADH',   val: -1},  {res: 'NH3',                    val: -1}, {res: 'Ala',          val:  1},  {res: 'Pyr',      val: -1}],                                                                                                                                                         true);
    case 6:  return new action("Muscle Contraction",                      6,  50, [MUSCLE],               [{res: 'ADP',   val:  50}, {res: 'ATP',    val: -50}, {res: 'Pi',                     val:  50}],                                                                                                                                                                                                                     false);
    case 7:  return new action("Urea Cycle",                              7,  4,  [LIVER],                [{res: 'ADP',   val:  4},  {res: 'ATP',    val: -4},  {res: 'Pi',                     val:  4}, {res: 'CO2',          val: -1},  {res: 'NH3',      val: -2}],                                                                                                                                                         true);
    case 8:  return new action("Fatty Acid Synthesis",                    8,  7,  [LIVER],                [{res: 'ADP',   val:  7},  {res: 'ATP',    val: -7},  {res: 'Pi',                     val:  7}, {res: 'NADP+',        val:  14}, {res: 'NADPH',    val: -14}, {res: 'HSCoA',                  val:  7}, {res: 'Acetyl-S-CoA', val: -8}],                                                                              false);
    case 9:  return new action("Lactate to Pyruvate",                     9,  0,  [LIVER],                [{res: 'NAD+',  val: -1},  {res: 'NADH',   val:  1},  {res: 'Pyr',                    val:  1}, {res: 'Lact',         val: -1}],                                                                                                                                                                                      false);
    case 10: return new action("Alanine to Pyruvate",                     10, 0,  [LIVER],                [{res: 'NAD+',  val: -1},  {res: 'NADH',   val:  1},  {res: 'NH3',                    val:  1}, {res: 'Ala',          val: -1},  {res: 'Pyr',      val: 1}],                                                                                                                                                          false);
    case 11: return new action("Gluconeogenesis",                         11, 6,  [LIVER],                [{res: 'ADP',   val:  6},  {res: 'ATP',    val: -6},  {res: 'Pi',                     val:  6}, {res: 'NAD+',         val:  2},  {res: 'NADH',     val: -2},  {res: 'Glc',                    val:  1}, {res: 'Pyr',          val: -2}],                                                                              false);
    case 12: return new action("Fatty Acid Degradation",                  12, 0,  [LIVER, MUSCLE],        [{res: 'NAD+',  val: -7},  {res: 'NADH',   val:  7},  {res: 'FAD',                    val: -7}, {res: 'FADH2',        val:  7},  {res: 'HSCoA',    val: -8},  {res: 'Palmitate (Fatty Acid)', val: -1}, {res: 'Acetyl-S-CoA', val: 8}],                                                                               true);
    case 13: return new action("Glycogen Degradation to Release Glucose", 13, 0,  [LIVER, MUSCLE],        [{res: 'Pi',    val: -1},  {res: 'Glc',    val:  1},  {res: 'Glycogen',               val: -1}],                                                                                                                                                                                                                      true);
    case 14: return new action("Glycogen Synthesis",                      14, 2,  [LIVER, MUSCLE],        [{res: 'ADP',   val:  2},  {res: 'ATP',    val: -2},  {res: 'Pi',                     val:  2}, {res: 'Glc',          val: -1},  {res: 'Glycogen', val: 1}],                                                                                                                                                          false);
    case 15: return new action("Glycolysis",                              15, 0,  [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -2},  {res: 'ATP',    val:  2},  {res: 'Pi',                     val: -2}, {res: 'NAD+',         val: -2},  {res: 'NADH',     val: 2},   {res: 'Glc',                    val: -1}, {res: 'Pyr',          val: 2}],                                                                               true);
    case 16: return new action("Pyruvate Dehydrogenase",                  16, 0,  [LIVER, MUSCLE, BRAIN], [{res: 'NAD+',  val: -1},  {res: 'NADH',   val:  1},  {res: 'HSCoA',                  val: -1}, {res: 'Acetyl-S-CoA', val:  1},  {res: 'Pyr',      val: -1}],                                                                                                                                                         true);
    case 17: return new action("PPP (oxid)",                              17, 0,  [LIVER, MUSCLE, BRAIN], [{res: 'NADP+', val: -2},  {res: 'NADPH',  val:  2},  {res: 'CO2',                    val:  1}, {res: 'Glc',          val: -1},  {res: 'Ribose',   val: 1}],                                                                                                                                                          true);
    case 18: return new action("PPP (non-oxid) Reversible",               18, 0,  [LIVER, MUSCLE, BRAIN], [{res: 'Glc',   val:  5},  {res: 'Ribose', val: -6}],                                                                                                                                                                                                                                                                 true);
    case 19: return new action("Kreb's Cycle",                            19, 0,  [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -1},  {res: 'ATP',    val:  1},  {res: 'Pi',                     val: -1}, {res: 'NAD+',         val: -3},  {res: 'NADH',     val: 3},   {res: 'FAD',                    val: -1}, {res: 'FADH2',        val: 1}, {res: 'HSCoA', val: 1}, {res: 'CO2', val: 2}, {res: 'Acetyl-S-CoA', val: -1}], true);
    case 20: return new action("Oxidative Phosphorylation FADH2",         20, 0,  [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -3},  {res: 'ATP',    val:  3},  {res: 'Pi',                     val: -3}, {res: 'FAD',          val:  2},  {res: 'FADH2',    val: -2},  {res: 'O2',                     val: -1}],                                                                                                              true);
    case 21: return new action("Oxidative Phosphorylation NADH",          21, 0,  [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val: -5},  {res: 'ATP',    val:  5},  {res: 'Pi',                     val: -5}, {res: 'NAD+',         val:  2},  {res: 'NADH',     val: -2},  {res: 'O2',                     val: -1}],                                                                                                              true);
    case 22: return new action("RNA Synthesis",                           22, 2,  [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val:  2},  {res: 'ATP',    val: -2},  {res: 'Pi',                     val:  2}, {res: 'Ribose',       val: -1},  {res: 'RNA',      val: 1}],                                                                                                                                                          false);
    case 23: return new action("Protein Synthesis",                       23, 4,  [LIVER, MUSCLE, BRAIN], [{res: 'ADP',   val:  4},  {res: 'ATP',    val: -4},  {res: 'Pi',                     val:  4}, {res: 'Ala',          val: -1},  {res: 'Protein',  val: 1}],                                                                                                                                                          false);
    }
    throw "unknown action id: " + id;
}

function isResourceLevelValid(resource, level)
{
    return level > 0;
}