function updateLimitedResources(limitedResources)
{
    $('#point-dropdown')
        .find('.organ-header')
            .each(function() {
                var organ = $(this).attr('organ');
                var minimized = $(this).hasClass('minimized');
                limitedResources.find('.organ-header[organ="' + organ + '"]')
                    .toggleClass('minimized', minimized)
                    .siblings('[organ="' + organ + '"]').toggle(!minimized);
            })
            .end()
        .empty()
        .append(limitedResources)
        .find('.organ-header')
            .click(function() {
                $(this).siblings('[organ="' + $(this).attr('organ') + '"]').toggle();
                $(this).toggleClass('minimized');
            })
            .end()
        .addResourceInfoSources();
}
