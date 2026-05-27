export default function LoopThroughGridCtrl($rootScope, $scope, usedControlsSvc) {
  console.debug("LoopThroughGridCtrl", $scope.action);

  usedControlsSvc.init({
      controls: ['GRD','EDT'],
      displayTheseOnly: true,
      hideProperties: true,
      items: []
  });
  $scope.controlList = usedControlsSvc.getControlList();

  $scope.$watch('action.GridId', function(curr, prev) {
    if(curr !== prev) {
      $scope.action.validate();
      $scope.action.getViewName();
    }
  });
};

LoopThroughGridCtrl.$inject = ["$rootScope", "$scope", "usedControlsSvc"];