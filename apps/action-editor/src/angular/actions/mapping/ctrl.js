export default function MappingCtrl($scope, $filter, editorApiSvc, usedControlsSvc, currentScreenSvc) {
    $scope.allow = [0,5,6,9];
    $scope.mappingActions = [];
    $scope.tableFields = [];
    $scope.tables = [];
    $scope.availableActions = [];
    $scope.selectedTable = null;

    $scope.availableActions.push(
      {
        label: "Navigation",
        value: 0
      },
      {
        label: "Map Route",
        value: 1
      }
    );

    // Load all the fields for this table
    $scope.loadTableFields = function (table, isInitalLoad) {
      if (table) {
          editorApiSvc
            .loadTableFields(table.label)
            .then(function () {
                $scope.tableFields = editorApiSvc.createFieldListOptions(table.label, [6,7]);      
                $scope.selectedTable = table.label;            
            });

        if(!isInitalLoad) {
          $scope.action.getAddressColumns(table.value);
        }

        // $scope.action.resetFieldsModel();
      }
    };

    // Load a list of available tables
    $scope.loadTables = function() {
      var tableList = currentScreenSvc.getOption("tableList");
      var table = null;

      tableList.forEach(function(item) {
        
        if($scope.action.ViewNameFriendly === item[0]) {
          table = { 
            value: item[0], 
            label: item[1]  
          };
        }

        $scope.tables.push({
            value: item[0],
            label: item[1],
        });
      });

    if (table) {
      $scope.loadTableFields(table, true);
      $scope.action.validate();
    }
  };

  $scope.loadTables();
  
  $scope.$watch('action.ControlsToUpdate', function() {
    usedControlsSvc.init({               
        hideProperties: true,
    });
    $scope.controlList = usedControlsSvc.getControlList().filter(function(control) {
      return control.type === "MAP";
    });
    usedControlsSvc.applyPropertiesWhenEditing();
    $scope.action.validate();
  }, true);

  $scope.$watch('action.RecordIds', function (_curr, _prev) {
    $scope.action.validate();
  }, true);

}

MappingCtrl.$inject = ["$scope", "$filter", "editorApiSvc", "usedControlsSvc", "currentScreenSvc"];