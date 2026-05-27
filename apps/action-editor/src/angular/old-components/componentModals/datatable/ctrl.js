const ComponentDataTableCtrl = function ($rootScope, $scope, $timeout, $filter, replacementEditorApiSvc, ComponentModalSvc, guidSvc, replacementComplexValueModel, currentScreenSvc) {
    console.log("ComponentDataTableCtrl", $scope.control);
    $scope.svgIconStyle = {
        display: 'inline-block'
    };
    $scope.$parent.layout.title = $scope.control.name + " : Editable Grid Builder";
    $scope.tab = "config";
    $scope.tabDisabled = ($scope.control.viewFriendlyName === "" || $scope.control.viewFriendlyName === null) ? true : false;
    $scope.tables = [];
    $scope.tableFields = [];
    $scope.options = {
        pageSizeOptions: [
            { value: null, label: "Display All" },
            { value: 10, label: "10" },
            { value: 25, label: "25" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
        ],
        colWidthSizes: [
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
        ],
        colAlignment: [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
        ],
        format: [
            { value: "", label: "None" },
            { value: "Number", label: "Number" },
            { value: "Money", label: "Money" }
        ],
        rounding: [
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" }
        ],
        separator: [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
        ],
        moneySeparators: [
            { value: "", label: "None" },
            { value: ".", label: "Decimal" },
            { value: ",", label: "Comma" },
            { value: " ", label: "Space" },
        ],
        moneySymbols: [
            { value: "", label: "None" },
            { value: "$", label: "Dollar" },
            { value: "£", label: "Pound" },
            { value: "€", label: "Euro" },
            { value: "¢", label: "Cents" }
        ]
    };
    $scope.layout = {
        selectColumn: true,
        selectedColIdx: null,
        selectedViewIdx: null,
        disableDynamic: true,
        query: "",
        sortableConfig: {
            animation: 150,
            group: 'columns',
            handle: '.mi-icon-move',
            filter: '.mi-ae-ignore',
            disabled: false,
            scroll: true,
            filter: '.ignore-elements',
            onUpdate: function () {
                console.warn("item moved");
                // $scope.autoSave();
            }
        },
        action: {
            loop: {
                distinctColumn: null,
                inLoop: false,
                tableName: $scope.control.viewFriendlyName
            }
        },
        validationRules: {
            0: [0, 1, 2, 3, 4, 6],
            1: [0],
            2: [0],
            4: [0],
            8: [0],
        }
    };

    // Get the label of the field selected
    var getFieldLabel = function (val) {
        return $filter('filter')($scope.tableFields, { value: val }, true)[0].label;
    }

    // Switch the tab
    $scope.switchTab = function (type) {
        if (!$scope.tabDisabled) {
            $scope.tab = type;
        }
    };

    // Clear control
    $scope.clearControl = function () {
        $scope.control.columns = [];
        $scope.control.viewList = [];
        $scope.control.defaultViewFilter = null;
        $scope.control.viewFilter = null;
    };

    // Update the label for the event button
    $scope.makeButtonLabel = function (action) {
        const events = currentScreenSvc.getEvents();
        const actionSets = currentScreenSvc.getActionSets();
        var count = ($scope.control[action] !== null) ?
            actionSets[events[$scope.control[action]][0]].Actions.length :
            0;
        return "Edit Actions (" + count + ")";
    };

    $scope.makeColumnButtonLabel = function (action) {
        const events = currentScreenSvc.getEvents();
        const actionSets = currentScreenSvc.getActionSets();
        var column = $scope.control.columns[$scope.layout.selectedColIdx],
            count = (column.onChangeEvent !== null) ?
                actionSets[events[column.onChangeEvent][0]].Actions.length :
                0;
        return "Edit Actions (" + count + ")";
    };

    // Set the default view filter
    $scope.setDefaultView = function (id) {
        $scope.control.defaultViewFilter = id;
    }

    // Adding new column
    $scope.addColumn = function (col, required) {
        var isRecordID = (col.value === 'RecordID'),
            data = {
                header: col.label,
                field: col.value,
                fieldType: col.fldTypeId,
                columnType: (col.isLinked) ? $.mi.Constants.ColumnType.Link : $.mi.Constants.ColumnType.Data,
                onChangeEvent: null,
                mapping: new replacementComplexValueModel({
                    ValueType: (col.isLinked || isRecordID) ? 14 : 15,
                    Value: (col.isLinked || isRecordID) ? "Dynamic" : "Editable",
                    Property: (col.isLinked) ? "Linked" : (isRecordID) ? "RecordID" : null
                }),
                readOnly: (col.isLinked || isRecordID) ? true : false,
                canDelete: (required || isRecordID) ? false : true,
                isLocked: (col.isLinked || isRecordID) ? true : false,
                format: {
                    width: 'md',
                    alignment: 'left',
                    type: null,
                    rounding: null,
                    separator: null,
                    thousands: null,
                    decimalPoint: null,
                    money: null,
                },
                validationRules: []
            };

        // Setup field specific formats
        if (!isRecordID && col.fldTypeId === $.mi.Constants.FieldType.Money) {
            data.format.type = "Money";
            data.format.rounding = "2";
            data.format.thousands = ",";
            data.format.decimalPoint = ".";
            data.format.money = "$";
        }

        if (!isRecordID && ((col.fldTypeId === $.mi.Constants.FieldType.Integer) || (col.fldTypeId === $.mi.Constants.FieldType.Decimal))) {
            data.format.type = "Number";
            data.format.rounding = "2";
            data.format.separator = "Yes";
        }

        if (required || isRecordID) {
            data.validationRules.push({
                rule: 0,
                value: null,
                canDelete: false
            });
        }



        $scope.layout.query = "";
        $scope.control.columns.push(data);

        if (!required) {
            $scope.layout.selectedColIdx = $scope.control.columns.length - 1;
        }
    };

    // Adding new view
    $scope.addView = function () {
        var name = "View " + $scope.getViewName('View');

        $scope.control.viewList.push({
            name: name,
            id: guidSvc.create(),
            columns: [],
            sorting: [],
            filtering: [],
            enableDynamicDates: false,
            width: null
        });

        if ($scope.control.viewList.length === 1) {
            $scope.setDefaultView($scope.control.viewList[0].id);
        }

        $scope.layout.selectedViewIdx = ($scope.control.viewList.length - 1);
    };

    // Add column to view
    $scope.addColumnToView = function (field) {
        $scope.control.viewList[$scope.layout.selectedViewIdx].columns.push({
            field: field
        });
    };

    // Does this column exist in the view
    $scope.existsInView = function (field) {
        var found = $filter('filter')($scope.control.viewList[$scope.layout.selectedViewIdx].columns, { field: field }, true);
        return (found && found.length === 1) ? false : true;
    };

    // Get New View Name
    $scope.getViewName = function (prefix) {
        var counter = 1,
            items = [];

        angular.forEach($scope.control.viewList, function (view) {
            isPrefixed = (view.name.replace(prefix, "") !== view.name) ? view.name.replace(prefix, "") : false;
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

    // Load a list of available tables
    $scope.loadTables = function () {
        var tableList = currentScreenSvc.getOption('tableList');

        tableList.forEach(function (item) {
            $scope.tables.push({
                value: item[1],
                label: item[1],
                view: item[0]
            });
        });
    };
    $scope.loadTables();

    // Load all the fields for this table
    $scope.loadTableFields = function () {
        if ($scope.control.viewFriendlyName !== null && $scope.control.viewFriendlyName !== "") {
            replacementEditorApiSvc
                .loadTableFields($scope.control.viewFriendlyName)
                .then(function () {
                    $scope.tableFields = replacementEditorApiSvc.createFieldListOptions($scope.control.viewFriendlyName, [6]);

                    // Setup all default required fields
                    if ($scope.control.columns.length === 0) {
                        angular.forEach($scope.tableFields, function (obj, idx) {
                            if (obj.required || obj.value === "RecordID") {
                                $scope.addColumn(obj, true);
                            }
                        });
                    }

                    // Setup a default view
                    if ($scope.control.viewList.length === 0) {
                        $scope.addView();
                    }
                });
        }
    };

    // Check which columns are already used
    $scope.alreadyUsed = function (item) {
        if ($filter('filter')($scope.control.columns, { field: item.value }, true).length === 0) {
            return item;
        }
    };

    // Get the icon for the field type
    $scope.getIcon = function (value) {
        return ComponentModalSvc.getIcon(value);
    };

    // Configure the selected column
    $scope.configureColumn = function (idx) {
        $scope.layout.selectedColIdx = idx;
        $scope.layout.selectColumn = false;
    };

    // Configure the selected view
    $scope.configureView = function (idx) {
        $scope.layout.selectedViewIdx = idx;
    };

    // Delete the column
    $scope.deleteColumn = function (evt, idx) {
        $scope.control.columns.splice(idx, 1);

        if (idx === $scope.layout.selectedColIdx) {
            $scope.selectColumns();
        }
    };

    // Delete the column
    $scope.deleteView = function (evt, idx) {
        // Check if this was the default
        var wasDefault = ($scope.control.viewList[idx].id === $scope.control.defaultViewFilter);

        // Delete the filter
        $scope.control.viewList.splice(idx, 1);
        $scope.layout.selectedViewIdx = null;

        if ($scope.control.viewList.length === 0) {
            $scope.addView();
        } else {
            if ($scope.control.viewList.length === 1 || wasDefault) {
                $scope.setDefaultView($scope.control.viewList[0].id);
            }
        }
    };

    // Delete column from view
    $scope.deleteViewColumn = function (evt, idx) {
        $scope.control.viewList[$scope.layout.selectedViewIdx].columns.splice(idx, 1);
    };

    // Select more columns
    $scope.selectColumns = function () {
        $scope.layout.selectColumn = true;
    };

    // Open action editor for the events
    $scope.openActionEditor = function (eventName) {
        $rootScope.$broadcast("component:modal:isModified");
        $rootScope.$broadcast("component:modal:autoSave");
        angular.element("#actionEditorModal").scope().openEditor($scope.selectedControl, eventName);
    };

    $scope.openColumnActionEditor = function () {
        angular.element("#actionEditorModal").scope().openEditor($scope.selectedControl, $scope.layout.selectedColIdx, true);
    };

    // Is this a numeric field type
    $scope.isNumericField = function (type) {
        return (type === null || type === undefined) ? false : ([1, 2, 4].indexOf(type) > -1);
    };

    $scope.$watch("control.viewFriendlyName", function (curr, prev) {
        // console.log('curr/prev', curr, prev);
        $scope.loadTableFields();
        $scope.tabDisabled = (curr === "" || curr === null) ? true : false;

        // Clear out all previous columns and views
        if (curr !== prev) {
            $scope.clearControl();
        }
    });

    $scope.$watch("control", function (curr, prev) {
        if (curr !== prev) {
            $rootScope.$broadcast("component:modal:isModified");
        }

        $scope.control.columns.forEach(function (obj) {
            obj.mapping = new replacementComplexValueModel(obj.mapping);
        });
        // console.log('control', $scope.control);
    }, true);

    $scope.$on("miae:closed", function () {
        $timeout(function () {
            // $scope.makeButtonLabel();
        });
    });

};
ComponentDataTableCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$filter', 'replacementEditorApiSvc', 'ComponentModalSvc', 'guidSvc', 'replacementComplexValueModel', 'currentScreenSvc'];
export default ComponentDataTableCtrl;