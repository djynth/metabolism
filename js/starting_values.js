function getStartingResources()
{
    var res = new Array();
    var organs = [BRAIN, MUSCLE, LIVER];
    for (organ in organs) {
        res.push(new resource('ADP', 0, organs[organ]));
        res.push(new resource('ATP', 0, organs[organ]));
        res.push(new resource('Pi', 0, organs[organ]));
        res.push(new resource('NAD+', 0, organs[organ]));
        res.push(new resource('NADH', 0, organs[organ]));
        res.push(new resource('FAD', 0, organs[organ]));
        res.push(new resource('FADH2', 0, organs[organ]));
        res.push(new resource('NADP+', 0, organs[organ]));
        res.push(new resource('NADPH', 0, organs[organ]));
        res.push(new resource('HSCoA', 0, organs[organ]));
        res.push(new resource('Protein', 0, organs[organ]));
        res.push(new resource('RNA', 0, organs[organ]));
        res.push(new resource('Glycogen', 0, organs[organ]));
        res.push(new resource('Acetyl-S-CoA', 0, organs[organ]));
        res.push(new resource('Pyr', 0, organs[organ]));
        res.push(new resource('Ribose', 0, organs[organ]));
    }

    res.push(new resource('O2', 0, BODY));
    res.push(new resource('CO2', 0, BODY));
    res.push(new resource('NH3', 0, BODY));
    res.push(new resource('Glc', 0, BODY));
    res.push(new resource('Ala', 0, BODY));
    res.push(new resource('Palmitate (Fatty Acid)', 0, BODY));
    res.push(new resource('Lact', 0, BODY));

    return res;
}