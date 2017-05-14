var frameModule = require("ui/frame");
var appSettings = require("application-settings");
var http = require("http");
var dialogs = require("ui/dialogs");

var page;

var navigationEntry = {
    moduleName: "pages/feed/feed",
    animated: true,
    transition: {
        name: "slide",
        duration: 380,
        curve: "easeIn"
    }
};

exports.pageLoaded = function (args) {
    page = args.object;
    console.log('app started - login page');
};

exports.GotoRegistration = function () {
    var registrationPage = {
        moduleName: "pages/registration/registration",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    };
    frameModule.topmost().navigate(registrationPage);
};

exports.Login = function () {
    txtUsername = page.getViewById("txtUsername");
    txtPassword = page.getViewById("txtPassword");

    console.log("login");

    http.request({
        url: global.ApiUrl + '/User',
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({ Email: txtUsername.text, Password: txtPassword.text })
    }).then(function (response) {
        console.log("response:" + response.statusCode);
        if (response.statusCode == 200) {
            var userToken = JSON.parse(response.content);
            console.log("token:" + userToken.UserToken.Token);

            appSettings.setString("token", userToken.UserToken.Token);

            frameModule.topmost().navigate(navigationEntry);
        }
        else {
            if (response.statusCode == 409) {
                dialogs.alert("Account has not been activated. Please check your email and click the link to activate account.").then(function () {
                    return;
                })
            }
            else {
                dialogs.alert("Invalid username or password!").then(function () {
                    return;
                })
            }
        }

    }, function (e) {
        console.log("Error occurred " + e);
        console.log("url:" + global.ApiUrl + '/PostStory');
        dialogs.alert("Invalid username or password!").then(function () {
            return;
        })
    });

    
}

