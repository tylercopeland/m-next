import template from "./tmpl.html";

export default function SharedResultModel(BaseModel, ResultToSetModel) {
  function SharedResultModel(data) {
    this.AssignValueToActions = [];
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
      angular.forEach(this.AssignValueToActions, function(value, idx) {
        self.AssignValueToActions[idx] = new ResultToSetModel(value);
      });
    }
  }

  SharedResultModel.prototype = angular.copy(BaseModel.prototype);

  SharedResultModel.prototype.config = {
    id: 31,
    category: "Action Results",
    name: "Assign Value To Shared Result",
    description: {
      short: "Sets an Shared Result variable.",
      long:
        "Sets a Shared Result Name variable to a specified value, which can then be retrieved from other screens using a Get Value From Shared Result action. A Shared Result is different from an Action Result in that an Action Result is only to be used in a list of actions for one object, such as when a button is clicked. On the other hand, a Shared Result can be retrieved anywhere else in Method."
    },
    learnMore: [
      [
        "Learn more about shared results",
        "https://help.method.me/en/articles/2495921-assign-value-to-shared-result"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  SharedResultModel.prototype.addNewItem = function() {
    var resultToSet = new ResultToSetModel({ IsSharedResult: true });
    resultToSet.addComplexValue();
    this.AssignValueToActions.push(resultToSet);
  };

  SharedResultModel.prototype.deleteItem = function(idx) {
    this.AssignValueToActions.splice(idx, 1);
    this.validate();
  };

  SharedResultModel.prototype.getActionResultSet = function() {
    var array = [];
    angular.forEach(this.AssignValueToActions, function(item) {
      if (!item.isShared()) {
        array.push(item.getValues());
      }
    });
    return array;
  };

  SharedResultModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.AssignValueToActions, function(item) {
      if (item.Source !== null && item.Source.getConsumedActionResult()) {
        array.push(item.Source.getValues());
      }
    });

    return array;
  };

  SharedResultModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.AssignValueToActions, function(item) {
      if (item.Source !== null && item.Source.isUsingControl(control)) {
        result =  true;
      }
    });

    return result;
  };


  SharedResultModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;

    angular.forEach(this.AssignValueToActions, function(item) {
      // Validate the model
      if (!item.validate()) {
        self.InValid = true;
      }

      // Validate the consumption of this model and make sure it was set
      self.validateConsumptionPosition(item.Source);
    });
  };

  SharedResultModel.prototype.removeSetAR = function(arList) {
    angular.forEach(this.AssignValueToActions, function(item) {
      item.Source.clear(arList);
    });
  };

  return SharedResultModel;
};

SharedResultModel.$inject = ["BaseModel", "ResultToSetModel"];