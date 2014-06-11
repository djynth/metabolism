var RESULTS;

$(document).ready(function() {
    RESULTS = $('#results');
});

function onGameOver(data)
{
    RESULTS.parent().fadeIn();
}