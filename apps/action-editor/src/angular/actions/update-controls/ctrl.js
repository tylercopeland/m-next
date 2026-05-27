export default function UpdateControlsCtrl($scope, usedControlsSvc, editorSvc) {
    console.debug("UpdateControlsCtrl", $scope.action);

    $scope.allow = [0, 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 15];
    $scope.controlFilter = usedControlsSvc.filterItems;

    $scope.addItem = function() {
        $scope.action.addNewItem();
        $scope.updateController();
    };

    $scope.removeItem = function (idx) {
        // console.error("removeItem", idx);
        $scope.action.ControlsToUpdate.splice(idx, 1);
        $scope.updateController();
        //  $scope.action.validate();
    };

    $scope.itemSelection = function(selected, item) {
        usedControlsSvc.updateComplexValue(selected, item);
        $scope.updateController();
    };

    $scope.updateController = function() {
        usedControlsSvc.init({
            controls: ['SEC', 'L-CON', 'GRD', 'CHT', 'CAL', 'APR', 'ICO', 'DOC', 'BGR', 'EDT'],
            items: $scope.action.ControlsToUpdate
        });
        
        // Get the standard control list from the service
        let controlList = usedControlsSvc.getControlList();
        
        // Check if we need to add calendar Resource controls that might not be in the list
        const calendarControls = editorSvc.getScreenControls(['CAL'], true);
        
        // Only add calendar Resource property if not already in the list
        if (calendarControls && calendarControls.length > 0) {
            calendarControls.forEach(control => {
                // Get the display options for the calendar control
                const displayOptions = editorSvc.controlDisplayOptions(control);
                
                if (displayOptions && displayOptions.length > 0) {
                    // Find only the Resource option
                    const resourceOption = displayOptions.find(option => option.value === 'Resource');
                    
                    if (resourceOption) {
                        // Add only the Resource option with comma-delimited tooltip
                        controlList.push({
                            id: control.id + "_Resource",
                            label: control.name + " - Resource Text",
                            tooltip: "Supports comma-delimited list of resources. Use quotes for resources that contain commas, e.g., \"Last, First\", OtherResource",
                            typeLabel: "Calendar", 
                            type: 'CAL',
                            used: false,
                            value: control.id,
                            property: "Resource",
                            fieldType: resourceOption.fieldType || 0,
                            readOnly: resourceOption.readOnly || false,
                            hasValidation: control.hasValidation,
                            supportsList: true
                        });
                    }
                }
            });
        }
        
        $scope.controlList = controlList;
        $scope.controlTotal = $scope.controlList.length;
        $scope.action.ControlsToUpdate = usedControlsSvc.getItemList();
        usedControlsSvc.applyPropertiesWhenEditing();
    };
    $scope.updateController();
};

UpdateControlsCtrl.$inject = ["$scope", "usedControlsSvc", "editorSvc"];