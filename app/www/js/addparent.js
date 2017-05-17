
$(document).ready(function () {

    var oWebViewInterface = window.nsWebViewInterface;

    $("#btnAddParent").click(function () {
        var data = {
            Email: $("#txtEmail").val()
        }
        oWebViewInterface.emit("AddParent", JSON.stringify(data));
    });
});

