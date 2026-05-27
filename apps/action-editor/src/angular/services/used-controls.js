export default function usedControlsSvc($filter, editorSvc) {

    var state = {
        allowedControls: [],
        displayTheseOnly: false,
        hideProperties: false,
        controlList: [],
        itemList: []
    };

    var init = function (data) {
        state.allowedControls = data.controls;
        state.displayTheseOnly = (data.displayTheseOnly) ? data.displayTheseOnly : false;
        state.hideProperties = (data.hideProperties) ? data.hideProperties : false;
        state.itemList = data.items;

        setUsedControlFlags();
    };

    var setUsedControlFlags = function () {
        _loadControls();
        angular.forEach(state.itemList, function (control) {
            var found = _findControl(control.ControlId, control.Property);
            control.id = (control.ControlId === null) ? null : control.ControlId + ((control.Property === undefined || control.Property === null || control.Property === "") ? "" : "_" + control.Property);
            if (found.length > 0) {
                found[0].used = true;
            }
        });
    };

    var applyPropertiesWhenEditing = function () {
        angular.forEach(state.itemList, function (control) {
            var found = _findControl(control.ControlId, control.Property);
            if (found.length > 0) {
                // obj.Property = found[0].property;
                control.includedTypes = [found[0].fieldType];
                if (found[0].fieldType === 0) {
                    control.includedTypes = [0, 1, 2, 3, 4, 8];
                }
                
                // Special handling for Calendar Resource - allow both text and decimal types
                if (control.Property === 'Resource' && found[0].type === 'CAL') {
                    control.includedTypes = [0, 1, 2, 3, 4, 8, 9];
                }
            }
        });
    };

    var updateComplexValue = function (selected, obj) {
        obj.Property = selected.property;
        obj.ControlId = selected.value;

        var found = _findControl(obj.ControlId, obj.Property);

        if (found.length > 0) {
            // obj.Property = found[0].property;
            setUsedControlFlags();

            obj.includedTypes = [selected.fieldType];

            switch (selected.fieldType) {
                case 0:
                    if (obj.Source.ValueType !== 9) {
                        obj.Source.changeType(9);
                    }
                    obj.includedTypes = [0, 1, 2, 3, 4, 8, 9];
                    break;
                case 1:
                    obj.Source.changeType(10);
                    break;
                case 2:
                    obj.Source.changeType(12);
                    break;
                case 3:
                    obj.Source.changeType(11);
                    break;
            }
        }
    }

    var getControlList = function (_editable) {
        //var controlList = [];
        //var editableOnly = editable === undefined ? false : editable;
        //angular.forEach(state.controlList,
        //    function (control) {
        //        if (!editableOnly || control.readOnly === false) {
        //            controlList.push(control);
        //        }
        //    });
        //return controlList;
        return state.controlList;
    };

    var getItemList = function () {
        return state.itemList;
    };

    var getControlTotal = function (editable) {
        return getControlList(editable).length;
    };

    var filterItems = function (item) {
        return function (opt) {
            return !opt.used || opt.value === item.ControlId;
        };
    };

    var _loadControls = function () {
        state.controlList = [];
        var getValues = editorSvc.getControlValues(state.allowedControls, state.displayTheseOnly, state.hideProperties);

        angular.forEach(getValues, function (control) {
            if (control.readOnly === false) {
                state.controlList.push({
                    id: control.id + ((control.property === undefined || control.property === null || control.property === "") ? "" : "_" + control.property),
                    label: control.name,
                    typeLabel: control.typeLabel,
                    type: control.type,
                    used: false,
                    value: control.id,
                    property: control.property,
                    fieldType: control.fieldType,
                    readOnly: control.readOnly === undefined ? false : control.readOnly,
                    hasValidation: control.hasValidation
                });
            }
        });
    };

    var _findControl = function (id, property) {
        return $filter('filter')(state.controlList, { value: id, property: property });
    };

    return {
        init: init,
        setUsedControlFlags: setUsedControlFlags,
        applyPropertiesWhenEditing: applyPropertiesWhenEditing,
        updateComplexValue: updateComplexValue,
        getControlList: getControlList,
        getItemList: getItemList,
        getControlTotal: getControlTotal,
        filterItems: filterItems,
    };

};

usedControlsSvc.$inject = ["$filter", "editorSvc"];
