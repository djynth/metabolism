var EAT_MAX = 50;

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

    this.run = function(organ, times) {
        if (!this.hasOrgan(organ)) {
            throw "invalid organ " + organ + " for pathway id " + this.id;
        }

        for (var i = 0; i < this.resources.length; i++) {
            if (getResourceValue(this.resources[i].res, isResourceGlobal(this.resources[i].res) ? GLOBAL : organ) + times*this.resources[i].val < 0) {
                return false;
            }
        }

        for (var i = 0; i < this.resources.length; i++) {
            var res = this.resources[i].res;
            var val = times*this.resources[i].val;
            var actualOrgan = isResourceGlobal(res) ? GLOBAL : organ;
            changeResourceValue(res, actualOrgan, val);
            onResourceChange(getResourceByName(res, actualOrgan), val);
        }

        refreshPathways();

        nextTurn();
        addPoints(times*this.points);

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

    this.getTotalMaxRuns = function(organ) {
        if (this.limit) {
            return 1;
        }

        var max = -1;
        var reactants = this.getReactants();
        for (var i = 0; i < reactants.length; i++) {
            var reactantMax = this.getMaxRuns(reactants[i].res, Math.abs(reactants[i].val), organ);
            if (max == -1 || reactantMax < max) {
                max = reactantMax;
            }
        }
        return max;
    }

    this.isEat = function() {
        return this.name == "Eat";
    }

    this.toHTML = function(resources, organ) {
        var s = '';
        s += '<div class="pathway" value="' + this.id + '">';

        s += '<p class="title">' + this.name + '</p>'
        s += '<p class="catabolic">(' + (this.catabolic ? 'Catabolic' : 'Anabolic') + ')</p>';
        s += '<p class="points">' + this.points + ' points</p>';

        var reactants = this.getReactants();
        var products = this.getProducts();

        if (this.isEat()) {
            var glc = 0;
            var ala = 0;
            var fa = 0;

            for (var i = 0; i < this.resources.length; i++) {
                if (getResourceByName('Glucose').hasName(this.resources[i].res)) {
                    glc = this.resources[i].val;
                } else if (getResourceByName('Alanine').hasName(this.resources[i].res)) {
                    ala = this.resources[i].val;
                } else {
                    fa = this.resources[i].val;
                }
            }

            s += '<div class="food-holder">'

            s += '<div class="btn-group">';
            s += '<button class="btn btn-mini btn-inverse eat-bottom"><i class="icon-chevron-down icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-minus"><i class="icon-minus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat" id="glc" value="' + glc + '"> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-plus disabled"><i class="icon-plus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-top disabled"><i class="icon-chevron-up icon-white"></i> </button>';
            s += '</div>';

            s += '<div class="btn-group">';
            s += '<button class="btn btn-mini btn-inverse eat-bottom"><i class="icon-chevron-down icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-minus"><i class="icon-minus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat" id="ala" value="' + ala + '"> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-plus disabled"><i class="icon-plus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-top disabled"><i class="icon-chevron-up icon-white"></i> </button>';
            s += '</div>';

            s += '<div class="btn-group">';
            s += '<button class="btn btn-mini btn-inverse eat-bottom"><i class="icon-chevron-down icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-minus"><i class="icon-minus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat" id="fa" value="' + fa + '"> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-plus disabled"><i class="icon-plus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse eat-top disabled"><i class="icon-chevron-up icon-white"></i> </button>';
            s += '</div>';

            s += '</div>';
        } else {
            s += '<table class="reaction">';

            for (var i = 0; i < Math.max(reactants.length, products.length); i++) {
                s += '<tr>';

                s += '<td class="reactant"';
                if (i < reactants.length) {
                    s += ' value="' + reactants[i].res + '"';
                }
                s += '>';
                if (i < reactants.length && isResourceGlobal(reactants[i].res)) {
                    s += '<strong>';
                }
                if (i < reactants.length) {
                    s += getResourceByName(reactants[i].res).name + '\t' + reactants[i].val;
                }
                if (i < reactants.length && isResourceGlobal(reactants[i].res)) {
                    s += '</strong>';
                }
                s += '</td>';

                s += '<td class="product"';
                s += '>';
                if (i < products.length && isResourceGlobal(products[i].res)) {
                    s += '<strong>';
                }
                if (i < products.length) {
                    s += products[i].val + '\t' + getResourceByName(products[i].res).name;
                }
                if (i < products.length && isResourceGlobal(products[i].res)) {
                    s += '</strong>';
                }
                s += '</td>';

                s += '</tr>';
            }

            s += '</table>';
        }

        var actual_limit = this.limit;
        var lacking = null;
        for (var i = 0; i < reactants.length; i++) {
            var max_runs = this.getMaxRuns(reactants[i].res, Math.abs(reactants[i].val), organ)

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
        s += '<div class="btn-group run-holder">';
        if (this.limit) {
            s += '<button class="btn btn-mini btn-inverse ' + (this.isEat() ? 'eat-run' : 'pathway-run') + '" value="1">Run</button>';
        } else {
            s += '<button class="btn btn-mini btn-inverse pathway-bottom disabled"><i class="icon-chevron-down icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse pathway-minus disabled"><i class="icon-minus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse pathway-run" value="1" min-value="1" max-value="1">Run x1</button>';
            s += '<button class="btn btn-mini btn-inverse pathway-plus" ><i class="icon-plus icon-white"></i> </button>';
            s += '<button class="btn btn-mini btn-inverse pathway-top"><i class="icon-chevron-up icon-white"></i> </button>';
        }
        
        s += '</div>';

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
    $('.pathway[value="' + pathway.id + '"]').each(function() {
        var lackingReactants = new Array();
        var reactants = pathway.getReactants();
        for (var i = 0; i < reactants.length; i++) {
            var reactantLimit = pathway.getMaxRuns(reactants[i].res, Math.abs(reactants[i].val), organ);
            var isLacking = reactantLimit <= 0;
            if (isLacking) {
                $(this).find('.reactant').filter(function() { return getResourceByName(reactants[i].res).hasName($(this).attr('value')); }).addClass('lacking');
                lackingReactants.push(getResourceByName(reactants[i].res).name)
            } else {
                $(this).find('.reactant').filter(function() { return getResourceByName(reactants[i].res).hasName($(this).attr('value')); }).removeClass('lacking');
            }
        }

        if (lackingReactants.length > 0) {
            $(this).find('.run-holder').hide();
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

            $(this).css('box-shadow', '0px 0px');
        } else {
            $(this).find('.run-holder').show();
            $(this).find('.lacking').hide();
            $(this).find('.pathway-run').attr('max-value', pathway.getTotalMaxRuns(organ));
            
            $(this).css('box-shadow', '0px 0px 5px 2px ' + pathway.color);
        }

        updatePathwayButtons($(this).find('.pathway-run'));
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
