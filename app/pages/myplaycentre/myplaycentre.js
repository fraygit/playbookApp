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

MyPlaycentre.prototype.Create = function () {
    topmost().navigate({
        moduleName: "pages/addplaycentre/addplaycentre",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
}

MyPlaycentre.prototype.GotoPlaycentre = function (args) {
    var item = args.object;
    var itemData = item.bindingContext;
    console.log("current playcentre " + itemData.Id);

    var playcentreId = appSettings.setString("PlaycentreId", itemData.Id);

    topmost().navigate({
        moduleName: "pages/playcentremenu/playcentremenu",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
}

MyPlaycentre.prototype.Join = function (args) {

    dialogs.alert({
        title: "Joining an existing playcentre?",
        message: "To join an existing playcentre, please contact your playcentre administrator and they will add you as a member. Once you are added you will be able to access the playcentre on this page.",
        okButtonText: "Ok"
    }).then(function () {
        console.log("Dialog closed!");
    });
}

MyPlaycentre.prototype.GoBack = function () {
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



module.exports = new MyPlaycentre();