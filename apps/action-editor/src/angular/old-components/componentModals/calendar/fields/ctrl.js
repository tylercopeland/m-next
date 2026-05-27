const ComponentCalendarFieldsCtrl = function ($rootScope, $scope, $http, $filter, $timeout, ComponentModalSvc, replacementComplexValueModel) {
    console.debug("ComponentCalendarFieldsCtrl", $scope.control);
    $scope.svgIconStyle = {
        display: 'inline-block'
    };
    $scope.$parent.layout.title = $scope.control.name + " / Calendar Fields";
    $scope.subtitle = $scope.control.name + " / Calendar Fields";
    $scope.columns = $scope.control.model.columns;
    $scope.allow = [9];
    $scope.checkbox = {
        selected: true
    };

    $scope.columns[5].expression[0].Source = new replacementComplexValueModel($scope.columns[5].expression[0].Source);
    $scope.columns[6].expression[0].Source = new replacementComplexValueModel($scope.columns[6].expression[0].Source);

    ComponentModalSvc
        .loadFields($scope.control.model.viewName)
        .then(function (resp) {
            $timeout(function () {
                // console.log('emit');
                $rootScope.$emit("miae:refreshSelect");
            }, 400);
            $scope.fields = resp;
        });

    $scope.dropdownOnly = function () {
        return function (opt) {
            return (opt.value.fldTypeId === 8);
        }
    };

    $scope.dateTimeOnly = function () {
        return function (opt) {
            return (opt.value.fldTypeId === 3);
        }
    };

    $scope.allDayFields = function () {
        return function (opt) {
            return (opt.value.fldTypeId === 5);
        }
    };

    $scope.$watch('checkbox.selected', function (curr, prev) {
        $scope.control.defaultResource = (curr) ? 'Session.Username' : '';
    });

    $scope.$watch('columns[1].name', function (curr, prev) {
        $scope.control.defaultResource = (curr === 'AssignedTo') ? 'Session.Username' : '';
    });

    $scope.$watch('columns', function (curr, prev) {
        if (curr !== prev) {
            $rootScope.$emit("component:modal:isModified");
        }
    }, true);
};
ComponentCalendarFieldsCtrl.$inject = ['$rootScope', '$scope', '$http', '$filter', '$timeout', 'ComponentModalSvc', 'replacementComplexValueModel'];
export default ComponentCalendarFieldsCtrl;