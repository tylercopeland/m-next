export default function ExpandCollapseSectionCtrl($rootScope, $scope, $filter, usedControlsSvc) {
console.debug("ExpandCollapseSectionCtrl", $scope.action);

$scope.controlFilter = usedControlsSvc.filterItems;

// Add new Item
$scope.addItem = function () {
    var found = $filter('filter')($scope.controlList, { used: false });
    var value = (found.length > 0) ? found[0].id : null;
    $scope.action.addNewItem(value);
};

$scope.removeItem = function (idx) {
    // console.error("removeItem", idx);
    $scope.action.ControlsToUpdate.splice(idx, 1);
    $scope.action.validate();
};

$scope.onSelect = function() {
    $scope.action.validate();
};

$scope.$watch('action.ControlsToUpdate', function(curr) {
    usedControlsSvc.init({
        controls: ["SEC"],
        displayTheseOnly: true,
        hideProperties: true,
        items: $scope.action.ControlsToUpdate
    });
    $scope.controlList = usedControlsSvc.getControlList();
    $scope.controlTotal = usedControlsSvc.getControlTotal();
    usedControlsSvc.applyPropertiesWhenEditing();

    $scope.controlList = $filter('orderBy')($scope.controlList, '+label');

    if(curr.length === 0) {
        $scope.addItem();
    }
}, true);

};

ExpandCollapseSectionCtrl.$inject = ["$rootScope", "$scope", "$filter", "usedControlsSvc"];