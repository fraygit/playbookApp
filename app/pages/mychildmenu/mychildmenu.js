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

var token = appSettings.getString("token", "");

var MyChildMenuPage = function (args) {
    console.log("my children page");
    //var page = args.object;
    //var params = page.navigationContext;
    //console.log("image:" + params.image);
    //if (params.image != null) {

    //}
};
MyChildMenuPage.prototype = new BasePage();
MyChildMenuPage.prototype.constructor = MyChildMenuPage;

MyChildMenuPage.prototype.pageLoaded = function (args) {
    page = args.object;
    var pageContext = page.navigationContext;
    console.log("child name: " + pageContext.Name);
    var viewModel = new Observable.Observable({ ActionBarTitle: pageContext.Name.toUpperCase() });
    args.object.bindingContext = viewModel;
};


MyChildMenuPage.prototype.GoBack = function () {
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

MyChildMenuPage.prototype.LinkParent = function () {
    topmost().navigate({
        moduleName: "pages/linkparent/linkparent",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};


MyChildMenuPage.prototype.GoEnrollment = function () {
    topmost().navigate({
        moduleName: "pages/enrollment/enrollment",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};



module.exports = new MyChildMenuPage();

