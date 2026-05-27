export default function RetrieveExchangeRateCtrl($rootScope, $scope) {
  console.debug("retrieveExchangeRate", $scope.action);

  $scope.allow = [0, 2, 3, 5, 6, 8, 11];
  $scope.allowCurr = [0, 2, 3, 5, 6, 8, 9];


};

RetrieveExchangeRateCtrl.$inject = ["$rootScope", "$scope"];