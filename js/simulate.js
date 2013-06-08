$(document).ready(function() {
    $('button#next_turn').click(function() {
        var resources = new Array();
        var i = 0;

        $('div#resources_column table#current_resources tr').each(function() {
            resources[i++] = new resource($(this).children('.resource_name').html(), $(this).children('.resource_value').html());
        });

        // TODO adjust resources
        for (i = 0; i < resources.length; i++) {
            resources[i].value = Math.ceil(Math.random()*10);
        }

        $('div#resources_column table#current_resources tr').each(function() {
            //alert(getResourceValue($(this).children('.resource_name').html(), resources));
            $(this).children('.resource_value').html(getResourceValue($(this).children('.resource_name').html(), resources));
        });
    });
});

function resource(name, value)
{
    this.name = name;
    this.value = value;
}

function getResourceValue(name, resources)
{
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].name == name) {
            return resources[i].value;
        }
    }
    return null;
}