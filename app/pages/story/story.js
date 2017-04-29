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

var StoryPage = function (args) {
    console.log("ok story page");
    //var page = args.object;
    //var params = page.navigationContext;
    //console.log("image:" + params.image);
    //if (params.image != null) {

    //}
};
StoryPage.prototype = new BasePage();
StoryPage.prototype.constructor = StoryPage;


StoryPage.prototype.GoBack = function () {
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

var storyImages = new Observable.Observable();
var token = appSettings.getString("token", "");


StoryPage.prototype.pageLoaded = function (args) {
    console.log("on navigate story page");
    var page = args.object;
    page.bindingContext = storyImages;

    var gotData = page.navigationContext;
    console.log('Title:' + gotData.Title);

    lblContent = page.getViewById("lblContent");
    lblContent.text = gotData.Content;

    txtTitle = page.getViewById("txtTitle");
    txtTitle.text = gotData.Title;

    txtAuthor = page.getViewById("txtAuthor");
    txtAuthor.text = gotData.Author;

    txtDate = page.getViewById("txtDate");
    txtDate.text = gotData.Date;

    var storyThumb = [];
    for (var i = 0; i < gotData.ThumbImages.length; i++) {
        storyThumb.push({
            Path: global.ApiUrl + "/PostMedia" + '?api_key=' + token + "&path=" + encodeURIComponent(gotData.ThumbImages[i].Path) + "&filename=" + gotData.ThumbImages[i].Filename
        })
    }
    console.log('Images:' + JSON.stringify(storyThumb));

    storyImages.set("storyImages", storyThumb);
}



module.exports = new StoryPage();