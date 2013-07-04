/**
 * Holds the currently available pathways.
 * @type {Array}
 */
var pathways = [];
/**
 * The maximum number of nutrients (i.e. resources) that can be "eaten" in a single turn.
 * @type {number}
 */
var EAT_MAX = 50;

/**
 * A Pathway object, which holds all the data about a specific metabolic pathway.
 * This pathway is not guaranteed to be unique among various organs; that is, the same Pathway object can represent a
 *     metabolic pathway that can be run in several distinct organs.
 * 
 * @param {number} id An ID which uniquely identifies this metabolic pathway.
 * @param {string} name The name used to identify this Pathway to the user.
 * @param {number} points The number of points earned by running this Pathway.
 * @param {boolean} limit Whether this Pathway is limited; if true, the Pathway can only be run once in a single turn,
 *                        otherwise it can be run as many times as the resources allow.
 * @param {string} color The color associated with this Pathway in the UI.
 * @param {boolean} catabolic Whether this Pathway is catabolic (as opposed to anabolic).
 * @param {array} organs A list of the organs in which this Pathway can be run.
 * @param {array} resources The resource which are modified each time the Pathway is run; this Array holds objects with
 *                          fields <code>res</code> which is the name of the resource, and <code>val</code> which is the
 *                          amount by which the resource is modified.
 */
function Pathway(id, name, points, limit, color, catabolic, organs, resources)
{
    this.id = id;
    this.name = name;
    this.points = points;
    this.limit = limit;
    this.color = color;
    this.catabolic = catabolic;
    this.organs = organs;
    this.resources = resources;

    /**
     * Determines whether this Pathway runs in the given organ.
     * 
     * @param {string} organ The organ for which to test compatibility with his Pathway.
     * @return {boolean} Returns true if this Pathway can be run in the given organ, false otherwise.
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
     * Determines whether this Pathway represents the eating pathway, which is unique in several respects.
     * 
     * @return {boolean} Returns true if this Pathway is the Eat pathway, false otherwise.
     */
    this.isEat = function() {
        return this.name == "Eat";
    }

    /**
     * Gets a list of the reactants in this Pathway.
     * 
     * @return {Array} A list of all the resources with negative changes.
     */
    this.getReactants = function() {
        var reactants = new Array();
        for (var i = 0; i < this.resources.length; i++) {
            if (this.resources[i].val < 0) {
                reactants.push(resources[i]);
            }
        }
        return reactants;
    }

    /**
     * Gets a list of the products in this Pathway.
     * 
     * @return {Array} A list of all the resources with positive changes.
     */
    this.getProducts = function() {
        var products = new Array();
        for (var i = 0; i < this.resources.length; i++) {
            if (this.resources[i].val > 0) {
                products.push(resources[i]);
            }
        }
        return products;
    }

    /**
     * Gets the maximum number of times that this Pathway can be run based on the given resource, or the absolute
     *     maximum number of times based on all resources if no resource or value is given.
     *
     * @param {string} organ The organ whose resources should be used to gauge the maximum number of times this Pathway
     *                       can be run.
     * @param {string|number|undefined} resource Any name of the resource to be checked or the Resource's ID, or
     *                                           undefined to check among all resources.
     * @param {number|undefined} value The change that running this Pathway once has on the resource's value (if this is
     *                                 greater than or equal to 0, -1 is returned since the resource imposes no limit),
     *                                 or undefined to check among all resources.
     * @return {number} The limit imposed on running this Pathway by the given resource if provided or by all resources
     *                      if none is specified, or -1 if it can be run an unlimited amount.
     */
    this.getMaxRuns = function(organ, resource, value) {
        if (typeof resource === 'undefined' || typeof value === 'undefined') {
            if (this.limit) {
                return 1;
            }

            var max = -1;
            for (var i = 0; i < this.resources.length; i++) {
                if (this.resources[i].val < 0) {
                    var actualOrgan = isResourceGlobal(resource) ? GLOBAL : organ;
                    var reactantMax = this.getMaxRuns(actualOrgan, this.resources[i].res, this.resources[i].val);
                    if (max == -1 || reactantMax < max) {
                        max = reactantMax;
                    }
                }
            }
            return max;
        } else {
            if (value >= 0) {
                return -1;
            }
            var actualOrgan = isResourceGlobal(resource) ? GLOBAL : organ;
            return Math.floor(getResourceValue(resource, actualOrgan)/Math.abs(value));
        }
    }

    /**
     * Runs this Pathway in the given organ the given number of times.
     * This function will verify that the Pathway can be run the given number of times and, if so, modify the resources
     *     and call the appropriate UI update functions, increment the turn counter, and add the appropriate number of
     *     points.
     * 
     * @param {string} organ The name of the organ in which to run this Pathway; resources in this organ will be used
     *                       and modified.
     * @param {number} times The number of times to run this Pathway; should be greater than or equal to 0.
     * @return {boolean} Returns true if the Pathway was successfully run, or false otherwise.
     */
    this.run = function(organ, times) {
        if (!this.hasOrgan(organ)) {
            throw "invalid organ " + organ + " for pathway id " + this.id;
        }

        for (var i = 0; i < this.resources.length; i++) {
            if (getResourceValue(this.resources[i].res, isResourceGlobal(this.resources[i].res) ? GLOBAL : organ) + 
                times*this.resources[i].val < 0) {
                return false;
            }
        }

        for (var i = 0; i < this.resources.length; i++) {
            var res = this.resources[i].res;
            var val = times*this.resources[i].val;
            var actualOrgan = isResourceGlobal(res) ? GLOBAL : organ;
            changeResourceValue(res, actualOrgan, val);
            onResourceChange(getResource(res, actualOrgan), val);
        }

        refreshPathways();

        nextTurn();
        addPoints(times*this.points);

        return true;
    }

    /**
     * Flattens this Pathway into an HTML element which can be inserted into the DOM.
     * @return {jQuery}
     */
    this.toHTML = function() {
        var elem = $('<div>')
            .addClass('pathway')
            .attr('value', this.id)
            .append($('<p>')
                .addClass('title')
                .html(this.name)
            ).append($('<p>')
                .addClass('points')
                .html(this.points + ' Points')
            );

        if (!this.hasOrgan(GLOBAL)) {
            elem.append($('<p>')
                .addClass('catabolic')
                .html(this.catabolic ? 'Catabolic' : 'Anabolic'));
        }

        if (this.isEat()) {
            var levels = [];
            for (var i = 0; i < this.resources.length; i++) {
                if (getResource('Glucose').hasName(this.resources[i].res)) {
                    levels.push({name: 'glc', value: this.resources[i].val});
                } else if (getResource('Alanine').hasName(this.resources[i].res)) {
                    levels.push({name: 'ala', value: this.resources[i].val});
                } else {
                    levels.push({name: 'fa', value: this.resources[i].val});
                }
            }

            var foodHolder = $('<div>').addClass('food-holder');

            for (var i = 0; i < levels.length; i++) {
                foodHolder.append($('<div>')
                    .addClass('btn-group')
                    .append($('<button>')
                        .addClass('btn btn-mini btn-inverse eat-bottom')
                        .append($('<i>').addClass('icon-chevron-down icon-white')))
                    .append($('<button>')
                        .addClass('btn btn-mini btn-inverse eat-minus')
                        .append($('<i>').addClass('icon-minus icon-white')))
                    .append($('<button>')
                        .addClass('btn btn-mini btn-inverse eat')
                        .attr('id', levels[i].name)
                        .attr('value', levels[i].value))
                    .append($('<button>')
                        .addClass('btn btn-mini btn-inverse eat-plus')
                        .append($('<i>').addClass('icon-plus icon-white')))
                    .append($('<button>')
                        .addClass('btn btn-mini btn-inverse eat-top')
                        .append($('<i>').addClass('icon-chevron-up icon-white')))
                    );
            }

            elem.append(foodHolder);
        } else {
            var reaction = $('<table>').addClass('reaction');

            var reactants = this.getReactants();
            var products  = this.getProducts();

            for (var i = 0; i < Math.max(reactants.length, products.length); i++) {
                var row = $('<tr>');

                var reactant = $('<td>').addClass('reactant');
                if (i < reactants.length) {
                    reactant.attr('value', reactants[i].res);
                    if (isResourceGlobal(reactants[i].res)) {
                        reactant.css('font-weight', 'bold');
                    }
                    reactant.html(getResource(reactants[i].res).name + ' ' + reactants[i].val);
                }

                var product = $('<td>').addClass('product');
                if (i < products.length) {
                    product.attr('value', products[i].res);
                    if (isResourceGlobal(products[i].res)) {
                        product.css('font-weight', 'bold');
                    }
                    product.html(getResource(products[i].res).name + ' ' + products[i].val);
                }

                reaction.append(row.append(reactant).append(product));
            }

            elem.append(reaction);
        }

        elem.append($('<p>').addClass('lacking'));

        var runHolder = $('<div>').addClass('btn-group run-holder');
        if (this.limit) {
            runHolder.append($('<button>').addClass('btn btn-mini btn-inverse').attr('value', 1).html('Run'));
            if (this.isEat()) {
                runHolder.children('button').addClass('eat-run');
            } else {
                runHolder.children('button').addClass('pathway-run');
            }
        } else {
            runHolder.append($('<button>')
                    .addClass('btn btn-mini btn-inverse pathway-bottom')
                    .append($('<i>').addClass('icon-chevron-down icon-white')))
                .append($('<button>')
                    .addClass('btn btn-mini btn-inverse pathway-minus')
                    .append($('<i>').addClass('icon-minus icon-white')))
                .append($('<button>')
                    .addClass('btn btn-mini btn-inverse pathway-run'))
                .append($('<button>')
                    .addClass('btn btn-mini btn-inverse pathway-plus')
                    .append($('<i>').addClass('icon-plus icon-white')))
                .append($('<button>')
                    .addClass('btn btn-mini btn-inverse pathway-top')
                    .append($('<i>').addClass('icon-chevron-up icon-white')));
        }

        elem.append(runHolder);

        return elem;
    }
}

/**
 * Gets a list of all the Pathways that can be run in the given organ.
 * 
 * @param {string} organ The organ which all the returned Pathways "have" (as determined by 
 *                       {@code Pathway.hasOrgan(string)}).
 * @return {array} An Array of all the Pathway which can run in the given organ.
 */
function getPathways(organ)
{
    var organPathways = new Array();
    for (var i = 0; i < pathways.length; i++) {
        if (pathways[i].hasOrgan(organ)) {
            organPathways.push(pathways[i]);
        }
    }
    return organPathways;
}

/**
 * Gets the Pathway object matching the given name or ID, if one exists.
 * @param {string|number} pathway A pathway identifier, either the Pathway's name or ID.
 * @return {Pathway|null} The Pathway matching the given name or ID, or null if none can be found.
 */
function getPathway(pathway)
{
    for (var i = 0; i < pathways.length; i++) {
        if (pathways[i].id == pathway || pathways[i].name == pathway) {
             return pathways[i];
        }
    }
    return null;
}

/**
 * Populates the pathway pane with all the available Pathways.
 * Although this function is typically only invoked once upon initialization, but may be called again if the Pathway
 *     data is modified.
 */
function populatePathways()
{
    $('.pathway-holder').empty();
    var organs = [GLOBAL, BRAIN, MUSCLE, LIVER];
    for (var i = 0; i < organs.length; i++) {
        var pathways = getPathways(organs[i]);
        for (var j = 0; j < pathways.length; j++) {
            $('.pathway-holder[value="' + organs[i] + '"]').append(pathways[j].toHTML(organs[i]));
        }
    }
    refreshPathways();
    updateEatButtons($('.food-holder'));
}

/**
 * Refreshes the pathway views.
 * This function should be called when resources are modified; if Pathway information is itself changed,
 *     <code>populatePathways</code> should be invoked.
 */
function refreshPathways()
{
    $('.pathway').each(function() {
        var pathway = getPathway($(this).attr('value'));
        var reactants = pathway.getReactants();
        for (var i = 0; i < pathway.organs.length; i++) {
            var lackingReactants = new Array();
            
            for (var j = 0; j < reactants.length; j++) {
                var reactantLimit = pathway.getMaxRuns(pathway.organs[i], reactants[j].res, reactants[j].val);
                if (reactantLimit == 0) {
                    $(this).find('.reactant').filter(function() {
                        return getResource(reactants[j].res).hasName($(this).attr('value'));
                    }).addClass('lacking');
                    lackingReactants.push(getResource(reactants[j].res).name)
                } else {
                    $(this).find('.reactant').filter(function() {
                        return getResource(reactants[j].res).hasName($(this).attr('value'));
                    }).removeClass('lacking');
                }
            }

            if (lackingReactants.length > 0) {
                $(this).find('.run-holder').hide();
                $(this).find('.lacking').show();

                var lackingList = 'Not enough ';
                for (var j = 0; j < lackingReactants.length; j++) {
                    lackingList += lackingReactants[j];
                    if (j != lackingReactants.length-1) {
                        lackingList += ', ';
                    }
                }
                $(this).find('p.lacking').html(lackingList + '.');

                $(this).css('box-shadow', '0px 0px');
            } else {
                $(this).find('.run-holder').show();
                $(this).find('.lacking').hide();
                $(this).find('.pathway-run').attr('max-value', pathway.getMaxRuns(pathway.organs[i]));
                
                $(this).css('box-shadow', '0px 0px 5px 2px ' + pathway.color);
            }

            updatePathwayButtons($(this).find('.pathway-run'));
        }
    });
    
}

/**
 * Updates the Pathway run button group, which allows the user to modify the number of times to run a Pathway in a
 *     single turn.
 * This function should be called every time the resource levels are changed, since such changes affect the number of
 *     times a Pathway can be run, and whenever a Pathway run button is pressed.
 * 
 * @param {jQuery} runButton The jQuery HTML element representing the main run button in the button group to be updated.
 */
function updatePathwayButtons(runButton)
{
    var id = runButton.parents('.pathway').attr('value');
    var organ = runButton.parents('.pathway-holder').attr('value');
    var times = runButton.attr('value');
    if (typeof times == 'undefined') {
        times = 1;
    }
    var pathway = getPathway(id);
    if (!pathway || pathway.limit) {
        return;
    }
    var maxRuns = pathway.getMaxRuns(organ);
    var plus   = runButton.siblings('.pathway-plus');
    var minus  = runButton.siblings('.pathway-minus');
    var top    = runButton.siblings('.pathway-top');
    var bottom = runButton.siblings('.pathway-bottom');
    runButton.attr('max-value', maxRuns);

    if (times > maxRuns) {
        times = maxRuns;
    } else if (times < 1) {
        times = 1;
    }

    runButton.attr('value', times);
    runButton.html('Run x' + times);

    if (times >= maxRuns) {
        plus.addClass('disabled');
        top.addClass('disabled');
    } else {
        plus.removeClass('disabled');
        top.removeClass('disabled');
    }

    if (times <= 1) {
        minus.addClass('disabled');
        bottom.addClass('disabled');
    } else {
        minus.removeClass('disabled');
        bottom.removeClass('disabled');
    }
}

/**
 * Updates the eat button group, which allows the user to vary the levels of the nutrient consumed when eating.
 * This function should be called upon initialization to populate the eat buttons and every time an eat button is
 *     pressed.
 * 
 * @param {jQuery} foodHolder The jQuery HTML element representing the container of the eat button group.
 */
function updateEatButtons(foodHolder)
{
    var glc = parseInt(foodHolder.find('.eat#glc').attr('value'));
    var ala = parseInt(foodHolder.find('.eat#ala').attr('value'));
    var fa  = parseInt(foodHolder.find('.eat#fa').attr('value'));

    if (glc == -1) {
        glc = EAT_MAX - ala - fa;
        foodHolder.find('.eat#glc').attr('value', glc);
    }
    if (ala == -1) {
        ala = EAT_MAX - glc - fa;
        foodHolder.find('.eat#ala').attr('value', ala);
    }
    if (fa == -1) {
        fa = EAT_MAX - glc - ala;
        foodHolder.find('.eat#fa').attr('value', fa);
    }

    var full = glc + ala + fa >= EAT_MAX;
    foodHolder.children('.btn-group').each(function() {
        var name = $(this).children('.eat').attr('id');
        var val = 0;
        if (name == 'glc') { name = 'Glc'; val = glc; }
        else if (name == 'ala') { name = 'Ala'; val = ala; }
        else if (name == 'fa') { name = 'FA'; val = fa; }
        var fullName = getResource(name).name;
        $(this).children('.eat').html(fullName + ' x' + val);

        if (full) {
            $(this).children('.eat-plus').addClass('disabled');
            $(this).children('.eat-top').addClass('disabled');
        } else {
            $(this).children('.eat-plus').removeClass('disabled');
            $(this).children('.eat-top').removeClass('disabled');
        }
        if (val <= 0) {
            $(this).children('.eat-minus').addClass('disabled');
            $(this).children('.eat-bottom').addClass('disabled');
        } else {
            $(this).children('.eat-minus').removeClass('disabled');
            $(this).children('.eat-bottom').removeClass('disabled');
        }
    });

    foodHolder.siblings('.run-holder').find('.eat-run').html('Run [' + (glc+ala+fa) + '/' + EAT_MAX + ']')
}

/**
 * Runs the "Eat" pathway with the given nutrient levels.
 * 
 * @param {number} glc The amount of Glucose to be eaten.
 * @param {number} ala The amount of Alanine to be eaten.
 * @param {number} fa The amount of Palmitate (Fatty Acid) to be eaten.
 */
function eat(glc, ala, fa)
{
    var eatTemplate = getPathway('Eat');
    var eat = new Pathway(eatTemplate.id, eatTemplate.name, eatTemplate.points, eatTemplate.limit, eatTemplate.color,
        eatTemplate.catabolic, eatTemplate.organs, [{res:'Glc', val:glc}, {res:'Ala', val:ala}, {res:'FA', val:fa}]);
    eat.run(GLOBAL, 1);
}
