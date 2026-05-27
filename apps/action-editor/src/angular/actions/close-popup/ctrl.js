export default function ClosePopUpCtrl($scope) {
    $scope.allow = [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15];
    
    // Only manage the validation checkbox
    $scope.validateBeforeClose = true;

}

ClosePopUpCtrl.$inject = ["$scope"];