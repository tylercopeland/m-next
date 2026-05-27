const ComponentModalSvc = function ($http, $q, $filter, guidSvc, replacementEditorApiSvc) {
    var displayTypes = {
        Data: 0,
        Image: 1,
        Document: 2,
        Icon: 3,
        TagList: 4
    };

    var newColumnObject = function (caption, columnType, fieldType) {
        // Create display type
        var display = displayTypes.Data;

        if (caption === "TagList") {
            display = displayTypes.TagList;
        }
        switch (fieldType) {
            case 6:
                display = displayTypes.Document;
                break;
            case 7:
                display = displayTypes.Image;
                break;
        }

        return {
            aggregate: null,
            caption: caption,
            columnType: columnType,
            expression: [],
            fieldType: fieldType,
            format: {
                alignment: "left",
                display: display,
                formatRounding: null,
                formatSeparator: null,
                formatType: "",
                hideCaption: false,
                icon: {
                    color: null,
                    name: null
                },
                visible: true,
                visiblemobile: true,
                width: {
                    mtype: 0,
                    mvalue: null,
                    type: 0,
                    value: null
                }
            },
            hasSubtotal: false,
            isKey: false,
            name: caption,
            onClick: null,
            subtotal: 0
        };
    };

    var newFilterDef = function (filterName, isDefault, viewName) {
        return {
            expression: [],
            filterId: guidSvc.create(),
            filterName: filterName,
            hidden: [],
            isDefault: isDefault, // True or False
            sorting: [],
            state: 1,
            viewName: viewName
        };
    };

    var newSortObject = function (fieldName, order) {
        return {
            filterField: fieldName,
            filterOrder: order
        };
    };

    var getFieldType = function (column) {
        // Field 0
        switch (column.columnType) {
            case 0:
                var displayAs = "Text";
                if (column.name === "TagList") {
                    displayAs = "TagList";
                } else {
                    switch (column.fieldType) {
                        case 1:
                            displayAs = "Decimal"; break;
                        case 2:
                            displayAs = "Integer"; break;
                        case 3:
                            displayAs = "Datetime"; break;
                        case 4:
                            displayAs = "Money"; break;
                        case 5:
                            displayAs = "YesNo"; break;
                        case 6:
                            displayAs = "FileAttachment"; break;
                        case 7:
                            displayAs = "Picture"; break;
                        case 8:
                            displayAs = "Dropdown"; break;
                        case 9:
                            displayAs = "Linked"; break;
                    }
                }
                return "Field - " + displayAs;
                break;
            case 1:
                return "Link";
                break;
            case 2:
                return "Expression";
                break;
        }
    };

    var getIcon = function (value) {
        switch (value) {
            case 0:
                return "text-width"; break;
            case 1:
                return "list-ul"; break;
            case 2:
                return "list-ol"; break;
            case 3:
                return "timer"; break;
            case 4:
                return "usd"; break;
            case 5:
                return "ok"; break;
            case 6:
                return "attachment"; break;
            case 7:
                return "picture"; break;
            case 8:
                return "collapse"; break;
            case 9:
                return "link"; break;
            default:
                return "text-width"; break;
        }
    };

    var loadFields = function (viewName) {
        var deferred = $q.defer();

        replacementEditorApiSvc.loadTableFields(viewName)
            .then(function (resp) {
                deferred.resolve(resp);
            });

        return deferred.promise;
    };

    var getCount = function (type, prefix, searchArray) {
        var counter = 1,
            items = [];

        angular.forEach(searchArray, function (column) {
            if (column.columnType === type) {
                var int = column.name.replace(prefix, "");
                if (!isNaN(parseInt(int))) {
                    items.push(parseInt(int));
                }
            }
        });

        if (items.length > 0) {
            items = $filter('orderBy')(items);
            counter = parseInt(items[items.length - 1]) + 1;
        }

        return counter;
    };

    var getFilterCount = function (prefix, searchArray) {
        var counter = 1,
            items = [];

        angular.forEach(searchArray, function (filter) {
            isPrefixed = (filter.filterName.replace(prefix, "") !== filter.filterName) ? filter.filterName.replace(prefix, "") : false;
            if (isPrefixed) {
                if (!isNaN(parseInt(isPrefixed))) {
                    items.push(parseInt(isPrefixed));
                }
            }
        });

        if (items.length > 0) {
            items = $filter('orderBy')(items);
            counter = parseInt(items[items.length - 1]) + 1;
        }

        return counter;
    };

    return {
        newColumnObject: newColumnObject,
        newFilterDef: newFilterDef,
        newSortObject: newSortObject,
        getFieldType: getFieldType,
        getIcon: getIcon,
        loadFields: loadFields,
        getCount: getCount,
        getFilterCount: getFilterCount
    };
};
ComponentModalSvc.$inject = ['$http', '$q', '$filter', 'guidSvc', 'replacementEditorApiSvc'];
export default ComponentModalSvc;