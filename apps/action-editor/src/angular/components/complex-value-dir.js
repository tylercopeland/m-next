import template from "./complex-value-tmpl.html";
import moment from "moment";

export default function miComplexValue($rootScope, $compile, $filter, $timeout, editorSvc, editorApiSvc, guidSvc, currentScreenSvc) {
    function link(scope, element, _attr) {
        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

        let pendingTimeout = null; // Track pending $timeout for cleanup
        let initialized = false;
        let sessionValues = scope.model.sessionOptions();
        const paymentValues = scope.model.paymentOptions(),
            dynamicDates = scope.model.dynamicDates(),
            valueTypes = scope.model.valueTypes,
            guid = guidSvc.create();

        // Populate list of controls on screen
        editorSvc.createControlListing(currentScreenSvc.getControls());

        // Generate DateTimePicker widget
        let dtp = null;
        const createDateTimePicker = function () {
            const opt = {
                name: "DatePicker",
                caption: "DatePicker",
                inputType: "DateTime",
                id: scope.actionSet,
                status: 0,
                isEventEnabled: true,
                isRendered: true,
                hideCaption: true,
                defaultValue: "",
                ignoreDefault: true,
                disabled: scope.action.isReadOnly,
                onChange: function () {
                    var selected = (this.value !== "") ? this.value.format("YYYY-MM-DD HH:mm:ss") : "";
                    scope.options.date = selected;
                    scope.updateInputValue(selected);
                    scope.$apply();
                }
            }

            dtp = element.find(".mi-ae-datepicker").DateTimePicker(opt);

            // Wait for DateTimePicker to render and then compile inserted content
            pendingTimeout = $timeout(function() {
                const insertedContent = element.find('.mi-ae-datepicker'); // Target dynamically added content
                $compile(insertedContent)(scope);
            });
        };

        // Get Control Label
        scope.generateOptionLabel = function (selection) {
            var found;
            if (selection !== null) {
                switch (selection.source.ValueType) {
                    case 0:
                        selection.label = editorSvc.getActionResultName(selection.source.Value);
                        break;
                    case 2:
                        found = $filter('filter')(scope.complexSelect, { category: "Loop", source: { Value: selection.source.Value } }, true);
                        selection.label = (found.length === 1) ? found[0].label : "";
                        break;
                    case 3:
                        found = $filter('filter')(scope.complexSelect, { category: "Field", source: { Value: selection.source.Value } }, true);
                        selection.label = (found.length === 1) ? found[0].label : "";
                        break;
                    case 5:
                    case 7:
                    case 14:
                    case 15:
                        selection.label = (selection.source.Value !== "" && selection.source.Value !== null) ?
                            editorSvc.getControlDisplayName(selection.source.Value, selection.source.Property) : "";
                        break;
                    case 6:
                        var result = $filter('filter')(sessionValues, { value: selection.source.Value }, function (actual, expected) {
                            if (actual.toLowerCase() === expected.toLowerCase()) {
                                return true;
                            }
                        });
                        selection.label = result && result.length > 0 ? result[0].label : null;
                        break;
                    case 13:
                        selection.label = $filter('filter')(dynamicDates, { value: selection.source.Value }, function (actual, expected) {
                            if (actual === expected) {
                                return true;
                            }
                        })[0].label;
                        break;
                    case 18:
                        var resultValue = $filter('filter')(paymentValues, { value: selection.source.Value }, function (actual, expected) {
                            if (actual.toLowerCase() === expected.toLowerCase()) {
                                return true;
                            }
                        });
                        selection.label = resultValue && resultValue.length > 0 ? resultValue[0].label : null;
                        break;
                    default:
                        selection.label = valueTypes[selection.source.ValueType].label;
                        break;
                }


            }
        };

        // Directive/Scope Configuration
        scope.groupFilter = ['Dynamic Dates', 'Editable Grid', 'User Defined', 'Action Result', 'Loop', 'Field', 'Control', 'Session', 'Payment Widget', 'Signature Component', 'Screen', 'Address Lookup Component', 'Process Payments'];
        scope.textAsInput = (scope.textArea) ? false : true;
        scope.placeholder = (scope.placeholder) ? scope.placeholder : '';
        scope.$watch(function() {
            return scope.errorCode ? scope.errorCode : scope.model.ValidationMessage;
        }, function(newVal) {
            scope.errorNumber = newVal;
        });
        scope.dropdown = {
            selected: null,
            showMore: false
        };
        scope.options = {
            text: "",
            number: 0,
            date: "",
            yesno: false
        };
        createDateTimePicker();

        // Build Complex select option
        var buildSelectOption = function (label, category, valueType, value, property, fieldType, controlType) {
            if (scope.filterControls && (valueType === 5 || valueType === 7 || valueType === 14 || valueType === 15)) {
                var found = $filter('filter')(scope.filterControls, { ValueType: valueType, Value: value }, true);
                if (found.length === 1 && scope.model.Value !== value) {
                    return;
                }
            }
            const candidate = {
                label: label,
                category: category,
                fieldType: fieldType,
                controlType: controlType,
                source: {
                    ValueType: valueType,
                    Value: value,
                    Property: property
                }
            };
            if(!scope.complexSelect.find(opt => {
                return ['label', 'category', 'fieldType'].every(k => opt[k] === candidate[k]);
            })) {                
                scope.complexSelect.push(candidate);
            } else {
                console.log('duplicate', candidate);
            }
        };

        // Build Complex select
        scope.buildComplexSelect = function () {

            // Handle app routine editor - filter out controls  
            if ($rootScope.actionEditor && $rootScope.actionEditor.isAppRoutineEditor) {
                scope.allow = scope.allow.filter(function (item) {
                    return item !== 5;
                });
            }

            scope.complexSelect = [];
            angular.forEach(scope.allow, function (valueType) {
                switch (valueType) {
                    case 0:
                        angular.forEach(scope.action.parentAr, function (ar) {
                            // Filter out duplicates
                            var found = $filter('filter')(scope.complexSelect, { category: valueTypes[valueType].label, source: { Value: ar.id } }, true);

                            if (found.length === 0) {
                                buildSelectOption(
                                    ar.name,
                                    valueTypes[valueType].label,
                                    valueType,
                                    ar.id,
                                    "",
                                    null
                                );
                            }
                        });
                        break;
                    case 2:
                        // Check if this is within a loop through table
                        // console.warn('get fields if in a loop', scope.action);
                        if (scope.action.loop.inLoop) {
                            editorApiSvc
                                .getAllLoopFieldValues(scope.action.loop)
                                .then(function (fields) {
                                    if (fields) {
                                        angular.forEach(fields, function (field) {
                                            buildSelectOption(
                                                field.label, // Label
                                                valueTypes[valueType].label,
                                                valueType,
                                                field.value, // Value
                                                "",
                                                null
                                            );
                                        });
                                        scope.generateOptionLabel(scope.dropdown.selected);
                                    }
                                });
                        }
                        break;
                    case 3:
                        // console.error('This feature should only be used in criteria builder only according to Jon!!!');
                        var preLoadedList = editorApiSvc.createFieldListOptions(scope.tableName);
                        editorApiSvc
                            .getAllLoopFieldValues({ ...scope.action.loop, tableName: scope.tableName}).then((returnedList) => {
                                var fieldListOptions = preLoadedList.length > 0 ? preLoadedList : returnedList;
                                angular.forEach(fieldListOptions, function (field) {
                                    buildSelectOption(
                                        field.label,
                                        valueTypes[valueType].label,
                                        valueType,
                                        field.value,
                                        field.type,
                                        null
                                    );
                                });
                                scope.generateOptionLabel(scope.dropdown.selected);
                            });
                        break;
                    case 5:
                        // Get all screen controls
                        angular.forEach(editorSvc.getControlValues((scope.visibleControls) ? scope.visibleControls : ['SEC', 'L-CON', 'PAY', 'DOC', 'BGR', 'EDT', 'REC', 'SIG', 'ADR'], scope.visibleControls), function (control) {
                            buildSelectOption(
                                control.name,
                                valueTypes[valueType].label,
                                valueType,
                                control.id,
                                control.property,
                                control.fieldType,
                                control.type
                            );
                        });
                        break;
                    case 6:
                        // Filter out session values for app routines
                        if ($rootScope.actionEditor && $rootScope.actionEditor.isAppRoutineEditor) {
                            var filter = ["BrowserWindowSize", "EmailContactRecordId", "EmailEntityRecordId",
                                "EntityFullName", "EntityRecordID", "ContactRecordID", "ActiveRecordID"];
                            sessionValues = sessionValues.filter(function (session) {
                                return !(filter.some(function (item) {
                                    return item === session.value;
                                }));
                            });
                        }

                        if (scope.allowedSessionValues !== undefined &&
                            scope.allowedSessionValues !== null &&
                            scope.allowedSessionValues.length > 0) {
                            angular.forEach(sessionValues, function (session) {
                                var match = $filter('filter')(scope.allowedSessionValues, session.value);
                                if (match.length > 0) {
                                    buildSelectOption(
                                        session.label,
                                        valueTypes[valueType].label,
                                        valueType,
                                        session.value,
                                        "",
                                        session.fieldType,
                                        null
                                    );
                                }
                            });
                        } else {
                            angular.forEach(sessionValues,
                                function (session) {
                                    buildSelectOption(
                                        session.label,
                                        valueTypes[valueType].label,
                                        valueType,
                                        session.value,
                                        "",
                                        session.fieldType,
                                        null
                                    );
                                });
                        }
                        break;
                    case 7:
                        // Get all screen controls
                        angular.forEach(editorSvc.getControlValues(['PAY'], ['PAY']), function (control) {
                            buildSelectOption(
                                control.name,
                                valueTypes[valueType].label,
                                valueType,
                                control.id,
                                control.property,
                                control.fieldType,
                                control.type
                            );
                        });
                        break;
                    case 13:
                        angular.forEach(dynamicDates,
                            function (session) {
                                buildSelectOption(
                                    session.label,
                                    valueTypes[valueType].label,
                                    valueType,
                                    session.value,
                                    "",
                                    session.fieldType,
                                    null
                                );
                            });
                        break;
                    case 14:
                        angular.forEach(editorSvc.getControlValues(['SIG'], ['SIG']), function (control) {
                            buildSelectOption(
                                control.name,
                                valueTypes[valueType].label,
                                valueType,
                                control.id,
                                control.property,
                                control.fieldType,
                                control.type
                            );
                        });
                        break;
                    case 15:
                        angular.forEach(editorSvc.getControlValues(['ADR'], ['ADR']), function (control) {
                            buildSelectOption(
                                control.name,
                                valueTypes[valueType].label,
                                valueType,
                                control.id,
                                control.property,
                                control.fieldType,
                                control.type
                            );
                        });
                        break;
                    case 18: 
                        angular.forEach(paymentValues, function (payment) {
                            buildSelectOption(
                                payment.label,        
                                valueTypes[valueType].label, 
                                valueType,            
                                payment.value,        
                                "",                   
                                payment.fieldType,    
                                null                  
                            );
                        });
                        break;
                    default:
                        buildSelectOption(
                            valueTypes[valueType].label,
                            valueTypes[valueType].category,
                            valueType,
                            "",
                            "",
                            valueTypes[valueType].fieldType,
                            null
                        );
                        break;
                }
            });
        };
        scope.buildComplexSelect();

        // Update value based on input
        scope.updateInputValue = function (value) {
            scope.model.Value = value;
            scope.revalidate();
        };

        // Update number value
        scope.validateNumberInput = function () {
            if (scope.model.Value === null || scope.model.Value === undefined) {
                scope.model.Value = 0;
                scope.options.number = 0;
            }
        };

        scope.revalidate = function () {
            scope.model.validate();
        };

        scope.fieldTypeFilter = function (_item) {
            return function (opt) {
                if (
                    scope.includedTypes !== undefined &&
                    scope.includedTypes !== null
                    && scope.includedTypes.length > 0
                ) {
                    return opt.fieldType === undefined ||
                        scope.includedTypes.indexOf(opt.fieldType) > -1 ||
                        (scope.forceAllow && scope.forceAllow.indexOf(opt.source.ValueType) > -1) ||
                        (scope.allowedControlTypes && scope.allowedControlTypes.indexOf(opt.controlType) > -1);
                }
                return true;
            };
        };

        scope.launchExpressionBuilder = function () {
            $rootScope.$broadcast("mi:expression", {
                id: guid,
                builder: 'actioneditor',
                value: scope.model.Value
            });
        };

        // Watch dropdown selected option
        scope.$watch("dropdown.selected", function (curr, prev) {
            if (curr !== null && initialized) {
                scope.model.ValueType = curr.source.ValueType;
                scope.model.Value = curr.source.Value;
                scope.model.Property = curr.source.Property;


                if (scope.model.ValueType === 8 || scope.model.ValueType === 9) {
                    scope.options.text = (scope.model.Value !== "") ? scope.model.Value : "";
                }
                if (scope.model.ValueType === 10) {
                    scope.options.number = (scope.model.Value !== "") ? scope.model.Value : 0;
                    scope.model.Value = (scope.model.Value !== "") ? scope.model.Value : 0;
                }
                if (scope.model.ValueType === 11) {
                    if ((scope.model.Value === "" || scope.model.Value === null || scope.model.Value === undefined) && !scope.ignoreDefault) {
                        scope.model.Value = moment().format("YYYY-MM-DD HH:mm:ss");
                    }
                    scope.options.date = scope.model.Value;
                    dtp.data("mi-DateTimePicker").setValue(scope.model.Value);
                }
                if (scope.model.ValueType === 12) {
                    if (curr !== prev && prev !== null) {
                        scope.options.yesno = true;
                        scope.model.Value = true;
                    } else {
                        scope.options.yesno = scope.model.Value;
                    }
                }

                // Determine if we should show 2nd column
                scope.dropdown.showMore = valueTypes[scope.model.ValueType].showMore;

                if (curr !== prev) {
                    scope.model.validate();
                }
            }
            // if(curr !== null && !initialized) { initialized = true; }
            if (!initialized) { initialized = true; }
        }, true);

        scope.$watch("model.ValueType", function (curr, prev) {
            if (((curr !== "" && curr !== undefined) && curr === prev) || (curr !== prev)) {
                scope.dropdown.selected = {
                    category: (valueTypes[curr].category) ? valueTypes[curr].category : valueTypes[curr].label,
                    label: "",
                    source: {
                        ValueType: scope.model.ValueType,
                        Value: scope.model.Value,
                        Property: scope.model.Property
                    }
                }

                scope.generateOptionLabel(scope.dropdown.selected);

                switch (curr) {
                    case 3:
                        if (scope.model.Value === "") {
                            scope.dropdown.selected = null;
                        }
                        break;
                    case 8:
                    case 9:
                        scope.options.text = scope.model.Value;
                        break;
                    case 10:
                        scope.options.number = scope.model.Value;
                        break;
                    case 11:
                        scope.options.date = scope.model.Value;
                        if (scope.model.Value !== "") {
                            dtp.data("mi-DateTimePicker").setValue(scope.model.Value);
                        }
                        break;
                    case 12:
                        scope.options.yesno = scope.model.Value;
                        break;
                }

                scope.dropdown.showMore = valueTypes[curr].showMore;
            } else {
                initialized = true;
            }
        });

        scope.$watch("model", function (curr, prev) {
            if (curr !== prev) {
                scope.model.ValueType = curr.ValueType;
                scope.model.Value = curr.Value;
                scope.model.Property = curr.Property;

                // scope.setOptions(curr, prev);
            }
        }, true);

        scope.$on("miae:refreshSelect", function () {
            scope.buildComplexSelect();
            scope.generateOptionLabel(scope.dropdown.selected);
        });

        scope.$on("miae:clearComplexValue", function () {
            scope.dropdown.selected = null;
        });

        scope.$on("mi:expression:update", function (e, params) {
            if (params.id === guid) {
                scope.model.Value = angular.copy(params.value);
            }
        });

        // CLEANUP: Cancel pending $timeout and destroy DateTimePicker when scope is destroyed
        scope.$on('$destroy', function() {
            if (pendingTimeout) {
                $timeout.cancel(pendingTimeout);
                pendingTimeout = null;
            }
            if (dtp && dtp.data) {
                try {
                    // Cleanup custom mi-DateTimePicker widget
                    const miDtpInstance = dtp.data("mi-DateTimePicker");
                    if (miDtpInstance && typeof miDtpInstance.destroy === "function") {
                        miDtpInstance.destroy();
                    }

                    // Also cleanup underlying bootstrap-datetimepicker plugin
                    const bsDtpInstance = dtp.data("DateTimePicker");
                    if (bsDtpInstance && typeof bsDtpInstance.destroy === "function") {
                        bsDtpInstance.destroy();
                    }
                } catch (error) {
                    console.error('DateTimePicker cleanup error:', error);
                }
            }
        });
    };

    return {
        restrict: "E",
        replace: true,
        scope: {
            action: "=",
            model: "=",
            allow: "=",
            forceAllow: "=?",
            includedTypes: "=?",
            errorCode: "=",
            ignore: "=?",
            disableValue: "=?",
            disableInput: "=?",
            filterRequired: "=?",
            textArea: "=?",
            placeholder: "=?",
            allowedSessionValues: "=?",
            allowedControlTypes: "=?",
            visibleControls: "=?",
            tableName: "=?",
            filterControls: "=?",
            filterControlIndex: "=?",
            numberMinValue: "=?",
            ignoreDefault: "=?",
            isReadOnly: "=?",
            maxLength: "=?",

        },
        link: link
    };
};

miComplexValue.$inject = ["$rootScope", "$compile", "$filter", "$timeout", "editorSvc", "editorApiSvc", "guidSvc", "currentScreenSvc"];