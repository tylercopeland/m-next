const ComponentGridViewsCtrl = function ($rootScope, $scope, $http, $filter, $timeout, ComponentModalSvc, guidSvc) {
    console.debug("ComponentGridViewsCtrl", $scope.control.model);
    $scope.svgIconStyle = {
        display: 'inline-block'
    };
    if ($scope.control.filterDef === null || $scope.control.filterDef.length === 0) {
        $scope.control.filterDef = [];
    }

    if ($scope.control.filterDef.length > 0) {
        angular.forEach($scope.control.filterDef, function (filter) {
            if (filter.expression === undefined) {
                filter.expression = [];
            }
            if (filter.sorting === undefined) {
                filter.sorting = [];
            }
        });
    }

    $scope.selectedIdx = null;
    $scope.$parent.layout.title = $scope.control.name + " | View Filter";
    $scope.buttonName = " Add a column";
    $scope.filterDef = $scope.control.filterDef;
    $scope.hiddenArray = [];
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
    $scope.addViewLabel = ($scope.filterDef.length === 0) ? " Add a view" : " Add another view";

    ComponentModalSvc
        .loadFields($scope.control.model.viewName)
        .then(function (resp) {
            $timeout(function () {
                // console.log('emit');
                $rootScope.$emit("miae:refreshSelect");
            }, 600);
            $scope.fields = resp;
            $rootScope.$broadcast("micb:refresh", {
                whereClause: ($scope.selectedIdx !== null) ? $scope.control.filterDef[$scope.selectedIdx].expression : []
            });
            // console.log('fields', resp);
        });

    $scope.loadProperties = function (idx) {
        $scope.selectedIdx = idx;
        // console.log('loadProperties', $scope.control.filterDef[idx]);
        $scope.setButtonName();
        $scope.createHiddenArray();
        $rootScope.$broadcast("micb:refresh", {
            whereClause: ($scope.control.filterDef[idx].hasOwnProperty('expression')) ? $scope.control.filterDef[idx].expression : []
        });
    };

    $scope.createHiddenArray = function () {
        $scope.hiddenArray = [];
        angular.forEach($scope.control.filterDef[$scope.selectedIdx].hidden, function (value, idx) {
            $scope.hiddenArray.push({
                idx: idx,
                value: value
            });
        });
    };

    $scope.deleteFilter = function (idx) {
        var isDefault = $scope.filterDef[idx].isDefault,
            filterCount = $scope.filterDef.length;

        $scope.filterDef.splice(idx, 1);
        if ($scope.selectedIdx === idx) {
            $scope.selectedIdx = null;
        }

        // Update default view
        if (isDefault && filterCount > 0) {
            if (idx === 0) {
                $scope.setAsDefault(0);
            } else if (idx > filterCount) {
                $scope.setAsDefault(filterCount - 1);
            } else {
                $scope.setAsDefault(idx - 1);
            }
        }
    };

    $scope.addView = function () {
        var isDefault = ($scope.filterDef.length === 0) ? true : false,
            name = "View" + ComponentModalSvc.getFilterCount("View", $scope.filterDef),
            filter = ComponentModalSvc.newFilterDef(name, isDefault, $scope.control.model.viewName);

        $scope.filterDef.push(filter);
        $scope.loadProperties($scope.filterDef.length - 1);
        $rootScope.$emit("component:modal:autoSave");
    };

    $scope.setAsDefault = function (idx) {
        angular.forEach($scope.filterDef, function (filter) {
            filter.isDefault = false;
        });
        $scope.filterDef[idx].isDefault = true;
    };

    $scope.setButtonName = function () {
        // console.log('setButtonName', $scope.control.filterDef[$scope.selectedIdx].hidden.length);
        $scope.buttonName = ($scope.control.filterDef[$scope.selectedIdx].hidden.length === 0) ? " Add a column" : " Add another column";
    };

    $scope.addHidden = function () {
        // console.log('addHidden', $scope.control.filterDef[$scope.selectedIdx].hidden);
        var length = $scope.hiddenArray.length;
        $scope.hiddenArray.push({
            idx: length,
            value: null
        });
    };

    $scope.removeHidden = function (idx, item) {
        $scope.hiddenArray.splice(idx, 1);
    };

    $scope.selectedColumns = function (item) {
        var inArray = $scope.control.filterDef[$scope.selectedIdx].hidden;
        return function (opt) {
            return (inArray.indexOf(opt.key) === -1) || opt.key === item;
        };
    };

    $scope.generateCopyName = function (name) {
        var origName = (name.indexOf(" - Copy") > -1) ? name.substr(0, name.indexOf(" - Copy")) : name,
            found = $filter('filter')($scope.filterDef, { filterName: origName });

        return (found.length === 1) ? origName + " - Copy" : origName + " - Copy " + found.length;
    };

    $scope.copy = function (index) {
        var copiedView = angular.copy($scope.filterDef[index]);

        copiedView.filterId = guidSvc.create();
        copiedView.filterName = $scope.generateCopyName(copiedView.filterName);
        copiedView.isDefault = false;

        $scope.filterDef.push(copiedView);
    };

    $scope.$watch('hiddenArray', function (curr, prev) {
        // console.log('hiddenArray', $scope.hiddenArray);
        if ($scope.selectedIdx !== null) {
            $scope.control.filterDef[$scope.selectedIdx].hidden = [];
            angular.forEach($scope.hiddenArray, function (obj, idx) {
                $scope.control.filterDef[$scope.selectedIdx].hidden.push(obj.value);
            });
            // console.log('after', $scope.control.filterDef[$scope.selectedIdx].hidden);
            $scope.setButtonName();
        }
    }, true);

    $scope.$watch('filterDef', function (curr, prev) {
        if (curr !== prev) {
            // console.log('isModified');
            $rootScope.$emit("component:modal:isModified");
        }
        var defaultFilter = $filter('filter')($scope.control.filterDef, { isDefault: true }, true);
        // console.log('defaultFilter', defaultFilter);
        $scope.control.model.viewFilter = (defaultFilter.length === 1) ? angular.copy(defaultFilter[0]) : null;
    }, true);
};
ComponentGridViewsCtrl.$inject = ['$rootScope', '$scope', '$http', '$filter', '$timeout', 'ComponentModalSvc', 'guidSvc'];
export default ComponentGridViewsCtrl;