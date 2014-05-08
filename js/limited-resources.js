$(document).ready(function() {
    updateLimitedResources($('#point-dropdown').children());

    $('.game-state-header').click(function() {
        $('#point-dropdown').slideToggle();
    });
});

function updateLimitedResources(limitedResources)
{
    var dropdown = $('#point-dropdown');

    dropdown.find('.organ-header').each(function() {
        var organ = $(this).attr('organ');
        var minimized = $(this).hasClass('minimized');
        limitedResources.find('.organ-header[organ="' + organ + '"]')
            .toggleClass('minimized', minimized)
            .siblings('[organ="' + organ + '"]').toggle(!minimized);
    });

    dropdown.empty().append(limitedResources);
    dropdown.find('.organ-header').click(function() {
        $(this).siblings('[organ="' + $(this).attr('organ') + '"]').toggle();
        $(this).toggleClass('minimized');
    });
    addResourceInfoSources(dropdown);
}
