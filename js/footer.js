$(document).ready(function() {
    $('#minimize-footer').click(function() {
        toggleFooter();
    });
});

function toggleFooter(open)
{
    if (typeof open === 'undefined') {
        open = !(FOOTER.find('.content').height() > 0);
    }

    var h = open ? parseInt(FOOTER.find('.content').css('max-height')) : 0;
    FOOTER.find('.content').animate({
        height: h
    }, {
        progress: onResize
    });
}
