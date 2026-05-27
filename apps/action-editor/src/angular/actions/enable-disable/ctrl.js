export default function EnableDisableControlCtrl($rootScope, $scope, usedControlsSvc) {
    console.debug("EnableDisableControlCtrl", $scope.action);

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
            items: $scope.action.ControlsToUpdate
        });
        $scope.controlList = usedControlsSvc.getControlList();
        $scope.controlTotal = usedControlsSvc.getControlTotal();
        usedControlsSvc.applyPropertiesWhenEditing();
    }, true);
};

EnableDisableControlCtrl.$inject = ["$rootScope", "$scope", "usedControlsSvc"];