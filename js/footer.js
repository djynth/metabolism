var FOOTER;

$(document).ready(function() {
    FOOTER = $('#footer');

    $('#minimize-footer').click(function() {
        FOOTER.find('.content').slideToggle({
            progress: onResize
        });
    });
});
