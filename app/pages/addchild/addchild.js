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

var session = bghttp.session("image-upload");

var page;

var AddChildPage = function (args) {
    console.log("my children page");
    //var page = args.object;
    //var params = page.navigationContext;
    //console.log("image:" + params.image);
    //if (params.image != null) {

    //}
};
AddChildPage.prototype = new BasePage();
AddChildPage.prototype.constructor = AddChildPage;

AddChildPage.prototype.contentLoaded = function (args) {
    page = args.object;
};

AddChildPage.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/mychildren/mychildren",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

module.exports = new AddChildPage();