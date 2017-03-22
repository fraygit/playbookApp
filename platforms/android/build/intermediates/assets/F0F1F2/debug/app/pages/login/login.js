var frameModule = require("ui/frame");

exports.pageLoaded = function () {

};

var navigationEntry = {
    moduleName: "pages/home/home",
    animated: true,
    transition: {
        name: "slide",
        duration: 380,
        curve: "easeIn"
    }
};

exports.Login = function () {
    frameModule.topmost().navigate(navigationEntry);
}

