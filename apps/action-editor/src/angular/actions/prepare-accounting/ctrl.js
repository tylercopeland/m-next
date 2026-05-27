export default function PrepareAccountingCtrl($rootScope, $scope, editorApiSvc) {
  console.debug("PrepareAccountingCtrl", $scope.action);

  $scope.criteriaBuilder = false;
  $scope.canContinue = false;
  $scope.tables = $scope.editor.getTables();

  $scope.loadTableFields = function(viewNameFriendly) {
    editorApiSvc
      .loadTableFields(viewNameFriendly)
      .then(function() {
        $rootScope.$broadcast("miae:refreshSelect");
      });
  };

  $scope.$watch("action", function(curr, prev) {
    if(curr.ViewNameFriendly !== null) {
      $scope.canContinue = true;
      $scope.action.validateViewNameFriendly();
      $scope.loadTableFields(curr.ViewNameFriendly);
    }
    
    if(curr.ViewNameFriendly !== prev.ViewNameFriendly) {
      $rootScope.$broadcast("micb:refresh", { whereClause: $scope.action.defaultWhere() });
    }
  }, true);

  $scope.toggleCriteriaBuilder = function () {
    $scope.criteriaBuilder = !$scope.criteriaBuilder;
    $scope.action.validate();
  };

};

PrepareAccountingCtrl.$inject = ["$rootScope", "$scope", "editorApiSvc"];