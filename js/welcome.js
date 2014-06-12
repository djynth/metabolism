var WELCOME;

$(document).ready(function() {
    WELCOME = $('#welcome');

    WELCOME.find('#option-new-game').click(function() {
        $('.overlay').fadeOut();
        newGame();
    });
});