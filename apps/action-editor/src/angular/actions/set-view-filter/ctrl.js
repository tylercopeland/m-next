export default function SetViewFilterCtrl($rootScope, $scope, $filter, editorSvc, usedControlsSvc) {
    console.debug("SetViewFilterCtrl", $scope.action);

    $scope.controlList = [];
    $scope.filterList = [];
    $scope.controlFilter = usedControlsSvc.filterItems;
    
    $scope.addItem = function () {
        $scope.action.addNewItem();
    };

    $scope.removeItem = function (idx) {
        $scope.action.ViewFilters.splice(idx, 1);
        $scope.action.validate();
    };

    $scope.onSelect = function (item) {
        $scope.action.loadFilters(item);
        $scope.action.validate();
    }

    $scope.validateAction = function() {
        $scope.action.validate();
    };

    $scope.$watch('action.ViewFilters', function () {
        //$scope.loadFilters();
        usedControlsSvc.init({
            controls: ["GRD", "EDT"],
            displayTheseOnly: true,
            hideProperties: true,
            items: $scope.action.ViewFilters
        });
        $scope.controlList = usedControlsSvc.getControlList();
        var total = usedControlsSvc.getControlTotal(),
            adjustCount = 0;

        angular.forEach($scope.controlList, function(ctrl, idx){
            $scope.action.getFilterCount(ctrl);
            if(ctrl.filterCount === 0) { 
                adjustCount++; 
                $scope.controlList.splice(idx, 1);
            }
        });
        $scope.controlTotal = total - adjustCount;

        usedControlsSvc.applyPropertiesWhenEditing();
    }, true);
};

SetViewFilterCtrl.$inject = ["$rootScope", "$scope", "$filter", "editorSvc", "usedControlsSvc"];