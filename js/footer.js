$(document).ready(function() {
    $('#footer-minimize').click(function() {
        $('#footer-content').slideToggle({
            progress: onResize
        });
    });
});