export default function LoopThroughTableCtrl($rootScope, $scope, editorApiSvc) {
    var blankSorting = {
        Field: null,
        IsAscending: true
    };

    $scope.sortingOptions = [
        {
            id: true,
            value: "Ascending"
        },
        {
            id: false,
            value: "Descending"
        }
    ];
    $scope.hasDistinct = false;
    $scope.criteriaBuilder = false;
    $scope.UsedFields = [];
    $scope.totalfields = 0;
    $scope.tables = $scope.editor.getTables();
    $scope.totalfields = editorApiSvc.createFieldListOptions($scope.action.ViewNameFriendly).length;
    $scope.criteriaButton = ($scope.action.WhereClause.length > 2) ? "Edit criteria" : "Open criteria builder";

    $scope.setUsedFields = function () {
        $scope.usedFields = [];
        angular.forEach($scope.action.Sorting, function (field) {
            $scope.usedFields.push(field.Field);
        });
    }

    $scope.loadTableFields = function () {
        $scope.isLoading = true;
        editorApiSvc
            .loadTableFields($scope.action.ViewNameFriendly)
            .then(function () {
                $scope.isLoading = false;
                $scope.totalfields = editorApiSvc.createFieldListOptions($scope.action.ViewNameFriendly).length;
                $scope.canContinue = true;
                $rootScope.$broadcast("micb:refresh", { 
                    whereClause: $scope.action.WhereClause 
                });
            });

        $scope.setUsedFields();
    };
    if ($scope.action.ViewNameFriendly !== null) {
        $scope.loadTableFields();
    }

    $scope.addSortingItem = function () {
        $scope.action.Sorting.push(angular.copy(blankSorting));
    };

    $scope.removeSortingItem = function (idx) {
        // console.error("removeItem", idx);
        $scope.action.Sorting.splice(idx, 1);
    };

    $scope.toggleCriteriaBuilder = function () {
        $scope.criteriaBuilder = !$scope.criteriaBuilder;
        $scope.action.validate();
    };

    $scope.$watch('action.WhereClause', function() {
        $scope.criteriaButton = ($scope.action.WhereClause.length > 2) ? "Edit criteria" : "Open criteria builder";
    }, true);

    $scope.$watch('action.ViewNameFriendly', function (curr, prev) {
        if (curr !== prev) {
            $scope.canContinue = false;
            $scope.action.DistinctColumn = null;
            $scope.action.Sorting = [{
                Field: "RecordID",
                IsAscending: true
            }];
            $scope.action.WhereClause = [];
            //   $scope.addSortingItem();
            $scope.loadTableFields();
            $scope.action.validate();
        }
    }, true);

    $scope.$watch('action.DistinctColumn', function(curr, prev) {
        if(curr !== null && curr !== prev) {
            $scope.action.Sorting = [];
            $scope.addSortingItem();
            $scope.action.Sorting[0].Field = curr;
            $scope.hasDistinct = true;
        } else if(curr !== null && curr === prev) {
            $scope.hasDistinct = true;
        } else {
            if(curr === null && prev !== null) {
                $scope.action.Sorting[0].Field = "RecordID";
            }
            $scope.hasDistinct = false;
        }
    }, true);

    $scope.$watch('action.Sorting', function(curr, prev) {
        if(curr.length !== 0 && curr !== prev && curr[curr.length - 1].Field !== null) {
            $scope.action.validate();
        }
    }, true);
};

LoopThroughTableCtrl.$inject = ["$rootScope", "$scope", "editorApiSvc"];