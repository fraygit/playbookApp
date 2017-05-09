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

var MemberList = function (args) {
    console.log("ok profile page");

};
MemberList.prototype = new BasePage();
MemberList.prototype.constructor = MemberList;

var member = new ObservableArray.ObservableArray([]);
var memberList = new Observable.Observable();

MemberList.prototype.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = memberList;

    var playcentreId = appSettings.getString("PlaycentreId", "");

    console.log("playcentre:" + playcentreId);
    global.CallSecuredApi("/PlaycentreMembers", "GET", null, "&playcentreId=" + playcentreId,
        function (result) {
            var list = JSON.parse(result);
            console.log(list);
            member = [];

            for (var i = 0; i < list.length; i++) {
                console.log("member id:" + list[i].Id);
                member.push(list[i]);
            }
            memberList.set("memberList", member);

        },
        function (error) {
        },
        function (apiErrorMessage) {
        });
}

MemberList.prototype.AddMember = function () {
    topmost().navigate({
        moduleName: "pages/addmember/addmember",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};



MemberList.prototype.GoBack = function () {
    topmost().navigate({
        moduleName: "pages/playcentremenu/playcentremenu",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    });
};



module.exports = new MemberList();