import template from "./tmpl.html";

export default function ActionResultModel(BaseModel, ResultToSetModel) {
  function ActionResultModel(data) {
    this.AssignValueToActions = [];
    this.IsAppRoutineInputValue = false;
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data === undefined) {
      this.addNewItem();
    } else {
      var self = this;
      angular.forEach(this.AssignValueToActions, function (value, idx) {
        self.AssignValueToActions[idx] = new ResultToSetModel(value);
      });
    }
  }

  ActionResultModel.prototype = angular.copy(BaseModel.prototype);

  ActionResultModel.prototype.config = {
    id: 0,
    category: "Action Results",
    name: "Assign Value To Action Result",
    description: {
      short: "Sets an Action Result variable.",
      long:
        "Sets an Action Result variable to a specified value, which can then be used in subsequent actions."
    },
    learnMore: [
      [
        "Learn more about action results",
        "https://help.method.me/en/articles/2493209-assign-value-to-action-result"
      ]
    ],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  ActionResultModel.prototype.addNewItem = function () {
    var resultToSet = new ResultToSetModel();
    resultToSet.addComplexValue();
    this.AssignValueToActions.push(resultToSet);
  };

  ActionResultModel.prototype.deleteItem = function (idx) {
    this.AssignValueToActions.splice(idx, 1);
    this.validate();
  };

  ActionResultModel.prototype.getActionResultSet = function () {
    var array = [];
    angular.forEach(this.AssignValueToActions, function (item) {
      if (!item.isShared()) {
        array.push(item.getValues());
      }
    });
    return array;
  };

  ActionResultModel.prototype.getActionResultUsed = function () {
    var array = [];

    angular.forEach(this.AssignValueToActions, function (item) {
      if (item.Source !== null && item.Source.getConsumedActionResult()) {
        array.push(item.Source.getValues());
      }
    });

    return array;
  };

  ActionResultModel.prototype.isUsingControl = function (control) {
    var result = false;
    angular.forEach(this.AssignValueToActions, function (item) {
      if (item.Source !== null && item.Source.isUsingControl(control)) {
        result = true;
      }
    });

    return result;
  };

  ActionResultModel.prototype.validate = function () {
    var self = this;
    this.InValid = false;

    angular.forEach(this.AssignValueToActions, function (item) {
      // Validate the model
      if (!item.validate()) {
        self.InValid = true;
      }

      // Validate the consumption of this model and make sure it was set
      self.validateConsumptionPosition(item.Source);
    });
  };

  ActionResultModel.prototype.removeSetAR = function (arList) {
    angular.forEach(this.AssignValueToActions, function (item) {
      item.Source.clear(arList);
    });
  };

  return ActionResultModel;
};

ActionResultModel.$inject = ["BaseModel", "ResultToSetModel"];