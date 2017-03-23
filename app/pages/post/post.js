var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;

var PostPage = function () { };
PostPage.prototype = new BasePage();
PostPage.prototype.constructor = PostPage;

PostPage.prototype.GoBack = function () {
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


module.exports = new PostPage();