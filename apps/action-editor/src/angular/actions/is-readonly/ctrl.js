export default function IsReadOnlyCtrl($rootScope, $scope, usedControlsSvc) {
console.debug("IsReadOnlyCtrl", $scope.action);

$scope.controlFilter = usedControlsSvc.filterItems;

    // Add new Item
    $scope.addItem = function () {
        $scope.action.addNewItem();
    };

    $scope.removeItem = function (idx) {
        // console.error("removeItem", idx);
        $scope.action.ControlsToUpdate.splice(idx, 1);
        $scope.action.validate();
    };

    $scope.onSelect = function() {
        $scope.action.validate();
    };

    $scope.$watch('action.ControlsToUpdate', function() {
        usedControlsSvc.init({
            hideProperties: true,
            controls: ['EDT'],
            displayTheseOnly: ['EDT'],
            items: $scope.action.ControlsToUpdate
        });
        $scope.controlList = usedControlsSvc.getControlList();
        $scope.controlTotal = usedControlsSvc.getControlTotal();
        usedControlsSvc.applyPropertiesWhenEditing();
    }, true);
};

IsReadOnlyCtrl.$inject = ["$rootScope", "$scope", "usedControlsSvc"];