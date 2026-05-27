export default function ActionSetModel(guidSvc, editorSvc) {

  function ActionSetModel(data) {
    this.ActionSetId = guidSvc.create();
    this.Actions = [];
    this.Name = "Action Set";
    this.Scope = 0; // Defaults To Screen
    angular.extend(this, data);
  };

  ActionSetModel.prototype.getAllActionResultsSet = function (array) {
    array = (array) ? array : [];

    // Loop Through Actions
    angular.forEach(this.Actions, function (action) {
      // Apply Parent array to action
      action.parentAr = angular.copy(array);

      // Get Results that are set and append to this parent
      if (typeof action.getActionResultSet === "function") {
        var setActionResults = action.getActionResultSet();
        Array.prototype.push.apply(array, setActionResults);
      }

      // Deal with actions and nested action sets
      if (action.config.hasNested) {
        var newState = [];
        angular.forEach(action.config.nestedProperties, function (prop) {
          var getResults = action[prop].getAllActionResultsSet(angular.copy(array));
          newState = newState.concat(getResults);
        });
        Array.prototype.push.apply(array, newState);
        // Get back only unique entries by id:
        array = Array.from(new Map(array.map(item => [item.id, item])).values());
      }
    });
    // return unique entries by id:
    return Array.from(new Map(array.map(item => [item.id, item])).values());
  };

  ActionSetModel.prototype.getAllActionResultsUsed = function () {
    var array = [],
      actionLength = (this.Actions.length - 1);

    // Loop Through Actions in reverse order
    for (var i = actionLength; i >= 0; i--) {
      var action = this.Actions[i];

      if (typeof action.getActionResultUsed === "function") {
        var getActionResults = action.getActionResultUsed();
        Array.prototype.push.apply(array, getActionResults);
      }

      // Deal with actions and nested action sets
      if (action.config.hasNested) {
        var newState = [];
        angular.forEach(action.config.nestedProperties, function (prop) {
          var getResults = action[prop].getAllActionResultsUsed(angular.copy(array));
          newState = newState.concat(getResults);
        });
        Array.prototype.push.apply(array, newState);
        array = [...new Set(array)]; // unique only
      }

      // Apply the child array to the action
      action.childAr = angular.copy(array);
    }

    return array;
  };

  ActionSetModel.prototype.linkActionResults = function () {
    editorSvc.assignArSet(this.getAllActionResultsSet());
    editorSvc.assignArGet(this.getAllActionResultsUsed());
  };

  ActionSetModel.prototype.validate = function () {
    // this.linkActionResults();

    // Run validation on each action
    angular.forEach(this.Actions, function (action, _idx) {
      if (typeof action.validate === "function") {
        var incompatibeWithAppRoutine = action.ValidationMessages.some(function (validation) {
          return (validation.Message === 138)
        });

        action.validate();

        if (incompatibeWithAppRoutine) {
          action.ValidationMessages.push({
            Property: "", //incompatible approutine action
            Message: 138
          });
        }
      }
    });
  };

  ActionSetModel.prototype.validate = function () {
    // this.linkActionResults();

    // Run validation on each action
    angular.forEach(this.Actions, function (action, _idx) {
      if (typeof action.validate === "function") {
        var incompatibeWithAppRoutine = action.ValidationMessages.some(function (validation) {
          return (validation.Message === 138)
        });

        action.validate();

        if (incompatibeWithAppRoutine) {
          action.ValidationMessages.push({
            Property: "", //incompatible approutine action
            Message: 138
          });
        }
      }
    });
  };

  ActionSetModel.prototype.checkControlReference = function (_referencedControl) {
    // this.linkActionResults();

    // Run validation on each action
    angular.forEach(this.Actions, function (action, _idx) {
      if (typeof action.validate === "function") {
        var incompatibeWithAppRoutine = action.ValidationMessages.some(function (validation) {
          return (validation.Message === 138)
        });

        action.validate();

        if (incompatibeWithAppRoutine) {
          action.ValidationMessages.push({
            Property: "", //incompatible approutine action
            Message: 138
          });
        }
      }
    });
  };

  ActionSetModel.prototype.isSpecifiedId = function (actionSetId, response) {
    if (this.ActionSetId === actionSetId) {
      return this;
    } else {
      angular.forEach(this.Actions, function (action) {
        // Deal with actions and nested action sets
        if (action.config.hasNested) {
          angular.forEach(action.config.nestedProperties, function (prop) {
            response = action[prop].isSpecifiedId(actionSetId, response);
          });
        }
      });
      return response;
    }
  };

  ActionSetModel.prototype.clearActionResult = function (arList) {
    angular.forEach(this.Actions, function (action, _idx) {
      if (typeof action.removeSetAR === "function") {
        action.removeSetAR(arList);
      }
    });
  };

  ActionSetModel.prototype.flagActionsAreInALoop = function (inLoop, tableName, distinctColumn) {
    // console.error('ActionSetModel.flagActionsAreInALoop', inLoop, tableName, distinctColumn);
    angular.forEach(this.Actions, function (action) {
      action.flagInALoop(inLoop, tableName, distinctColumn);
    });
  };

  ActionSetModel.prototype.setNewId = function () {
    this.ActionSetId = guidSvc.create();
  };

  return ActionSetModel;
};

ActionSetModel.$inject = ["guidSvc", "editorSvc"];