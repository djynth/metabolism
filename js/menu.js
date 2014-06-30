var MENU;

$(document).ready(function() {
    MENU = $('#menu');

    MENU.find('.tab').click(function() {
        if (!$(this).hasClass('active')) {
            MENU.find('.tab.active').removeClass('active');
            MENU.find('.content.active').removeClass('active');

            $(this).addClass('active');
            MENU.find('.content.' + $(this).attr('for')).addClass('active');
        }
    });

    MENU.find('.theme').find('.select').click(function() {
        var theme = $(this).parents('.theme');
        setColorTheme(theme.attr('theme'), theme.attr('type'), true);
    });

    MENU.find('.form').find('input[type=text], input[type=password]')
        .focusin(function() {
            $(this).parents('.form').find('.form-info')
                .addClass('active')
                .html($(this).attr('info'));
        })
        .focusout(function() {
            $(this).parents('.form').find('.form-info')
                .removeClass('active')
                .html('');
        });
});