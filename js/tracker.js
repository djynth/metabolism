function updateTracker(resource, organ)
{
    $('#trackers').find('.tracker[res="' + resource + '"]').each(function() {
        var res = getRes(resource, organ);
        $(this).find('.organ[organ="' + organ + '"]').find('.amount').text(res.attr('amount'));

        var total = 0;
        $(this).find('.amount').each(function() {
            total += parseInt($(this).text());
        });
        $(this).find('.total').text(total);

        // TODO: add icons
    });
}
