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

MyChildrenPage.prototype.contentLoaded = function (args) {
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
};

MyChildrenPage.prototype.GoBack = function () {
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

