var application = require("application");
var appSettings = require("application-settings");
var topmost = require("ui/frame").topmost;
var http = require("http");


if (application.android) {
    application.onLaunch = function (intent) {
        console.log('init');
        //imageCache.initialize();
    };
}
//application.start({ moduleName: "pages/home/home" });


global.IsBlank = function (str) {
    return (!str || /^\s*$/.test(str));
};

//global.ApiUrl = 'http://10.0.2.2:1001/api';
global.ApiUrl = 'http://api1.myplaybook.co.nz/api';

var token = appSettings.getString("token", "");

global.CallSecuredApi = function (url, method, param, queryString, resultCallback, errorCallback, errorApiCallback) {
    token = appSettings.getString("token", "");
    console.log("token:" + token);
    console.log("Call api " + url);
    http.request({
        url: global.ApiUrl + url + '?api_key=' + encodeURIComponent(token) + queryString,
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
            console.log('error thrown by api');
            errorApiCallback(response);
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

global.GenerateGuid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
};


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

console.log("token - " + token);

// Add token validation
//if (!global.IsBlank(token)) {
//    application.start({ moduleName: "pages/feed/feed" });
//}
//else {
//    application.start({ moduleName: "pages/login/login" });
//}
application.start({ moduleName: "pages/feed/feed" });






