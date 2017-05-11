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

exports.SignUp = function (args) {
    var txtUsername = page.getViewById("txtUsername");
    var txtFirstName = page.getViewById("txtFirstName");
    var txtLastName = page.getViewById("txtLastName");
    var txtPassword = page.getViewById("txtPassword");
    var txtPassword2 = page.getViewById("txtPassword2");
    var txtPassword2 = page.getViewById("txtPassword2");
    var btnSignUp = page.getViewById("btnSignUp");

    btnSignUp.isEnabled = false;

    if (global.IsBlank(txtUsername.text)) {
        dialogs.alert("Please input email.").then(function () {
        });
        return;
    }
    if (global.IsBlank(txtFirstName.text)) {
        dialogs.alert("Please input first name.").then(function () {
        });
        return;
    }
    if (global.IsBlank(txtLastName.text)) {
        dialogs.alert("Please input last name.").then(function () {
        });
        return;
    }
    if (global.IsBlank(txtPassword.text)) {
        dialogs.alert("Please input password.").then(function () {
        });
        return;
    }
    if (global.IsBlank(txtPassword2.text)) {
        dialogs.alert("Please input confirm password.").then(function () {
        });
        return;
    }

    if (txtPassword2.text != txtPassword.text) {
        dialogs.alert("Password does not match.").then(function () {
        });
        return;
    }

    global.CallSecuredApi("/User", "PUT", JSON.stringify({ Email: txtUsername.text, FirstName: txtFirstName.text, LastName: txtLastName.text, Password: txtPassword.text }), "",
        function (result) {
            console.log("ok signup:" + JSON.stringify(result));

            dialogs.alert("Account has been created. Please check your email and click the link to activate account.").then(function () {
                frameModule.topmost().navigate({
                    moduleName: "pages/login/login",
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 380,
                        curve: "easeIn"
                    }
                });
            });

            //http.request({
            //    url: global.ApiUrl + '/User',
            //    method: "POST",
            //    headers: { "Content-Type": "application/json" },
            //    content: JSON.stringify({ Email: txtUsername.text, Password: txtPassword.text })
            //}).then(function (response) {
            //    console.log("response:" + response.statusCode);
            //    if (response.statusCode == 200) {
            //        var userToken = JSON.parse(response.content);
            //        console.log("token:" + userToken.UserToken.Token);



            //        //appSettings.setString("token", userToken.UserToken.Token);

            //        //var homePage = {
            //        //    moduleName: "pages/home/home",
            //        //    animated: true,
            //        //    transition: {
            //        //        name: "slide",
            //        //        duration: 380,
            //        //        curve: "easeIn"
            //        //    }
            //        //};
            //        //frameModule.topmost().navigate(homePage);
            //    }
            //    else {
            //        dialogs.alert("Invalid username or password!").then(function () {
            //            return;
            //        })
            //    }

            //}, function (e) {
            //    console.log("Error occurred " + e);
            //    console.log("url:" + global.ApiUrl + '/PostStory');
            //    dialogs.alert("Invalid username or password!").then(function () {
            //        return;
            //    })
            //});

        },
        function (error) {
            console.log('here error:' + error);
            btnSignUp.isEnabled = true;
        },
        function (apiErrorMessage) {
            dialogs.alert("User with the same email address already exist.").then(function () {
                btnSignUp.isEnabled = true;
            });
        });
};