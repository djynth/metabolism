var FOOTER;

$(document).ready(function() {
    FOOTER = $('#footer');

    $('#minimize-footer').click(function() {
        toggleFooter();
    });
});

function toggleFooter(open)
{
    if (typeof open === 'undefined') {
        FOOTER.find('.content').slideToggle({
            progress: onResize
        });
    } else {
        if (open) {
            FOOTER.find('.content').slideDown({
                progress: onResize
            });
        } else {
            FOOTER.find('.content').slideUp({
                progress: onResize
            });
        }
    }
}
