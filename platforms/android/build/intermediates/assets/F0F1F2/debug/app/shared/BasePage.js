var topmost = require("ui/frame").topmost;
var Observable = require("data/observable").Observable;

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
  var pageName = args.view.text.toLowerCase();
  appViewModel.set("selectedPage", pageName);

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

module.exports = BasePage;