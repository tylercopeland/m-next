export default function TextFunctionsCtrl($rootScope, $scope, ComplexValueModel) {
  console.debug("TextFunctionsCtrl", $scope.action);

  $scope.allow = [];
  $scope.functionTypes = $scope.action.functionOptions;
  $scope.separatorOptions = $scope.action.separatorOptions;
  $scope.textFindList = [
    { value: false, label: "First" },
    { value: true, label: "Last" }
  ];
  $scope.searchUsing = [
    { value: true, label: "Position" },
    { value: false, label: "Text" }
  ];
  $scope.mainLabel = "";
  $scope.radio = {
    isPosition: true
  };
  $scope.dropdown = {
    separator: null
  };

  $scope.getLRPositionLabel = function() {
    var labels = {
      left: {
        position: 'Return this many characters, starting from the left',
        text: 'Return all characters before this'
      },
      right: {
        position: 'Return this many characters, starting from the right',
        text: 'Return all characters after this'
      }
    };

    switch($scope.action.TextFunctionType) {
      case 6:
        return ($scope.radio.isPosition) ? labels.left.position : labels.left.text;
      case 7:
        return ($scope.radio.isPosition) ? labels.right.position : labels.right.text;
    }
  };

  $scope.addJoin = function() {
    $scope.action.addJoinValue();
  };

  $scope.removeJoin = function(idx) {
    $scope.action.Options.TextValues.splice(idx, 1);
  };

  $scope.updateSearchUsing = function() {
    switch($scope.action.TextFunctionType) {
      case 6:
      case 7:
        $scope.action.Options = {
          Length: ($scope.radio.isPosition) ? new ComplexValueModel({ ValueType: 10, Value: 1 }) : null,
          SearchText: (!$scope.radio.isPosition) ? new ComplexValueModel({ ValueType: 9 }) : null
        };
        break;
      case 8:
        $scope.action.Options = {
          Length: ($scope.radio.isPosition) ? new ComplexValueModel({ ValueType: 10, Value: 1 }) : null,
          StartIndex: ($scope.radio.isPosition) ? new ComplexValueModel({ ValueType: 10, Value: 1 }) : null,
          EndText: (!$scope.radio.isPosition) ? new ComplexValueModel({ ValueType: 9 }) : null,
          StartText: (!$scope.radio.isPosition) ? new ComplexValueModel({ ValueType: 9 }) : null
        };
        break;
    }
  };

  $scope.$watch("action.TextFunctionType", function(curr, prev) {
    $scope.allow = [0,1,2,5,6,7,8,9,10,11,12];

    if(curr !== prev) {
      $scope.action.setupModelValues(curr);

      switch(curr) {
        case 6:
        case 7:
        case 8:
          $scope.radio.isPosition = true;
          break;
      };
    }

    if(curr !== null && curr === prev) {
      switch(curr) {
        case 6:
        case 7:
        case 8:
          $scope.radio.isPosition = ($scope.action.Options.Length !== null) ? true : false;
          break;
      };
    }

    // Setup labels & allowed selection
    switch(curr) {
      case 0:
        $scope.allow = [0,2,5,7,9];
        break;
      case 2:
        $scope.mainLabel = 'Is this a date?';
        break;
      case 3:
        $scope.mainLabel = 'Is this empty?';
        break;
      case 4:
        $scope.mainLabel = 'Is this a number?';
        break;
      case 9:
        $scope.mainLabel = 'Return the number of characters in';
        break;
      case 12:
        $scope.mainLabel = 'Convert this to lower case';
        break;
      case 13:
        $scope.mainLabel = 'Convert this to upper case';
        break;
      case 14:
        $scope.mainLabel = 'Convert this to title case';
        break;
      case 15:
        $scope.mainLabel = 'Is this an email address?';
        break;
      default:
        $scope.mainLabel = "";
        break;
    };
  });

  $scope.$watch("dropdown.separator", function(curr, prev) {
    if(curr !== null && prev !== null) {
      $scope.action.Options.Separator = (curr.label !== "Text") ? curr.value : "";
    }
  });

  $scope.$watch("action.Options.Separator", function(curr, prev) {
      if((curr !== null && curr !== undefined) && curr === prev) {
          switch($scope.action.Options.Separator) {
            case ",":
              $scope.dropdown.separator = $scope.separatorOptions[1];
              break;
            case "\\n\\r":
              $scope.dropdown.separator = $scope.separatorOptions[2];
              break;
            case "":
              $scope.dropdown.separator = $scope.separatorOptions[3];
              break;
            case " ":
              $scope.dropdown.separator = $scope.separatorOptions[4];
              break;
            case "|":
              $scope.dropdown.separator = $scope.separatorOptions[5];
              break;
            default:
              $scope.dropdown.separator = $scope.separatorOptions[0];
              break;
          }
      }
  });
};

TextFunctionsCtrl.$inject = ["$rootScope", "$scope", "ComplexValueModel"];