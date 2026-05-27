export default function ProcessPaymentsV2Ctrl($rootScope, $scope, $injector, ComplexValueModel, currentScreenSvc, $filter) {
    console.debug("ProcessPaymentsV2Ctrl", $scope.action)
    
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
  
    $scope.allowedTypesNumber = [0, 2, 5, 6, 10, 18];
    $scope.allowedTypesText = [0, 2, 5, 6, 9, 18];
    if($scope.$parent.isAppRoutineEditor) {
        $scope.action.txnTypes = $scope.action.txnTypes.filter(function (type) {
            return type.value !== 2;
        });
    }
    $scope.availableRoutines = [];
    $scope.appRoutineInputs = [];
    $scope.routineId = null;

    var appId = currentScreenSvc.getOption('AppRef');
    var none = "None";

    // Add all routines to available-actions dropdown
    var addRoutines = function (routines) {
        $scope.availableRoutines.push({
            label: none + " (default)",
            value: none,
        })
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

    $scope.selectRoutine = function (item) {
        if (item.value === none) {
            $scope.action.resetAppRoutineModel();
            return;
        }
    
        $scope.action.AppRoutineId = item.value;
        appRoutinesSvc.getRoutine(appId, $scope.action.AppRoutineId, appRoutinesSvc.appRoutineStatus.live).then(function (routine) {
            routine.versions.forEach(function (version) {
                if (version.status === appRoutinesSvc.appRoutineStatus.live) {    
                    // Add input values from the routine version
                    $scope.action.InputValues = [];
                    version.actions[0].assignValueToActions.forEach(function (value) {
                        $scope.action.addInputValue(value.actionResultName, value.source.valueType);
                    });
                }
            });
        });
    };

    var setRoutineOrActionSetModel = function () {
        if ($scope.action.isAppRoutineSet()) {
          $scope.routineId = $scope.action.AppRoutineId;
        } else {
            $scope.routineId = $scope.availableRoutines[0].value;
            $scope.selectRoutine($scope.availableRoutines[0]);
        }
    };

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
          setRoutineOrActionSetModel();
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
  
        return '{key} ({type})'.format({
          key: inputValue.Key,
          type: type
        });
    };

    var actionValue = $scope.action.ActionType !== null
        ? $filter('filter')( $scope.action.txnTypes, { value: $scope.action.ActionType })[0] 
        : null;

    $scope.actionType = {
        selected: actionValue
    };

    $scope.usingType = { 
        selected: $filter('filter')( $scope.action.usingTypes, { value: $scope.action.Using })[0] 
    } 

    
    $scope.$watch('actionType.selected', function(newValue, oldValue) {
        if (newValue !== oldValue){
            $scope.action.ActionType = $scope.actionType.selected.value;
            $scope.action.validate();
        }      
        })

    $scope.$watch('usingType.selected', function(newValue, oldValue) {
    if (newValue !== oldValue){
        $scope.action.Using = $scope.usingType.selected.value
    }      
    })

    getAllRoutines(appId);
}  

ProcessPaymentsV2Ctrl.$inject = ["$rootScope", "$scope", "$injector", "ComplexValueModel", "currentScreenSvc", "$filter"]