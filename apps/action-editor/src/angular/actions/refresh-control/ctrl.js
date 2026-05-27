export default function RefreshControlCtrl($rootScope, $scope, $filter, usedControlsSvc) {
    console.debug("RefreshControlCtrl", $scope.action);

    $scope.controlFilter = usedControlsSvc.filterItems;

    $scope.addItem = function () {
        $scope.action.addNewItem();
        $scope.updateController();
    };

    $scope.removeItem = function (idx) {
        $scope.action.ControlsToRefresh.splice(idx, 1);
        $scope.updateController();
        $scope.action.validate();
    };

    $scope.itemSelection = function (selected, item) {
        item.isGrid = selected.type === "GRD" || selected.type === "EDT";
        $scope.updateController();
        $scope.action.validateThis(item, $scope.action);
    };

    $scope.updateController = function () {
        usedControlsSvc.init({
            controls: ["GRD", "CHT", "CAL", "EDT", "DOC", "GAL"],
            displayTheseOnly: true,
            hideProperties: true,
            items: $scope.action.ControlsToRefresh
        });
        $scope.controlList = usedControlsSvc.getControlList();
        $scope.controlTotal = usedControlsSvc.getControlTotal();
        $scope.action.ControlsToRefresh = usedControlsSvc.getItemList();
        usedControlsSvc.applyPropertiesWhenEditing();
    };
    $scope.updateController();

    $scope.configureIsGrid = function () {
        angular.forEach($scope.action.ControlsToRefresh, function (control) {
            var found = $filter('filter')($scope.controlList, { id: control.ControlId });
            if (found && found.length === 1) {
                control.isGrid = found[0].type === "GRD" || (found[0].type === "EDT")
            }
        });
    };
    $scope.configureIsGrid();
};

RefreshControlCtrl.$inject = ["$rootScope", "$scope", "$filter", "usedControlsSvc"];