export default function ProcessPaymentsCtrl($rootScope, $scope, editorSvc, $filter) {
  console.debug("ProcessPaymentsCtrl", $scope.action)   
  $scope.paymentWidgetList = editorSvc.getScreenControls(['PAY'], true)    
  $scope.paymentTotalAllow = [0, 2, 5, 10]    
  $scope.allowedTypesNumber = [0, 2, 5, 6, 10]
  $scope.allowedTypesText = [0, 2, 5, 6, 9]
  $scope.actionType = { 
    selected: $filter('filter')( $scope.action.txnTypes, { value: $scope.action.ActionType })[0] 
  } 
  $scope.paymentType = { 
    selected: $filter('filter')($scope.action.paymentTypes, { value: $scope.action.PaymentType })[0] 
  } 
  $scope.currentYear = new Date().getFullYear()

  $scope.$watch('action.PaymentWidgetName', function(newValue, oldValue) {
    if(newValue !== null && newValue !== "" && newValue !== undefined && newValue !== oldValue) {
      $scope.action.validateWidgetName();
    }
  })
  
  $scope.$watch('action.UseDefaultGateway', function(newValue, oldValue) {
    if (newValue !== oldValue && newValue) {
      $scope.action.clearPaymentGateway()
    }      
  })

  $scope.$watch('action.UsePaymentWidget', function(newValue, oldValue) {
    if (newValue !== oldValue && !newValue){
      // default gateway option only available with payment widget
      $scope.action.UseDefaultGateway = false
      $scope.action.PaymentWidgetName = ""
    }
  })

  $scope.$watch('actionType.selected', function(newValue, oldValue) {
    if (newValue !== oldValue){
      $scope.action.ActionType = $scope.actionType.selected.value
      if ($scope.actionType.selected.label !== 'Charge'){
        // Payment widget only supports Charge at the moment
        $scope.action.UsePaymentWidget = false
      }
    }      
  })

  $scope.$watch('paymentType.selected', function(newValue, oldValue) {
    if (newValue !== oldValue){
      $scope.action.PaymentType = $scope.paymentType.selected.value
    }      
  })

}  

ProcessPaymentsCtrl.$inject = ["$rootScope", "$scope", "editorSvc", "$filter"]