import template from './tmpl.html';

export default function LoopThroughListModel(BaseModel, ActionSetModel, ComplexValueModel) {
  function LoopThroughListModel(data) {
    this.Source = new ComplexValueModel({ ValueType: '' });
    this.LoopActionSet = new ActionSetModel(data ? data.LoopActionSet : null);
    this.isReadOnly = false;

    if (data) {
      delete data.LoopActionSet;
    }

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    // AFTER angular.extend, wrap Source in ComplexValueModel if it exists
    if (data !== undefined && data.Source) {
      this.Source = new ComplexValueModel(data.Source);
    }
  }

  LoopThroughListModel.prototype = angular.copy(BaseModel.prototype);

  LoopThroughListModel.prototype.config = {
    id: 55,
    category: 'List',
    name: 'Loop Through List',
    description: {
      short: 'In the Loop, each action runs for every item in your list.',
      long: "All actions in the 'Loop Through List' section will run once for every item in your list.",
    },
    learnMore: [['Learn more', '...']],
    template: template,
    active: true,
    hasNested: true,
    nestedProperties: ['LoopActionSet'],
  };

  LoopThroughListModel.prototype.containsActionSetId = function (actionSetId) {
    return this.LoopActionSet.ActionSetId === actionSetId ? this.LoopActionSet : false;
  };

  LoopThroughListModel.prototype.getActionResultSet = function () {
    const array = [];

    if (this.LoopActionSet.Actions.length > 0) {
      angular.forEach(this.LoopActionSet.Actions, function (action) {
        if (typeof action.getActionResultSet === 'function') {
          array.push(action.getActionResultSet());
        }
      });
    }

    return [].concat.apply([], array);
  };

  LoopThroughListModel.prototype.getActionResultUsed = function () {
    const array = [];

    // Check if Source consumes an action result
    if (this.Source !== null && this.Source.getConsumedActionResult && this.Source.getConsumedActionResult()) {
      array.push(this.Source.getValues());
    }

    return array;
  };

  LoopThroughListModel.prototype.isUsingControl = function (control) {
    // Check if Source is using this control
    if (this.Source !== null && this.Source.ValueType === 5 && this.Source.Value === control) {
      return true;
    }

    return false;
  };

  LoopThroughListModel.prototype.validate = function () {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    //validate action for app routine
    LoopThroughListModel.prototype.ValidateAppRoutineAction(self);

    // Validate that Source is required and not empty
    // Note: ValueType 0 is "Action Result", so we can't use !this.Source.ValueType (0 is falsy)
    if (!this.Source || (this.Source.ValueType !== 0 && !this.Source.ValueType)) {
      this.ValidationMessages.push({
        Property: 'Source',
        Message: 102,
      });
      this.InValid = true;
    }

    // Validate the consumption of Source to make sure action results are set before they're used
    this.validateConsumptionPosition(this.Source);

    this.LoopActionSet.validate();
  };

  LoopThroughListModel.prototype.removeSetAR = function (arList) {
    // Clear Source if it references a deleted action result
    if (this.Source) {
      this.Source.clear(arList);
    }
    this.LoopActionSet.clearActionResult(arList);
  };

  LoopThroughListModel.prototype.generateNewIds = function () {
    this.LoopActionSet.setNewId();
    if (Array.isArray(this.LoopActionSet.Actions) && this.LoopActionSet.Actions.length > 0) {
      this.LoopActionSet.Actions.forEach((element) => {
        if (
          element.ActionId === 1 ||
          element.ActionId === 26 ||
          element.ActionId === 29 ||
          element.ActionId === 38 ||
          element.ActionId === 53 ||
          element.ActionId === 55
        ) {
          element.generateNewIds();
        }
      });
    }
  };

  return LoopThroughListModel;
}

LoopThroughListModel.$inject = ['BaseModel', 'ActionSetModel', 'ComplexValueModel'];
