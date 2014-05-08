$(document).ready(function() {
    $('.theme-option').outerWidth(100/$('.theme-option').length + '%');

    $('.theme-option').click(function() {
        setColorTheme($(this).attr('value'), $(this).attr('theme-type'), true);
    });

    $('#tooltip-toggle').children().click(function() {
        setHelpTooltips($(this).attr('value') === 'on');
    });
});