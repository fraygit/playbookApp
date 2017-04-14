var application = require("application");
var appSettings = require("application-settings");
var topmost = require("ui/frame").topmost;
var http = require("http");
//application.start({ moduleName: "pages/home/home" });


global.IsBlank = function (str) {
    return (!str || /^\s*$/.test(str));
};

global.ApiUrl = 'http://10.0.2.2:1001/api';

var token = appSettings.getString("token", "");

global.CallSecuredApi = function (url, method, param, queryString, resultCallback, errorCallback, errorApiCallback) {
    token = appSettings.getString("token", "");
    console.log("token:" + token);
    console.log("Call api " + url);
    http.request({
        url: global.ApiUrl + url + '?api_key=' + token + queryString,
        method: method,
        headers: { "Content-Type": "application/json" },
        content: param
    }).then(function (response) {

        console.log(url + " - status:" + response.statusCode);
        if (response.statusCode == 200) {
            resultCallback(response.content);
        }
        else if (response.statusCode == 403) {
            console.log("forbidden");
            appSettings.setString("token", "");
            topmost().navigate({
                moduleName: "pages/login/login",
                animated: true,
                transition: {
                    name: "slide",
                    duration: 380,
                    curve: "easeIn"
                }
            });
        }
        else {
            errorApiCallback();
        }
    }, function (e) {
        errorCallback(e);
        //console.log("Error occurred " + e);
        //console.log("url:" + global.ApiUrl + '/PostStory');
        //dialogs.alert("Error posting story.").then(function () {
        //    return;
        //})
    });
}

global.FormatDate = function (date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

// Add token validation
if (!global.IsBlank(token)) {
    application.start({ moduleName: "pages/home/home" });
}
else {
    application.start({ moduleName: "pages/login/login" });
}






