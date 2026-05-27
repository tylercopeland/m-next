export default function SetControlFocusCtrl($rootScope, $scope, editorSvc) {
  console.debug('SetControlFocusCtrl', $scope.action);

  $scope.loadControls = function() {
    var controls = editorSvc.getScreenControls(['SEC', 'L-CON', 'DOC'], false);

    $scope.controlList = [];

    angular.forEach(controls, function(control) {
      $scope.controlList.push({
        value: control.id,
        label: control.name,
        typeLabel: control.typeLabel
      });
    });
  };
  $scope.loadControls();

  $scope.itemSelection = function(_selection, _item) {
    $scope.action.validate();
  };
};

SetControlFocusCtrl.$inject = ['$rootScope', '$scope', 'editorSvc'];