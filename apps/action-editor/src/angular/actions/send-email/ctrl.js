export default function SendEmailCtrl($rootScope, $scope, currentScreenSvc) {
  console.debug("SendEmailCtrl", $scope.action);

  $scope.allow = [0,2,5,6,8,9,10,11,12];
  $scope.allowAttach = [0,2,5,9];
  $scope.showCC = ($scope.action.CC === null || $scope.action.CC === undefined) ? false : true;
  $scope.showBCC = ($scope.action.BCC === null || $scope.action.BCC === undefined) ? false : true;
  $scope.showAdvanced = ($scope.action.Server === null || $scope.action.Server.Value === "") ? false : true;
  $scope.priorityOptions = $scope.action.priorityOptions;
  $scope.isSenderManagementEnabled = currentScreenSvc.isFeatureFlagEnabled({ id: 42, name: "senderManagement"});
  
  // Add new Item
  $scope.addItem = function() {
    $scope.action.addAttachment();
  };

  $scope.removeItem = function(idx) {
    $scope.action.Attachments.splice(idx, 1);
  };

  $scope.$watch('showCC', function(curr, prev) {
    if(curr !== prev) {
      $scope.action.addProperty('CC', (!$scope.showCC) ? null : { ValueType: 9 });
    }
  });

  $scope.$watch('showBCC', function(curr, prev) {
    if(curr !== prev) {
      $scope.action.addProperty('BCC', (!$scope.showBCC) ? null : { ValueType: 9 });
    }
  });

  $scope.$watch('showAdvanced', function(curr, prev) {
    if(curr !== prev) {
      $scope.action.addProperty('Server', (!$scope.showAdvanced) ? null : { ValueType: 9 });
      $scope.action.addProperty('Username', (!$scope.showAdvanced) ? null : { ValueType: 9 });
      $scope.action.addProperty('Password', (!$scope.showAdvanced) ? null : { ValueType: 9 });
      $scope.action.addProperty('Port', (!$scope.showAdvanced) ? null : { ValueType: 9 });
    }
  });

  $scope.$watch("action.Attachments", function() {
    $rootScope.$broadcast("miae:refreshSelect");
  }, true);
};

SendEmailCtrl.$inject = ["$rootScope", "$scope", "currentScreenSvc"];