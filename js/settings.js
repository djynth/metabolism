$(document).ready(function() {
    $('.theme').click(function() {
        setColorTheme($(this).attr('theme'), $(this).attr('type'), true);
    });
});