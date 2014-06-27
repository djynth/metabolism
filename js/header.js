var HEADER;

$(document).ready(function() {
    HEADER = $('#header');

    HEADER.find('.title').click(function() {
        $(this).siblings('.dropdown').slideToggle(function() {
            $(this).find('input').first().focus();
        });
    });

    $('#undo').click(function() {
        $.ajax({
            url: '/index.php/site/undo',
            type: 'POST',
            dataType: 'json',
            data: { },
            success: onTurn
        });
    });

    $('#open-menu').click(function() {
        MENU.fadeToggle();
    });
});
