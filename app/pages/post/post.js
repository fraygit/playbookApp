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

var session = bghttp.session("image-upload");

var PostPage = function (args) {
    console.log("ok post1.1");
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
var selectedImages = [];
var capturedImages = [];

var children = new ObservableArray.ObservableArray([]);
var childrenList = new Observable.Observable();

console.log("ok post");

PostPage.prototype.contentLoaded = function (args) {
    console.log("ok post2");
    page = args.object;
    page.bindingContext = childrenList;
    children = [];
    children.push(new Observable.Observable({
        Name: 'Andy',
        Id: '123',
        ProfileImage: 'https://assets.babycenter.com/ims/2016/10/iStock_43693432_4x3.jpg',
        Class: 'list-item'
    }));
    children.push(new Observable.Observable({
        Name: 'Sam',
        Id: '456',
        ProfileImage: 'https://pbs.twimg.com/profile_images/450103729383956480/Tiys3m4x.jpeg',
        Class: 'list-item'
    }));

    childrenList.set("childrenList", children);
    console.log("ok post 3");
};

PostPage.prototype.SelectChild = function (args) {
    var item = args.object;
    var itemData = item.bindingContext;
    if (itemData.Class == 'list-item') {
        itemData.Class = 'list-item-selected';
    }
    else {
        itemData.Class = 'list-item';
    }
    console.log('item:' + JSON.stringify(itemData));
}

PostPage.prototype.GoBack = function () {
    selectedImages = [];
    capturedImages = [];
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
            newImage.src = capturedImages[i].ImagePath;
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
            var img = imageAsset
            var savepath = fs.knownFolders.documents().path;
            var filename = 'img_' + new Date().getTime() + '.jpg';
            var filepath = fs.path.join(savepath, filename);

            imageSource.fromAsset(imageAsset).then(function (res) {
                console.log("from asset");
                res.saveToFile(filepath, "jpg");

                var newImageCaptured = { Id: generateGuid(), Image: imageAsset, ImagePath: filepath, Filename: filename };
                capturedImages.push(newImageCaptured);
                console.log("image captured:" + filepath);
                console.log(imageAsset)

                ReloadImages();
            });



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

var UploadMedia = function (storyId) {
    console.log("Start Upload");
    var token = appSettings.getString("token", "");
    for (var i = 0; i < capturedImages.length; i++) {
        var request = {
            url: global.ApiUrl + '/PostMedia?api_key=' + token,
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": capturedImages[i].Filename
            },
            description: "{ 'storyid': '" + storyId + "' }"
        };
        var params = [{ name: "StoryId", value: storyId.toString() }, { name: "fileToUpload", filename: capturedImages[i].ImagePath, mimeType: 'image/jpeg' }];
        //var task = session.uploadFile(capturedImages[i].ImagePath, request);
        var task = session.multipartUpload(params, request);
        console.log("uploading: " + capturedImages[i].ImagePath);

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
    capturedImages = [];
    console.log("upload " + global.ApiUrl + '/PostMedia?api_key=' + token);
    for (var i = 0; i < selectedImages.length; i++) {
        var request = {
            url: global.ApiUrl + '/PostMedia?api_key=' + token,
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": selectedImages[i].Filename
            },
            description: "{ 'storyid': '" + storyId + "' }"
        };
        var params = [{ name: "StoryId", value: storyId.toString() }, { name: "fileToUpload", filename: selectedImages[i].ImagePath, mimeType: 'image/jpeg' }];
        //var task = session.uploadFile(capturedImages[i].ImagePath, request);
        var task = session.multipartUpload(params, request);
        console.log("uploading: " + selectedImages[i].ImagePath);

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
    selectedImages = [];

}

PostPage.prototype.Post = function () {
    var isContinuePost = true;
    txtStory = page.getViewById("txtStory");
    if (global.IsBlank(txtStory.text)) {
        isContinuePost = false;
        dialogs.alert("Can not post story. Story is blank!").then(function () {
            
        })
    }

    if (isContinuePost) {



        //UploadMedia(response.content);

        global.CallSecuredApi("/PostStory", "POST", JSON.stringify({ Title: "Test", Content: txtStory.text, WrittenBy: 'fy' }), "",
            function (result) {
                console.log("story id: " + result);
                UploadMedia(result);
                topmost().navigate({
                    moduleName: "pages/home/home",
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


        //http.request({
        //    url: global.ApiUrl + '/PostStory',
        //    method: "POST",
        //    headers: { "Content-Type": "application/json" },
        //    content: JSON.stringify({ Title: "Test", Content: txtStory.text, WrittenBy: 'fy' })
        //}).then(function (response) {

        //    console.log("story id:" + response.content);
        //    if (response.statusCode == 200) {

        //        UploadMedia(response.content);

        //        topmost().navigate({
        //            moduleName: "pages/home/home",
        //            animated: true,
        //            transition: {
        //                name: "slide",
        //                duration: 380,
        //                curve: "easeIn"
        //            }
        //        });
        //    }
        //    else {
        //        dialogs.alert("Error posting story.").then(function () {
        //            return;
        //        })
        //    }
        //}, function (e) {
        //    console.log("Error occurred " + e);
        //    console.log("url:" + global.ApiUrl + '/PostStory');
        //    dialogs.alert("Error posting story.").then(function () {
        //        return;
        //    })
        //});
    }

};


module.exports = new PostPage();