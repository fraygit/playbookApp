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

var page;
var children = new ObservableArray.ObservableArray([]);
var childrenList = new Observable.Observable();

var token = appSettings.getString("token", "");

var MyChildrenPage = function (args) {
    console.log("my children page");
    //var page = args.object;
    //var params = page.navigationContext;
    //console.log("image:" + params.image);
    //if (params.image != null) {

    //}
};
MyChildrenPage.prototype = new BasePage();
MyChildrenPage.prototype.constructor = MyChildrenPage;

MyChildrenPage.prototype.SelectChild = function (args) {
    var item = args.object;
    var itemData = item.bindingContext;
    console.log("child id" + itemData.Id);
    appSettings.setString("CurrentChildId", itemData.Id);
    topmost().navigate({
        moduleName: "pages/mychildmenu/mychildmenu",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        },
        context: { Name: itemData.Name }
    });
};

MyChildrenPage.prototype.contentLoaded = function (args) {
    page = args.object;
    page.bindingContext = childrenList;
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

    global.CallSecuredApi("/Child", "GET", null, "",
        function (result) {
            console.log("get children");
            console.log(result);
            var list = JSON.parse(result);
            console.log(list);

            for (var i = 0; i < list.length; i++) {
                var filename = 'img_' + new Date().getTime() + '.jpg';

                var child = new Observable.Observable({
                    Name: list[i].FirstName,
                    Id: list[i].Id,
                    Class: 'list-item',
                    ProfileImage: global.ApiUrl + "/PostMedia" + '?api_key=' + token + "&path=" + encodeURIComponent(list[i].ProfilePhoto) + "&filename=" + filename
                });
                children.push(child);

            }
            childrenList.set("childrenList", children);

        },
        function (error) {
        },
        function (apiErrorMessage) {
        });

};


MyChildrenPage.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/feed/feed",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};

MyChildrenPage.prototype.addChild = function () {
    topmost().navigate({
        moduleName: "pages/addchild/addchild",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};


module.exports = new MyChildrenPage();

