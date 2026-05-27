export default function MergeEntitiesCtrl($rootScope,$injector ,$scope, currentScreenSvc) {
    console.debug("MergeEntitiesCtrl", $scope.action);
    console.debug(" $scope", $scope);
    $scope.allow = [0, 2, 5, 6, 10];
    $scope.fromLabel = "From Entity RecordID";
    $scope.toLabel = "To Entity RecordID";
    $scope.fromContactLabel = "From Contact RecordID";
    $scope.toContactLabel = "To Contact RecordID";

    $scope.entityInfo = "<li>Merge cannot be undone.</li><li>'From Entity' details will be moved to 'To Entity' only if 'To Entity' has blank values.</li><li>All records linked to 'From Entity' will be moved to 'To Entity'.</li><li>Accounting data will be synced to QuickBooks automatically.</li><li>'From Entity' will be deleted from Method and QuickBooks.</li>";
    $scope.entityInfoQbo = "<li>Merge cannot be undone.</li><li>'From Entity' details will be moved to 'To Entity' only if 'To Entity' has blank values.</li><li>All records linked to 'From Entity' will be moved to 'To Entity'.</li>";
    $scope.contactInfo = "<li>Merge cannot be undone.</li><li>'From Contact' details will be moved to 'To Contact' only if 'To Contact' has blank values.</li><li>All records linked to 'From Contact' will be moved to 'To Contact'.</li><li>'From Contact' will be deleted from Method.</li>";
    $scope.swapInfo = "";

 

    if (currentScreenSvc.getOption('isDeveloper')) {
        $scope.isQbo = currentScreenSvc.getOption('versionTarget') === angular.element.mi.Constants.AccountingSoftware.QuickBooksOnline || currentScreenSvc.getOption('versionTarget') === angular.element.mi.Constants.AccountingSoftware.QuickBooksOnlineGlobal
        console.debug("Develop isQbo", $scope.isQbo);
    
    }
    else {
        var sessionSvc;
        if ($injector.has('sessionSvc')) {
          sessionSvc = $injector.get('sessionSvc');
          console.debug(`I am "CreateShortUrlCtrl" and I found "sessionSvc" by asking $injector.`);
          var accountingSoftware = sessionSvc.sessionData.account.accountingSoftware;
          $scope.isQbo = accountingSoftware === angular.element.mi.Constants.AccountingSoftware.QuickBooksOnline || accountingSoftware === angular.element.mi.Constants.AccountingSoftware.QuickBooksOnlineGlobal;
        } else {
          console.debug(`I am "CreateShortUrlCtrl" and I needed access to "sessionSvc" from legacy and I did not get it!`);
        }

        console.debug("User isQbo", $scope.isQbo);
    }


};

MergeEntitiesCtrl.$inject = ["$rootScope","$injector" , "$scope", "currentScreenSvc"];