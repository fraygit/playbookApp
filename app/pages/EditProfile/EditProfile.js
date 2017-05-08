var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var camera = require("nativescript-camera");
var label = require("ui/label");
var image = require("ui/image");
var Observable = require('data/observable');
var ObservableArray = require('data/observable-array');
var imagepickerModule = require("nativescript-imagepicker");
var http = require("http");
var dialogs = require("ui/dialogs");
var fs = require("file-system");
var imageSource = require("image-source")
var bghttp = require("nativescript-background-http");
var appSettings = require("application-settings");
var imageCacheModule = require("ui/image-cache");

var session = bghttp.session("image-upload");

var EditProfile = function (args) {
    console.log("ok edit profile");
};


EditProfile.prototype = new BasePage();
EditProfile.prototype.constructor = EditProfile;

EditProfile.prototype.pageLoaded = function (args) {
    console.log("edit");
    page = args.object;
    var txtFirstName = page.getViewById("txtFirstName");
    var txtLastName = page.getViewById("txtLastName");

    global.CallSecuredApi("/User", "GET", null, "",
        function (result) {
            var user = JSON.parse(result);
            txtFirstName.text = user.FirstName;
            txtLastName.text = user.LastName;
        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
};

EditProfile.prototype.Save = function (args) {
    var txtFirstName = page.getViewById("txtFirstName");
    var txtLastName = page.getViewById("txtLastName");
    var pnlSuccess = page.getViewById("pnlSuccess");

    var user = {
        FirstName: txtFirstName.text,
        LastName: txtLastName.text
    }

    global.CallSecuredApi("/UserProfile", "POST", JSON.stringify(user), "",
        function (result) {
            pnlSuccess.visibility = "visible";
        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
}

EditProfile.prototype.GoBack = function () {
    selectedImages = [];
    capturedImages = [];
    topmost().navigate({
        moduleName: "pages/myprofile/myprofile",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};



module.exports = new EditProfile();