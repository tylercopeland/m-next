export default function GoToScreenCtrl($rootScope, $scope, $filter, editorApiSvc, ComplexValueModel) {
    console.debug("GoToScreenCtrl", $scope.action);

    var rawList = [];

    $scope.allow = [0, 5, 6, 10];
    $scope.allowParams = [0, 2, 5, 6, 9];
    $scope.dropdowns = {
        appList: [
            {
                label: "Back (Browser History)",
                value: "back"
            },
            {
                category: "System Pages",
                label: "Dashboard",
                value: "dashboard"
            }
        ],
        screenList: [],
        appSelection: null,
        appScreenSelection: null,
        transition: [
            {
                label: "Close this screen",
                value: true
            },
            {
                label: "Keep this screen in currently open list",
                value: false
            }
        ],
        activeRecordType: null
    };
    $scope.showParameters = true;
    $scope.usedFields = [];
    $scope.viewFriendlyName = null;
    $scope.tableFields = [];
    $scope.loadTableFields = function (ViewNameFriendly) {
        if (ViewNameFriendly !== null && ViewNameFriendly !== "") {
            $scope.isLoading = true;

            editorApiSvc
                .loadTableFields(ViewNameFriendly)
                .then(function () {
                    $scope.isLoading = false;
                    $scope.canContinue = true;
                    $scope.tableFields = editorApiSvc.createFieldListOptions(ViewNameFriendly);
                    if ($scope.action.Params === null || $scope.action.Params.length === 0) {
                        $scope.action.addParam();
                    }

                });
        }
    };

    $scope.onSelect = function (field) {
        var found = $filter('filter')($scope.tableFields, { value: field.Key }, true);
        if (found.length > 0) {
            field.includedTypes = [found[0].fieldType];
            if (found[0].fieldType === 0) {
                field.Value = new ComplexValueModel({ ValueType: 9 });
                field.includedTypes = [0, 1, 3];
            } else if (found[0].fieldType === 1) {
                field.Value = new ComplexValueModel({ ValueType: 10 });
                field.includedTypes = [0, 1];
            } else if (found[0].fieldType === 2) {
                field.Value = new ComplexValueModel({ ValueType: 12 });
            } else if (found[0].fieldType === 3) {
                field.Value = new ComplexValueModel({ ValueType: 11 });
            }
        }

        $scope.setUsedFields();
    }

    var initializeData = function (_app, _screen) {
        $scope.dropdowns.activeRecordType = ($scope.action.ActiveRecordId !== null && $scope.action.ActiveRecordId.Value !== -1) ? 0 : 1;

        if ($scope.action.ScreenId === "back" || $scope.action.ScreenId === "dashboard") {
            $scope.dropdowns.appSelection = $scope.action.ScreenId;
            $scope.dropdowns.appScreenSelection = null;
        } else {
            var found = $filter('filter')(rawList, { key: $scope.action.ScreenId }, true);
            if (found.length === 1) {
                $scope.dropdowns.appSelection = found[0].appName;
                $scope.dropdowns.appScreenSelection = $scope.action.ScreenId;
            } else {
                if ($scope.action.AppName) {
                    $scope.dropdowns.appSelection = $scope.action.AppName;
                }
            }
        }
    };

    $scope.loadApps = function () {
        editorApiSvc
            .loadScreenList()
            .then(function (data) {
                // Setup raw list for future usage;
                rawList = angular.copy(data);

                angular.forEach(rawList, function (obj) {
                    var found = $filter('filter')($scope.dropdowns.appList, { value: obj.appName }, true);

                    if (found.length === 0) {
                        $scope.dropdowns.appList.push({
                            category: "Apps",
                            label: obj.appName,
                            value: obj.appName
                        });
                    }
                });
                initializeData();
            });
    };
    $scope.loadApps();

    $scope.loadAppScreens = function (app) {
        $scope.dropdowns.screenList = [];
        angular.forEach(rawList, function (obj) {
            if (obj.appName === app) {
                if (!obj.isScreenlet) {
                    $scope.dropdowns.screenList.push({
                        label: obj.screenName,
                        value: obj.key,
                        viewFriendlyName: obj.viewFriendlyName
                    });
                }
            }
        });
    };

    $scope.removeItem = function (idx) {
        $scope.action.Params.splice(idx, 1);
    };

    $scope.ensureHasParams = function () {
        if (!$scope.action.Params || $scope.action.Params.length === 0) {
            $scope.action.Params = [];
            $scope.action.addParam();
        }

    };

    $scope.clearParams = function () {
        $scope.action.Params = [];
    };

    $scope.isAppScreen = function () {
        return ($scope.action.ScreenId !== "dashboard" && $scope.action.ScreenId !== "back");
    };

    $scope.setUsedFields = function () {
        $scope.usedFields = [];
        angular.forEach($scope.action.Fields, function (field) {
            $scope.usedFields.push(field.Field);
        });
        angular.forEach($scope.action.FieldsToOmit, function (field) {
            $scope.usedFields.push(field.Field);
        });
        $scope.action.validateFields();
    }



    $scope.$watch('dropdowns.activeRecordType', function (curr, prev) {
        if (curr !== null && prev !== null) {
            $scope.action.switchActiveRecordId(curr);
        }
    }, true);

    $scope.$watch("dropdowns.appSelection", function (curr, prev) {
        if (curr !== null && curr !== undefined) {
            if (curr !== "back" && curr !== "dashboard") {
                if (prev !== null && curr !== prev) {
                    $scope.action.ScreenId = null;
                    $scope.dropdowns.appScreenSelection = null;
                }
                $scope.action.AppName = curr;
                $scope.loadAppScreens(curr);
            } else {
                $scope.action.ScreenId = curr;
                $scope.action.validate();
            }
        }
    }, true);

    $scope.$watch("dropdowns.appScreenSelection", function (curr, _prev) {
        if (curr !== null && curr !== undefined) {
            $scope.action.ScreenId = curr;
            $scope.action.validate();
            if (!$scope.action.OpenIn) {
                $scope.action.OpenIn = 0;
            }

            var found = $filter('filter')($scope.dropdowns.screenList, { value: curr }, true);
            if (found.length > 0) {
                if ($scope.viewFriendlyName && $scope.viewFriendlyName != found[0].viewFriendlyName) {
                    $scope.clearParams();
                }
                $scope.viewFriendlyName = found[0].viewFriendlyName;
                $scope.loadTableFields(found[0].viewFriendlyName);
                $scope.setUsedFields();

            }
        }
    }, true);
};

GoToScreenCtrl.$inject = ["$rootScope", "$scope", "$filter", "editorApiSvc", "ComplexValueModel"];