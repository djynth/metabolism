var BRAIN  = "brain";
var MUSCLE = "muscle";
var LIVER  = "liver";
var GLOBAL = "global";

var TURNS = 50;
var turn = TURNS+1;
var points = 0;

$(document).ready(function() {
    loadData();

    setPoints(points);
    nextTurn();

    populateResources();
    populatePathways();
    selectOrgan(BRAIN);

    $(window).resize(function() { $('.scrollbar-content').each(function() { updateScrollbar($(this)); }); });

    $('.organ-title').click(function() {
        selectOrgan($(this).attr('value'));
    });

    $('.pathway-run').click(function() {
        var id = $(this).parents('.pathway').attr('value');
        var organ = $(this).parents('.pathway-holder').attr('value');
        var times = $(this).attr('value');
        getPathway(id).run(organ, times);

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
        var resource = getResource($(this).find('.resource-name').html());
        if (resource.imageFilename != 'none') {
            $('#resource-visual').append('<img name="' + resource.name + '" src="' + resource.imageFilename + '" alt="' + resource.name + 
                '" class="image-content hidden">');

            setTimeout(function() {
                $('#resource-visual img[name="' + resource.name + '"]').fadeIn(250);
            }, 300);  
        }
    });

    $('.resource-data').mouseleave(function() {
        var resource = getResource($(this).find('.resource-name').html());
        if (resource.imageFilename != 'none') {
            $('#resource-visual img[name="' + resource.name + '"]').fadeOut(100, function() {
                $(this).remove();
            });
        }
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
            $('#cell-canvas').addClass(organ);
        } else {                                    // unselect this tab
            $(this).removeClass('active');
            $(this).children('.cover').hide();
            $('.pathway-holder[value="'  + $(this).attr('value') + '"]').hide();
            $('.resource-holder[value="' + $(this).attr('value') + '"]').hide();
            $('#cell-canvas').removeClass($(this).attr('value'));
        }
    });
}

function loadData()
{
    $.ajax({
        url: "../resources.txt",
        dataType: "text",
        async: false,
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
    });
            
    $.ajax({
        url: "../pathways.txt",
        dataType: "text",
        async: false,
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
    });
}
