$(document).ready(function() {
    $('.result-cover').show().fadeOut(650);

    $('#play-again').click(function() {
        window.location.replace(baseUrl);       // TODO: this doesn't seem to be working as intended
    });
});