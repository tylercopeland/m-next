import template from "./tmpl.html";

export default function ShowMessageModel(
  BaseModel,
  ResultToSetModel,
  ControlModel,
  ComplexValueModel
) {
  function ShowMessageModel(data) {
    this.Message = "";
    this.Buttons = "ok";
    this.Title = "";
    this.ControlToUpdate = null;
    this.ResultToSet = new ResultToSetModel();
    this.MessageParameters = [];
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      this.ResultToSet = new ResultToSetModel(data.ResultToSet);

      if (
        data.MessageParameters != null &&
        data.MessageParameters.length > 0
      ) {
        var self = this;
        this.MessageParameters = [];
        angular.forEach(data.MessageParameters, function(item) {
          self.MessageParameters.push(new ComplexValueModel(item));
        });
      }
    }
  }

  ShowMessageModel.prototype = angular.copy(BaseModel.prototype);

  ShowMessageModel.prototype.config = {
    id: 2,
    category: "Screen",
    name: "Show Message",
    description: {
      short: "Shows a popup message to your users.",
      long: "Shows a popup message to your users."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2593841-show-message-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  ShowMessageModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ResultToSet !== null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }

    return array;
  };

  ShowMessageModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.MessageParameters, function(item) {
      if (item !== null && item.getConsumedActionResult()) {
        array.push(item.getValues());
      }
    });

    return array;
  };

  ShowMessageModel.prototype.isUsingControl = function(control) {
    var result = false;
    if (this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return true;
    }
    angular.forEach(this.MessageParameters, function(item) {
      if (item !== null && item.ValueType === 5 && item.Value === control)  {
        result = true;
      }
    });
    
    return result;
  };

  ShowMessageModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.Buttons === "no" && this.ResultToSet.ActionResultName === null) {
      if (!this.ResultToSet.validate()) {
        this.InValid = true;
      }
    }
  };

  return ShowMessageModel;
};

ShowMessageModel.$inject = [
  "BaseModel",
  "ResultToSetModel",
  "ControlModel",
  "ComplexValueModel"
];