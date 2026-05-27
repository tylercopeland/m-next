const ComponentValidationCtrl = function ($rootScope, $scope, $filter, $stateParams, currentScreenSvc) {
    $scope.svgIconStyle = {
        display: 'inline-block'
    };
    $scope.$parent.layout.title = $scope.control.name + " : Validation Window";
    $scope.editMode = false;
    $scope.controlValidations = ($scope.control.validationRules) ? $scope.control.validationRules : [];
    $scope.selectedValidation = null;
    $scope.validationMax = 100000;
    $scope.stepCount = ($scope.control.FieldType === 2) ? 1 : "";
    $scope.isReadOnly = currentScreenSvc.getOption('designerMode') === $.mi.Constants.DesignerMode.ReadOnly;
    $scope.layout = {
        sortableConfig: {       // Object that controls the drag and drop sorting
            animation: 150,
            group: 'columns',
            handle: '.mi-icon-move',
            filter: '.mi-ae-ignore',
            disabled: false,
            scroll: true,
            filter: '.ignore-elements',
            onUpdate: function () {
                console.warn("item moved");
            }
        },
        validations: [
            {
                rule: 0,
                name: "Field Is Required",
                description: "Validate that a field has been populated.",
                default: null
            },
            {
                rule: 1,
                name: "Field Contains a Valid Email Address",
                description: "Validate that a field contains a valid email address.  Multiple addresses may be separated by a comma.",
                default: null
            },
            {
                rule: 2,
                name: "Field Maximum Length",
                description: "Validate that a field does not exceed a certain number of characters.",
                default: 1
            },
            {
                rule: 3,
                name: "Field Minimum Length",
                description: "Validate that a field is at least a certain number of characters.",
                default: 1
            },
            {
                rule: 4,
                name: "Is Less Than",
                description: "Validate that a field is less than a specified value.",
                default: null
            },
            {
                rule: 5,
                name: "Is Greater Than",
                description: "Validate that a field is greater than a specified value.",
                default: null
            },
            {
                rule: 6,
                name: "Field Contains No Malicious Values",
                description: "Validate that a field does not contain malicious values.",
                default: true
            }
        ]
    };

    $scope.addValidation = function () {
        $scope.editMode = false;
        $scope.selectedValidation = null;
    };

    $scope.hasValidationOption = function (rule) {
        var hasOption = ($scope.controlValidationProperties.indexOf(rule) > -1);
        var found = $filter('filter')($scope.controlValidations, { rule: rule }, true);
        var isAdded = (found.length > 0);
        return (hasOption && !isAdded);
    };

    $scope.addRule = function (validate) {
        var field = $scope.getFieldByCaption();
        $scope.editMode = true;
        $scope.controlValidations.push({
            rule: validate.rule,
            value: (validate.rule == 2 && field) ? field.maxSize : validate.default,
            canDelete: true
        });
        $scope.selectedValidation = $scope.controlValidations[$scope.controlValidations.length - 1];
        $scope.addAnalyticEvent("Added", $scope.getValidationName($scope.selectedValidation));
    };

    $scope.loadValidation = function (item, idx) {
        $scope.editMode = true;
        $scope.selectedValidation = $scope.controlValidations[idx];
        // if ($rootScope.sessionData.account.accountFriendlyName !== "templatedevv2")
            $scope.validationMax = $scope.getFieldByCaption().maxSize;
    };

    $scope.deleteValidation = function (evt, idx) {
        evt.preventDefault();
        evt.stopPropagation();
        $scope.editMode = false;
        $scope.addAnalyticEvent("Removed", $scope.getValidationName($scope.controlValidations[idx]));
        $scope.selectedValidation = null;
        $scope.controlValidations.splice(idx, 1);
    };

    $scope.getValidationName = function (validation) {
        if (validation) {
            var found = $filter('filter')($scope.layout.validations, { rule: validation.rule }, true);
            return (found.length > 0) ? found[0].name : "";
        }
    };

    $scope.validateMin = function () {
        var value = $scope.selectedValidation.value;

        if (value === null || value === undefined || value < 1) {
            $scope.selectedValidation.value = 1;
        }

        var maxLength = $scope.getRule(2);
        if (maxLength && value > maxLength.value) {
            $scope.selectedValidation.value = angular.copy(maxLength.value);
        }
    };

    $scope.validateMax = function () {
        var value = $scope.selectedValidation.value,
            field = $scope.getFieldByCaption();
        if (value === null || value === undefined || value < 1) {
            $scope.selectedValidation.value = (field) ? field.maxSize : 1;
        }

        // Validate Max Length against field requirements
        if (field) {
            if (value > field.maxSize && $rootScope.sessionData.account.accountFriendlyName !== "templatedevv2") {
                $scope.selectedValidation.value = field.maxSize;
            }
        }

        var minLength = $scope.getRule(3);
        if (minLength && value < minLength.value) {
            $scope.selectedValidation.value = angular.copy(minLength.value);
        }
    };

    $scope.getFieldByCaption = function () {
        let fields;
        fields = currentScreenSvc.getOption('Fields');
        var found = $filter('filter')(fields, { caption: $scope.control.name }, true);
        return (found.length > 0) ? found[0] : null;
    };

    $scope.getRule = function (rule) {
        var found = $filter('filter')($scope.controlValidations, { rule: rule }, true);
        return (found.length > 0) ? found[0] : null;
    };

    $scope.validateCharacters = function (evt) {
        if (evt.key === "-") {
            evt.preventDefault();
            return false;
        }
    };

    $scope.addAnalyticEvent = function (action, details) {
        // analyticsSvc.trackEvent($stateParams.screenId, 'Field Validation', action, details, {
        //     BoundField: $scope.control.isBound,
        //     FieldName: ($scope.control.isBound) ? $scope.control.name : $scope.control.caption,
        //     FieldType: $scope.getFieldType($scope.control.FieldType)
        // }, $stateParams.activeRecordId);
    };

    $scope.getFieldType = function (value) {
        var fieldType = "";
        angular.forEach($.mi.Constants.FieldType, function (number, text) {
            if (number === value) {
                fieldType = text;
            }
        });
        return fieldType;
    }

    $scope.$watch('controlValidations', function (curr, prev) {
        $scope.control.validationRules = (curr.length === 0) ? null : angular.copy($scope.controlValidations);
    }, true);
};
ComponentValidationCtrl.$inject = ['$rootScope', '$scope', '$filter', '$stateParams', 'currentScreenSvc'];
export default ComponentValidationCtrl;