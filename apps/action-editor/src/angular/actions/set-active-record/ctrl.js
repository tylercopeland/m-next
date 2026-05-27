export default function SetActiveRecordCtl($rootScope, $scope) {
    console.debug("SetActiveRecordCtl");
    $scope.allow = [0, 2, 3, 5, 6, 9, 10];
    // Initialize action
};

SetActiveRecordCtl.$inject = ["$rootScope", "$scope"];