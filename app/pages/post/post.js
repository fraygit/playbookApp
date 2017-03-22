var BasePage = require("../../shared/BasePage");

var PostPage = function () { };
PostPage.prototype = new BasePage();
PostPage.prototype.constructor = PostPage;


module.exports = new PostPage();