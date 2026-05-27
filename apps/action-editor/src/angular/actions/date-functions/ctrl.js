export default function DateFunctionsCtrl($rootScope, $scope, ComplexValueModel) {
  console.debug('DateFunctionsCtrl', $scope.action);

  $scope.allow = [0, 2, 5, 6, 11];
  $scope.allowAmount = [0, 2, 5, 6, 10];

  $scope.showFormat = false;
  $scope.formatOptions = [];
  $scope.showAmount = false;
  $scope.formatLabel = '';

  var setupOptionsLabels = function(type) {
    $scope.dateLabel = 'Using this date';

    switch (type) {
      case 13:
        $scope.formatLabel = 'Format the date to look like';
        break;
      case 0:
        $scope.dateLabel = 'Return the year from';
        break;
      case 1:
        $scope.dateLabel = 'Return the month from';
        $scope.formatLabel = 'Using this format';
        break;
      case 2:
        $scope.dateLabel = 'Return the day from';
        $scope.formatLabel = 'Using this format';
        break;
      case 3:
        $scope.dateLabel = 'Return the hour from';
        $scope.formatLabel = 'Using this format';
        break;
      case 4:
        $scope.dateLabel = 'Return the minute from';
        break;
      case 11:
        $scope.dateLabel = 'Return day of the week from';
        break;
      case 10:
        $scope.dateLabel = 'Return day of the year from';
        break;
      case 15:
        $scope.dateLabel = 'Return first day of the month';
        break;
      case 16:
        $scope.dateLabel = 'Return last day of the month';
        break;
      case 18:
        $scope.dateLabel = 'Return first day of the quarter';
        break;
      case 19:
        $scope.dateLabel = 'Return last day of the quarter';
        break;
      case 20:
        $scope.dateLabel = 'Return first day of the year';
        break;
      case 21:
        $scope.dateLabel = 'Return last day of the year';
        break;
      case 22:
        $scope.dateLabel = 'Return first day of the week';
        break;
      case 23:
        $scope.dateLabel = 'Return last day of the week';
        break;
      case 12:
        $scope.formatLabel = 'Return this';
        break;
      case 5:
        $scope.formatLabel = 'Add year(s)';
        break;
      case 6:
        $scope.formatLabel = 'Add month(s)';
        break;
      case 7:
        $scope.formatLabel = 'Add day(s)';
        break;
      case 8:
        $scope.formatLabel = 'Add hour(s)';
        break;
      case 9:
        $scope.formatLabel = 'Add minute(s)';
        break;
      case 14:
        $scope.dateLabel = 'Subtract this date';
        $scope.formatLabel = 'From this date';
        break;
      case 17:
        $scope.dateLabel = 'Convert this date';
        break;
      default:
        break;
    }
  };

  var setupActionValues = function(type) {
    // Set defaults
    $scope.showFormat = false;
    $scope.formatOptions = [];
    $scope.showAmount = false;

    switch (type) {
      case 1:
        $scope.showFormat = true;
        $scope.formatOptions = $scope.action.formats.month;
        break;
      case 2:
        $scope.showFormat = true;
        $scope.formatOptions = $scope.action.formats.day;
        break;
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        $scope.showAmount = true;
        break;
      case 13:
        $scope.showFormat = true;
        $scope.formatOptions = $scope.action.formats.format;
        $scope.formatLabel = 'Format the date to look like';
        break;
      default:
        break;
    }
    
    if ($scope.action.Options === null || $scope.action.Options.Format === undefined) {
      $scope.setDefaultFormat();
    }
  };

  $scope.setDefaultFormat = function() {
    switch ($scope.action.DateFunctionType) {
      case 1:
        $scope.action.Options = { Format: 1 };
        break;
      case 2:
        $scope.action.Options = { Format: 1 };
        break;
      case 3:
        $scope.action.Options = { Format: 10 };
        break;
      case 13:
        $scope.action.Options = { Format: 1 };
        break;
      default:
        break;
    }
  };

  setupActionValues($scope.action.DateFunctionType);
  setupOptionsLabels($scope.action.DateFunctionType);

  $scope.$watch('action.DateFunctionType', function(curr, prev) {
    if (curr !== prev) {
      $scope.action.Options = null;
      switch (curr) {
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          $scope.action.Options = { Amount: new ComplexValueModel({ ValueType: 10, Value: 1 }) };
          break;
        case 12:
          $scope.action.Options = { WeekDay: 1, DateFindType: 1 };
          break;
        case 14:
          var future = new Date();
          future.setDate(future.getDate() + 3);

          $scope.action.Options = { OtherDate: new ComplexValueModel({ ValueType: 11, Value: future }), TimeSpan: 4 };
          break;
        default:
          break;
      }
      setupActionValues(curr);
      setupOptionsLabels(curr);
    }
  });
};

DateFunctionsCtrl.$inject = ['$rootScope', '$scope', 'ComplexValueModel'];