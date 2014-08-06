$(document).ready(function() {
    NEW_GAME.find('.mode')
        .hover(
            function() {
                var details = $(this).find('.details');
                var t = setTimeout(function() {
                    details.slideDown();
                }, 500);
                $(this).data('timeout', t);
            },
            function() {
                clearTimeout($(this).data('timeout'));
                $(this).find('.details').slideUp();
            }
        )
        .click(function() {
            clearTimeout($(this).data('timeout'));
            $(this).find('.details').slideUp();
            $(this).siblings('.mode').each(function() {
                $(this).removeClass('active');
                $(this).find('.label').slideDown();
            })

            $(this).toggleClass('active');
            $(this).find('.label').slideToggle();

            if ($(this).hasClass('active')) {
                var mode = $(this).attr('mode');
                $(this).parents('.content').find('.mode-info').each(function() {
                    $(this).toggle($(this).attr('mode') === mode);
                });
            } else {
                $(this).parents('.content').find('.mode-info').hide();
            }
        });

    NEW_GAME.find('.mode-info').find('.play').click(function() {
        newGame(
            $(this).parents('.mode-info').attr('mode'),
            $(this).siblings('.challenges').val()
        );
        MENU.fadeOut();
        $('#open-menu').find('.cover').fadeToggle();
        toggleFooter(true);
        toggleSidebar('left', true);
        toggleSidebar('right', true);
    });

    NEW_GAME.find('.mode-info').find('.challenges').change(function() {
        $(this).siblings('.details').hide();
        var details = $(this).siblings('.details[challenge=' + $(this).val() + ']');
        details.show();
        $(this).siblings('.play').toggleClass('disabled', details.length === 0);
    });
});