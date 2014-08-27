function setWorking(working)
{
    var idle = working === false;
    LOG.find('.title').find('.fa')
        .toggleClass('fa-bars', idle)
        .toggleClass('fa-spinner fa-spin', !idle);

    if (idle) {
        working = 'Idle';
    }

    LOG.find('.title').find('p').html(working);
}

function log(message)
{
    LOG.find('.notifications').append('<p class="notification">' + message + '</p>');
}