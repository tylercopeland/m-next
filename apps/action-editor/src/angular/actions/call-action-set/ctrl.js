export default function CallActionSetCtrl($scope, $injector, $filter, $timeout, guidSvc, currentScreenSvc, ComplexValueModel) {
  console.debug('CallActionSetCtrl', $scope.action);

  var appRoutinesSvc;
  if ($injector.has('appRoutinesSvc')) {
      appRoutinesSvc = $injector.get('appRoutinesSvc');
    console.debug(`I am "CallActionSetCtrl" and I found "appRoutinesSvc" by asking $injector.`);
  } else {
    console.debug(`I am "CallActionSetCtrl" and I needed access to "appRoutinesSvc" from legacy and I did not get it!`);
  }

  var notificationSvc;
  if ($injector.has('notificationSvc')) {
      notificationSvc = $injector.get('notificationSvc');
    console.debug(`I am "CallActionSetCtrl" and I found "notificationSvc" by asking $injector.`);
  } else {
    console.debug(`I am "CallActionSetCtrl" and I needed access to "notificationSvc" from legacy and I did not get it!`);
  }

  $scope.selectedAppRoutine = null;
  $scope.isAppRoutine = false;
  $scope.hideJumpButton = false;
  $scope.routineId = null;
  $scope.allow = [0, 2, 5, 6, 9, 10, 11, 12];
  $scope.messageType = 0;

  if ($scope.action.ShowMessage && !$scope.action.CustomMessage) {
    $scope.messageType = 1;
  }
  if ($scope.action.ShowMessage && $scope.action.CustomMessage) {
    $scope.messageType = 2;
  }

  var appId = currentScreenSvc.getOption('AppRef');

  var handleButtonDisplay = function () {
    $scope.hideJumpButton = $scope.action.ActionSetId && $scope.action.ActionSetId !== guidSvc.empty ? false : true;
  };

  $scope.availableRoutines = !$scope.$parent.isAppRoutineEditor ? $scope.editor.listAllActionSets($scope.editor.selectedControl.actionSetId) : [];

  // Add all routines to available-actions dropdown
  var addRoutines = function (routines) {
    // Get all available action sets except for the current one
    if (routines.length > 0) {
      var category = 'App';
      routines.forEach(function (routine) {
        // Add available routines
        $scope.availableRoutines.push({
          label: routine.name,
          value: routine.appRoutineId,
          category: category
        });
      });
    }
  };

  var setRoutineOrActionSetModel = function () {
    if ($scope.action.isAppRoutine()) {
      $scope.isAppRoutine = true;
      $scope.routineId = $scope.action.AppRoutineId;
      $scope.hideJumpButton = true;
    } else {
      $scope.routineId = $scope.action.ActionSetId;
      var action = $filter('filter')($scope.availableRoutines, {
        value: $scope.action.ActionSetId
      }, true);
      if (action.length === 1) {
        $scope.action.ActionSetControl = action[0].id;
      }
      handleButtonDisplay();
    }

    // Set the default value if action was not saved before
    if (!$scope.routineId) {
      if ($scope.availableRoutines.length > 0) {
        $scope.routineId = $scope.availableRoutines[0].value;
        $scope.selectRoutine($scope.availableRoutines[0]);
      }
    }
  };

  // Gets all routines for current app
  var getAllRoutines = function (appId) {
    // Fetch only live routines with live versions
    if (appRoutinesSvc) appRoutinesSvc.getAllRoutines(appId, appRoutinesSvc.appRoutineStatus.live).then(
      function (routines) {
        // Only routines that have live and active version will be listed
        routines = routines.filter(function (routine) {
          return routine.isActive;
        });

        addRoutines(routines);
        // Once promise resolved, set model
        // Use $timeout to trigger digest cycle since appRoutinesSvc uses native Promise
        $timeout(function() {
          setRoutineOrActionSetModel();
        });
      },
      function (_err) {
        if (typeof mi === 'undefined') {
          var mi = {
              constants : {
                  errorMessages: {
                      generic: "An unexpected error has occurred. Please try again, or if the issue persists, contact support@method.me."
                  }
              }
          }
        }
        if (notificationSvc) notificationSvc.error(mi.constants.errorMessages.generic);
      }
    );
  };

  $scope.jumpToAction = function () {
    var action = $filter('filter')($scope.availableRoutines, {
      value: $scope.action.ActionSetId
    }, true);
    if (action.length === 1) {
      $scope.pushSelectedEvent(action[0].id, action[0].event, false);
    }
  };

  $scope.learnMore = function (_evt) {
  };

  $scope.selectRoutine = function (item) {
    // Handle call another action set from screen controls
    if (item.category === 'Screen') {
      $scope.action.validate();
      $scope.action.resetAppRoutineModel();
      $scope.isAppRoutine = false;
      $scope.action.ActionSetId = item.value;
      $scope.hideJumpButton = false;
      var action = $filter('filter')($scope.availableRoutines, {
        value: $scope.action.ActionSetId
      }, true);
      if (action.length === 1) {
        $scope.action.ActionSetControl = action[0].id;
      }
      return;
    } else {
      // Handle app routines
      $scope.isAppRoutine = true;
      $scope.action.ActionSetId = null;
      $scope.action.AppRoutineId = item.value;
      $scope.hideJumpButton = true;
      $scope.action.ActionSetControl = null;
      // Fetch only live version for the routine
      if (appRoutinesSvc) appRoutinesSvc.getRoutine(appId, $scope.action.AppRoutineId, appRoutinesSvc.appRoutineStatus.live).then(function (routine) {
        // Use $timeout to trigger digest cycle since appRoutinesSvc uses native Promise
        $timeout(function() {
          routine.versions.forEach(function (version) {
            if (version.status === appRoutinesSvc.appRoutineStatus.live) {
              $scope.action.AppRoutineVersionId = version.versionId;

              // Add input values from the routine version
              $scope.action.InputValues = [];
              version.actions[0].assignValueToActions.forEach(function (value) {
                $scope.action.addInputValue(value.actionResultName, value.source.valueType);
              });

              // Add output values from the routine version
              $scope.action.OutputValues = [];
              version.outputValues.forEach(function (output) {
                $scope.action.addOutputValue(output.value);
              });
            }
          });
        });
      });
    }
  };

  $scope.changeExecutionMode = function () {
    if ($scope.action.IsSync) {
      // TODO:
    }
  };

  $scope.changeMessageMode = function (val) {
    if (val === 0) {
      $scope.action.ShowMessage = false;
      $scope.action.CustomMessage = null;
      $scope.messageType = 0;
    }
    if (val === 1) {
      $scope.action.ShowMessage = true;
      $scope.action.CustomMessage = null;
      $scope.messageType = 1;
    }
    if (val === 2) {
      $scope.action.ShowMessage = true;
      $scope.action.CustomMessage = new ComplexValueModel({
        ValueType: 9
      })
      $scope.messageType = 2;
    }

  };

  $scope.getInputValue = function (inputValue) {
    var type = '';

    switch (inputValue.Value.ValueType) {
      case 9:
        type = 'Text';
        break;
      case 10:
        type = 'Number';
        break;
      case 11:
        type = 'Yes/No';
        break;
      case 12:
        type = 'DateTime';
        break;
      default:
        type = 'Text';
    }

    return `${inputValue.Key} (${type})`
  };

  getAllRoutines(appId);
};

CallActionSetCtrl.$inject = ['$scope', '$injector', '$filter', '$timeout', 'guidSvc', 'currentScreenSvc', 'ComplexValueModel'];