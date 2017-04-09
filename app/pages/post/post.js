var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var camera = require("nativescript-camera");
var label = require("ui/label");
var image = require("ui/image");
var Observable = require('data/observable');
var ObservableArray = require('data/observable-array');

var PostPage = function (args) {
    //var page = args.object;
    //var params = page.navigationContext;
    //console.log("image:" + params.image);
    //if (params.image != null) {

    //}
};
PostPage.prototype = new BasePage();
PostPage.prototype.constructor = PostPage;

var txtStory;
var pnlMedia;
var page;

PostPage.prototype.contentLoaded = function (args) {
    page = args.object;
};


PostPage.prototype.GoBack = function () {
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

function generateGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

var capturedImages = [];

PostPage.prototype.OpenCamera = function () {
    camera.requestPermissions();
    camera.takePicture()
        .then(function (imageAsset) {
            txtStory = page.getViewById("txtStory");
            pnlMedia = page.getViewById("pnlMedia");
            txtStory.height = "50%";
            pnlMedia.height = "42%";

            //if (capturedImages.length > 0) {
            //    for (var i = 0; i < capturedImages.length; i++) {
            //        var displayedImage = page.getViewById(capturedImages[i].Id);
            //        pnlMedia.removeChild(displayedImage);
            //    }
            //}
            
            pnlMedia.removeChildren();

            var newImageCaptured = { Id: generateGuid(), Image: imageAsset };
            capturedImages.push(newImageCaptured);

            if (capturedImages.length > 0) { 
                var imgWidth = 100 / capturedImages.length;
                for (var i = 0; i < capturedImages.length; i++) {
                    var newImage = new image.Image();
                    newImage.src = capturedImages[i].Image;
                    newImage.id = capturedImages[i].Id;
                    newImage.class = "imagecaptured";
                    newImage.height = imgWidth + '%';
                    pnlMedia.addChild(newImage);
                }
            }


        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
}


module.exports = new PostPage();