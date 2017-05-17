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

var AddParent = function (args) {
    console.log("ok profile page");

};
AddParent.prototype = new BasePage();
AddParent.prototype.constructor = AddParent;

AddParent.prototype.pageLoaded = function (args) {
    page = args.object;
    var wvAddParent = page.getViewById('wvAddParent');
    if (wvAddParent.android) { // in IOS android will be undefined
        wvAddParent.android.getSettings().setBuiltInZoomControls(false);
    }
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(wvAddParent, '~/www/Addparent.html')
    oWebViewInterface.on('AddParent', function (eventData) {
        console.log(JSON.stringify(eventData));
        var childId = appSettings.getString("CurrentChildId", "");
        var data = eventData;
        var request = {Email: data.Email, ChildId:  childId}
        if (!global.IsBlank(data.Email)) {
            global.CallSecuredApi("/LinkChild", "POST", JSON.stringify(request), "",
                function (result) {
                    topmost().navigate({
                        moduleName: "pages/linkparent/linkparent",
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

AddParent.prototype.GoBack = function () {
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



module.exports = new AddParent();