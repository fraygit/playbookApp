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
var webViewInterfaceModule = require('nativescript-webview-interface');
var oWebViewInterface;

var session = bghttp.session("image-upload");

var page;

var AddPlaycentre = function (args) {
    console.log("ok profile page");

};
AddPlaycentre.prototype = new BasePage();
AddPlaycentre.prototype.constructor = AddPlaycentre;

AddPlaycentre.prototype.pageLoaded = function (args) {
    page = args.object;
    var wvAddPlaycentre = page.getViewById('wvAddPlaycentre');
    if (wvAddPlaycentre.android) { // in IOS android will be undefined
        wvAddPlaycentre.android.getSettings().setBuiltInZoomControls(false);
    }
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(wvAddPlaycentre, '~/www/AddPlaycentre.html')
    oWebViewInterface.on('AddPlaycentre', function (eventData) {
        console.log(JSON.stringify(eventData));
        if (!global.IsBlank(eventData.Email)) {
            global.CallSecuredApi("/Playcentre", "PUT", JSON.stringify(eventData), "",
                function (result) {
                    topmost().navigate({
                        moduleName: "pages/myplaycentre/myplaycentre",
                        animated: true,
                        transition: {
                            name: "slide",
                            duration: 380,
                            curve: "easeIn"
                        }
                    });
                },
                function (error) {
                },
                function (apiErrorMessage) {
                });
        }
    });
}

AddPlaycentre.prototype.GoBack = function () {
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



module.exports = new AddPlaycentre();