var resources;

$(document).ready(function() {
    $(window).resize(onResize);

    $('button.btn, input[type=button].btn').click(function() {
        $(this).blur();
    });

    $('.btn-group.checkbox').find('.btn').click(function() {
        $(this).toggleClass('active');
    });

    $('.btn-group.radio').find('.btn').click(function() {
        $(this).siblings('.btn').removeClass('active');
        $(this).addClass('active');
    });

    $('.btn.toggle').click(function() {
        $(this).toggleClass('active');
    });

    $('button.btn, input[type=button].btn').keydown(function(e) {
        if (e.which === 32) {       // space
            $(this).click();
            $(this).focus();
            e.stopPropagation();
            e.preventDefault();
        }

        if (e.which === 27) {       // esc
            $(this).blur();
            e.stopPropagation();
        }
    });

    $('input[type=text], input[type=password], input[type=email]')
        .focusin(function() {
            $(this).siblings('.add-on').addClass('focus');
        })
        .focusout(function() {
            $(this).siblings('.add-on').removeClass('focus');
        })
        .keydown(function(e) {
            e.stopPropagation();

            if (e.which === 13 || e.which === 27) {     // enter or esc
                $(this).blur();
            }
        });

    $('.add-on.right')
        .each(function() {
            $(this).nextAll('.add-on.right').css(
                'right',
                parseInt($(this).css('right')) + $(this).outerWidth()
            );
        })
        .hover(
            function() {
                var elem = $(this);
                $(this).data('timeout', setTimeout(function() {
                    elem.velocity({ width: elem.css('max-width') }, {
                        progress: function() {
                            $(this).nextAll('.add-on.right').css(
                                'right',
                                parseInt($(this).css('right')) + $(this).outerWidth()
                            );
                        }
                    });
                    elem.find('*').fadeIn();
                }, 250));
            },
            function() {
                clearTimeout($(this).data('timeout'));
                $(this).velocity({ width: $(this).css('min-width') }, {
                        progress: function() {
                            $(this).nextAll('.add-on.right').css(
                                'right',
                                parseInt($(this).css('right')) + $(this).outerWidth()
                            );
                        }
                    });
                $(this).find('*:not(i)').fadeOut();
            }
        );

    $('a.interior').click(function(e) {
        e.preventDefault();

        var href = $(this).attr('href');
        switch(href)
        {
            case 'about':
            case 'account':
            case 'data':
            case 'new-game':
            case 'settings':
            case 'tutorial':
                MENU.show().find('.tab[for=' + href + ']').click();
                break;
        }
    })
});

function onResize()
{
    var contentHeight = 
        $(window).height() - HEADER.outerHeight() - FOOTER.outerHeight();
    CONTENT_AREA.height(contentHeight);

    var pathwaysContentHeight = contentHeight;
    $('.pathways-header').each(function() {
        pathwaysContentHeight -= $(this).outerHeight(true);
    });
    $('.pathways').each(function() {
        $(this).css('max-height', pathwaysContentHeight);
        if ($(this).hasClass('active')) {
            $(this).height(pathwaysContentHeight);
        }
    });

    var vert = _RESOURCE_SIZES.vertical;
    var hori = _RESOURCE_SIZES.horizontal;
    contentHeight -= $('.resources-header').totalHeight();
    vert.activeHeight = contentHeight - ($('.resources').length-1)*vert.compactHeight - vert.amount - vert.points;
    hori.activeHeight = contentHeight - ($('.resources').length-1)*hori.compactHeight;
    hori.activeWidth = $('.resources').width() - hori.amount - hori.points;
    hori.compactWidth = $('.resources').width();

    resizeResources($('.resources.active'), false);

    FILTER.find('input[type=text]').each(function() {
        $(this).outerWidth($(this).parent().width());
    });

    PATHWAYS.find('.food').each(function() {
        var eatWidth = $(this).outerWidth();
        $(this).children().first().children(':not(.eat)').each(function() {
            eatWidth -= $(this).outerWidth();
        });

        $(this).find('.eat').outerWidth(eatWidth);
    });
}

function toggleSidebar(sidebar, show)
{
    var icon = $('.sidebar-title.' + sidebar).find('.fa');
    if (sidebar === 'left') {
        CONTENT_AREA.toggleClass('left-shown', show);
        TRACKER.toggleClass('left-shown', show);
        if (show) {
            icon.addClass('fa-toggle-left').removeClass('fa-toggle-right');
        } else {
            icon.addClass('fa-toggle-right').removeClass('fa-toggle-left');
        }
    }
    if (sidebar === 'right') {
        CONTENT_AREA.toggleClass('right-shown', show);
        TRACKER.toggleClass('right-shown', show);
        if (show) {
            icon.addClass('fa-toggle-right').removeClass('fa-toggle-left');
        } else {
            icon.addClass('fa-toggle-left').removeClass('fa-toggle-right');
        }
    }
}

function newGame(mode, challenge)
{
    $.ajax({
        url: '/index.php/site/newGame',
        type: 'POST',
        dataType: 'json',
        data: {
            mode: mode,
            challenge_id: challenge,
        },
        success: function(data) {
            DIAGRAM.css(
                'background-image',
                'url(\'img/diagrams/diagram' + data.challenge_id + '.png\')'
            );

            $.when(
                MENU.fadeOut(),
                $('#open-menu').find('.cover').fadeOut(),
                toggleFooter(true),
                toggleSidebar('left', true),
                toggleSidebar('right', true)
            ).done(function() {
                onTurn(data);
            });
        }
    });
}

function onTurn(data)
{
    setTurn(data.turn, data.max_turns);
    setPoints(data.score);

    resources = new Array();
    for (resource in data.resources) {
        resources[resource] = new Object();
        resources[resource].amounts = new Array();
        for (organ in data.resources[resource]) {
            var amount = data.resources[resource][organ];
            resources[resource].amounts[organ] = amount;
        }
    }

    if (typeof data.limits !== 'undefined') {
        for (resource in data.resources) {
            resources[resource].limit = data.limits[resource];
        }
    }

    refreshPathways(
        refreshResources(typeof data.limits !== 'undefined'),
        data.restrictions
    );

    refreshState(data.passive_pathways);
    refreshTrackers();

    if (isFilterActive()) {
        onFilterChange();    
    }

    TRACKER.find('.actions').find('.organ').each(function() {
        $(this).find('.amount').text(data.action_counts[$(this).organ()]);
    });

    RESOURCES.each(function() {
        resizeResource($(this), 350);
    })

    if (data.completed) {
        setTimeout(function() {
            onGameOver(data);
        }, 1500);
    }
}

function setTurn(turn, maxTurns)
{
    if (maxTurns == -1) {
        TURNS.text(turn + ' Turns');
    } else {
        TURNS.text((maxTurns - turn) + '/' + maxTurns + ' Turns');
    }
}

function setPoints(points)
{
    POINTS.text(points + ' Points');
}

function getUsername()
{
    return $('#account-info').attr('username');
}

function getColorTheme()
{
    return {
        theme : BODY.attr('theme'),
        type  : BODY.attr('type')
    };
}

function setColorTheme(theme, type, save)
{
    BODY.attr({ theme : theme, type : type }).applyColorTheme(theme, type);

    if (save) {
        $.ajax({
            url: '/index.php/user/saveTheme',
            type: 'POST',
            dataType: 'json',
            data: {
                theme: theme,
                type: type
            }
        });
    }
}

jQuery.fn.extend({
    res: function(res) {
        if (typeof res !== 'undefined') {
            return this.attr('res', res);
        }
        return parseInt(this.attr('res'));
    },

    organ: function(organ) {
        if (typeof organ !== 'undefined') {
            return this.attr('organ', organ);
        }
        return parseInt(this.attr('organ'));
    },

    pathway: function(pathway) {
        if (typeof pathway !== 'undefined') {
            return this.attr('pathway', pathway);
        }
        return parseInt(this.attr('pathway'));
    },

    formSiblings: function(selector) {
        return this.parents('form').find(selector);
    },

    applyColorTheme: function(theme, type) {
        this.find('.organ-popup').each(function() {
            $(this).find('.image').attr(
                'src',
                '/img/organs/' + type + '/' + $(this).organ() + '.png'
            );
        });

        TRACKER.find('.icon').each(function() {
            updateIcon($(this));
        })

        updateResourceVisualImage();

        return this;
    },

    totalHeight: function() {
        var h = 0;
        this.each(function() {
            h += $(this).outerHeight();
        });
        return h;
    },

    totalWidth: function() {
        var w = 0;
        this.each(function() {
            w += $(this).outerWidth();
        });
        return w;
    }
});
