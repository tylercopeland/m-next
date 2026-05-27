export default function OpenPopUpCtrl($rootScope, $scope, $filter, editorApiSvc, ComplexValueModel, currentScreenSvc) {
    console.debug("Open ScreenAsAModalCtrl", $scope.action);
    
    // Popup width constants
    const POPUP_WIDTH_SMALL = null;
    const POPUP_WIDTH_MEDIUM = 650;
    const POPUP_WIDTH_LARGE = 900;

    let rawList = [];
    // Track the previous screen ID to detect genuine screen changes (controller state, not model data)
    let previousScreenId = null;

    $scope.allow = [0, 2, 5, 6, 10];
    $scope.allowParams = [0, 2, 5, 6, 9];
    $scope.dropdowns = {
        appList: [],
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
        activeRecordType: null,
        popupSize: 'small' // Default to small size
    };
    $scope.showParameters = true;
    $scope.usedFields = [];
    $scope.viewFriendlyName = null;
    $scope.tableFields = [];

    // Truncate PopUpHeader to max length and validate
    // Also auto-fill with screen name if empty on blur
    $scope.truncateAndValidatePopUpHeader = function () {
        const maxLength = $scope.action.popUpHeaderMaxLength;

        // Auto-fill with appropriate label if empty
        if (!$scope.action.PopUpHeader) {
            if ($scope.dropdowns.appScreenSelection) {
                // Regular screen selected - use screen name from screenList
                const found = $filter('filter')($scope.dropdowns.screenList, { value: $scope.dropdowns.appScreenSelection }, true);
                if (found.length > 0) {
                    $scope.action.PopUpHeader = found[0].label.substring(0, maxLength);
                }
            } else if ($scope.dropdowns.appSelection === 'back' || $scope.dropdowns.appSelection === 'dashboard') {
                // Special case: 'back' or 'dashboard' selected - use capitalized label
                const label = $scope.dropdowns.appSelection.charAt(0).toUpperCase() + $scope.dropdowns.appSelection.slice(1);
                $scope.action.PopUpHeader = label.substring(0, maxLength);
            }
        }

        // Truncate if over max length
        if ($scope.action.PopUpHeader && $scope.action.PopUpHeader.length > maxLength) {
            $scope.action.PopUpHeader = $scope.action.PopUpHeader.substring(0, maxLength);
        }

        $scope.action.validate();
    };

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
    };

    var initializeData = function (_app, _screen) {
        $scope.dropdowns.activeRecordType = ($scope.action.ActiveRecordId !== null && $scope.action.ActiveRecordId.Value !== -1) ? 0 : 1;

        // Initialize popup size based on ModalWidth, default to small
        if ($scope.action.ModalWidth === POPUP_WIDTH_MEDIUM) {
            $scope.dropdowns.popupSize = 'medium';
        } else if ($scope.action.ModalWidth === POPUP_WIDTH_LARGE) {
            $scope.dropdowns.popupSize = 'large';
        } else {
            // Default to small for null, undefined, or any other value
            $scope.dropdowns.popupSize = 'small';
            // Ensure ModalWidth is null for small size (default)
            if ($scope.action.ModalWidth !== null && $scope.action.ModalWidth !== undefined) {
                $scope.action.ModalWidth = POPUP_WIDTH_SMALL;
            }
        }

        if ($scope.action.ScreenId === "back" || $scope.action.ScreenId === "dashboard") {
            $scope.dropdowns.appSelection = $scope.action.ScreenId;
            $scope.dropdowns.appScreenSelection = null;
            // Auto-populate PopUpHeader if empty when loading existing action with 'back' or 'dashboard'
            if (!$scope.action.PopUpHeader) {
                const maxLength = $scope.action.popUpHeaderMaxLength;
                const label = $scope.action.ScreenId.charAt(0).toUpperCase() + $scope.action.ScreenId.slice(1);
                $scope.action.PopUpHeader = label.substring(0, maxLength);
            }
        } else {
            var found = $filter('filter')(rawList, { key: $scope.action.ScreenId }, true);
            if (found.length === 1) {
                $scope.dropdowns.appSelection = found[0].appName;
                $scope.dropdowns.appScreenSelection = $scope.action.ScreenId;

                // Auto-populate PopUpHeader if empty when loading existing action
                if (!$scope.action.PopUpHeader && found[0].screenName) {
                    const maxLength = $scope.action.popUpHeaderMaxLength;
                    $scope.action.PopUpHeader = found[0].screenName.substring(0, maxLength);
                    previousScreenId = $scope.action.ScreenId;
                }
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

        // Get the current screen ID from the current screen service
        const currentScreenId = currentScreenSvc.getOption('screenId');

        angular.forEach(rawList, function (obj) {
            if (obj.appName === app) {
                // Filter out the current parent screen to prevent self-referencing
                if (obj.key === currentScreenId) {
                    return; // Skip this screen
                }

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
    };

    $scope.$watch('dropdowns.activeRecordType', function (curr, prev) {
        if (curr === null || curr === prev) {
            return;
        }

        if (curr === 0) {
            $scope.clearParams();
        } else if (curr === 1) {
            $scope.ensureHasParams();
        }

        $scope.action.switchActiveRecordId(curr);
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
                // Auto-populate PopUpHeader with capitalized label for 'back' or 'dashboard'
                // Only if empty or if switching from a regular screen
                if (!$scope.action.PopUpHeader || (previousScreenId && previousScreenId !== curr)) {
                    const maxLength = $scope.action.popUpHeaderMaxLength;
                    const label = curr.charAt(0).toUpperCase() + curr.slice(1);
                    $scope.action.PopUpHeader = label.substring(0, maxLength);
                    previousScreenId = curr;
                }
                $scope.action.validate();
            }
        }
    }, true);

    // Helper to auto-populate PopUpHeader when screen changes
    function updatePopUpHeaderForScreen(screenLabel, curr) {
        // Auto-populate if empty or if screen genuinely changed
        if (!$scope.action.PopUpHeader || (previousScreenId && previousScreenId !== curr)) {
            $scope.action.PopUpHeader = screenLabel;
        }
        // Always track current screen (even if not overwriting PopUpHeader)
        previousScreenId = curr;
    }

    $scope.$watch("dropdowns.appScreenSelection", function (curr) {
        if (curr === null || curr === undefined) {
            return;
        }

        $scope.action.ScreenId = curr;
        if (!$scope.action.OpenIn) {
            $scope.action.OpenIn = 0;
        }

        var found = $filter('filter')($scope.dropdowns.screenList, { value: curr }, true);
        if (found.length > 0) {
            const shouldClearParams = $scope.viewFriendlyName && $scope.viewFriendlyName !== found[0].viewFriendlyName;
            if (shouldClearParams) {
                $scope.clearParams();
            }
            $scope.viewFriendlyName = found[0].viewFriendlyName;
            $scope.loadTableFields(found[0].viewFriendlyName);
            $scope.setUsedFields();

            const maxLength = $scope.action.popUpHeaderMaxLength;
            const screenLabel = (found[0].label || '').substring(0, maxLength);
            updatePopUpHeaderForScreen(screenLabel, curr);
        }

        $scope.action.validate();
    }, true);

    $scope.$watch("dropdowns.popupSize", function (curr, prev) {
        if (curr !== null && curr !== undefined && curr !== prev) {
            if (curr === 'small') {
                $scope.action.ModalWidth = POPUP_WIDTH_SMALL;
            } else if (curr === 'medium') {
                $scope.action.ModalWidth = POPUP_WIDTH_MEDIUM;
            } else if (curr === 'large') {
                $scope.action.ModalWidth = POPUP_WIDTH_LARGE;
            }
        }
    }, true);
}

OpenPopUpCtrl.$inject = ["$rootScope", "$scope", "$filter", "editorApiSvc", "ComplexValueModel", "currentScreenSvc"];
