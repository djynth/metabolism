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

    this.hasOrgan = function(organ) {
        for (var i = 0; i < organs.length; i++) {
            if (organs[i] == organ) {
                return true;
            }
        }
        return false;
    }

    this.run = function(organ) {
        if (!this.hasOrgan(organ)) {
            throw "invalid organ " + organ + " for pathway id " + this.id;
        }

        for (var i = 0; i < this.resources.length; i++) {
            if (getResourceValue(this.resources[i].res, isResourceGlobal(this.resources[i].res) ? GLOBAL : organ) + this.resources[i].val < 0) {
                return false;
            }
        }

        for (var i = 0; i < this.resources.length; i++) {
            var res = this.resources[i].res;
            var val = this.resources[i].val;
            var actualOrgan = isResourceGlobal(res) ? GLOBAL : organ;
            changeResourceValue(res, actualOrgan, val);
            onResourceChange(getResourceByName(res, actualOrgan), val);
        }

        refreshPathways();

        nextTurn();
        addPoints(this.points);

        return true;
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

    this.getMaxRuns = function(resource, value, organ) {
        return Math.floor(getResourceValue(resource, (isResourceGlobal(resource) ? GLOBAL : organ), resources)/value);
    }

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
                lackingReactants.push(getResourceByName(reactants[i].res).name)
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
