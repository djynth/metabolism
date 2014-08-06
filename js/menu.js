$(document).ready(function() {
    MENU.find('.tab').click(function() {
        if (!$(this).hasClass('active')) {
            MENU.find('.tab.active').removeClass('active');
            MENU.find('.content.active').removeClass('active');

            $(this).addClass('active');
            MENU.find('.content.' + $(this).attr('for')).addClass('active');
        }
    });
});
