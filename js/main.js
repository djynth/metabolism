var BRAIN  = "brain";       // a tag representing the brain organ
var MUSCLE = "muscle";      // a tag representing the muscle organ
var LIVER  = "liver";       // a tag representing the liver organ
var GLOBAL = "global";      // a tag representing the global organ: pathways and resources that are not constrained to one specific area in the body

var TURNS = 50;             // the maximum numer of turns
var turn = TURNS+1;         // the current turn (starts at TURNS and decreases)
var points = 0;             // the current number of points accumulated
var resources = [];         // an array holding the current resource states
var pathways = [];          // an array holding all possible pathways

loadData();
setPoints(points);
nextTurn();

$(document).ready(function() {
    

    $(window).resize(function() { $('.scrollbar-content').each(function() { updateScrollbar($(this)); }); });

    $('.organ-title').click(function() {
        selectOrgan($(this).attr('value'));
    });
});

/**
 * Updates the scrollbar held by the given element.
 * If the given element does not have a scrollbar, one is created for it, otherwise its height is updated.
 * Thus, this function should be called whenever the window is resized or the contents of a scrollbar holder are changed.
 * 
 * @param  {jQuery} elem the scrollbar container to be updated
 */
function updateScrollbar(elem)
{
    elem.css('height', ($(window).height() - elem.offset().top - parseInt(elem.css('padding-top')) - parseInt(elem.css('padding-bottom'))) + 'px');

    if (elem.attr('scrollbar') != 'true') {
        elem.mCustomScrollbar({
            autoHideScrollbar: true,
            scrollInertia: 350,
            theme: "dark",
        });
        elem.attr('scrollbar', 'true')
    } else {
        elem.mCustomScrollbar('update');
    }
}

/**
 * Moves to the next turn by decreasing the current turn by one and updating the turn counter element.
 *
 * @return {Number} the current turn
 */
function nextTurn() {
    turn--;
    $('#turns').html(turn + '/' + TURNS + ' Turns Remaining');
    return turn;
}

/**
 * Sets the user's total score to the given value and updates the point counter element.
 * 
 * @param {Number} pts the user's point total
 */
function setPoints(pts) {
    points = pts;
    $('#points').html(points + ' Points');
}

/**
 * Selects the given organ by highlighting its tab and showing its pathways and resources while hidding all other organs.
 * 
 * @param  {String} organ the organ to be shown to the user
 */
function selectOrgan(organ) {
    $('.organ-title').each(function() {
        if ($(this).attr('value') == GLOBAL) {
            return;
        }
        if ($(this).attr('value') == organ) {       // select this tab
            $(this).addClass('active');
            $(this).children('.cover').show();
            updateScrollbar($('.pathway-holder[value="'  + $(this).attr('value') + '"]').show());
            updateScrollbar($('.resource-holder[value="' + $(this).attr('value') + '"]').show());
        } else {                                    // unselect this tab
            $(this).removeClass('active');
            $(this).children('.cover').hide();
            $('.pathway-holder[value="'  + $(this).attr('value') + '"]').hide();
            $('.resource-holder[value="' + $(this).attr('value') + '"]').hide();
        }
    });
}

/**
 * Populates the pathway sidebar with all pathways and refreshes them.
 * This function should only be called once to initialize the pathway sidebar.
 */
function populatePathways() {
    var organs = [GLOBAL, BRAIN, MUSCLE, LIVER];
    for (var i = 0; i < organs.length; i++) {
        var pathways = getPathways(organs[i]);
        for (var j = 0; j < pathways.length; j++) {
            $('.pathway-holder[value="' + organs[i] + '"]').append(pathways[j].toHTML(resources, organs[i]));
        }
    }
    refreshPathways();
}

/**
 * Populates the resource sidebar with the current resource levels.
 */
function populateResources() {
    for (var i = 0; i < resources.length; i++) {
        var res = resources[i];

        $('.resource-holder[value="' + res.organ + '"]').append('<div class="resource-data" title="' + res.name + '">' + 
            '<div class="progress">' +
            '<span class="resource-name">' + res.abbr + '</span>' +
            '<span class="resource-value">' + res.value + '</span>' + 
            '<div class="bar" style="width: ' + Math.min(100, 100*(res.value/res.max_value)) + '%;"></div>' + 
            '</div></div>');
    }

    $('.resource-data').tooltip({ delay: { show: 500, hide: 100 } });
}

/**
 * This function ought to be invoked whenver a resource level is modified by any means.
 * The resource value shown to the user is updated and the resource container is highlighted to show the user that the level has been modified.
 * 
 * @param  {Resource} resource the resource that has been changed
 * @param  {Number} change     the amount by which the given resource has changed
 *
 * TODO: use resource.value rather than a separate variable
 */
function onResourceChange(resource, change) {
    var color = change > 0 ? "72, 144, 229" : "232, 12, 15";
    var elem = $('.resource-data').filter(function() {
        if($(this).parent().attr('value') != resource.organ) {
            return false;
        }
        var isCorrectResource = false;
        $(this).find('.resource-name').each(function() {
            if (resource.hasName($(this).html())) {
                isCorrectResource = true;
            }
        });
        return isCorrectResource;
    });
    elem.animate({ boxShadow : "0 0 5px 5px rgb("+color+")" }, 250, function() {
        elem.animate({ boxShadow : "0 0 5px 5px rgba("+color+", 0)" }, 250);
    });
    elem.find('.resource-value').html(resource.value);
    elem.find('.bar').css('width', Math.min(100, 100*(resource.value/resource.max_value)) + '%')
}

function loadData()
{
    $.ajax({
        url: "../assets/resources.txt",
        dataType: "text",
    }).done(function(data) {
        var lines = data.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line || line.charAt(0) == '#') {
                continue;
            }
            var d = line.split(/\s{1,}/);
            
            for (var j = 0; j < d.length; j++) {
                d[j] = d[j].replace(/_/g, ' ');
            }

            d[0] = parseInt(d[0]);  // parse ID
            d[4] = parseInt(d[4]);  // parse starting value
            d[5] = parseInt(d[5]);  // parse max value
            if (d[6] == 'true') {   // resource is global
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], GLOBAL, d[7]));
            } else {                // resource is not global
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], BRAIN,  d[7]));
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], MUSCLE, d[7]));
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], LIVER,  d[7]));
            }
        }
    }).fail(function() {
        alert('failed to load resources');          // TODO
    }).always(function() {
            $.ajax({
            url: "../assets/pathways.txt",
            dataType: "text",
        }).done(function(data) {
            var lines = data.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (!line || line.charAt(0) == '#') {
                    continue;
                }
                var d = line.split(/\s{1,}/);
                
                for (var j = 0; j < d.length; j++) {
                    d[j] = d[j].replace(/_/g, ' ');
                }

                d[0] = parseInt(d[0]);  // parse ID
                d[2] = parseInt(d[2]);  // parse points
                d[3] = d[3] == 'true';  // parse limit
                d[5] = d[5] == 'true';  // parse catabolic
                d[6] = d[6].split(','); // parse organs
                d[7] = d[7].split(',');
                for (var j = 0; j < d[7].length; j++) {
                    e = d[7][j].split(':');
                    d[7][j] = {res: e[0], val: parseInt(e[1])};
                }
                pathways.push(new Pathway(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7]));
            }
        }).fail(function() {
            alert('failed to load pathways');          // TODO
        }).always(function() {
            populateResources();
            populatePathways();
            selectOrgan(BRAIN);

            $('.run-pathway').click(function() {
                var id = $(this).parents('.pathway').attr('value');
                var organ = $(this).parents('.pathway-holder').attr('value');
                var pathway = getPathwayById(id);
                pathway.run(organ);
            });
        });
    });

    
}