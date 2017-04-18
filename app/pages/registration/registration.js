var frameModule = require("ui/frame");
var appSettings = require("application-settings");
var http = require("http");
var dialogs = require("ui/dialogs");

var page;

exports.pageLoaded = function (args) {
    page = args.object;
    console.log('app started - login page');
};


exports.GoLogin = function (args) {
    var loginPage = {
        moduleName: "pages/login/login",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    };
    frameModule.topmost().navigate(loginPage);
};