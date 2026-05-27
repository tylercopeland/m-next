export default function DeleteRecordCtrl($rootScope, $scope, editorApiSvc) {
  console.debug('DeleteRecordCtrl', $scope.action);

  $scope.criteriaBuilder = false;
  $scope.canContinue = false;
  $scope.tables = $scope.editor.getTables();
  $scope.criteriaButton = $scope.action.WhereClause.length > 2 ? 'Edit criteria' : 'Open criteria builder';

  $scope.loadTableFields = function() {
    if ($scope.action.ViewNameFriendly !== null && $scope.action.ViewNameFriendly !== '') {
      $scope.isLoading = true;
      editorApiSvc.loadTableFields($scope.action.ViewNameFriendly).then(function() {
        $scope.isLoading = false;
        $scope.canContinue = true;
        $rootScope.$broadcast('micb:refresh', {
          whereClause: $scope.action.WhereClause
        });
      });
    }
  };

  $scope.toggleCriteriaBuilder = function() {
    $scope.criteriaBuilder = !$scope.criteriaBuilder;
    $scope.action.validate();
  };

  $scope.$watch(
    'action.WhereClause',
    function() {
      $scope.criteriaButton = $scope.action.WhereClause.length > 2 ? 'Edit criteria' : 'Open criteria builder';
    },
    true
  );

  $scope.$watch(
    'action.ViewNameFriendly',
    function(curr, prev) {
      if (curr !== prev) {
        $scope.canContinue = false;
        $scope.action.WhereClause = [];
        $scope.loadTableFields();
        $scope.action.validateViewNameFriendly();
        $rootScope.$broadcast('micb:refresh', {
          whereClause: $scope.action.WhereClause
        });
      }
      if (curr !== null && curr === prev) {
        $scope.canContinue = true;
        $scope.loadTableFields();
      }
    },
    true
  );
};

DeleteRecordCtrl.$inject = ['$rootScope', '$scope', 'editorApiSvc'];