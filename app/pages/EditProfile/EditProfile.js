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

var EditProfile = function (args) {
    console.log("ok edit profile");
};

var page;
var selectedImage;



EditProfile.prototype = new BasePage();
EditProfile.prototype.constructor = EditProfile;

EditProfile.prototype.pageLoaded = function (args) {
    console.log("edit");
    page = args.object;
    var txtFirstName = page.getViewById("txtFirstName");
    var txtLastName = page.getViewById("txtLastName");
    var profilePhoto = page.getViewById("profilePhoto");
    var token = appSettings.getString("token", "");

    global.CallSecuredApi("/User", "GET", null, "",
        function (result) {
            var user = JSON.parse(result);
            txtFirstName.text = user.FirstName;
            txtLastName.text = user.LastName;
            profilePhoto.src = global.ApiUrl + '/PostMedia?api_key=' + token + "&path=" + encodeURIComponent(user.ProfilePhoto) + "&filename=profile.jpg";
        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
};

EditProfile.prototype.Save = function (args) {
    var txtFirstName = page.getViewById("txtFirstName");
    var txtLastName = page.getViewById("txtLastName");
    var pnlSuccess = page.getViewById("pnlSuccess");

    var user = {
        FirstName: txtFirstName.text,
        LastName: txtLastName.text
    }

    global.CallSecuredApi("/UserProfile", "PUT", JSON.stringify(user), "",
        function (result) {
            pnlSuccess.visibility = "visible";

            var token = appSettings.getString("token", "");
            if (selectedImage != null && selectedImage != undefined) {
                console.log("start Upload - " + token);
                var filename = 'img_' + new Date().getTime() + '.jpg';
                var request = {
                    url: global.ApiUrl + '/UserProfile?api_key=' + token,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "File-Name": filename
                    },
                    description: "{ 'childId': 's' }"
                };
                console.log("image:" + selectedImage.ImagePath);
                console.log("Req: " + JSON.stringify(request));
                var params = [{ name: "childId", value: '1' }, { name: "fileToUpload", filename: selectedImage.ImagePath, mimeType: 'image/jpeg' }];
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

        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
}

EditProfile.prototype.OpenGallery = function () {
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

                console.log('thumb-' + JSON.stringify(selected.thumb));
                profilePhoto.src = selected.thumb;
            });
        }).catch(function (e) {
            console.log(e);
        });
}


EditProfile.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/myprofile/myprofile",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};



module.exports = new EditProfile();