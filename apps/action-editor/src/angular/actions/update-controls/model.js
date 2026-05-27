import template from "./tmpl.html";

export default function UpdateControlsModel(BaseModel, ControlModel) {
  function UpdateControlsModel(data) {
    this.ControlsToUpdate = [];
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
      angular.forEach(this.ControlsToUpdate, function(value, idx) {
        self.ControlsToUpdate[idx] = new ControlModel(value);
      });
    }
  }

  UpdateControlsModel.prototype = angular.copy(BaseModel.prototype);

  UpdateControlsModel.prototype.config = {
    id: 3,
    category: "Screen",
    name: "Update Controls On Screen",
    description: {
      short: "Enters the specified value into the specified field or object.",
      long:
        "Enters the specified value into the specified field or object on the screen. Note: only fields and objects currently placed on the screen are available to be used in this action."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623080-update-controls-on-screen-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  UpdateControlsModel.prototype.addNewItem = function() {
    var controlModel = new ControlModel();
    this.ControlsToUpdate.push(controlModel);
  };

  UpdateControlsModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    angular.forEach(this.ControlsToUpdate, function(item) {
      // Validate the model
  //    if (!item.validate()) {
  //      self.InValid = true;
  //    }

      // Validate the consumption of this model and make sure it was set
      self.validateConsumptionPosition(item.Source);
    });
  };
  
  UpdateControlsModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ControlsToUpdate, function(item) {
      if (item.ControlId === control) {
        result = true;
      }
    });

    return result;
  };
  UpdateControlsModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.ControlsToUpdate, function(item) {
      if (item.Source !== null && item.Source.getConsumedActionResult()) {
        array.push(item.Source.getValues());
      }
    });

    return array;
  };

  return UpdateControlsModel;
};

UpdateControlsModel.$inject = ["BaseModel", "ControlModel"];