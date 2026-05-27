export default function GoToWebpageCtrl($rootScope, $scope) {
  console.debug("GoToWebpageCtrl", $scope.action);

  $scope.allow = [0, 5, 9];
  $scope.validateUrl = function() {
    $scope.action.validate();
  };
};

GoToWebpageCtrl.$inject = ["$rootScope", "$scope"];