var HEADER;

$(document).ready(function() {
    HEADER = $('#header');

    HEADER.find('.title').click(function() {
        $(this).siblings('.dropdown').slideToggle(function() {
            $(this).find('input').first().focus();
        });
    });

    HEADER.find('.sidebar-title').click(function() {
        var side = $(this).hasClass('left') ? 'left' : 'right';
        var icon = $(this).find('.fa')
        var show = (icon.hasClass('fa-toggle-left')  && side === 'right') ||
                   (icon.hasClass('fa-toggle-right') && side === 'left');
        icon.toggleClass('fa-toggle-left fa-toggle-right');
        
        toggleSidebar(side, show);
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
        $(this).find('.cover').fadeToggle();
    });
});
