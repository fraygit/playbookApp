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

var PlaycentreMenu = function (args) {
    console.log("ok profile page");

};
PlaycentreMenu.prototype = new BasePage();
PlaycentreMenu.prototype.constructor = PlaycentreMenu;

PlaycentreMenu.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/myplaycentre/myplaycentre",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

PlaycentreMenu.prototype.GoToMembers = function () {
    topmost().navigate({
        moduleName: "pages/memberlist/memberlist",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};


module.exports = new PlaycentreMenu();