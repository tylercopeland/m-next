export default function LoopThroughDocumentsCtrl($rootScope, $scope) {
  console.debug("LoopThroughDocumentsCtrl", $scope.action);

  $scope.allow = [0, 2, 5, 6, 10];
  $scope.tables = $scope.editor.getTables();

  $scope.$watch('action.ViewNameFriendly', function (curr, prev) {
      if (curr !== prev) {
          $scope.action.validate();
      }
  }, true);
};

LoopThroughDocumentsCtrl.$inject = ["$rootScope", "$scope"];