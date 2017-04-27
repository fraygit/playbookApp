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

var page;
var selectedImage;

var AddChildPage = function (args) {
    console.log("my children page");
    //var page = args.object;
    //var params = page.navigationContext;
    //console.log("image:" + params.image);
    //if (params.image != null) {

    //}
};
AddChildPage.prototype = new BasePage();
AddChildPage.prototype.constructor = AddChildPage;

AddChildPage.prototype.contentLoaded = function (args) {
    page = args.object;
};

AddChildPage.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/mychildren/mychildren",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

var GetImageFromCache = function (imgPath, imgCallBack) {
    console.log("start image cache");
    var cache = new imageCacheModule.Cache();
    cache.maxRequests = 5;
    cache.enableDownload();

    var imgSrc;

    var image = cache.get(imgPath);
    if (image) {
        console.log("image retrieve");
        imgSrc = imageSource.fromNativeSource(image);
        imgCallBack(imgSrc);
    }
    else {
        console.log("image cache push");
        cache.push({
            key: imgPath,
            url: imgPath,
            completed: function (cachedImage, key) {
                if (imgPath === key) {
                    imgSrc = imageSource.fromNativeSource(cachedImage);
                    imgCallBack(imgSrc);
                }
            }
        });
    }
    
};

AddChildPage.prototype.OpenGallery = function () {
    var context = imagepickerModule.create({
        mode: "multiple"
    });

    var profilePhoto = page.getViewById("profilePhoto");

    context
        .authorize()
        .then(function () {
            return context.present();
        })
        .then(function (selection) {
            console.log("Selection done:");
            selection.forEach(function (selected) {
                console.log(" - " + selected.uri);
                var newImageCaptured = { Id: global.GenerateGuid(), ImagePath: selected.fileUri, Thumb: selected.thumb };
                selectedImage = newImageCaptured;

                //profilePhoto.src = selected.fileUri;
                console.log('thumb-' + JSON.stringify(selected.thumb));
                profilePhoto.src = selected.thumb;
                //GetImageFromCache(selected.fileUri, function (imgSrc) {
                //    console.log("return image source");
                //    console.log("imgSrc" + JSON.stringify(imgSrc));
                //    profilePhoto.imageSource = imgSrc;
                //});
                

            });
        }).catch(function (e) {
            console.log(e);
        });
}

AddChildPage.prototype.AddChild = function () {
    var btnAddChild = page.getViewById("btnAddChild");
    var txtFirstName = page.getViewById("txtFirstName");
    var txtLastName = page.getViewById("txtLastName");
    var dteDOB = page.getViewById("dteDOB");

    btnAddChild.isEnabled = false;

    var dob = new Date(dteDOB.year, dteDOB.month, dteDOB.day);
    console.log(dob);

    global.CallSecuredApi("/Child", "PUT", JSON.stringify({ FirstName: txtFirstName.text, LastName: txtLastName.text, DateOfBirth: dob }), "",
        function (result) {
            console.log("child id: " + result);
            var childId = result;
            console.log(selectedImage);
            var token = appSettings.getString("token", "");
            if (selectedImage != null && selectedImage != undefined) {
                console.log("start Upload - " + token);
                var filename = 'img_' + new Date().getTime() + '.jpg';
                var request = {
                    url: global.ApiUrl + '/Child?api_key=' + token,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "File-Name": filename
                    },
                    description: "{ 'childId': '" + childId + "' }"
                };
                console.log("Req: " + JSON.stringify(request));
                var params = [{ name: "childId", value: childId.toString() }, { name: "fileToUpload", filename: selectedImage.ImagePath, mimeType: 'image/jpeg' }];
                console.log("params: " + JSON.stringify(params));
                var task = session.multipartUpload(params, request);
                console.log("uploading: " + selectedImage.ImagePath);

                task.on("progress", function () {
                    console.log("progress");
                });
                task.on("error", function () {
                    console.log("error");
                });
                task.on("complete", function () {
                    console.log("complete");
                });
            }
            topmost().navigate({
                moduleName: "pages/mychildren/mychildren",
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

};

module.exports = new AddChildPage();