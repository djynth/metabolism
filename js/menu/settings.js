var shortcuts;

$(document).ready(function() {
    $(window).keydown(function(e) {
        if (codeToName(e.which) === false) {
            return;
        }

        var activeBindings = SETTINGS.find('.current.binding.active:visible');
        console.log(activeBindings);
        if (activeBindings.length) {
            setShortcut(
                activeBindings.parents('.keybind').attr('action'),
                e.which
            );
            activeBindings.click();
        } else {
            switch (shortcuts[e.which])
            {
                case 'toggle_menu':
                    toggleMenu();
                    break;
            }
        }
    });

    SETTINGS.find('.header').find('.collapse').click(function() {
        var content = $(this).parents('.header').next();

        if (content.is(':visible')) {
            $(this).text('Expand');
        } else {
            $(this).text('Collapse');
        }

        content.slideToggle();
    });

    SETTINGS.find('.theme').find('.select').click(function() {
        var theme = $(this).parents('.theme');
        setColorTheme(theme.attr('theme'), theme.attr('type'), true);
    });

    SETTINGS.find('.header').find('.revert-all').click(function() {
        SETTINGS.find('.keybind').each(function() {
            var defaultKey = $(this).find('.default.binding').attr('key');
            setShortcut($(this).attr('action'), defaultKey);
        });
    });

    SETTINGS.find('.binding').click(function() {
        var action = $(this).parents('.keybind').attr('action');
        if ($(this).hasClass('default')) {
            setShortcut(action, $(this).attr('key'));
        }
        if ($(this).hasClass('current')) {
            SETTINGS.find('.keybind[action!=' + action + ']').find('.binding.current').each(function() {
                $(this).toggleClass('active', false);
                $(this).find('.focus').toggle(false);
            });

            $(this).toggleClass('active');
            $(this).find('.focus').toggle();
        }
    });
});

function setKeyboardShortcuts(keyboardShortcuts)
{
    shortcuts = new Array();

    SETTINGS.find('.keybind').each(function() {
        var action = $(this).attr('action');
        var currentKey = keyboardShortcuts[action]['current'];
        var defaultKey = keyboardShortcuts[action]['default'];
        currentKey = currentKey === null ? -1 : currentKey;
        defaultKey = defaultKey === null ? -1 : defaultKey;
        $(this).find('.default.binding')
            .attr('key', defaultKey)
            .find('.key').text(codeToName(defaultKey));
        setShortcut(action, currentKey);
    });
}

function setShortcut(action, key)
{
    SETTINGS.find('.keybind[action=' + action + ']').each(function() {
        $(this).find('.current.binding')
            .attr('key', key)
            .find('.key').text(codeToName(key));
        $(this).find('.default.binding').each(function() {
            $(this).toggleClass('disabled', key == $(this).attr('key'));
        })
    });

    if (key === -1) {
        delete shortcuts[key];
    } else {
        SETTINGS.find('.keybind[action!=' + action + ']').find('.current.binding[key=' + key + ']').each(function() {
            setShortcut($(this).parents('.keybind').attr('action'), -1);
        });

        shortcuts[key] = action;
    }
}

function codeToName(code)
{
    if (48 <= code && code <= 90) {    // alphanumeric
        return String.fromCharCode(code);
    }

    switch(parseInt(code))
    {
        case -1:
            return 'NONE';
        case 32:
            return 'SPACE';
        case 13:
            return 'ENTER';
        case 27:
            return 'ESC';
        case 35:
            return 'END';
        case 36:
            return 'HOME';
        case 45:
            return 'INSERT';
        case 46:
            return 'DELETE';
        case 33:
            return 'PAGE UP';
        case 34:
            return 'PAGE DOWN';
        case 37:
            return 'LEFT';
        case 38:
            return 'UP';
        case 39:
            return 'DOWN';
        case 40:
            return 'RIGHT';
        case 8:
            return 'BACKSPACE';
        case 189:
            return '-';
        case 187:
            return '+';
        case 219:
            return ']';
        case 221:
            return ']';
        case 220:
            return '\\';
        case 186:
            return ';';
        case 222:
            return '\'';
        case 188:
            return '<';
        case 190:
            return '>';
        case 191:
            return '/';
        default:
            return false;
    }
}
