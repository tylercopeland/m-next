import template from './field-select-tmpl.html';

export default function miFieldSelect($rootScope, $compile, $filter, editorApiSvc) {
    function link(scope, element, _attr) {

        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

        scope.fields = [];
        scope.field = {
            selected: scope.value
        };
        scope.searchEnabled = (scope.allowSearch) ? scope.allowSearch : true;
        scope.usedFields = (scope.usedFields) ? scope.usedFields : [];
        scope.externalFieldList = (scope.externalFieldList) ? scope.externalFieldList : [];
        scope.hideUsedFields = (scope.hideUsedFields) ? scope.hideUsedFields : true;

        const hideRequired = (scope.hideRequired) ? scope.hideRequired : false,
            fieldList = editorApiSvc.createFieldListOptions(scope.tableName),
            dbValueCheck = "_RecordID";
        let initialized = false;

        scope.setupFields = function () {
            angular.forEach(fieldList, function (field) {
                if (!scope.ignoreFields || scope.ignoreFields.indexOf(field.value) === -1) {
                    // Check if this item is required
                    if (scope.requiredOnly) {
                        // Check if this item is a match for XXX or XXX_RECORDID
                        const valueCheck = scope.value.replace(dbValueCheck, "");
                        if (valueCheck === field.value || valueCheck + dbValueCheck === field.value) {
                            scope.fields.push(field);
                        }
                    } else {
                        // Strip Record ID from value
                        const filterCheck = field.value.replace(dbValueCheck, ""),
                            found = $filter("filter")(fieldList, { value: filterCheck }, true),
                            parentRequired = (found.length > 0) ? found[0].required : false;

                        if (!hideRequired || ((hideRequired && !field.required) && (hideRequired && !parentRequired))) {
                            scope.fields.push(field);
                        }
                    }
                }
            });
        };
        scope.setupFields();

        scope.$watch('fields', function (_curr, _prev) {
            if (!initialized) {
                initialized = true;
            }
        }, true);

        scope.$watch('field.selected', function () {
            scope.value = scope.field.selected;
        });

        scope.fieldFilter = function (field) {
            return function (opt) {
                return scope.usedFields.indexOf(opt.value) === -1 || opt.value === field.selected;
            };
        };

        scope.filterLinked = function (_field) {
            return function (opt) {
                if (scope.ignoreLinked) {
                    return (!opt.isLinked);
                } else {
                    return opt;
                }
            };
        };

        scope.clearOption = function () {
            if (scope.allowClear) {
                scope.field.selected = null;
            }
        }

        scope.$watch('value', function (curr, prev) {
            if (curr !== prev) {
                scope.field.selected = curr;
            }
        }, true);
    }

    return {
        restrict: "E",
        replace: true,
        scope: {
            tableName: "=",
            value: "=",
            disableSelect: "=?",
            hideRequired: "=?",
            requiredOnly: "=?",
            allowSearch: "=?",
            usedFields: "=?",
            hideUsedFields: "=?",
            onSelect: "&?",
            ignoreLinked: "=?",
            allowClear: "=?",
            ignoreFields: "=?",

        },
        link: link
    };
};

miFieldSelect.$inject = ["$rootScope", "$compile", "$filter", "editorApiSvc"];