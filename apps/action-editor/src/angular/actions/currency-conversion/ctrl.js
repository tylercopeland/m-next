export default function CurrencyConversionCtrl($rootScope, $scope) {
  console.debug('currencyConversion', $scope.action);

  $scope.allowVal = [0, 2, 3, 5, 6, 8, 9, 10];
  $scope.allowRate = [0, 2, 3, 5, 6, 8, 9, 10];
};

CurrencyConversionCtrl.$inject = ['$rootScope', '$scope'];