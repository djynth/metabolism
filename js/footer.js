$(document).ready(function() {
    $('#minimize-footer').click(function() {
        $(this).siblings('.content').slideToggle({
            progress: onResize
        });
    });
});
