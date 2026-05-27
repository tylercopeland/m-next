export default function SendMobilePushNotificationCtrl($rootScope, $scope, $filter, editorApiSvc, configs, ComplexValueModel) {
  console.debug("SendMobilePushNotificationCtrl", $scope.action);

  var rawList = [];
  $scope.users = ["User 1", "User 2", "User 3"];
  $scope.allow = [0,2,5,6,8,9,10,11,12];
  $scope.allowParams = [0, 2, 5, 6, 9];
  $scope.dropdowns = {
    appList: [
      {
        category: "System Pages",
        label: "Dashboard",
        value: "dashboard"
      }
    ],
    screenList: [],
    appSelection: null,
    appScreenSelection: null,
    transition: [
      {
        label: "Close this screen",
        value: true
      },
      {
        label: "Keep this screen in currently open list",
        value: false
      }
    ],
  };

  $scope.onSelect = function (field) {
    var found = $filter('filter')($scope.tableFields, { value: field.Key }, true);
    if (found.length > 0) {
      field.includedTypes = [found[0].fieldType];
      if (found[0].fieldType === 0) {
        field.Value = new ComplexValueModel({ ValueType: 9 });
        field.includedTypes = [0, 1, 3];
      }
      else if (found[0].fieldType === 1) {
        field.Value = new ComplexValueModel({ ValueType: 10 });
        field.includedTypes = [0, 1];
      }
      else if (found[0].fieldType === 2) {
        field.Value = new ComplexValueModel({ ValueType: 12 });
      }
      else if (found[0].fieldType === 3) {
        field.Value = new ComplexValueModel({ ValueType: 11 });
      }
    }

    $scope.setUsedFields();
  }

  var initializeData = function (_app, _screen) {

    if ($scope.action.ScreenId === "dashboard") {
      $scope.dropdowns.appSelection = $scope.action.ScreenId;
      $scope.dropdowns.appScreenSelection = null;
    }
    else {
      var found = $filter('filter')(rawList, { key: $scope.action.ScreenId }, true);
      if (found.length === 1) {
        $scope.dropdowns.appSelection = found[0].appName;
        $scope.dropdowns.appScreenSelection = $scope.action.ScreenId;
      }
      else {
        if ($scope.action.AppName) {
          $scope.dropdowns.appSelection = $scope.action.AppName;
        }
      }
    }
  };

  $scope.loadApps = function () {
    editorApiSvc
      .loadScreenList()
      .then(function (data) {
        // Setup raw list for future usage;
        rawList = angular.copy(data);

        angular.forEach(rawList, function (obj) {
          var found = $filter('filter')($scope.dropdowns.appList, { value: obj.appName }, true);

          if (found.length === 0) {
            $scope.dropdowns.appList.push({
              category: "Apps",
              label: obj.appName,
              value: obj.appName
            });
          }
        });
        initializeData();
      });
  };
  $scope.loadApps();

  $scope.loadAppScreens = function (app) {
    $scope.dropdowns.screenList = [];
    angular.forEach(rawList, function (obj) {
      if (obj.appName === app) {
        if (!obj.isScreenlet) {
          $scope.dropdowns.screenList.push({
            label: obj.screenName,
            value: obj.key,
            viewFriendlyName: obj.viewFriendlyName
          });
        }
      }
    });
  };

  $scope.$watch("dropdowns.appSelection", function (curr, prev) {
    if (curr !== null && curr !== undefined) {
      if (curr !== "back" && curr !== "dashboard") {
        if (prev !== null && curr !== prev) {
          $scope.action.ScreenId = null;
          $scope.dropdowns.appScreenSelection = null;
        }
        $scope.action.AppName = curr;
        $scope.loadAppScreens(curr);
      } else {
        $scope.action.ScreenId = curr;
        $scope.action.validate();
      }
    }
  }, true);

  $scope.$watch("dropdowns.appScreenSelection", function (curr, _prev) {
    if (curr !== null && curr !== undefined) {
      $scope.action.ScreenId = curr;
      $scope.action.validate();
    }
  }, true);
};

SendMobilePushNotificationCtrl.$inject = ["$rootScope", "$scope", "$filter", "editorApiSvc", "configs", "ComplexValueModel"];