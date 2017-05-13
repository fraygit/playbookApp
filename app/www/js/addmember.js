
$(document).ready(function () {

    var oWebViewInterface = window.nsWebViewInterface;
    
    $("#btnAddMember").click(function () {
        var data = {
            Email: $("#txtEmail").val(),
            IsParent: $("#chkParent").prop("checked"),
            IsEducator: $("#chkEducator").prop("checked")
        }
        oWebViewInterface.emit("AddMember", JSON.stringify(data));
    });
});

