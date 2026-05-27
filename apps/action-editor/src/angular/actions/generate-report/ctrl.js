export default function GenerateReportCtrl($rootScope, $scope, editorApiSvc) {
  console.debug('GenerateReportCtrl', $scope.action);

  $scope.allow = [0, 5, 6, 9];
  $scope.allowOptions = [0, 1, 5, 9];
  $scope.reportNames = [];
  $scope.tableNames = [];
  $scope.isLoading = false;
  $scope.canContinue = false;
  $scope.criteriaBuilder = false;
  $scope.canUseCriteriaBuilder = false;
  $scope.safeGuards = $scope.action.safeGuards;
  $scope.reportTypes = $scope.action.reportTypes;
  $scope.criteriaButton = $scope.action.WhereClause.length > 2 ? 'Edit criteria' : 'Open criteria builder';

  var verifyFriendlyName = function (list, selection) {
    var found = false;

    angular.forEach(list, function (obj) {
      if (obj.viewNameFriendly === selection) {
        found = true;
      }
    });

    return found;
  };

  $scope.getReportNames = function () {
    $scope.reportNames = [];
    $scope.canUseCriteriaBuilder = false;

    editorApiSvc.getReportNames().then(function (resp) {
      angular.forEach(resp, function (item) {
        $scope.reportNames.push({
          value: item,
          label: item,
        });
      });
    });
  };
  $scope.getReportNames();

  $scope.getReportTableNames = function () {
    $scope.canContinue = false;
    $scope.tableNames = [];

    editorApiSvc.getReportTableNames($scope.action.ReportName).then(function (resp) {
      $scope.isLoading = false;
      $scope.canContinue = true;

      angular.forEach(resp, function (obj, idx) {
        var friendlyName = obj.viewNameFriendly || obj.ViewNameFriendly;
        if (idx === 0 && ($scope.action.ViewFriendlyName === '' || $scope.action.ViewFriendlyName === null)) {
          $scope.action.ViewFriendlyName = friendlyName;
        }

        $scope.tableNames.push({
          value: friendlyName,
          label: friendlyName,
        });
      });

      // Ticket #PL-10952
      // Verify action.ViewFriendlyName this code is for backwards compatibility
      if (!verifyFriendlyName(resp, $scope.action.ViewFriendlyName)) {
        // Remove viewacc
        var checkTerm = $scope.action.ViewFriendlyName.replace(/viewacc/g, '');

        if (!verifyFriendlyName(resp, checkTerm)) {
          // Remove view
          checkTerm = $scope.action.ViewFriendlyName.replace(/view/g, '');

          if (verifyFriendlyName(resp, checkTerm)) {
            $scope.action.ViewFriendlyName = checkTerm;
          }
        } else {
          $scope.action.ViewFriendlyName = checkTerm;
        }
      }
    });
  };

  $scope.loadTableFields = function (viewNameFriendly) {
    $scope.canUseCriteriaBuilder = false;
    editorApiSvc.loadTableFields(viewNameFriendly).then(function () {
      $rootScope.$broadcast('miae:refreshSelect');
      $scope.canUseCriteriaBuilder = true;
    });
  };

  $scope.reportDesigner = function () {
    window.location = 'http://www.methodintegration.com/MethodReportDesigner/MethodReportDesigner.application';
  };

  $scope.toggleCriteriaBuilder = function () {
    $scope.criteriaBuilder = !$scope.criteriaBuilder;
  };

  $scope.$watch(
    'action.WhereClause',
    function () {
      if ($scope.action.ReportName !== null) {
        $scope.action.validate();
      }
      $scope.criteriaButton = $scope.action.WhereClause.length > 2 ? 'Edit criteria' : 'Open criteria builder';
    },
    true,
  );

  $scope.$watch(
    'action.ReportName',
    function (curr, prev) {
      if (curr !== '' && curr !== null) {
        $scope.isLoading = true;
        if (curr !== prev) {
          $scope.action.ViewFriendlyName = null;
        }
        $scope.getReportTableNames();
        $scope.action.validateReportName();
        if (curr !== prev) {
          $scope.action.WhereClause = [];
          $rootScope.$broadcast('micb:refresh', {
            whereClause: $scope.action.WhereClause,
          });
        }
      }
    },
    true,
  );

  $scope.$watch(
    'action.ViewFriendlyName',
    function (curr, _prev) {
      if (curr !== '' && curr !== null && curr !== undefined) {
        $scope.loadTableFields(curr);
        $scope.action.validateViewFriendlyName();
      }
    },
    true,
  );

  $scope.isDisplayReportOptionVisible = !$scope.$parent.isAppRoutineEditor;

  //this section will be hidden initialize this value to always be false for app routines
  if ($scope.$parent.isAppRoutineEditor) {
    $scope.action.DisplayReport = false;
  }
}

GenerateReportCtrl.$inject = ['$rootScope', '$scope', 'editorApiSvc'];
