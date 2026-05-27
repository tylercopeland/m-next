export default function ShowHideControlCtrl($scope, usedControlsSvc) {
console.debug("ShowHideControlCtrl", $scope.action);

$scope.controlFilter = usedControlsSvc.filterItems;

$scope.addItem = function() {
    $scope.action.addNewItem();
    $scope.updateController();
};

$scope.removeItem = function (idx) {
    // console.error("removeItem", idx);
    $scope.action.ControlsToUpdate.splice(idx, 1);
    $scope.updateController();
    $scope.action.validate();
};

$scope.itemSelection = function(_selected, _item) {
    $scope.updateController();
    $scope.action.validate();
};

$scope.updateController = function() {
    usedControlsSvc.init({
        
        hideProperties: true,
        items: $scope.action.ControlsToUpdate
    });
    $scope.controlList = usedControlsSvc.getControlList();
    $scope.controlTotal = usedControlsSvc.getControlTotal();
    $scope.action.ControlsToUpdate = usedControlsSvc.getItemList();
    usedControlsSvc.applyPropertiesWhenEditing();
};
$scope.updateController();
};

ShowHideControlCtrl.$inject = ["$scope", "usedControlsSvc"];