
var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var camera = require("nativescript-camera");
var vr = require("nativescript-videorecorder");

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

feed.push({
    Author: 'fray',
    Image: "http://www.playcentre.org.nz/Image?Action=View&Image_id=163",
    Date: new Date(),
    Title: 'Test feed'
});

feed.push({
    Author: 'Anna',
    Date: new Date(),
    Image: "https://www.nzgeo.com/wp-content/uploads/1970/01/Playcentre_mowing-1600x1068.jpg",
    Title: 'Another post'
});

HomePage.prototype.contentLoaded = function (args) {
    var page = args.object;
    pageData.set("Feed", feed);
    page.bindingContext = pageData;
};


HomePage.prototype.WriteStory = function () {
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
