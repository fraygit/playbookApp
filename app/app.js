var application = require("application");
var appSettings = require("application-settings");
//application.start({ moduleName: "pages/home/home" });


global.IsBlank = function (str) {
    return (!str || /^\s*$/.test(str));
};

global.ApiUrl = 'http://10.0.2.2:1001/api';

// Add token validation
var token = appSettings.getString("token", "");
if (!global.IsBlank(token)) {
    application.start({ moduleName: "pages/home/home" });
}
else {
    application.start({ moduleName: "pages/login/login" });
}






