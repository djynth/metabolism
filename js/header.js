$(document).ready(function() {
    HEADER.find('.title').click(function() {
        $(this).siblings('.dropdown').slideToggle(function() {
            $(this).find('input').first().focus();
        });
    });

    HEADER.find('.sidebar-title').click(function() {
        var side = $(this).hasClass('left') ? 'left' : 'right';
        var icon = $(this).find('.fa');
        var show = (icon.hasClass('fa-toggle-left')  && side === 'right') ||
                   (icon.hasClass('fa-toggle-right') && side === 'left');
        
        toggleSidebar(side, show);
    });

    $('#undo').click(undo);

    $('#open-menu').click(toggleMenu);
});

function undo()
{
    $.ajax({
        url: '/index.php/site/undo',
        type: 'POST',
        dataType: 'json',
        data: { },
        success: onTurn
    });
}
