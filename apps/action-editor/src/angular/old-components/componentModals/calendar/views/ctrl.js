const ComponentCalendarViewsCtrl = function ($rootScope, $scope, $http, $filter, $timeout, ComponentModalSvc) {
    console.debug("ComponentCalendarViewsCtrl", $scope.control);
    $scope.svgIconStyle = {
        display: 'inline-block'
    };
    if (!$scope.control.hasOwnProperty('filterDef') || $scope.control.filterDef === null || $scope.control.filterDef.length === 0) {
        $scope.control.filterDef = [
            ComponentModalSvc.newFilterDef("DrpFilter", true, $scope.control.model.viewName)
        ];
        $scope.control.model.viewFilter = angular.copy($scope.control.filterDef[0]);
    }

    $scope.$parent.layout.title = $scope.control.name + " / Views";
    $scope.subtitle = $scope.control.name + " / Views";
    $scope.filterDef = $scope.control.filterDef;
    $scope.layout = {
        collapsedList: false,
        action: {
            loop: {
                distinctColumn: null,
                inLoop: false,
                tableName: $scope.control.model.viewName
            }
        }
    };

    ComponentModalSvc
        .loadFields($scope.control.model.viewName)
        .then(function (resp) {
            $timeout(function () {
                // console.log('emit');
                $rootScope.$emit("miae:refreshSelect");
            }, 400);
            $scope.fields = resp;
        });

    $scope.$watch('filterDef', function (curr, prev) {
        // console.log('filterDef Changed', curr);
        console.log('filterDef Changed', (curr === prev));
        if (curr !== prev) {
            console.log('isModified');
            $rootScope.$emit("component:modal:isModified");
        }
        $scope.control.model.viewFilter = angular.copy($scope.control.filterDef[0]);
    }, true);
};
ComponentCalendarViewsCtrl.$inject = ['$rootScope', '$scope', '$http', '$filter', '$timeout', 'ComponentModalSvc'];
export default ComponentCalendarViewsCtrl;