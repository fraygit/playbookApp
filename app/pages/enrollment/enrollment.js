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

var Enrollment = function (args) {
    console.log("ok profile page");

};
Enrollment.prototype = new BasePage();
Enrollment.prototype.constructor = Enrollment;

var playcentre = new ObservableArray.ObservableArray([]);
var playcentreList = new Observable.Observable();


Enrollment.prototype.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = playcentreList;

    var childId = appSettings.getString("CurrentChildId", "");
    global.CallSecuredApi("/ChildEnrollment", "GET", null, "&childId=" + childId,
        function (result) {
            var list = JSON.parse(result);
            console.log(list);
            playcentre = [];
            for (var i = 0; i < list.length; i++) {
                playcentre.push(list[i]);
                console.log(JSON.stringify(list[i]));
            }
            playcentreList.set("playcentreList", playcentre);

        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
}

Enrollment.prototype.Join = function (args) {
    dialogs.confirm("Are you sure you want to join this child to ").then(function (result) {
        console.log("Dialog result: " + result);
    });
};

Enrollment.prototype.GoBack = function () {
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



module.exports = new Enrollment();