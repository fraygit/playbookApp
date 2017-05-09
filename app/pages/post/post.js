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
var childrenSelected;

var photosCaptured = new ObservableArray.ObservableArray([]);
var photosList = new Observable.Observable();


console.log("ok post");

PostPage.prototype.contentLoaded = function (args) {
    console.log("ok post2");
    page = args.object;
    page.bindingContext = childrenList;
    photosCaptured = new ObservableArray.ObservableArray([]);

    children = [];


    //children.push(new Observable.Observable({
    //    Name: 'Andy',
    //    Id: '123',
    //    ProfileImage: 'https://assets.babycenter.com/ims/2016/10/iStock_43693432_4x3.jpg',
    //    Class: 'list-item'
    //}));
    //children.push(new Observable.Observable({
    //    Name: 'Sam',
    //    Id: '456',
    //    ProfileImage: 'https://pbs.twimg.com/profile_images/450103729383956480/Tiys3m4x.jpeg',
    //    Class: 'list-item'
    //}));

    var GetImageFromCache = function (imgPath, childItem, imgCallBack) {
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
                    console.log("image completed");
                    console.log("image output: " + JSON.stringify(cachedImage));
                    if (imgPath === key) {
                        imgSrc = imageSource.fromNativeSource(cachedImage);
                        imgCallBack(imgSrc, childItem);
                    }
                }
            });
        }

    };

    global.CallSecuredApi("/Child", "GET", null, "",
        function (result) {
            console.log("get children");
            console.log(result);
            var list = JSON.parse(result);
            console.log(list);
            var token = appSettings.getString("token", "");

            for (var i = 0; i < list.length; i++) {
                var filename = 'img_' + new Date().getTime() + '.jpg';

                var imageClass = 'list-item';
                if (childrenSelected != undefined) {
                    for (var c = 0; c < childrenSelected.length; c++) {
                        if (childrenSelected[c] == list[i].Id) {
                            imageClass = 'list-item-selected';
                        }
                    }
                }
                var child = new Observable.Observable({
                    Name: list[i].FirstName,
                    Id: list[i].Id,
                    Class: imageClass,
                    ProfileImage: global.ApiUrl + "/PostMedia" + '?api_key=' + token + "&path=" + encodeURIComponent(list[i].ProfilePhoto) + "&filename=" + filename,
                });
                children.push(child);


            }
            childrenList.set("childrenList", children);

        },
        function (error) {
        },
        function (apiErrorMessage) {
        });

    
    console.log("ok post 3");
};

PostPage.prototype.SelectChild = function (args) {
    var item = args.object;
    var itemData = item.bindingContext;
    var tabView1 = page.getViewById("tabView1");
    tabView1.selectedIndex = 1;

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

PostPage.prototype.DeletePhoto = function () {
    dialogs.confirm("Your message").then(function (result) {
        console.log("Dialog result: " + result);
    });
    //for (var i = 0; i < capturedImages.length; i++) {
    //    if (capturedImages[i].Id == imageGuid)
    //    {
    //        capturedImages.splice(i, 1);
    //    }
    //}
    //ReloadImages();
}

var ReloadImages = function () {

    pnlMedia = page.getViewById("pnlMedia");
    txtStory = page.getViewById("txtStory");
    txtStory.height = "44%";
    pnlMedia.height = "42%";

    pnlMedia.removeChildren();

    var numOfImages = capturedImages.length + selectedImages.length;
    var imgWidth = 100 / numOfImages;
    console.log("num images : " + numOfImages);

    if (numOfImages > 0) {
        for (var i = 0; i < capturedImages.length; i++) {
            var newImage = new image.Image();
            newImage.src = capturedImages[i].ImagePath;
            newImage.id = capturedImages[i].Id;
            newImage.class = "imagecaptured";
            newImage.height = '65px';
            newImage.tap = "DeletePhoto";
            pnlMedia.addChild(newImage);
            var newLabel = new label.Label();
            newLabel.text = " ";
            pnlMedia.addChild(newLabel);
        }
        for (var i = 0; i < selectedImages.length; i++) {
            var newImage = new image.Image();
            newImage.src = selectedImages[i].Thumb;
            newImage.id = selectedImages[i].Id;
            newImage.class = "imagecaptured";
            newImage.height = '65px';
            pnlMedia.addChild(newImage);
            var newLabel2 = new label.Label();
            newLabel2.text = " ";
            pnlMedia.addChild(newLabel2);
        }
    }
    
};

var GetSelectedChildren = function () {
    childrenSelected = [];
    for (var c = 0; c < children.length; c++) {
        if (children[c].Class == "list-item-selected") {
            childrenSelected.push(children[c].Id);
            console.log("Selected Child: " + children[c].Name);
        }
    }
};

PostPage.prototype.OpenCamera = function () {
    GetSelectedChildren();
    camera.requestPermissions();
    var cameraOptions = { width: 300, height: 300, keepAspectRatio: false, saveToGallery: true };
    camera.takePicture(cameraOptions)
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
                console.log(imageAsset);

                var pnlMedia = page.getViewById("pnlMedia");
                pnlMedia.bindingContext = photosList;                

                //var photo = new Observable.Observable({ Id: generateGuid(), Image: imageAsset, ImagePath: filepath, Filename: filename });
                //photosCaptured.push(photo);
                //childrenList.set("testOB", "f");
                ReloadImages();

            });
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
}


PostPage.prototype.OpenGallery = function () {
    GetSelectedChildren();
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
                var filename = 'img_' + new Date().getTime() + '.jpg';
                var newImageCaptured = { Id: generateGuid(), ImagePath: selected.fileUri, Thumb: selected.thumb, Filename: filename };
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
    txtTitle = page.getViewById("txtTitle");
    var txtNoticing = page.getViewById("txtNoticing");
    var txtRecognising = page.getViewById("txtRecognising");
    var txtResponding = page.getViewById("txtResponding");
    var chkStrand1 = page.getViewById("chkStrand1");
    var chkStrand1Goal1 = page.getViewById("chkStrand1Goal1");
    var chkStrand1Goal2 = page.getViewById("chkStrand1Goal2");
    var chkStrand1Goal3 = page.getViewById("chkStrand1Goal3");
    var chkStrand2 = page.getViewById("chkStrand2");
    var chkStrand2Goal1 = page.getViewById("chkStrand2Goal1");
    var chkStrand2Goal2 = page.getViewById("chkStrand2Goal2");
    var chkStrand2Goal3 = page.getViewById("chkStrand2Goal3");
    var chkStrand2Goal4 = page.getViewById("chkStrand2Goal4");
    var chkStrand3 = page.getViewById("chkStrand3");
    var chkStrand3Goal1 = page.getViewById("chkStrand3Goal1");
    var chkStrand3Goal2 = page.getViewById("chkStrand3Goal2");
    var chkStrand3Goal3 = page.getViewById("chkStrand3Goal3");
    var chkStrand4 = page.getViewById("chkStrand4");
    var chkStrand4Goal1 = page.getViewById("chkStrand4Goal1");
    var chkStrand4Goal2 = page.getViewById("chkStrand4Goal2");
    var chkStrand4Goal3 = page.getViewById("chkStrand4Goal3");
    var chkStrand4Goal4 = page.getViewById("chkStrand4Goal4");
    var chkStrand5 = page.getViewById("chkStrand5");
    var chkStrand5Goal1 = page.getViewById("chkStrand5Goal1");
    var chkStrand5Goal2 = page.getViewById("chkStrand5Goal2");
    var chkStrand5Goal3 = page.getViewById("chkStrand5Goal3");
    var chkStrand5Goal4 = page.getViewById("chkStrand5Goal4");

    if (global.IsBlank(txtStory.text)) {
        isContinuePost = false;
        dialogs.alert("Can not post story. Story is blank!").then(function () {
            
        })
    }

    if (isContinuePost) {

        GetSelectedChildren();

        //UploadMedia(response.content);

        var postStory = {
            Title: txtTitle.text,
            Content: txtStory.text,
            WrittenBy: 'fy',
            PlaycentreId: appSettings.getString("PlaycentreId", ""),
            TaggedChildren: childrenSelected,
            Noticing: txtNoticing.text,
            Recognising: txtRecognising.text,
            Responding: txtResponding.text,
            Strand1: chkStrand1.checked,
            Strand1Goal1: chkStrand1Goal1.checked,
            Strand1Goal2: chkStrand1Goal2.checked,
            Strand1Goal3: chkStrand1Goal3.checked,
            Strand2: chkStrand2.checked,
            Strand2Goal1: chkStrand2Goal1.checked,
            Strand2Goal2: chkStrand2Goal2.checked,
            Strand2Goal3: chkStrand2Goal3.checked,
            Strand2Goal4: chkStrand2Goal4.checked,
            Strand3: chkStrand3.checked,
            Strand3Goal1: chkStrand3Goal1.checked,
            Strand3Goal2: chkStrand3Goal2.checked,
            Strand3Goal3: chkStrand3Goal3.checked,
            Strand4: chkStrand4.checked,
            Strand4Goal1: chkStrand4Goal1.checked,
            Strand4Goal2: chkStrand4Goal2.checked,
            Strand4Goal3: chkStrand4Goal3.checked,
            Strand4Goal4: chkStrand4Goal4.checked,
            Strand5: chkStrand5.checked,
            Strand5Goal1: chkStrand5Goal1.checked,
            Strand5Goal2: chkStrand5Goal2.checked,
            Strand5Goal3: chkStrand5Goal3.checked,
            Strand5Goal4: chkStrand5Goal4.checked
        };

        global.CallSecuredApi("/PostStory", "POST", JSON.stringify(postStory), "",
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

PostPage.prototype.ChangeStrand1 = function () {
    console.log('tap strand');
    var chkStrand1 = page.getViewById("chkStrand1");
    console.log('tap strand' + chkStrand1.checked);

    var pnlStrand1 = page.getViewById("pnlStrand1");
    if (!chkStrand1.checked) {
        pnlStrand1.visibility = 'visible';
    }
    else {
        pnlStrand1.visibility = 'collapsed';
    }
};


PostPage.prototype.ChangeStrand1 = function () {
    console.log('tap strand');
    var chkStrand1 = page.getViewById("chkStrand1");
    console.log('tap strand' + chkStrand1.checked);

    var pnlStrand1 = page.getViewById("pnlStrand1");
    if (!chkStrand1.checked) {
        pnlStrand1.visibility = 'visible';
    }
    else {
        pnlStrand1.visibility = 'collapsed';
    }
};

PostPage.prototype.ChangeStrand2 = function () {
    console.log('tap strand');
    var chkStrand2 = page.getViewById("chkStrand2");
    console.log('tap strand' + chkStrand2.checked);
    var pnlStrand2 = page.getViewById("pnlStrand2");
    if (!chkStrand2.checked) {
        pnlStrand2.visibility = 'visible';
    }
    else {
        pnlStrand2.visibility = 'collapsed';
    }
};

PostPage.prototype.ChangeStrand3 = function () {
    console.log('tap strand');
    var chkStrand3 = page.getViewById("chkStrand3");
    console.log('tap strand' + chkStrand3.checked);
    var pnlStrand3 = page.getViewById("pnlStrand3");
    if (!chkStrand3.checked) {
        pnlStrand3.visibility = 'visible';
    }
    else {
        pnlStrand3.visibility = 'collapsed';
    }
};

PostPage.prototype.ChangeStrand4 = function () {
    console.log('tap strand');
    var chkStrand4 = page.getViewById("chkStrand4");
    console.log('tap strand' + chkStrand4.checked);
    var pnlStrand4 = page.getViewById("pnlStrand4");
    if (!chkStrand4.checked) {
        pnlStrand4.visibility = 'visible';
    }
    else {
        pnlStrand4.visibility = 'collapsed';
    }
};

PostPage.prototype.ChangeStrand5 = function () {
    console.log('tap strand');
    var chkStrand5 = page.getViewById("chkStrand5");
    console.log('tap strand' + chkStrand5.checked);
    var pnlStrand5 = page.getViewById("pnlStrand5");
    if (!chkStrand5.checked) {
        pnlStrand5.visibility = 'visible';
    }
    else {
        pnlStrand5.visibility = 'collapsed';
    }
};


module.exports = new PostPage();