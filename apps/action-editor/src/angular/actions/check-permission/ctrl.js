export default function CheckPermissionCtrl($rootScope, $scope, $q, editorApiSvc) {
  console.debug('CheckPermissionCtrl', $scope.action);
  var appsList = [];
  var permissions = [];

  var loadApps = function () {
    var deferred = $q.defer();

    // Get apps and permissions
    editorApiSvc.getAppsAndPermissions().then(
      function (resp) {
        appsList = resp.apps;
        permissions = resp.permissions;
        deferred.resolve();
      },
      function () {
        deferred.reject();
      },
    );

    return deferred.promise;
  };

  var createPermissionList = function () {
    $scope.permissionOptions = [];
    angular.forEach(permissions[$scope.action.AppId], function (permission) {
      $scope.permissionOptions.push({
        key: permission.Key === undefined ? permission.key : permission.Key,
        value: permission.Value === undefined ? permission.value : permission.Value,
      });
    });
  };

  var createAppsList = function () {
    $scope.appSelection = [];
    angular.forEach(appsList, function (name, id) {
      $scope.appSelection.push({
        value: id,
        label: name,
      });
    });
  };

  loadApps().then(function () {
    createAppsList();
    createPermissionList();
  });

  $scope.appSwitch = function () {
    createPermissionList();
    $scope.action.validate();
  };

  $scope.permissionSwitch = function () {
    $scope.action.validate();
  };

  $scope.$watch('action.ShowMessage', function (curr, prev) {
    if (curr !== prev) {
      if (curr) {
        $scope.action.DenialMessage = null;
      } else {
        $scope.action.ResultToSet.ActionResultName = null;
        $scope.action.ResultToSet.IsSharedResult = false;
      }
    }
  });
}

CheckPermissionCtrl.$inject = ['$rootScope', '$scope', '$q', 'editorApiSvc'];
