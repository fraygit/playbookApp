var topmost = require("ui/frame").topmost;
var Observable = require("data/observable").Observable;
var appSettings = require("application-settings");

var appViewModel = new Observable();
appViewModel.selectedPage = "home";

function BasePage() {}
BasePage.prototype.viewModel = appViewModel
BasePage.prototype.pageLoaded = function(args) {
  var page = args.object;
  page.bindingContext = appViewModel;
}
BasePage.prototype.toggleDrawer = function() {
  var page = topmost().currentPage;
  page.getViewById("drawer").toggleDrawerState();
}
BasePage.prototype.navigate = function(args) {
  var pageName = args.view.text.toLowerCase().replace(" ", "");
  appViewModel.set("selectedPage", pageName);

  if (pageName == "home") {
      pageName = "feed";
  }

  var navigationEntry = {
      moduleName: "pages/" + pageName + "/" + pageName,
      animated: true,
      transition: {
          name: "slide",
          duration: 380,
          curve: "easeIn"
      }
  };
  topmost().navigate(navigationEntry);
}

BasePage.prototype.logout = function (args) {
    appSettings.setString("token", "");
    var navigationEntry = {
        moduleName: "pages/login/login",
        animated: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    };
    topmost().navigate(navigationEntry);
}

module.exports = BasePage;