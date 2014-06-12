var RESULTS;

$(document).ready(function() {
    RESULTS = $('#results');

    RESULTS.find('.play-again').click(function() {
        RESULTS.parent().fadeOut();
        newGame();
    });
});

function onGameOver(data)
{
    RESULTS.parent().fadeIn();
    RESULTS.find('.points').html('Points: ' + data.score);
    RESULTS.find('.turn').html('Turn: ' + data.turn);
}