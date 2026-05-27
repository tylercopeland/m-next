export default function SharedResultCtrl($rootScope, $scope, deleteModalSvc) {
  console.debug("SharedResultCtrl", $scope.action);

  $scope.allow = [0,1,2,5,6,7,8,9,10,11,12];

  $scope.addItem = function() {
    $scope.action.addNewItem();
  };

  $scope.removeItem = function(idx, item) {
    var consumptions = $scope.action.hasConsumption(item);

    if(!consumptions) {
      $scope.action.deleteItem(idx);
    } else {
      deleteModalSvc.showModal({
          title: "Delete Action Result", 
          message: "We've found the following action result is being used elsewhere within your action set: <strong>" + consumptions.join(", ") + "</strong>. <br><br>Do you still want to delete this action result?",
          cancelText: "Cancel",
          cancelCallback: function() {
          },
          confirmText: "Delete",
          confirmCallback: function() {
            $scope.action.deleteItem(idx);
            $scope.editor.cleanUpActionResults([{
              id: item.ActionResultId,
              name: item.ActionResultName,
              model: item
            }]);
            $scope.editor.validate();
            $scope.$apply();
          }
      });  
    }
  };
};

SharedResultCtrl.$inject = ["$rootScope", "$scope", "deleteModalSvc"];