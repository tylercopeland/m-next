export default function LoopThroughListCtrl($scope) {
  // Allow values for ComplexValue dropdown (Action Result, Loop, Control, Session, Text)
  $scope.allow = [0, 2, 5, 6, 9];
}

LoopThroughListCtrl.$inject = ['$scope'];
