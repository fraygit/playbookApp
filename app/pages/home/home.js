
var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var camera = require("nativescript-camera");
var vr = require("nativescript-videorecorder");
var appSettings = require("application-settings");

var videorecorder = new vr.VideoRecorder();

var HomePage = function() {};
HomePage.prototype = new BasePage();
HomePage.prototype.constructor = HomePage;

var observableArray = require("data/observable-array");
var observableModule = require("data/observable");

// Place any code you want to run when the home page loads here.



var navigationEntry = {
    moduleName: "pages/post/post",
    animated: true,
    transition: {
        name: "slide",
        duration: 380,
        curve: "easeIn"
    }
};


var feed = new observableArray.ObservableArray([]);
var pageData = new observableModule.Observable();

HomePage.prototype.contentLoaded = function (args) {
    var page = args.object;
    page.bindingContext = pageData;
    //var feed = new observableArray.ObservableArray([]);
    feed = [];

    //feed.push(new observableModule.Observable({
    //    Author: 'fray',
    //    Images: new observableArray.ObservableArray([{ Path: "http://www.playcentre.org.nz/Image?Action=View&Image_id=163" }, { Path: "http://www.playcentre.org.nz/Image?Action=View&Image_id=163" }]),
    //    Date: new Date(),
    //    Content: 'Test feed',
    //    ImageCount: 0
    //}));

    //feed.push(new observableModule.Observable({
    //    Author: 'Anna',
    //    Date: new Date(),
    //    Images: new observableArray.ObservableArray([{ Path: "https://www.nzgeo.com/wp-content/uploads/1970/01/Playcentre_mowing-1600x1068.jpg" }]),
    //    Content: 'Another post',
    //    ImageCount: 0
    //}));

    var token = appSettings.getString("token", "");

    global.CallSecuredApi("/PostStory", "GET", null, "",
        function (result) {
            console.log("stories");
            //console.log(result);
            var list = JSON.parse(result);
            console.log(list);

            var imageCount = 1;

            for (var i = 0; i < list.length; i++) {
                console.log("looping " + list.length);
                var storyImages = new observableArray.ObservableArray([]);
                //console.log("media num:" + list[i].Media.length);
                if (list[i].MediaThumb != null || list[i].MediaThumb != undefined) {
                    if (list[i].MediaThumb.length > 0) {

                        var imageUrl = global.ApiUrl + "/PostMedia" + '?api_key=' + token + "&path=" + encodeURIComponent(list[i].MediaThumb[0].Path) + "&filename=" + list[i].MediaThumb[0].Filename;
                        console.log("image:" + imageUrl);
                        storyImages.push({ Path: imageUrl });
                        console.log("image ok");
                    }
                }
                
                feed.push(new observableModule.Observable({
                    Id: list[i].Id,
                    Title: list[i].Title,
                    Author: list[i].Author,
                    Date: global.FormatDate(new Date(list[i].DatePosted)),
                    Images: storyImages,
                    ThumbImages: list[i].MediaThumb,
                    Content: list[i].Content,
                    ImageCount: 0
                }));
                console.log("image ok2");
            }
            pageData.set("Feed", feed);
        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
    
    
};


HomePage.prototype.WriteStory = function () {
    console.log("go to post");
    topmost().navigate(navigationEntry);
};

HomePage.prototype.OpenCamera = function () {
    camera.requestPermissions();
    camera.takePicture()
        .then(function (imageAsset) {

            topmost().navigate({
                            moduleName: "pages/post/post",
                            animated: true,
                            transition: {
                                name: "slide",
                                duration: 380,
                                curve: "easeIn"
                            },
                            context: {image: imageAsset}
                        });

            console.log("Result is an image asset instance");
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
}

HomePage.prototype.OpenVideoRecorder = function () {
    var options = {
        saveToGallery:true, //default false | optional
        explanation:"Why do i need this permission" //optional on api 23 #android
    }
    videorecorder.record(options)
    .then(function (data) {
        console.log("video success");
        console.log(data.file);
    })
    .catch(function(err){
        console.log(err);
    })
};

HomePage.prototype.fun = function() {
    var page = topmost().currentPage;
    var logo = page.getViewById("logo");
    logo.animate({
        rotate: 3600,
        duration: 3000
    }).then(function() {
        logo.rotate = 0;
    });
};


HomePage.prototype.GoToStory = function(args){
    var item = args.object;
    var itemData = item.bindingContext;
    console.log('story details:' + itemData.get("Id"));

    var storyId = itemData.get("Id");

    topmost().navigate({
        moduleName: "pages/story/story",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        },
        context: {
            Id: itemData.get("Id"),
            Title: itemData.get("Title"),
            Author: itemData.get("Author"),
            Date: itemData.get("Date"),
            Images: itemData.get("Images"),
            Content: itemData.get("Content"),
            ThumbImages: itemData.get("ThumbImages"),
            ImageCount: 0
        }
    });
};

module.exports = new HomePage();
