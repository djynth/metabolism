$(document).ready(function() {
    $('#save-game').submit(function() {
        var form = $(this);
        if (form.find('input.error').length === 0) {
            $.ajax({
                url: '/index.php/site/saveGame',
                type: 'POST',
                dataType: 'json',
                data: {
                    name : form.find('.game-name').val()
                },
                success: function(data) {
                    form.siblings('.form-info')
                        .addClass('active')
                        .toggleClass('error', !data.success)
                        .html(data.message);
                },
                error: function() {
                    form.siblings('.form-info')
                        .addClass('active error')
                        .html(INTERNAL_ERROR);
                }
            });
        }
        return false;
    });

    DATA.find('.load').click(function() {
        var id = parseInt($(this).parents('.game').attr('game'));
        $.ajax({
                url: '/index.php/site/loadGame',
                type: 'POST',
                dataType: 'json',
                data: {
                    id : id
                },
                success: onGameStart
            });
    });
});