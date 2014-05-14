var WELCOME;

$(document).ready(function() {
    WELCOME = $('#welcome');

    WELCOME.find('.header').find('.icon-remove').click(function() {
        $(this).parents('.overlay').fadeOut();
    });
});