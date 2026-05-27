export default function RetrieveValuesCtrl($rootScope, $scope, editorSvc, editorApiSvc, noSqlSvc) {
    console.debug("RetrieveValuesCtrl", $scope.action);

    $scope.criteriaBuilder = false;
    $scope.canContinue = false;
    //   $scope.allow = [0, 5, 6, 8, 9, 10, 11, 12];
    var tables = $scope.editor.getTables();
    var hasNoSqlTables = false;
    noSqlSvc.views.forEach(view => {
        if (!tables.some(table => table.value == view.name))
        {
            tables.push({id: view.name, value: view.name});
            hasNoSqlTables = true;
        }
    });

    if (hasNoSqlTables) {
        tables = tables.sort((a,b)=> {
            return a.value > b.value  ? 1 : -1;
        });
    }
    
    $scope.tables = tables;

    $scope.usedFields = [];
    $scope.criteriaButton = ($scope.action.WhereClause.length > 2) ? "Edit criteria" : "Open criteria builder";

    $scope.loadTableFields = function () {
        if ($scope.action.ViewNameFriendly !== null && $scope.action.ViewNameFriendly !== "") {
            $scope.isLoading = true;

            editorApiSvc
                .loadTableFields($scope.action.ViewNameFriendly)
                .then(function () {
                    $scope.isLoading = false;
                    $scope.canContinue = true;
                    $scope.tableFields = editorApiSvc.createFieldListOptions($scope.action.ViewNameFriendly);
                    $scope.setUsedFields();

                    if($scope.action.Bindings.length === 0) {
                    $scope.addItem();
                    }

                    if($scope.criteriaBuilder) {
                        $rootScope.$broadcast("micb:refresh", {
                        whereClause: $scope.action.WhereClause
                        });
                    }
                });
        }
    };

    $scope.setUsedFields = function () {
        $scope.usedFields = [];
        angular.forEach($scope.action.Bindings, function (field) {
            $scope.usedFields.push(field.FieldName);
        });
        //  $scope.action.validate();
    }

    $scope.addItem = function () {
        $scope.action.addItem();
    };

    $scope.removeItem = function (idx) {
        $scope.action.Bindings.splice(idx, 1);
        $scope.setUsedFields();
    };

    $scope.toggleCriteriaBuilder = function () {
        $scope.criteriaBuilder = !$scope.criteriaBuilder;
        $scope.action.validate();
    };

    $scope.$watch('action.WhereClause', function() {
        $scope.criteriaButton = ($scope.action.WhereClause.length > 2) ? "Edit criteria" : "Open criteria builder";
    }, true);

    $scope.$watch('action.ViewNameFriendly', function(){
        if (noSqlSvc.isNoSql($scope.action.ViewNameFriendly))
        {
            $scope.action.aggregateTypes = [
                { label: "First", value: 0 },
                { label: "Last", value: 1 },
                { label: "Count", value: 6 }
                ];

                if (!$scope.action.aggregateTypes.some(x => x.value == $scope.action.AggregationType))
                {
                    $scope.action.AggregationType = $scope.action.aggregateTypes[0].value;
                }
        }
        else {
            
            $scope.action.aggregateTypes = [
                { label: "First", value: 0 },
                { label: "Last", value: 1 },
                { label: "Minimum", value: 2 },
                { label: "Maximum", value: 3 },
                { label: "Sum", value: 4 },
                { label: "Avg", value: 5 },
                { label: "Count", value: 6 }
                ];
            
        }
    });


    $scope.$watch('action.ViewNameFriendly', function (curr, prev) {
        $scope.loadTableFields();
        $scope.canContinue = false;
        if (curr !== prev) {
            $scope.action.Fields = [];
            $scope.action.WhereClause = [];
            $scope.action.Bindings = [];
            $scope.usedFields = [];
            $scope.action.validateViewNameFriendly();
            $rootScope.$broadcast("micb:refresh", {
                whereClause: $scope.action.WhereClause
            });
        }
    }, true);
};

RetrieveValuesCtrl.$inject = ["$rootScope", "$scope", "editorSvc", "editorApiSvc", "noSqlSvc"];