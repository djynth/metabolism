$(document).ready(function() {
    $('.title').click(function() {
        $(this).siblings('.dropdown').slideToggle(function() {
            $(this).find('input').first().focus();
        });
    });

    $('#undo').click(function() {
        $.ajax({
            url: 'index.php/site/undo',
            type: 'POST',
            dataType: 'json',
            data: { },
            success: onTurn
        });
    });
});
