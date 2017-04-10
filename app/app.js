var application = require("application");
//application.start({ moduleName: "pages/home/home" });


global.IsBlank = function (str) {
    return (!str || /^\s*$/.test(str));
};

global.ApiUrl = 'http://10.0.2.2:1001/api';


application.start({ moduleName: "pages/login/login" });




