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

var MyPlaycentre = function (args) {
    console.log("ok profile page");

};
MyPlaycentre.prototype = new BasePage();
MyPlaycentre.prototype.constructor = MyPlaycentre;

var playcentre = new ObservableArray.ObservableArray([]);
var playcentreList = new Observable.Observable();


MyPlaycentre.prototype.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = playcentreList;

    global.CallSecuredApi("/Playcentre", "GET", null, "",
        function (result) {
            var list = JSON.parse(result);
            console.log(list);

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

MyPlaycentre.prototype.GoToPost = function (args) {
    var item = args.object;
    var itemData = item.bindingContext;

    console.log("current playcentre" + itemData.Id);

    appSettings.setString("PlaycentreId", itemData.Id);

    topmost().navigate({
        moduleName: "pages/post/post",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

MyPlaycentre.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/home/home",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};



module.exports = new MyPlaycentre();