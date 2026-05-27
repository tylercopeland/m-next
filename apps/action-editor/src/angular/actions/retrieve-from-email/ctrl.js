export default function RetrieveValuesFromEmailCtrl($scope, $filter) {
    console.debug("RetrieveValuesFromEmailCtrl", $scope.action);

    $scope.criteriaBuilder = false;
    $scope.canContinue = false;
    $scope.usedValues = [];

    $scope.usedValues = function (item) {
        return function (opt) {
            var found = $filter('filter')($scope.action.Bindings, { ValueName: opt.value }, true);
            return found.length === 0 || opt.value === item.ValueName;
        };
    }

    $scope.addItem = function () {
        $scope.action.addItem();
    };

    $scope.removeItem = function (idx) {
        $scope.action.Bindings.splice(idx, 1);
    };

    $scope.updateValidation = function(item) {
        $scope.action.validateItem(item);
    };
};

RetrieveValuesFromEmailCtrl.$inject = ["$scope", "$filter"];