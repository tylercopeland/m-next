export default function StopProcessingCtrl ($rootScope, $scope) {
    console.debug('StopProcessingCtrl', $scope.action);
};  
StopProcessingCtrl.$inject = ['$rootScope', '$scope'];