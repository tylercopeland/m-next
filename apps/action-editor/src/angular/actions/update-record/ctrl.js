export default function UpdateRecordCtrl($rootScope, $scope, $filter, editorApiSvc, ComplexValueModel) {
    console.debug("UpdateRecordCtrl", $scope.action);

    $scope.allow1st = [3];
    $scope.allow2nd = [0, 2, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.tables = $scope.editor.getTables();
    $scope.criteriaBuilder = false;
    $scope.criteriaButton = ($scope.action.WhereClause.length > 2) ? "Edit criteria" : "Open criteria builder";

    $scope.loadTableFields = function (_loading) {
        if ($scope.action.ViewNameFriendly !== null && $scope.action.ViewNameFriendly !== "") {
            $scope.isLoading = true;
            editorApiSvc
                .loadTableFields($scope.action.ViewNameFriendly)
                .then(function () {
                    $scope.tableFields = editorApiSvc.createFieldListOptions($scope.action.ViewNameFriendly);
                    // $scope.setUsedFields(loading);
                    $scope.isLoading = false;
                    $scope.canContinue = true;

                    if($scope.action.Fields.length === 0) {
                        $scope.addItem();
                    } else {
                    angular.forEach($scope.action.Fields, function(obj) {
                        var found = $filter('filter')($scope.tableFields, { value: obj.Field }, true);
                        if (found.length > 0) {
                            obj.includedTypes = [found[0].fieldType];
                            if (found[0].fieldType === 0) {
                                obj.includedTypes = [0, 1, 3];
                            } 
                            if (found[0].fieldType === 1) {
                                obj.includedTypes = [0, 1];
                            }
                        }
                    });
                    $scope.setUsedFields();
                    }
                });
        }
    };

    $scope.addItem = function () {
        $scope.action.addNewField();
    };

    $scope.removeItem = function (idx) {
        $scope.action.Fields.splice(idx, 1);
    };

    $scope.setUsedFields = function () {
        $scope.usedFields = [];
        angular.forEach($scope.action.Fields, function (field) {
            $scope.usedFields.push(field.Field);
        });
        $scope.action.validate();
    }

    $scope.onSelect = function (field) {
        var found = $filter('filter')($scope.tableFields, { value: field.Field }, true);
        if (found.length > 0) {
            field.includedTypes = [found[0].fieldType];
            if (found[0].fieldType === 0) {
                field.Source = new ComplexValueModel({ ValueType: 9 });
                field.includedTypes = [0, 1, 3];
            } else if (found[0].fieldType === 1) {
                field.Source = new ComplexValueModel({ ValueType: 10 });
                field.includedTypes = [0, 1];
            } else if (found[0].fieldType === 2) {
                field.Source = new ComplexValueModel({ ValueType: 12 });
            } else if (found[0].fieldType === 3) {
                field.Source = new ComplexValueModel({ ValueType: 11 });
            }
        }

        $scope.setUsedFields();
    }

    $scope.toggleCriteriaBuilder = function () {
        $scope.criteriaBuilder = !$scope.criteriaBuilder;
        $scope.action.validate();
    };

    $scope.$watch('action.WhereClause', function() {
        if($scope.action.ViewNameFriendly !== null) {
            $scope.action.validate();
        }
        $scope.criteriaButton = ($scope.action.WhereClause.length > 2) ? "Edit criteria" : "Open criteria builder";
    }, true);


    $scope.$watch('action.ViewNameFriendly', function (curr, prev) {
        if (curr !== prev) {
            $scope.action.validateViewNameFriendly();
            $scope.canContinue = false;
            $scope.action.Fields = [];
            $scope.action.WhereClause = [];
            $scope.action.addNewField();
            $scope.loadTableFields();
        }
        if (curr !== null && curr === prev) {
            $scope.canContinue = false;
            $scope.loadTableFields();
        }
    }, true);
};

UpdateRecordCtrl.$inject = ["$rootScope", "$scope", "$filter", "editorApiSvc", "ComplexValueModel"];