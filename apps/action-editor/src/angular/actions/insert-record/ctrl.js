export default function InsertRecordCtrl($rootScope, $scope, $filter, editorApiSvc, ComplexValueModel) {
    console.debug("InsertRecordCtrl", $scope.action);

    $scope.canContinue = false;
    $scope.allow = [0, 2, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.allowIds = [0, 2, 5, 6, 10];
    $scope.requiredList = [];
    $scope.requiredUniqueList = [];
    $scope.usedFields = [];
    $scope.tables = $scope.editor.getTables();
    $scope.transactionFields = ["RefNumber"];
    $scope.recurrenceFields = ["DueDateStart", "DueDateEnd", "IsChangedOccurrence"];
    $scope.omittedFieldList = ["RecordID", "IsMarketplaceTemplate","CreatedDate", "CreatedBy", "CreatedBy_RecordID", "LastModifiedBy", "LastModifiedBy_RecordID", "LastModifiedDate", "RecurrenceType"];
    $scope.omittedFieldListFriendly = ["RecordID", "CreatedBy", "CreatedDate", "LastModifiedBy", "LastModifiedDate", "TxnID", "RecurrenceType"];


    $scope.isReactRuntime = true;

    $scope.loadTableFields = function (insertRequiredFields, insertUniqueFields, insertRecurrenceFields) {
        if ($scope.action.ViewNameFriendly !== null && $scope.action.ViewNameFriendly !== "") {
            $scope.isLoading = true;

            editorApiSvc
                .loadTableFields($scope.action.ViewNameFriendly)
                .then(function () {
                    $scope.isLoading = false;
                    $scope.canContinue = true;

                    $scope.createRequiredList();
                    $scope.tableFields = editorApiSvc.createFieldListOptions($scope.action.ViewNameFriendly);

                    if (insertRequiredFields) {
                        $scope.addRequiredFields();
                    } else {
                        $scope.markRequiredFields();
                    }

                    if (insertUniqueFields) {
                        $scope.addUniqueFields();
                        $scope.addTransactionFields();
                    }

                    if (insertRecurrenceFields) {
                        $scope.addRecurrenceFields();
                    }

                    if($scope.requiredList.length === 0 && $scope.action.Fields.length === 0) {
                        $scope.addItem();
                    }

                    if($scope.requiredList.length > 0) {
                    $scope.setUsedFields(!insertRequiredFields);
                    }

                });
        }
    };

    var getFields = function () {
        return editorApiSvc.getFields($scope.action.ViewNameFriendly);
    };

    var getFieldType = function (type) {
        switch(type) {
            case "DateTime":
                return 11;
            case "YesNo":
                return 12;
            default:
                return 9;
        }
    }
    $scope.createRequiredList = function () {
        $scope.requiredList = [];
        $scope.requiredUniqueList = [];

        angular.forEach(getFields(), function (field) {
            if (field.value.isReq) {
                $scope.requiredList.push(field.key);
                $scope.requiredUniqueList.push(field.key);
                if (field.value.fldType === "DropDown") {
                    $scope.requiredList.push(field.key + "_RecordID");
                }               
            }
        });
    };

    $scope.addRequiredFields = function () {
        angular.forEach(getFields(), function (field) {
            if (field.value.isReq) {
                $scope.action.addNewField(field.key, field.value.isReq);
            }
        });
    };

    $scope.addUniqueFields = function() {
        angular.forEach(getFields(), function(field) {
            if (field.value.isUnique && field.key != "RecordID") {
                $scope.action.addNewField(field.key, field.value.isReq, field.value.isUnique);
            }
        });
    };

    $scope.addTransactionFields = function() {
        angular.forEach(getFields(), function(field) {
            if($scope.transactionFields.length > 0 && $scope.transactionFields.indexOf(field.key) >= 0) {
                $scope.action.addNewOmittedField(field.key);
            }
        });
    };

    $scope.addRecurrenceFields = function() {
        angular.forEach(getFields(), function(field) {
            if ($scope.recurrenceFields.length > 0 && $scope.recurrenceFields.indexOf(field.key) >= 0) {
                var fieldTypeVal = getFieldType(field.value.fldType);
                $scope.action.addNewField(field.key, field.value.isReq, field.value.isUnique, fieldTypeVal);
            }
        })
    };

    $scope.markRequiredFields = function () {
        angular.forEach($scope.action.Fields, function (field) {
            field.Required = ($scope.requiredList.indexOf(field.Field) > -1);
        });
    };

    $scope.addItem = function () {
        $scope.action.addNewField();
    };

    $scope.addOmittedItem = function() {
        $scope.action.addNewOmittedField();
    };

    $scope.removeItem = function (idx) {
        $scope.action.Fields.splice(idx, 1);
        $scope.setUsedFields(false);
    };

    $scope.removeOmittedItem = function(idx) {
        $scope.action.FieldsToOmit.splice(idx, 1);
        $scope.setUsedFields(false);
    };

    $scope.getAddFieldTotal = function () {
        return ($scope.tableFields.length - $scope.requiredList.length) + $scope.requiredUniqueList.length - 1; // exclude recordid
    };


    $scope.setUsedFields = function () {
        $scope.usedFields = [];
        angular.forEach($scope.action.Fields, function (field) {
            $scope.usedFields.push(field.Field);
        });
        angular.forEach($scope.action.FieldsToOmit, function(field) {
            $scope.usedFields.push(field.Field);
        });
        $scope.action.validateFields();
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

    $scope.$watch('action.ViewNameFriendly', function (curr, prev) {
        if (curr !== prev) {
            $scope.action.validateViewNameFriendly();
            $scope.canContinue = false;
            $scope.action.SourceRecordId = new ComplexValueModel({ ValueType: 10 });
            $scope.action.Fields = [];
            $scope.action.FieldsToOmit = [];
            
            if ($scope.action.InsertType === 0) {
                $scope.loadTableFields(true);
                $scope.setUsedFields();
            }
            else {
                $scope.action.InsertType = 0;
            }
        }
        if (curr !== null && curr === prev) {
            $scope.canContinue = false;
            $scope.loadTableFields(false);
        }
    }, true);

    $scope.$watch('action.InsertType', function (curr, prev) {
        if (curr != prev) {
            $scope.action.SourceRecordId = new ComplexValueModel({ ValueType: 10 });
            $scope.action.Fields = [];
            $scope.action.FieldsToOmit = [];
            
            if(curr === 1 || curr === 2) {
                $scope.loadTableFields(false, curr === 1, curr === 2);
                $scope.setUsedFields(false);
            }
            else {
                $scope.loadTableFields(true);
                $scope.setUsedFields(false);
            }
        }
    });
};

InsertRecordCtrl.$inject = ["$rootScope", "$scope", "$filter", "editorApiSvc", "ComplexValueModel"];