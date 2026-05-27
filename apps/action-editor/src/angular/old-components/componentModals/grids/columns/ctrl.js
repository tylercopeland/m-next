const ComponentGridColumnCtrl = function ($rootScope, $scope, $http, $filter, $timeout, ComponentModalSvc, guidSvc, currentScreenSvc) {
    console.debug("ComponentGridColumnCtrl", $scope.control.model);
    $scope.svgIconStyle = {
        display: 'inline-block'
    };
    var propertyIdx = 0,
        guid = guidSvc.create();

    $scope.$parent.layout.title = $scope.control.name + " | Column Property Window";
    $scope.recordColumn = null;
    $scope.columns = [];
    $scope.properties = null;
    $scope.editMode = true;
    $scope.fields = [];
    $scope.layout = {
        bulk: {
            adding: false,
            list: [],
            button: {
                on: 'Add single column',
                off: 'Add multiple columns'
            }
        },
        query: "",
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
                // $scope.autoSave();
            }
        },
        alignments: [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" }
        ],
        formats: [
            { value: "", label: "None" },
            { value: "Number", label: "Number" },
            { value: "Short Date", label: "Short Date" },
            { value: "Short Date and Time", label: "Short Date and Time" },
            { value: "Long Date", label: "Long Date" },
            { value: "Long Date and Time", label: "Long Date and Time" },
            { value: "Time", label: "Time" },
            { value: "Hour", label: "Hour" },
            { value: "Day", label: "Day" },
            { value: "Day of Week", label: "Day of Week" },
            { value: "Month", label: "Month" },
            { value: "Month and Year", label: "Month and Year" },
            { value: "Year", label: "Year" }
        ],
        rounding: [
            { value: 0, label: "0" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" }
        ],
        separator: [
            { value: "Regular", label: "Regular" },
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
        ],
        width: [
            { value: 0, label: "Pixels" },
            { value: 1, label: "%" }
        ]
    };
    $scope.bulkBtnLabel = $scope.layout.bulk.button.off;
    $scope.layout['numberFormats'] = [
        ...$scope.layout.formats,
        { value: "Hours in hh:mm", label: "Hours in hh:mm" },
        { value: "Minutes in hh:mm", label: "Minutes in hh:mm" }
    ];

    ComponentModalSvc
        .loadFields($scope.control.model.viewName)
        .then(function (resp) {
            $timeout(function () {
                $rootScope.$emit("miae:refreshSelect");
            }, 400);
            $scope.fields = resp;
        });

    $scope.setupColumns = function () {
        $scope.recordColumn = $filter('filter')($scope.control.model.columns, { name: "RecordID" }, true)[0];
        angular.forEach($scope.control.model.columns, function (obj) {
            if (obj.name !== "RecordID") {
                $scope.columns.push(obj);
            }
        });
    };
    $scope.setupColumns();

    $scope.alreadyUsed = function (item) {
        if ($filter('filter')($scope.columns, { name: item.key }, true).length === 0 && item.key !== "RecordID") {
            return item;
        }
    };

    $scope.loadProperties = function (column, idx, hideExpressionBuilder) {
        // console.log('loadProperties', column, idx, hideExpressionBuilder);
        $scope.properties = column;

        if (hideExpressionBuilder || hideExpressionBuilder === undefined) {
            $scope.layout.showExpressionBuilder = false;
        }

        if ($scope.properties.format.alignment === null || $scope.properties.format.alignment === "") {
            $scope.properties.format.alignment = "left";
        }
        if ($scope.properties.format.formatType === null || $scope.properties.format.formatType === "") {
            $scope.properties.format.formatType = "";
        }
        if ($scope.properties.format.formatRounding !== null || $scope.properties.format.formatRounding !== "") {
            if (!_.isNumber($scope.properties.format.formatRounding)) {
                $scope.properties.format.formatRounding = parseInt(angular.copy($scope.properties.format.formatRounding));
            }
        }
        $scope.editMode = true;

        var events = currentScreenSvc.getEvents(column.onClick),
            count = (column.onClick !== null && (events !== null && events !== undefined)) ?
            currentScreenSvc.getActionSets(events[0]).Actions.length :
                0;
        $scope.buttonLabel = "Click (" + count + ")";
    };
    $scope.loadProperties($scope.recordColumn);

    $scope.getIcon = function (value) {
        return ComponentModalSvc.getIcon(value);
    };

    $scope.getFieldType = function (column) {
        return ComponentModalSvc.getFieldType(column);
    };

    $scope.addColumn = function () {
        $scope.layout.query = "";
        $scope.editMode = false;
        propertyIdx = null;
        $scope.properties = null;
        $timeout(function () {
            angular.element("#columnSearch").focus();
        }, 100);
    };

    $scope.toggleMultiple = function () {
        $scope.layout.bulk.adding = !$scope.layout.bulk.adding;

        if (!$scope.layout.bulk.adding) {
            $scope.layout.bulk.list = [];
        }
        $scope.bulkBtnLabel = ($scope.layout.bulk.adding) ? $scope.layout.bulk.button.on : $scope.layout.bulk.button.off;
    };

    $scope.selectField = function (field) {
        if ($scope.layout.bulk.adding) {
            var idx = $scope.layout.bulk.list.indexOf(field);
            if (idx === -1) {
                $scope.layout.bulk.list.push(field);
            } else {
                $scope.layout.bulk.list.splice(idx, 1);
            }
        } else {
            $scope.insertNewProperty(ComponentModalSvc.newColumnObject(field.key, 0, field.value.fldTypeId));
        }
    };

    $scope.selectExpression = function () {
        if ($scope.layout.bulk.adding) {
            var idx = $scope.layout.bulk.list.indexOf("Expression");
            if (idx === -1) {
                $scope.layout.bulk.list.push("Expression");
            } else {
                $scope.layout.bulk.list.splice(idx, 1);
            }
        } else {
            var name = "Expression" + ComponentModalSvc.getCount(2, "Expression", $scope.columns);
            $scope.insertNewProperty(ComponentModalSvc.newColumnObject(name, 2, -1));
        }
    };

    $scope.selectLink = function () {
        if ($scope.layout.bulk.adding) {
            var idx = $scope.layout.bulk.list.indexOf("Link");
            if (idx === -1) {
                $scope.layout.bulk.list.push("Link");
            } else {
                $scope.layout.bulk.list.splice(idx, 1);
            }
        } else {
            var name = "Link" + ComponentModalSvc.getCount(1, "Link", $scope.columns);
            $scope.insertNewProperty(ComponentModalSvc.newColumnObject(name, 1, -1));
        }
    };

    $scope.isInArray = function (item) {
        return ($scope.layout.bulk.list.indexOf(item) > -1)
    };

    $scope.bulkAdd = function () {
        angular.forEach($scope.layout.bulk.list, function (obj) {
            if (obj !== "Link" && obj !== "Expression") {
                $scope.columns.push(ComponentModalSvc.newColumnObject(obj.key, 0, obj.value.fldTypeId));
            }
            if (obj === "Link") {
                var name = "Link" + ComponentModalSvc.getCount(1, "Link", $scope.columns);
                $scope.columns.push(ComponentModalSvc.newColumnObject(name, 1, -1));
            }
            if (obj === "Expression") {
                var name = "Expression" + ComponentModalSvc.getCount(2, "Expression", $scope.columns);
                $scope.columns.push(ComponentModalSvc.newColumnObject(name, 2, -1));
            }
        });
        $scope.toggleMultiple();
    };

    $scope.insertNewProperty = function (obj) {
        // console.log('insertNewProperty');
        $scope.columns.push(obj);
        propertyIdx = $scope.columns.length - 1;
        $scope.properties = $scope.columns[propertyIdx];
        $scope.editMode = true;
        setTimeout(function () {
            $scope.autoSave();
        }, 300);
    };

    $scope.triggerDelete = function (evt, idx) {
        // console.log('triggerDelete', $scope.columns[idx]);
        evt.preventDefault();
        evt.stopPropagation();

        var onClick = $scope.columns[idx].onClick,
            canDelete = true;

        if (onClick !== null) {
            var actionId = (currentScreenSvc.getEvents(onClick)) ? currentScreenSvc.getEvents(onClick)[0] : null;
            var hasActions = (actionId) ? currentScreenSvc.getActionSets(actionId).Actions.length : null;
            // console.log('hasActions', hasActions);
            canDelete = (hasActions === null) ? true : false;
        }

        if (canDelete) {
            $scope.deleteColumn(idx);
        } else {
            var closingMsg = $("<p>This column contains click actions. Are you sure you want to delete?</p>");
            closingMsg.newDialog({
                modal: true,
                title: "Do you want to delete this column?",
                width: 450,
                height: 220,
                buttons: [
                    {
                        text: "Cancel",
                        classes: 'ghost',
                        click: function () {
                            closingMsg.newDialog("close");
                        }
                    },
                    {
                        text: "Delete",
                        classes: "blue",
                        click: function () {
                            $scope.deleteColumn(idx);
                            $scope.$apply();
                            closingMsg.newDialog("close");
                        }
                    }
                ]
            });
        }
    };

    $scope.deleteColumn = function (idx) {
        $scope.columns.splice(idx, 1);
        $scope.editMode = false;
        if (idx === propertyIdx) {
            propertyIdx = null;
        }
        setTimeout(function () {
            $scope.autoSave();
        }, 300);
    };

    $scope.createExpression = function () {
        console.log('open expression builder', $scope.properties.expression);
        $scope.layout.showExpressionBuilder = true;
        $rootScope.$broadcast("mi:expression", {
            id: guid,
            builder: 'grid-column',
            value: $scope.properties.expression,
            title: $scope.properties.caption
        });
    };

    $scope.autoSave = function () {
        $scope.$emit("component:modal:autoSave");
    };

    $scope.openActionEditor = function () {
        var idx = $scope.control.model.columns.indexOf($scope.properties);
        angular.element("#actionEditorModal").scope().openEditor($scope.selectedControl, idx, true);
    };

    $scope.updateFormat = function (selected) {
        // console.log('formatType', selected);
        if (selected.value === "Number") {
            $scope.properties.format.formatRounding = 0;
            $scope.properties.format.formatSeparator = "Regular";
        } else {
            $scope.properties.format.formatRounding = null;
            $scope.properties.format.formatSeparator = null;
        }
    };

    $scope.$watch('columns', function (curr, prev) {
        // console.log('columns updated')
        $scope.control.model.columns = [];
        $scope.control.model.columns.push($scope.recordColumn);
        angular.forEach($scope.columns, function (column) {
            $scope.control.model.columns.push(column);
        });
        $scope.$emit("component:modal:isModified");
        // console.log('columns', $scope.control.model.columns);
    }, true);

    $scope.$on("mi:expression:update", function (e, params) {
        if (params.id === guid) {
            // console.log('update this', params.value);
            $scope.properties.expression = angular.copy(params.value);
        }
    });
    $scope.validateFieldFormat = function (column) {
        let field = $scope.getFieldType(column);
        return field === "Field - Decimal" || field === "Field - Integer";
    }
};
ComponentGridColumnCtrl.$inject = ['$rootScope', '$scope', '$http', '$filter', '$timeout', 'ComponentModalSvc', 'guidSvc', 'currentScreenSvc'];
export default ComponentGridColumnCtrl;