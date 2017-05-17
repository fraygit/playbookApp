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

var LinkParent = function (args) {
    console.log("ok profile page");

};
LinkParent.prototype = new BasePage();
LinkParent.prototype.constructor = LinkParent;

var member = new ObservableArray.ObservableArray([]);
var parentList = new Observable.Observable();

LinkParent.prototype.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = parentList;

    var childId = appSettings.getString("CurrentChildId", "");

    console.log("childId:" + childId);
    global.CallSecuredApi("/LinkChild", "GET", null, "&childId=" + childId,
        function (result) {
            var list = JSON.parse(result);
            console.log(list);
            member = [];

            for (var i = 0; i < list.length; i++) {
                console.log("member id:" + list[i].Id);
                member.push(list[i]);
            }
            parentList.set("parentList", member);

        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
}

LinkParent.prototype.AddParent = function () {
    topmost().navigate({
        moduleName: "pages/addparent/addparent",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};



LinkParent.prototype.GoBack = function () {
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



module.exports = new LinkParent();