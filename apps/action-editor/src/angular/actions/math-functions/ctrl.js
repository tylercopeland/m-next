export default function MathFunctionsCtrl($rootScope, $scope) {
console.debug("MathFunctionsCtrl", $scope.action);

$scope.allow = [0, 2, 5, 6, 10];
$scope.functionTypes = $scope.action.mathOptions;
$scope.canAddMore = false;
$scope.roundingOptions = [
    { value: 0, label: "No Rounding" },
    { value: 1, label: "Round Up" },
    { value: 2, label: "Round Down" },
    { value: 3, label: "Round Closest" }
];
$scope.labelOptions = {
    required1: "",
    required2: "",
    allOthers: ""
};

var setupLabels = function () {
    switch ($scope.action.MathFunctionType) {
        case 0:
            $scope.labelOptions = { required1: "Find the absolute value of" };
            break;
        case 1:
            $scope.labelOptions = { required1: "Round this number"};
            break;
        case 2:
            $scope.labelOptions = { required1: "Raise this", required2: "To the power of", allOthers: "" };
            break;
        case 3:
            $scope.labelOptions = { required1: "Find the square root of" };
            break;
        case 4:
            $scope.labelOptions = { required1: "Add this", required2: "To this", allOthers: "And then add this", addLabel: "addend" };
            break;
        case 5:
            $scope.labelOptions = { required1: "Subtract from this", required2: "This", allOthers: "And then subtract this", addLabel: "subtrahend" };
            break;
        case 6:
            $scope.labelOptions = { required1: "Multiply this", required2: "By this", allOthers: "And then multiply this", addLabel: "factor" };
            break;
        case 7:
            $scope.labelOptions = { required1: "Divide this", required2: "By this", allOthers: "And then divide this", addLabel: "divisor" };
            break;
        case 8:
        case 9:
            $scope.labelOptions = { required1: "Compare this", required2: "To this", allOthers: "And then compare with this", addLabel: "comparative" };
            break;
        case 10:
            $scope.labelOptions = { required1: "Find the remainder of dividing this", required2: "By this", allOthers: "" };
            break;
        case 11:
            $scope.labelOptions = { required1: "Find the sin of" };
            break;
        case 12:
            $scope.labelOptions = { required1: "Find the cos of" };
            break;
        case 13:
            $scope.labelOptions = { required1: "Find the tan of" };
            break;
        case 14:
            $scope.labelOptions = { required1: "Find the log of" };
            break;
        case 15:
            $scope.labelOptions = { required1: "Find the log10 of" };
            break;
        case 16:
            $scope.labelOptions = { required1: "Using this", required2: "Find this percentage", allOthers: "" };
            break;
        default:
            $scope.labelOptions = { required1: "Of this", required2: "", allOthers: "" };
            break;
    }
};

var canAddMoreValues = function (type) {
    switch (type) {
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            $scope.canAddMore = true;
            break;
        default:
            $scope.canAddMore = false;
    }
};

$scope.canAddMoreAndLabels = function (type) {
    canAddMoreValues(type);
    setupLabels();
};
$scope.canAddMoreAndLabels($scope.action.MathFunctionType);

$scope.addValue = function (value) {
    $scope.action.addNewValue(value);
};

$scope.removeValue = function (idx) {
    $scope.action.Values.splice(idx, 1);
};

$scope.$watch("action.MathFunctionType", function (curr, prev) {
    if (curr !== prev) {
        $scope.action.setupModelValues(curr);
        $scope.canAddMoreAndLabels(curr);
    }
});

$scope.$watch("action.DecimalPlaces", function (newValue, _oldValue) {
    if (newValue === undefined || newValue === null || isNaN(newValue)) {
        $scope.action.DecimalPlaces = 0;
    }
});
};

MathFunctionsCtrl.$inject = ["$rootScope", "$scope"];