function getActions(organ)
{
    var actions = new Array();

    if (organ == BODY) {
        actions.push(getAction(1));
        actions.push(getAction(2));
        actions.push(getAction(3));
    } else if (organ == BRAIN) {
        actions.push(getAction(4));
    } else if (organ == MUSCLE) {
        actions.push(getAction(5));
        actions.push(getAction(6));
        actions.push(getAction(7));
    } else if (organ == LIVER) {
        actions.push(getAction(8));
        actions.push(getAction(9));
        actions.push(getAction(10));
        actions.push(getAction(11));
        actions.push(getAction(12));
    }

    if (organ == LIVER || organ == MUSCLE) {
        actions.push(getAction(13));
        actions.push(getAction(14));
        actions.push(getAction(15));
    }

    if (organ == BRAIN || organ == MUSCLE || organ == LIVER) {
        actions.push(getAction(16));
        actions.push(getAction(17));
        actions.push(getAction(18));
        actions.push(getAction(19));
        actions.push(getAction(20));
        actions.push(getAction(21));
        actions.push(getAction(22));
        actions.push(getAction(23));
        actions.push(getAction(24));
    }

    return actions;
}

function runAction(id, organ, resources)
{
    switch(id)
    {
    case 1:         // Breath In
        if (organ != BODY) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        changeResourceValue('O2', organ, resources, 50);
        break;
    case 2:         // Breath Out
        if (organ != BODY) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('CO2', organ, resources, -50) < 0) { return "Not enough CO2"; }
        break;
    case 3:         // Eat
        if (organ != BODY) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        changeResourceValue('Glc', organ, resources, 20);
        changeResourceValue('Ala', organ, resources, 10);
        changeResourceValue('Palmitate (Fatty Acid)', organ, resources, 20);
        break;
    case 4:         // Pump Na+ and K+ ions
        if (organ != BRAIN) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }
        
        if (changeResourceValue('ATP', organ, resources, -50) < 0) { return "Not enough ATP"; }
        changeResourceValue('ADP', organ, resources, 50);
        changeResourceValue('Pi', organ, resources, 50);
        break;
    case 5:         // Pyruvate to Lactate
        if (organ != MUSCLE) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }
        
        if (changeResourceValue('NADH', organ, resources, -1) < 0) { return "Not enough NADH"; }
        if (changeResourceValue('Pyr', organ, resources, -1) < 0) { return "Not enough Pyr"; }
        changeResourceValue('NAD+', organ, resources, 1);
        changeResourceValue('Lact', BODY, resources, 1);
        break;
    case 6:         // Pyruvate to Alanine
        if (organ != MUSCLE) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('NADH', organ, resources, -1) < 0) { return "Not enough NADH"; }
        if (changeResourceValue('NH3', BODY, resources, -1) < 0) { return "Not enough NH3"; }
        if (changeResourceValue('Pyr', organ, resources, -1) < 0) { return "Not enough Pyr"; }
        changeResourceValue('NAD+', organ, resources, 1);
        changeResourceValue('Ala', BODY, resources, 1);
        break;
    case 7:         // Muscle Contraction
        if (organ != MUSCLE) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('ATP', organ, resources, -50) < 0) { return "Not enough ATP"; }
        changeResourceValue('ADP', organ, resources, 50);
        changeResourceValue('Pi', organ, resources, 50);
        break;
    case 8:         // Urea Cycle
        if (organ != LIVER) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('ATP', organ, resources, -4) < 0) { return "Not enough ATP"; }
        if (changeResourceValue('CO2', organ, resources, -1) < 0) { return "Not enough CO2"; }
        if (changeResourceValue('NH3', organ, resources, -2) < 0) { return "Not enough NH3"; }
        changeResourceValue('ADP', organ, resources, 4);
        changeResourceValue('Pi', organ, resources, 4);
        break;
    case 9:         // Fatty Acid Synthesis
        if (organ != LIVER) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('ATP', organ, resources, -7) < 0) { return "Not enough ATP"; }
        if (changeResourceValue('NADPH', organ, resources, -14) < 0) { return "Not enough NADPH"; }
        if (changeResourceValue('Acetyl-S-CoA', organ, resources, -8) < 0) { return "Not enough Acetyl-S-CoA"; }
        changeResourceValue('ADP', organ, resources, 7);
        changeResourceValue('Pi', organ, resources, 7);
        changeResourceValue('NADP+', organ, resources, 14);
        changeResourceValue('HSCoA', organ, resources, 7);
        break;
    case 10:        // Lactate to Pyruvate
        if (organ != LIVER) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('NAD+', organ, resources, -1) < 0) { return "Not enough NAD+"; }
        if (changeResourceValue('Lact', BODY, resources, -1) < 0) { return "Not enough Lact"; }
        changeResourceValue('NADH', organ, resources, 1);
        changeResourceValue('Pyr', organ, resources, 1);
        break;
    case 11:        // Alanine to Pyruvate
        if (organ != LIVER) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('NAD+', organ, resources, -1) < 0) { return "Not enough NAD+"; }
        if (changeResourceValue('Ala', BODY, resources, -1) < 0) { return "Not enough Ala"; }
        changeResourceValue('NADH', organ, resources, 1);
        changeResourceValue('NH3', BODY, resources, 1);
        changeResourceValue('Pyr', organ, resources, 1);
        break;
    case 12:        // Gluconeogenesis
        if (organ != LIVER) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('ATP', organ, resources, -6) < 0) { return "Not enough ATP"; }
        if (changeResourceValue('NADH', organ, resources, -2) < 0) { return "Not enough NADH"; }
        if (changeResourceValue('Pyr', organ, resources, -2) < 0) { return "Not enough Pyr"; }
        changeResourceValue('ADP', organ, resources, 6);
        changeResourceValue('Pi', organ, resources, 6);
        changeResourceValue('NAD+', organ, resources, 2);
        changeResourceValue('Glc', BODY, resources, 2);
        break;
    case 13:        // Fatty Acid Degradation
        if (organ != LIVER && organ != MUSCLE) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('NAD+', organ, resources, -7) < 0) { return "Not enough NAD+"; }
        if (changeResourceValue('FAD', organ, resources, -7) < 0) { return "Not enough FAD"; }
        if (changeResourceValue('HSCoA', organ, resources, -8) < 0) { return "Not enough HSCoA"; }
        if (changeResourceValue('Palmitate (Fatty Acid)', BODY, resources, -1) < 0) { return "Not enough Palmitate (Fatty Acid)"; }
        changeResourceValue('NADH', organ, resources, 7);
        changeResourceValue('FADH2', organ, resources, 7);
        changeResourceValue('Acetyl-S-CoA', organ, resources, 8);
        break;
    case 14:        // Glycogen Degradation to Release Glucose
        if (organ != LIVER && organ != MUSCLE) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('Pi', organ, resources, -1) < 0) { return "Not enough Pi"; }
        if (changeResourceValue('Glycogen', organ, resources, -1) < 0) { return "Not enough Glycogen"; }
        changeResourceValue('Glc', BODY, resources, 1);
        break;
    case 15:        // Glycogen Synthesis
        if (organ != LIVER && organ != MUSCLE) {
            throw "incorrect organ " + organ  + " for action id " + id;
        }

        if (changeResourceValue('ATP', organ, resources, -2) < 0) { return "Not enough ATP"; }
        if (changeResourceValue('Glc', BODY, resources, -1) < 0) { return "Not enough Glc"; }
        changeResourceValue('ADP', organ, resources, 2);
        changeResourceValue('Pi', organ, resources, 2);
        changeResourceValue('Glycogen', organ, resources, 1);
        break;
    case 16:        // Glycolysis
        if (changeResourceValue('ATP', organ, resources, -2) < 0) { return "Not enough ATP"; }
        if (changeResourceValue('NAD+', organ, resources, -2) < 0) { return "Not enough NAD+"; }
        if (changeResourceValue('Glc', BODY, resources, -1) < 0) { return "Not enough Glc"; }
        changeResourceValue('ADP', organ, resources, 2);
        changeResourceValue('Pi', organ, resources, 2);
        changeResourceValue('NADH', organ, resources, 2);
        changeResourceValue('Pyr', organ, resources, 2);
        break;
    case 17:        // Pyruvate Dehydrogenase
        if (changeResourceValue('NAD+', organ, resources, -1) < 0) { return "Not enough NAD+"; }
        if (changeResourceValue('HSCoA', organ, resources, -1) < 0) { return "Not enough HSCoA"; }
        if (changeResourceValue('Pyr', organ, resources, -1) < 0) { return "Not enough Pyr"; }
        changeResourceValue('NADH', organ, resources, 1);
        changeResourceValue('Acetyl-S-CoA', organ, resources, 1);
        break;
    case 18:        // PPP (oxid)
        if (changeResourceValue('NADP+', organ, resources, -2) < 0) { return "Not enough NADP+"; }
        if (changeResourceValue('Glc', BODY, resources, -1) < 0) { return "Not enough Glc"; }
        changeResourceValue('NADPH', organ, resources, 2);
        changeResourceValue('CO2', BODY, resources, 1);
        changeResourceValue('Ribose', organ, resources, 1);
        break;
    case 19:        // PPP (non-oxid) Reversible
        if (changeResourceValue('Ribose', organ, resources, -6) < 0) { return "Not enough Ribose"; }
        changeResourceValue('Glc', BODY, resources, 5);
        break;
    case 20:        // Kreb's Cycle
        if (changeResourceValue('ADP', organ, resources, -1) < 0) { return "Not enough ADP"; }
        if (changeResourceValue('Pi', organ, resources, -1) < 0) { return "Not enough Pi"; }
        if (changeResourceValue('NAD+', organ, resources, -3) < 0) { return "Not enough NAD+"; }
        if (changeResourceValue('FAD', organ, resources, -1) < 0) { return "Not enough FAD"; }
        if (changeResourceValue('Acetyl-S-CoA', organ, resources, -1) < 0) { return "Not enough Acetyl-S-CoA"; }
        changeResourceValue('ATP', organ, resources, 1);
        changeResourceValue('NADH', organ, resources, 3);
        changeResourceValue('HSCoA', organ, resources, 1);
        changeResourceValue('CO2', BODY, resources, 2);
        break;
    case 21:        // Oxidative Phosphorylation FADH2
        if (changeResourceValue('ADP', organ, resources, -3) < 0) { return "Not enough ADP"; }
        if (changeResourceValue('Pi', organ, resources, -3) < 0) { return "Not enough Pi"; }
        if (changeResourceValue('FADH2', organ, resources, -2) < 0) { return "Not enough FADH2"; }
        if (changeResourceValue('O2', BODY, resources, -1) < 0) { return "Not enough O2"; }
        changeResourceValue('ATP', organ, resources, 3);
        changeResourceValue('FAD', organ, resources, 2);
        break;
    case 22:        // Oxidative Phosphorylation NADH
        if (changeResourceValue('ADP', organ, resources, -5) < 0) { return "Not enough ADP"; }
        if (changeResourceValue('Pi', organ, resources, -5) < 0) { return "Not enough Pi"; }
        if (changeResourceValue('NADH', organ, resources, -2) < 0) { return "Not enough NADH"; }
        if (changeResourceValue('O2', BODY, resources, -1) < 0) { return "Not enough O2"; }
        changeResourceValue('ATP', organ, resources, 5);
        changeResourceValue('NAD+', organ, resources, 2);
        break;
    case 23:        // RNA Synthesis
        if (changeResourceValue('ATP', organ, resources, -2) < 0) { return "Not enough ATP"; }
        if (changeResourceValue('Ribose', organ, resources, -1) < 0) { return "Not enough Ribose"; }
        changeResourceValue('ADP', organ, resources, 2);
        changeResourceValue('Pi', organ, resources, 2);
        changeResourceValue('RNA', organ, resources, 1);
        break;
    case 24:        // Protein Synthesis
        if (changeResourceValue('ATP', organ, resources, -4) < 0) { return "Not enough ATP"; }
        if (changeResourceValue('Ala', BODY, resources, -1) < 0) { return "Not enough Ala"; }
        changeResourceValue('ADP', organ, resources, 4);
        changeResourceValue('Pi', organ, resources, 4);
        changeResourceValue('Protein', organ, resources, 1);
        break;
    default:
        throw "invalid action id " + id;
    }

    return resources;
    // run the action, return the modified resources if it was completed or an error string if the resources are not sufficient to perform the action
}

function action(name, id, catabolic, points)
{
    this.name = name;
    this.id = id;
    this.points = points;
    this.catabolic = catabolic;
    this.anabolic = !catabolic;

    this.toString = function() {
        return this.name;
    }
}

function getAction(id)
{
    if (typeof id == "string") {
        id = parseInt(id);
    }

    switch(id)
    {
    case 1:  return new action("Breath In",                                1,  true,  0);
    case 2:  return new action("Breath Out",                               2,  true,  0);
    case 3:  return new action("Eat",                                      3,  true,  0);
    case 4:  return new action("Pump Na+ and K+ ions",                     4,  false, 50);
    case 5:  return new action("Pyruvate to Lactate",                      5,  true,  0);
    case 6:  return new action("Pyruvate to Alanine",                      6,  true,  0);
    case 7:  return new action("Muscle Contraction",                       7,  false, 50);
    case 8:  return new action("Urea Cycle",                               8,  true,  4);
    case 9:  return new action("Fatty Acid Synthesis",                     9,  false, 7);
    case 10: return new action("Lactate to Pyruvate",                      10, false, 0);
    case 11: return new action("Alanine to Pyruvate",                      11, false, 0);
    case 12: return new action("Gluconeogenesis",                          12, false, 6);
    case 13: return new action("Fatty Acid Degradation",                   13, true,  0);
    case 14: return new action("Glycogen Degradation to Release Glucose",  14, true,  0);
    case 15: return new action("Glycogen Synthesis",                       15, false, 2);
    case 16: return new action("Glycolysis",                               16, true,  0);
    case 17: return new action("Pyruvate Dehydrogenase",                   17, true,  0);
    case 18: return new action("PPP (oxid)",                               18, true,  0);
    case 19: return new action("PPP (non-oxid) Reversible",                19, true,  0);
    case 20: return new action("Kreb's Cycle",                             20, true,  0);
    case 21: return new action("Oxidative Phosphorylation FADH2",          21, true,  0);
    case 22: return new action("Oxidative Phosphorylation NADH",           22, true,  0);
    case 23: return new action("RNA Synthesis",                            23, false, 2);
    case 24: return new action("Protein Synthesis",                        24, false, 4);
    }
    throw "unknown action id: " + id;
}