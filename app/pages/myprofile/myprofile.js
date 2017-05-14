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

var MyProfilePage = function (args) {
    console.log("ok profile page");

};
MyProfilePage.prototype = new BasePage();
MyProfilePage.prototype.constructor = MyProfilePage;


MyProfilePage.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/feed/feed",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

MyProfilePage.prototype.GotoEditProfile = function () {
    topmost().navigate({
        moduleName: "pages/EditProfile/EditProfile",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

var token = appSettings.getString("token", "");


module.exports = new MyProfilePage();