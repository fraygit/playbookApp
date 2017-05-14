var oWebViewInterface = window.nsWebViewInterface;

$(document).ready(function () {


    oWebViewInterface.on('LoadChildrenList', function (eventData) {

        var model = JSON.parse(eventData);
        var template = $('#template').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, { Children: model });
        $('#pnlChildList').html(rendered);

    });


});
var tagList = [];

function TagChild(childId, e) {
    console.log(childId);
    if ($(e).prop("checked")) {
        tagList.push(childId);
    }
    else {
        for (var i = 0; i < tagList.length; i++) {
            if (tagList[i] == childId) {
                tagList.splice(i, 1);
            }
        }
    }
    oWebViewInterface.emit("TagChild", JSON.stringify(tagList));
}