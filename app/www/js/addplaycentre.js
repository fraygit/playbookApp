
$(document).ready(function () {

    var oWebViewInterface = window.nsWebViewInterface;

    $("#btnAddPlaycentre").click(function () {
        var data = {
            Name: $("#txtName").val(),
            Email: $("#txtName").val(),
            Address: $("#txtAddress").val(),
            ContactNumber: $("#txtContactNumber").val(),
            MainContactPerson: $("#txtContactPerson").val()
        }
        oWebViewInterface.emit("AddPlaycentre", JSON.stringify(data));
    });
});

