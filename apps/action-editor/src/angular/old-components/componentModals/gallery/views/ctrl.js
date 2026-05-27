const ComponentGalleryViewsCtrl = function ($rootScope, $scope, $http, $filter, $timeout, ComponentModalSvc) {
    $scope.svgIconStyle = {
        display: 'inline-block'
    };
    if (!$scope.control.hasOwnProperty('filterDef') || $scope.control.filterDef === null || $scope.control.filterDef.length === 0) {
        $scope.control.filterDef = [ComponentModalSvc.newFilterDef("DrpFilter", true, $scope.control.model.viewName)];
        $scope.control.model.viewFilter = angular.copy($scope.control.filterDef[0]);
    }

    $scope.$parent.layout.title = $scope.control.name + " | View Filter";
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
            $timeout(function () { $rootScope.$emit("miae:refreshSelect"); }, 400);
            $scope.fields = resp;
            $rootScope.$broadcast("micb:refresh", { whereClause: $scope.filterDef[0].expression });
        });

    $scope.$watch('filterDef', function (curr, prev) {
        if (curr !== prev) { $rootScope.$emit("component:modal:isModified"); }
        $scope.control.model.viewFilter = angular.copy($scope.control.filterDef[0]);
    }, true);
};
ComponentGalleryViewsCtrl.$inject = ['$rootScope', '$scope', '$http', '$filter', '$timeout', 'ComponentModalSvc'];
export default ComponentGalleryViewsCtrl;