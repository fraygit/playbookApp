var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var camera = require("nativescript-camera");
var label = require("ui/label");
var image = require("ui/image");
var Observable = require('data/observable');
var ObservableArray = require('data/observable-array');
var imagepickerModule = require("nativescript-imagepicker");

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

var selectedImages = [];
var capturedImages = [];

var ReloadImages = function () {

    pnlMedia = page.getViewById("pnlMedia");
    txtStory = page.getViewById("txtStory");
    txtStory.height = "50%";
    pnlMedia.height = "42%";

    pnlMedia.removeChildren();
    //console.log("display images");
    //console.log("selected images : " + selectedImages.length);

    var numOfImages = capturedImages.length + selectedImages.length;
    var imgWidth = 100 / numOfImages;
    console.log("num images : " + numOfImages);

    if (numOfImages > 0) {
        for (var i = 0; i < capturedImages.length; i++) {
            var newImage = new image.Image();
            newImage.src = capturedImages[i].Image;
            newImage.id = capturedImages[i].Id;
            newImage.class = "imagecaptured";
            newImage.height = imgWidth + '%';
            pnlMedia.addChild(newImage);
        }
        for (var i = 0; i < selectedImages.length; i++) {
            var newImage = new image.Image();
            newImage.src = selectedImages[i].ImagePath;
            newImage.id = selectedImages[i].Id;
            newImage.class = "imagecaptured";
            newImage.height = imgWidth + '%';
            pnlMedia.addChild(newImage);
        }
    }
    
};


PostPage.prototype.OpenCamera = function () {
    camera.requestPermissions();
    camera.takePicture()
        .then(function (imageAsset) {
            var newImageCaptured = { Id: generateGuid(), Image: imageAsset };
            capturedImages.push(newImageCaptured);
            console.log("image captured");
            console.log(imageAsset)

            ReloadImages();

        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
}


PostPage.prototype.OpenGallery = function () {
    var context = imagepickerModule.create({
        mode: "multiple"
    });

    context
        .authorize()
        .then(function () {
            return context.present();
        })
        .then(function (selection) {
            console.log("Selection done:");
            selection.forEach(function (selected) {
                console.log(" - " + selected.uri);
                var newImageCaptured = { Id: generateGuid(), ImagePath: selected.fileUri, Thumb: selected.thumb };
                selectedImages.push(newImageCaptured);

                ReloadImages();
            });
        }).catch(function (e) {
            console.log(e);
        });
}


module.exports = new PostPage();