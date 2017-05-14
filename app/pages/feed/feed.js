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

var FeedPage = function (args) {

};
FeedPage.prototype = new BasePage();
FeedPage.prototype.constructor = FeedPage;

FeedPage.prototype.Post = function () {
    topmost().navigate({
        moduleName: "pages/playcentrelist/playcentrelist",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
}

FeedPage.prototype.contentLoaded = function (args) {
    page = args.object;

    var wvFeed = page.getViewById('wvFeed');
    if (wvFeed.android) { // in IOS android will be undefined
        wvFeed.android.getSettings().setBuiltInZoomControls(false);
    }
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(wvFeed, '~/www/feed.html')

    wvFeed.on('loadFinished', function (wbargs) {
        console.log('webiviewloaded');
        if (!args.error) {
            var token = appSettings.getString("token", "");
            global.CallSecuredApi("/PostStory", "GET", null, "",
                function (result) {
                    var list = JSON.parse(result);
                    for (var i = 0; i < list.length; i++) {
                        console.log("looping " + list.length);
                        console.log('img:' + JSON.stringify(list[i]));
                        if (list[i].MediaThumb != undefined) {
                            for (var t = 0; t < list[i].MediaThumb.length; t++) {
                                console.log('thumb:' + JSON.stringify(list[i].MediaThumb[t]));
                                var imgUrl = 'http://34.209.177.254/api' + "/PostMedia" + '?api_key=' + encodeURIComponent(token) + "&path=" + encodeURIComponent(list[i].MediaThumb[t].Path) + "&filename=" + encodeURIComponent(list[i].MediaThumb[t].Filename);
                                list[i].MediaThumb[t].ImgUrl = imgUrl;
                            }
                        }
                    }

                    console.log('stories:' + JSON.stringify(list));
                    oWebViewInterface.emit('LoadFeed', JSON.stringify(list));

                },
                function (error) {
                },
                function (apiErrorMessage) {
                });



        }
    });
}

module.exports = new FeedPage();