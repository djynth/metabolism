$(document).ready(function() {
    $('#undo').click(function() {
        $.ajax({
            url: 'index.php/site/undo',
            type: 'POST',
            dataType: 'json',
            data: { },
            success: function(data) {
                onPathwaySuccess(data);
            },
            error: function() {
                notifyInternalError();
            }
        });
    });
});
