var WELCOME;

$(document).ready(function() {
    WELCOME = $('#welcome');

    WELCOME.find('.header').find('.fa').click(function() {
        $(this).parents('.overlay').fadeOut();
    });
});