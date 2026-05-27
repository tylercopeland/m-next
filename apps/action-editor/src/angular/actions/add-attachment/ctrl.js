export default function AddAttachmentCtrl($rootScope, $scope) {
  console.debug('AddAttachmentCtrl', $scope.action);

  $scope.allow = [0, 2, 5, 6, 10];
  $scope.allowUrl = [0, 2, 5, 9];
  $scope.allowAttachToEmail = [0, 2, 5, 8, 12];
  $scope.tables = $scope.editor.getTables();

  $scope.$watch(
    'action.ViewNameFriendly',
    function(curr, prev) {
      if (curr !== prev) {
        $scope.action.validateViewNameFriendly();
      }
    },
    true
  );

  $scope.$watch(
    'action.Url',
    function(curr, prev) {
      if ((curr.ValueType === prev.ValueType && curr.ValueType !== 9) || (curr.ValueType === 9 && curr.Value !== '')) {
        $scope.action.validate();
      }
    },
    true
  );
};

AddAttachmentCtrl.$inject = ["$rootScope", "$scope"];