$(document).ready(function () {

    var oWebViewInterface = window.nsWebViewInterface;

    oWebViewInterface.on('LoadChildrenList', function (eventData) {

        var model = JSON.parse(eventData);
        var template = $('#template').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, { Children: model });
        $('#pnlChildList').html(rendered);

    });



});