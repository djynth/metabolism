$(document).ready(function() {
    $('#limited-resources').find('.organ-header').click(function() {
        $(this).siblings('[organ="' + $(this).attr('organ') + '"]').toggle();
    });
});

function updateLimitedResources()
{
    // TODO
}
