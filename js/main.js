var BRAIN  = "brain";
var MUSCLE = "muscle";
var LIVER  = "liver";
var GLOBAL = "global";

var TURNS = 50;
var turn = TURNS+1;
var points = 0;
var resources = [];
var pathways = [];

loadData();

$(document).ready(function() {
    setPoints(points);
    nextTurn();

    $(window).resize(function() { $('.scrollbar-content').each(function() { updateScrollbar($(this)); }); });

    $('.organ-title').click(function() {
        selectOrgan($(this).attr('value'));
    });
});

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

function nextTurn() {
    turn--;
    $('#turns').html(turn + '/' + TURNS + ' Turns Remaining');
    return turn;
}

function addPoints(pts) {
    setPoints(points + pts);
}

function setPoints(pts) {
    points = pts;
    $('#points').html(points + ' Points');
}

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

function populateResources() {
    for (var i = 0; i < resources.length; i++) {
        var res = resources[i];

        $('.resource-holder[value="' + res.organ + '"]').append('<div class="resource-data">' + 
            '<div class="progress">' +
            '<span class="resource-name">' + res.name + '</span>' +
            '<span class="resource-value">' + res.value + '</span>' + 
            '<div class="bar" style="width: ' + Math.min(100, 100*(res.value/res.max_value)) + '%;"></div>' + 
            '</div></div>');
    }
}

function onResourceChange(resource, change) {
    if (change == 0) {
        return;
    }
    var color = change > 0 ? "72, 144, 229" : "232, 12, 15";
    var elem = $('.resource-data').filter(function() {
        return resource.hasName($(this).find('.resource-name').html()) && resource.organ == $(this).parents('.resource-holder').attr('value');
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
        url: "../resources.txt",
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
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], GLOBAL, d[7], d[8]));
            } else {                // resource is not global
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], BRAIN,  d[7], d[8]));
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], MUSCLE, d[7], d[8]));
                resources.push(new Resource(d[0], d[1], d[2], d[3], d[4], d[5], LIVER,  d[7], d[8]));
            }
        }
    }).fail(function() {
        alert('Error\nFailed to load resource data!');          // TODO
    }).always(function() {
            $.ajax({
            url: "../pathways.txt",
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
            alert('Error\nFailed to load pathway data!');          // TODO
        }).always(function() {
            populateResources();
            populatePathways();
            selectOrgan(BRAIN);

            updateEatButtons($('.food-holder'));

            $('.pathway-run').click(function() {
                var id = $(this).parents('.pathway').attr('value');
                var organ = $(this).parents('.pathway-holder').attr('value');
                var times = $(this).attr('value');
                getPathwayById(id).run(organ, times);

                updatePathwayButtons($(this));
            });

            $('.pathway-plus').click(function() {
                if (!$(this).hasClass('disabled')) {
                    var times = parseInt($(this).siblings('.pathway-run').attr('value')) + 1;
                    $(this).siblings('.pathway-run').attr('value', times);
                    updatePathwayButtons($(this).siblings('.pathway-run'));
                }
            });

            $('.pathway-minus').click(function() {
                if (!$(this).hasClass('disabled')) {
                    var times = parseInt($(this).siblings('.pathway-run').attr('value')) - 1;
                    $(this).siblings('.pathway-run').attr('value', times);
                    updatePathwayButtons($(this).siblings('.pathway-run'));
                }
            });

            $('.pathway-top').click(function() {
                if (!$(this).hasClass('disabled')) {
                    var times = parseInt($(this).siblings('.pathway-run').attr('max-value'));
                    $(this).siblings('.pathway-run').attr('value', times);
                    updatePathwayButtons($(this).siblings('.pathway-run'));
                }
            });

            $('.pathway-bottom').click(function() {
                if (!$(this).hasClass('disabled')) {
                    var times = parseInt($(this).siblings('.pathway-run').attr('min-value'));
                    $(this).siblings('.pathway-run').attr('value', times);
                    updatePathwayButtons($(this).siblings('.pathway-run'));
                }
            });

            $('.eat-run').click(function() {
                var foodHolder = $(this).parent().siblings('.food-holder');
                var glc = parseInt(foodHolder.find('#glc').attr('value'));
                var ala = parseInt(foodHolder.find('#ala').attr('value'));
                var fa  = parseInt(foodHolder.find('#fa').attr('value'));

                if (glc + ala + fa < EAT_MAX) {
                    $('#modal-header').html('Are You Sure?');
                    $('#modal-content').html('You are eating less than you could! Your total nutrient intake of ' + (glc+ala+fa) + ' is less than the maximum of ' + EAT_MAX);
                    $('#modal-cancel').click(function() {
                        $('.modal').modal('hide');
                    });
                    $('#modal-confirm').click(function() {
                        $('.modal').modal('hide');
                        eat(glc, ala, fa);
                    });
                    $('.modal').modal('show');
                } else {
                    eat(glc, ala, fa);
                }
            });

            $('.eat-plus').click(function() {
                if (!$(this).hasClass('disabled')) {
                    $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) + 1);
                    updateEatButtons($(this).parents('.food-holder'));
                }
            });

            $('.eat-minus').click(function() {
                if (!$(this).hasClass('disabled')) {
                    $(this).siblings('.eat').attr('value', parseInt($(this).siblings('.eat').attr('value')) - 1);
                    updateEatButtons($(this).parents('.food-holder'));
                }
            });

            $('.eat-top').click(function() {
                if (!$(this).hasClass('disabled')) {
                    $(this).siblings('.eat').attr('value', -1);
                    updateEatButtons($(this).parents('.food-holder'));
                }
            });

            $('.eat-bottom').click(function() {
                if (!$(this).hasClass('disabled')) {
                    $(this).siblings('.eat').attr('value', 0);
                    updateEatButtons($(this).parents('.food-holder'));
                }
            });

            $('.resource-data').mouseenter(function() {
                var resource = getResourceByName($(this).find('.resource-name').html());
                if (resource.imageFilename != 'none') {
                    $('#resource-visual').append('<img name="' + resource.name + '" src="' + resource.imageFilename + '" alt="' + resource.name + 
                        '" class="image-content hidden">');

                    setTimeout(function() {
                        $('#resource-visual img[name="' + resource.name + '"]').fadeIn(250);
                    }, 300);  
                }
            });

            $('.resource-data').mouseleave(function() {
                var resource = getResourceByName($(this).find('.resource-name').html());
                if (resource.imageFilename != 'none') {
                    $('#resource-visual img[name="' + resource.name + '"]').fadeOut(100, function() {
                        $(this).remove();
                    });
                }
            });            
        });
    });
}

function updatePathwayButtons(runButton)
{
    var id = runButton.parents('.pathway').attr('value');
    var organ = runButton.parents('.pathway-holder').attr('value');
    var times = runButton.attr('value');
    var pathway = getPathwayById(id);
    if (!pathway || pathway.limit) {
        return;
    }
    var maxRuns = pathway.getTotalMaxRuns(organ);
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
        var fullName = getResourceByName(name).name;
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

function eat(glc, ala, fa)
{
    var eatTemplate = getPathwayByName('Eat');
    var eat = new Pathway(eatTemplate.id, eatTemplate.name, eatTemplate.points, eatTemplate.limit, eatTemplate.color,
        eatTemplate.catabolic, eatTemplate.organs, [{res:'Glc', val:glc}, {res:'Ala', val:ala}, {res:'FA', val:fa}]);
    eat.run(GLOBAL, 1);
}