import template from './tmpl.html';

export default function LoopThroughTableModel(BaseModel, ActionSetModel) {
  function LoopThroughTableModel(data) {
    this.ViewNameFriendly = null;
    this.WhereClause = [];
    this.DistinctColumn = null;
    this.Sorting = [];
    this.LoopActionSet = new ActionSetModel(data ? data.LoopActionSet : null);
    this.isReadOnly = false;

    if (data) {
      delete data.LoopActionSet;
    }

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (this.WhereClause === null) {
      this.WhereClause = [];
    }
  }

  LoopThroughTableModel.prototype = angular.copy(BaseModel.prototype);

  LoopThroughTableModel.prototype.config = {
    id: 26,
    category: 'Table',
    name: 'Loop Through Table',
    description: {
      short:
        "In 'Loop Through Table' section all subsequent actions will be processed for each record in the specified table.",
      long: "In 'Loop Through Table' section all subsequent actions will be processed for each record in the specified table that meets your criteria. If you want to search through all records, set your 'Where' to be 'RecordID', 'Type In', '>0'. Note: each record's Record ID will be temporarily loaded into 'Action Result (for Record ID)' so that it is easily available for use in actions inside your loop.",
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623521-loop-through-table-action']],
    template: template,
    active: true,
    hasNested: true,
    nestedProperties: ['LoopActionSet'],
  };

  LoopThroughTableModel.prototype.containsActionSetId = function (actionSetId) {
    return this.LoopActionSet.ActionSetId === actionSetId ? this.LoopActionSet : false;
  };

  LoopThroughTableModel.prototype.getActionResultSet = function () {
    var array = [];

    if (this.LoopActionSet.Actions.length > 0) {
      angular.forEach(this.LoopActionSet.Actions, function (action) {
        if (typeof action.getActionResultSet === 'function') {
          array.push(action.getActionResultSet());
        }
      });
    }

    return [].concat.apply([], array);
  };

  LoopThroughTableModel.prototype.isUsingControl = function (control) {
    var result = false;
    angular.forEach(this.WhereClause, function (item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    return result;
  };

  LoopThroughTableModel.prototype.validate = function () {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    //validate action for app routine
    LoopThroughTableModel.prototype.ValidateAppRoutineAction(self);

    if (this.ViewNameFriendly === null || this.ViewNameFriendly === undefined || this.ViewNameFriendly === '') {
      this.ValidationMessages = [
        {
          Property: 'ViewNameFriendly',
          Message: 104,
        },
      ];
      this.InValid = true;
    }

    angular.forEach(this.Sorting, function (item) {
      item.ValidationMessage = item.Field === '' || item.Field === null ? 105 : null;
      if (item.ValidationMessage !== null) {
        self.InValid = true;
      }
    });

    this.LoopActionSet.validate();
  };

  LoopThroughTableModel.prototype.removeSetAR = function (arList) {
    this.LoopActionSet.clearActionResult(arList);
  };

  LoopThroughTableModel.prototype.generateNewIds = function () {
    this.LoopActionSet.setNewId();
    if(Array.isArray(this.LoopActionSet.Actions) && this.LoopActionSet.Actions.length > 0 ) {        
      this.LoopActionSet.Actions.forEach(element => {
        if (element.ActionId === 1 || element.ActionId === 26 || element.ActionId === 29 || element.ActionId === 38 || element.ActionId === 53 ||
          element.ActionId === 55) {
          element.generateNewIds();            
        }
      });
    }
  };

  return LoopThroughTableModel;
}

LoopThroughTableModel.$inject = ['BaseModel', 'ActionSetModel'];
