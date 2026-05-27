export default function ShowToastCtrl($rootScope, $scope, $filter, $timeout, editorApiSvc, _ComplexValueModel) {

  const VALUE_TYPE_TEXT = 9;
  const MESSAGE_MAX_LENGTH = 120;
  const VALIDATION_CODE_MAX_LENGTH = 141;
  const BUTTON_TEXT_MAX_LENGTH = 40;

  var rawList = [];

  // Toast type options
  $scope.toastTypes = [
    { value: 'success', label: 'Success' },
    { value: 'emphasized', label: 'Information' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
  ];

  // Allowed value types for Message field:
  // 0 = Action Result, 2 = Loop, 5 = Control, 6 = Session, 9 = Text
  $scope.messageAllow = [0, 2, 5, 6, 9];

  // Allowed value types for ActiveRecordId:
  // 0 = Action Result, 5 = Control, 6 = Session, 10 = Number
  $scope.activeRecordAllow = [0, 5, 6, 10];

  // Navigation dropdowns
  $scope.dropdowns = {
    appList: [],
    screenList: [],
    appSelection: null,
    appScreenSelection: null,
    activeRecordType: null
  };

  // Initialize defaults if not set
  if (!$scope.action.ToastType) {
    $scope.action.ToastType = 'success';
  }

  // Initialize navigation data
  var initializeData = function () {
    $scope.dropdowns.activeRecordType = ($scope.action.ActiveRecordId !== null && $scope.action.ActiveRecordId.Value !== -1) ? 0 : 1;

    if ($scope.action.NavigateToScreenId) {
      var found = $filter('filter')(rawList, { key: $scope.action.NavigateToScreenId }, true);
      if (found.length === 1) {
        $scope.dropdowns.appSelection = found[0].appName;
        $scope.dropdowns.appScreenSelection = $scope.action.NavigateToScreenId;
      } else if ($scope.action.NavigateToAppName) {
        $scope.dropdowns.appSelection = $scope.action.NavigateToAppName;
      }
    } else if ($scope.action.NavigateToAppName) {
      $scope.dropdowns.appSelection = $scope.action.NavigateToAppName;
    }
  };

  // Load apps list (only apps, no system pages)
  $scope.loadApps = function () {
    editorApiSvc
      .loadScreenList()
      .then(function (data) {
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

  // Load screens for selected app
  $scope.loadAppScreens = function (app) {
    $scope.dropdowns.screenList = [];
    angular.forEach(rawList, function (obj) {
      if (obj.appName === app) {
        if (!obj.isScreenlet) {
          $scope.dropdowns.screenList.push({
            label: obj.screenName,
            value: obj.key
          });
        }
      }
    });
  };

  // Watch Message value for max length validation (120 chars) and required validation
  $scope.$watch('action.Message.Value', function (newVal) {
    if ($scope.action.Message.ValueType === VALUE_TYPE_TEXT && newVal && typeof newVal === 'string' && newVal.length === MESSAGE_MAX_LENGTH) {
      $scope.action.Message.ValidationMessage = VALIDATION_CODE_MAX_LENGTH;
    } else if ($scope.action.Message.ValidationMessage === VALIDATION_CODE_MAX_LENGTH) {
      $scope.action.Message.ValidationMessage = null;
    }
    $scope.action.validate();
  });

  // Re-run validation when ValidationMessage is cleared by ComplexValueModel.validate() on blur
  // This ensures required validation (code 109) persists until user enters text
  $scope.$watch('action.Message.ValidationMessage', function (newVal, oldVal) {
    if (newVal === null && oldVal === 109) {
      $timeout(function () {
        $scope.action.validate();
      }, 0);
    }
  });

  // Watch ButtonText for max length validation (40 chars)
  $scope.$watch('action.ButtonText', function (newVal) {
    $scope.action.validate();
    // Show max length error when ButtonText reaches 40 chars (after validate clears/rebuilds)
    if (newVal && typeof newVal === 'string' && newVal.length === BUTTON_TEXT_MAX_LENGTH) {
      // Check if error already exists (validate() may have added it)
      var hasMaxLengthError = $scope.action.ValidationMessages.some(function(msg) {
        return msg.Property === 'ButtonText' && msg.Message === 142;
      });
      if (!hasMaxLengthError) {
        $scope.action.ValidationMessages.push({
          Property: 'ButtonText',
          Message: 142
        });
      }
    }
  });

  // Clear ButtonText max length error on blur (same behavior as Message field)
  $scope.onButtonTextBlur = function() {
    $scope.action.ValidationMessages = $scope.action.ValidationMessages.filter(function(msg) {
      return !(msg.Property === 'ButtonText' && msg.Message === 142);
    });
  };

  // Watch activeRecordType changes
  $scope.$watch('dropdowns.activeRecordType', function (curr, prev) {
    if (curr !== null && prev !== null) {
      $scope.action.switchActiveRecordId(curr);
    }
  }, true);

  // Watch app selection changes
  $scope.$watch('dropdowns.appSelection', function (curr, prev) {
    if (curr !== null && curr !== undefined) {
      if (prev !== null && curr !== prev) {
        $scope.action.NavigateToScreenId = null;
        $scope.dropdowns.appScreenSelection = null;
      }
      $scope.action.NavigateToAppName = curr;
      $scope.loadAppScreens(curr);
    }
  }, true);

  // Watch screen selection changes
  $scope.$watch('dropdowns.appScreenSelection', function (curr, _prev) {
    if (curr !== null && curr !== undefined) {
      $scope.action.NavigateToScreenId = curr;
    }
    $scope.action.validate();
  }, true);

  // Watch IncludeNavigationButton changes to revalidate
  $scope.$watch('action.IncludeNavigationButton', function () {
    $scope.action.validate();
  });
};

ShowToastCtrl.$inject = ['$rootScope', '$scope', '$filter', '$timeout', 'editorApiSvc', 'ComplexValueModel'];
