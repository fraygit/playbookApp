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

var TagChild = function (args) {

};
TagChild.prototype = new BasePage();
TagChild.prototype.constructor = TagChild;

TagChild.prototype.Post = function () {
    topmost().navigate({
        moduleName: "pages/post/post",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
}

TagChild.prototype.contentLoaded = function (args) {
    page = args.object;

    var wvTagChild = page.getViewById('wvTagChild');
    if (wvTagChild.android) { // in IOS android will be undefined
        wvTagChild.android.getSettings().setBuiltInZoomControls(false);
    }
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(wvTagChild, '~/www/tag.html')
    oWebViewInterface.on('TagChild', function (eventData) {
        console.log('TagChild' + JSON.stringify(eventData));
        appSettings.setString("TaggedChild", JSON.stringify(eventData));
    });
    wvTagChild.on('loadFinished', function (wbargs) {
        console.log('webiviewloaded');
        if (!args.error) {

            var playcentreId = appSettings.getString("PlaycentreId", "");

            if (playcentreId != "") {

                global.CallSecuredApi("/PlaycentreChild", "GET", null, "&playcentreId=" + playcentreId,
                    function (result) {
                        console.log("get children");
                        console.log(result);
                        var list = JSON.parse(result);
                        console.log(list);
                        var token = appSettings.getString("token", "");
                        var chdrn = [];
                        for (var i = 0; i < list.length; i++) {
                            var filename = 'img_' + new Date().getTime() + '.jpg';

                            var childItem = {
                                Name: list[i].FirstName,
                                Id: list[i].Id,
                                ProfileImage: global.ApiUrl + "/PostMedia" + '?api_key=' + encodeURIComponent(token) + "&path=" + encodeURIComponent(list[i].ProfilePhoto) + "&filename=" + filename,
                            };
                            chdrn.push(childItem);
                        }

                        console.log('children:', JSON.stringify(chdrn));

                        oWebViewInterface.emit('LoadChildrenList', JSON.stringify(chdrn));

                    },
                    function (error) {
                    },
                    function (apiErrorMessage) {
                    });
            }
            else {
                global.CallSecuredApi("/Child", "GET", null, "",
                    function (result) {
                        console.log("get children");
                        console.log(result);
                        var list = JSON.parse(result);
                        console.log(list);
                        var token = appSettings.getString("token", "");
                        var chdrn = [];
                        for (var i = 0; i < list.length; i++) {
                            var filename = 'img_' + new Date().getTime() + '.jpg';

                            var childItem = {
                                Name: list[i].FirstName,
                                Id: list[i].Id,
                                ProfileImage: global.ApiUrl + "/PostMedia" + '?api_key=' + encodeURIComponent(token) + "&path=" + encodeURIComponent(list[i].ProfilePhoto) + "&filename=" + filename,
                            };
                            chdrn.push(childItem);
                        }

                        console.log('children:', JSON.stringify(chdrn));

                        oWebViewInterface.emit('LoadChildrenList', JSON.stringify(chdrn));

                    },
                    function (error) {
                    },
                    function (apiErrorMessage) {
                    });
            }

        }
    });
}

TagChild.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/playcentrelist/playcentrelist",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

module.exports = new TagChild();