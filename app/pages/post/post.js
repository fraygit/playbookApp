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
var webViewInterfaceModule = require('nativescript-webview-interface');
var oWebViewInterface;

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
var taggedChildred = [];

var photosCaptured = new ObservableArray.ObservableArray([]);
var photosList = new Observable.Observable();


var mediaArr = new ObservableArray.ObservableArray([]);

var viewModel = new Observable.Observable({
    SelectedMedia: mediaArr
});


console.log("ok post");

PostPage.prototype.TestWb = function (args) {
    oWebViewInterface.emit('RetrieveData', '');
}

PostPage.prototype.contentLoaded = function (args) {
    console.log("ok post2");
    page = args.object;
    //page.bindingContext = childrenList;
    page.bindingContext = viewModel;
    photosCaptured = new ObservableArray.ObservableArray([]);

    //children = [];
    //children = new ObservableArray.ObservableArray([]);

    //while (mediaArr.length > 0) {
    //    mediaArr.pop();
    //}

    var wvWriteStory = page.getViewById('wvWriteStory');
    if (wvWriteStory.android) { // in IOS android will be undefined
        wvWriteStory.android.getSettings().setBuiltInZoomControls(false);
    }
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(wvWriteStory, '~/www/writestory.html')
    oWebViewInterface.on('GetValues', function (eventData) {
        console.log(JSON.stringify(eventData));
        PostStory(eventData);
    });

    //wvTagChild = page.getViewById('wvTagChild');
    //if (wvTagChild.android) { // in IOS android will be undefined
    //    wvTagChild.android.getSettings().setBuiltInZoomControls(false);
    //}
    //oWebViewInterface = new webViewInterfaceModule.WebViewInterface(wvTagChild, '~/www/tag.html')
    //wvTagChild.on('loadFinished', function (wbargs) {
    //    if (!args.error) {

    //        global.CallSecuredApi("/Child", "GET", null, "",
    //            function (result) {
    //                console.log("get children");
    //                console.log(result);
    //                var list = JSON.parse(result);
    //                console.log(list);
    //                var token = appSettings.getString("token", "");
    //                var chdrn = [];
    //                for (var i = 0; i < list.length; i++) {
    //                    var filename = 'img_' + new Date().getTime() + '.jpg';

    //                    var childItem = {
    //                        Name: list[i].FirstName,
    //                        Id: list[i].Id,
    //                        ProfileImage: global.ApiUrl + "/PostMedia" + '?api_key=' + encodeURIComponent(token) + "&path=" + encodeURIComponent(list[i].ProfilePhoto) + "&filename=" + filename,
    //                    };
    //                    chdrn.push(childItem);
    //                }
                    
    //                oWebViewInterface.emit('LoadChildrenList', JSON.stringify(chdrn));

    //            },
    //            function (error) {
    //            },
    //            function (apiErrorMessage) {
    //            });


            
    //    }
    //});

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

    //global.CallSecuredApi("/Child", "GET", null, "",
    //    function (result) {
    //        console.log("get children");
    //        console.log(result);
    //        var list = JSON.parse(result);
    //        console.log(list);
    //        var token = appSettings.getString("token", "");

    //        for (var i = 0; i < list.length; i++) {
    //            var filename = 'img_' + new Date().getTime() + '.jpg';

    //            var imageClass = 'list-item';
    //            if (childrenSelected != undefined) {
    //                for (var c = 0; c < childrenSelected.length; c++) {
    //                    if (childrenSelected[c] == list[i].Id) {
    //                        imageClass = 'list-item-selected';
    //                    }
    //                }
    //            }

    //            var child = new Observable.Observable({
    //                Name: list[i].FirstName,
    //                Id: list[i].Id,
    //                Class: imageClass,
    //                ProfileImage: global.ApiUrl + "/PostMedia" + '?api_key=' + encodeURIComponent(token) + "&path=" + encodeURIComponent(list[i].ProfilePhoto) + "&filename=" + filename,
    //            });
    //            children.push(child);


    //        }
    //        childrenList.set("childrenList", children);

    //    },
    //    function (error) {
    //    },
    //    function (apiErrorMessage) {
    //    });

    
    console.log("ok post 3");
};

PostPage.prototype.SelectChild = function (args) {
    var item = args.object;
    var itemData = item.bindingContext;
    var tabView1 = page.getViewById("tabView1");
    tabView1.selectedIndex = 1;

    if (itemData.Class == 'list-item') {
        itemData.Class = 'list-item-selected';
        taggedChildred.push(itemData.Id);
    }
    else {
        itemData.Class = 'list-item';
        for (var g = 0; g < taggedChildred.length; g++) {
            if (taggedChildred[g] == itemData.Id) {
                taggedChildred.splice(g, 1);
            }
        }
    }
    console.log('tagged:' + JSON.stringify(taggedChildred));
    console.log('item:' + JSON.stringify(itemData));
}

PostPage.prototype.GoBack = function () {
    selectedImages = [];
    capturedImages = [];
    topmost().navigate({
        moduleName: "pages/tagchild/tagchild",
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
    console.log(children.getItem[0]);
    //for (var c = 0; c < children.length; c++) {
    //    if (children.getItem[c].Class == "list-item-selected") {
    //        childrenSelected.push(children.getItem[c].Id);
    //        console.log("Selected Child: " + children.getItem[c].Name);
    //    }
    //}
};

PostPage.prototype.OpenCamera = function () {
    //GetSelectedChildren();
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

                //var pnlMedia = page.getViewById("pnlMedia");
                //pnlMedia.bindingContext = photosList;

                var mediaItem = new Observable.Observable({ Id: generateGuid(), Image: imageAsset, ImagePath: filepath, Filename: filename, Preview: filepath });
                mediaArr.push(mediaItem);

                //var photo = new Observable.Observable({ Id: generateGuid(), Image: imageAsset, ImagePath: filepath, Filename: filename });
                //photosCaptured.push(photo);
                //childrenList.set("testOB", "f");
                //ReloadImages();

            });
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
}

PostPage.prototype.DeletePhoto = function (args) {
    var item = args.object;
    var itemData = item.bindingContext;
    for (var i = 0; i < mediaArr.length; i++) {
        console.log('image to delete:' + mediaArr.getItem(i).Id);
        console.log('image to :' + itemData.Id);
        if (mediaArr.getItem(i).Id == itemData.Id) {
            console.log('delete');
            mediaArr.splice(i,1);
        }
    }
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

                var mediaItem = { Id: generateGuid(), ImagePath: selected.fileUri, Thumb: selected.thumb, Filename: filename, Preview: selected.thumb };
                mediaArr.push(mediaItem);


                //ReloadImages();
            });
        }).catch(function (e) {
            console.log(e);
        });
}

var UploadMedia = function (storyId) {
    console.log("Start Upload");
    var token = appSettings.getString("token", "");

    console.log(mediaArr.length);
    for (var i = 0; i < mediaArr.length; i++) {
        var request = {
            url: global.ApiUrl + '/PostMedia?api_key=' + encodeURIComponent(token),
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": mediaArr.getItem(i).Filename
            },
            description: "{ 'storyid': '" + storyId + "' }"
        };
        console.log('request' + JSON.stringify(request));
        var params = [{ name: "StoryId", value: storyId.toString() }, { name: "fileToUpload", filename: mediaArr.getItem(i).ImagePath, mimeType: 'image/jpeg' }];
        var task = session.multipartUpload(params, request);
        console.log("uploading: " + mediaArr.getItem(i).ImagePath);

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

    while (mediaArr.length > 0) {
        mediaArr.pop();
    }

    //for (var i = 0; i < capturedImages.length; i++) {
    //    var request = {
    //        url: global.ApiUrl + '/PostMedia?api_key=' + encodeURIComponent(token),
    //        method: "POST",
    //        headers: {
    //            "Content-Type": "application/octet-stream",
    //            "File-Name": capturedImages[i].Filename
    //        },
    //        description: "{ 'storyid': '" + storyId + "' }"
    //    };
    //    var params = [{ name: "StoryId", value: storyId.toString() }, { name: "fileToUpload", filename: capturedImages[i].ImagePath, mimeType: 'image/jpeg' }];
    //    var task = session.multipartUpload(params, request);
    //    console.log("uploading: " + capturedImages[i].ImagePath);

    //    task.on("progress", function () {
    //        console.log("progress");
    //    });
    //    task.on("error", function () {
    //        console.log("error");
    //    });
    //    task.on("complete", function () {
    //        console.log("complete");
    //    });

    //}
    //capturedImages = [];
    //console.log("upload " + global.ApiUrl + '/PostMedia?api_key=' + token);
    //for (var i = 0; i < selectedImages.length; i++) {
    //    var request = {
    //        url: global.ApiUrl + '/PostMedia?api_key=' + encodeURIComponent(token),
    //        method: "POST",
    //        headers: {
    //            "Content-Type": "application/octet-stream",
    //            "File-Name": selectedImages[i].Filename
    //        },
    //        description: "{ 'storyid': '" + storyId + "' }"
    //    };
    //    var params = [{ name: "StoryId", value: storyId.toString() }, { name: "fileToUpload", filename: selectedImages[i].ImagePath, mimeType: 'image/jpeg' }];
    //    var task = session.multipartUpload(params, request);
    //    console.log("uploading: " + selectedImages[i].ImagePath);

    //    task.on("progress", function () {
    //        console.log("progress");
    //    });
    //    task.on("error", function () {
    //        console.log("error");
    //    });
    //    task.on("complete", function () {
    //        console.log("complete");
    //    });

    //}
    selectedImages = [];

}


var PostStory = function (postData) {
    var isContinuePost = true;
    //txtStory = page.getViewById("txtStory");
    //txtTitle = page.getViewById("txtTitle");


    if (global.IsBlank(postData.Title)) {
        isContinuePost = false;
        dialogs.alert("Can not post story. Title is blank!").then(function () {

        })
    }

    if (isContinuePost) {

        GetSelectedChildren();

        //UploadMedia(response.content);
        var taggedChildren = [];
        if (appSettings.getString("TaggedChild", "") != "") {
            taggedChildren = JSON.parse(appSettings.getString("TaggedChild", ""));
        }

        var postStory = {
            Type: postData.Type,
            Title: postData.Title,
            Content: postData.Story,
            WrittenBy: 'fy',
            PlaycentreId: appSettings.getString("PlaycentreId", ""),
            TaggedChildren: taggedChildren,
            Noticing: postData.Story,
            Recognising: postData.Recognising,
            Responding: postData.Responding,
            Strand1: postData.Strand1,
            Strand1Goal1: postData.Strand1Goal1,
            Strand1Goal2: postData.Strand1Goal2,
            Strand1Goal3: postData.Strand1Goal3,
            Strand2: postData.Strand2,
            Strand2Goal1: postData.Strand2Goal1,
            Strand2Goal2: postData.Strand2Goal2,
            Strand2Goal3: postData.Strand2Goal3,
            Strand2Goal4: postData.Strand2Goal4,
            Strand3: postData.Strand3,
            Strand3Goal1: postData.Strand3Goal1,
            Strand3Goal2: postData.Strand2Goal2,
            Strand3Goal3: postData.Strand2Goal3,
            Strand4: postData.Strand4,
            Strand4Goal1: postData.Strand4Goal1,
            Strand4Goal2: postData.Strand4Goal2,
            Strand4Goal3: postData.Strand4Goal3,
            Strand4Goal4: postData.Strand4Goal4,
            Strand5: postData.Strand5,
            Strand5Goal1: postData.Strand5Goal1,
            Strand5Goal2: postData.Strand5Goal2,
            Strand5Goal3: postData.Strand5Goal3,
            Strand5Goal4: postData.Strand5Goal4
        };

        //var postStory = {
        //    Title: txtTitle.text,
        //    Content: txtStory.text,
        //    WrittenBy: 'fy',
        //    PlaycentreId: appSettings.getString("PlaycentreId", ""),
        //    TaggedChildren: childrenSelected,
        //    Noticing: txtNoticing.text,
        //    Recognising: txtRecognising.text,
        //    Responding: txtResponding.text,
        //    Strand1: chkStrand1.checked,
        //    Strand1Goal1: chkStrand1Goal1.checked,
        //    Strand1Goal2: chkStrand1Goal2.checked,
        //    Strand1Goal3: chkStrand1Goal3.checked,
        //    Strand2: chkStrand2.checked,
        //    Strand2Goal1: chkStrand2Goal1.checked,
        //    Strand2Goal2: chkStrand2Goal2.checked,
        //    Strand2Goal3: chkStrand2Goal3.checked,
        //    Strand2Goal4: chkStrand2Goal4.checked,
        //    Strand3: chkStrand3.checked,
        //    Strand3Goal1: chkStrand3Goal1.checked,
        //    Strand3Goal2: chkStrand3Goal2.checked,
        //    Strand3Goal3: chkStrand3Goal3.checked,
        //    Strand4: chkStrand4.checked,
        //    Strand4Goal1: chkStrand4Goal1.checked,
        //    Strand4Goal2: chkStrand4Goal2.checked,
        //    Strand4Goal3: chkStrand4Goal3.checked,
        //    Strand4Goal4: chkStrand4Goal4.checked,
        //    Strand5: chkStrand5.checked,
        //    Strand5Goal1: chkStrand5Goal1.checked,
        //    Strand5Goal2: chkStrand5Goal2.checked,
        //    Strand5Goal3: chkStrand5Goal3.checked,
        //    Strand5Goal4: chkStrand5Goal4.checked
        //};

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


    }

}

PostPage.prototype.Post = function () {
    oWebViewInterface.emit('RetrieveData', '');
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