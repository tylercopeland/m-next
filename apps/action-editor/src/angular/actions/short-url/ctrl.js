export default function CreateShortUrlCtrl($rootScope, $injector, $scope, $filter, editorApiSvc) {
  console.debug("CreateShortUrlCtrl", $scope.action);


  var rawList = [];

  $scope.allow = [0,2,5,6,10];

  var sessionSvc;
  if ($injector.has('sessionSvc')) {
    sessionSvc = $injector.get('sessionSvc');
    console.debug(`I am "CreateShortUrlCtrl" and I found "sessionSvc" by asking $injector.`);
    $scope.accountName = sessionSvc.sessionData.account.name;
  } else {
    console.debug(`I am "CreateShortUrlCtrl" and I needed access to "sessionSvc" from legacy and I did not get it!`);
  }

  $scope.dropdowns = {
    appList: [],
    screenList: [],
    appSelection: null,
    appScreenSelection: null,
  };

  var initializeData = function(_app, _screen) {
    $scope.dropdowns.activeRecordType = ($scope.action.ActiveRecordId !== -1) ? 0 : 1;

    if($scope.action.ScreenId === "back" || $scope.action.ScreenId === "dashboard") {
      $scope.dropdowns.appSelection = $scope.action.ScreenId;
      $scope.dropdowns.appScreenSelection = null;
    } else {
      var found = $filter('filter')(rawList, {key: $scope.action.ScreenId}, true);
      if(found.length === 1) {
        
        $scope.dropdowns.appSelection = found[0].appName;
        $scope.dropdowns.appScreenSelection = $scope.action.ScreenId;
      } else {
        if($scope.action.AppName) {
          $scope.dropdowns.appSelection = $scope.action.AppName;
        }
      }
    }
  };

  $scope.loadApps = function() {
    editorApiSvc
      .loadScreenList()
      .then(function(data) {
        // Setup raw list for future usage;
        rawList = angular.copy(data);

        angular.forEach(rawList, function(obj) {
          var found = $filter('filter')($scope.dropdowns.appList, {value: obj.appName}, true);

          if(found.length === 0) {
            $scope.dropdowns.appList.push({
                label: obj.appName,
                value: obj.appName
            });
          }
        });
        initializeData();
      });
  };
  $scope.loadApps();

  $scope.loadAppScreens = function(app) {
    $scope.dropdowns.screenList = [];
    angular.forEach(rawList, function(obj) {
      if(!obj.isScreenlet) {
        if(obj.appName === app) {
          $scope.dropdowns.screenList.push({
            label: obj.screenName,
            value: obj.key
          });
        }
      }
    });
  };

  $scope.$watch("action.InviteType", function(curr, prev) {
    if(curr !== null && prev !== null && curr !== prev) {
      $scope.action.switchInviteType();
    }
  }, true);

  $scope.$watch("dropdowns.appSelection", function(curr, _prev) {
    if(curr !== null && curr !== undefined) {
      $scope.action.ScreenId = null;
      $scope.action.AppName = curr;
      $scope.loadAppScreens(curr);
      // if(prev !== null) {
      //   $scope.action.validateScreen();
      // }
    }
  }, true);

  $scope.$watch("dropdowns.appScreenSelection", function(curr, _prev) {
    if(curr !== null && curr !== undefined) {
      $scope.action.ScreenId = curr;
      $scope.action.validateScreen();
    }
  }, true);
};

CreateShortUrlCtrl.$inject = ["$rootScope", "$injector", "$scope", "$filter", "editorApiSvc"];