export default function ValidateControlsCtrl($rootScope, $scope, $filter, editorSvc, currentScreenSvc) {
console.debug("ValidateControlsCtrl", $scope.action);

$scope.controlTotal = 0;
$scope.controlList = [];

// Create custom control list
editorSvc.getControlValues(['TXT', 'SIG', 'DRP', 'HTM', 'ADR', 'DTP'], ['TXT', 'SIG', 'DRP', 'HTM', 'ADR', 'DTP'], true)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(ctrl => {
        if (ctrl.hasValidation) {
            $scope.controlList.push(ctrl);
        }
    });
$scope.controlTotal = $scope.controlList.length;

$scope.addNewControl = function() {
    var added = false;
    angular.forEach($scope.controlList, function(ctrl) {
        if(!added && $scope.action.ControlsToValidate.indexOf(ctrl.id) === -1) {
            $scope.action.ControlsToValidate.push(ctrl.id);
            added = true;
        }
    });
};

$scope.toggleValidation = function(type) {
    if(!$scope.action.isReadOnly)
    {
        $scope.action.ValidateAllControls = type;
    }
};

$scope.itemSelection = function(selected, item, idx) {
    $scope.action.ControlsToValidate[idx] = item;
};

$scope.controlFilter = function(item) {
    return function (opt) {
        return ($scope.action.ControlsToValidate.indexOf(opt.id) === -1) || opt.id === item;
    };
};

$scope.removeControl = function(idx) {
    $scope.action.ControlsToValidate.splice(idx, 1);
};

$scope.validationCount = function(id) {
    var found = findControl(id), 
        ctrl = (found.length > 0) ? found[0] : null,
        count = (ctrl) ? (ctrl.options.validationRules) ? ctrl.options.validationRules.length : 0 : 0;

    return "Edit Validations (" + count + ")";
};

$scope.openValidation = function(id) {
    // Going deeper so change label of modal to close
    $scope.$parent.layout.buttonLabel = "Close";
    angular.element("#componentModal").scope().openModal("validation", findControl(id)[0], true, true);
};

var findControl = function(id) {
    const Controls = currentScreenSvc.getControls();
    return $filter('filter')(Controls, { options: { id: id } }, true);
};

$scope.$watch('action', function(curr, prev) {
    if(curr.ValidateAllControls !== prev.ValidateAllControls) {
        if(curr.ValidateAllControls) {
            $scope.action.ControlsToValidate = [];
        } else {
            $scope.addNewControl();
        }
    }
}, true);
};

ValidateControlsCtrl.$inject = ["$rootScope", "$scope", "$filter", "editorSvc", "currentScreenSvc"];