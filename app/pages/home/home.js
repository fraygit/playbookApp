
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
var pageData = new observableModule.Observable();


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

var feed = new observableArray.ObservableArray([]);;

feed.push(new observableModule.Observable({
    Author: 'fray',
    Images: new observableArray.ObservableArray([{ Path: "http://www.playcentre.org.nz/Image?Action=View&Image_id=163" }, { Path: "http://www.playcentre.org.nz/Image?Action=View&Image_id=163" }]),
    Date: new Date(),
    Content: 'Test feed'
}));

feed.push(new observableModule.Observable({
    Author: 'Anna',
    Date: new Date(),
    Images: new observableArray.ObservableArray([{ Path: "https://www.nzgeo.com/wp-content/uploads/1970/01/Playcentre_mowing-1600x1068.jpg" }]),
    Content: 'Another post'
}));

HomePage.prototype.contentLoaded = function (args) {
    var page = args.object;
    pageData.set("Feed", feed);


    global.CallSecuredApi("/PostStory", "GET", null, "",
        function (result) {
            console.log("stories");
            console.log(result);
            var list = JSON.parse(result);
            console.log(list);
            console.log(list[0].Content);

            for (var i = 0; i < list.length; i++) {

                var storyImages = new observableArray.ObservableArray([]);
                console.log("media num:" + list[i].Media.length);
                if (list[i].Media.length > 0) {
                    console.log("downloading");
                    for (var y = 0; y < list[i].Media.length; y++) {
                        console.log("path:" + encodeURIComponent(list[i].Media[y].Path));
                        console.log("path:" + encodeURIComponent(list[i].Media[y].Filename));
                        var token = appSettings.getString("token", "");
                        var imageUrl = global.ApiUrl + "/PostMedia" + '?api_key=' + token + "&path=" + encodeURIComponent(list[i].Media[y].Path) + "&filename=" + list[i].Media[y].Filename;
                        console.log(imageUrl);
                        storyImages.push({ Path: imageUrl });
                    }
                }

                feed.push(new observableModule.Observable({
                    Author: list[i].WrittenBy,
                    Date: global.FormatDate(new Date()),
                        Images: storyImages,
                    Content: list[i].Content
                }));
            }

        },
        function (error) {
        },
        function (apiErrorMessage) {
        });


    page.bindingContext = pageData;
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
}

module.exports = new HomePage();
