import template from "./tmpl.html";

export default function RetrieveValuesFromEmailModel(
  BaseModel,
  guidSvc,
  ResultToSetModel,
  ControlModel
) {
  function RetrieveValuesFromEmailModel(data) {
    this.Bindings = [];
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data === undefined) {
      this.addItem();
    } else {
      var self = this;
      angular.forEach(this.Bindings, function(value, idx) {
        self.Bindings[idx].ControlToUpdate = value.ControlToUpdate
          ? new ControlModel(value.ControlToUpdate)
          : value.ControlToUpdate;
        self.Bindings[idx].ResultToSet = value.ResultToSet
          ? new ResultToSetModel(value.ResultToSet)
          : value.ResultToSet;
      });
    }
  }

  RetrieveValuesFromEmailModel.prototype = angular.copy(BaseModel.prototype);

  RetrieveValuesFromEmailModel.prototype.valueTypes = [
    { label: "From Name", value: 0 },
    { label: "From Email", value: 1 },
    { label: "To Name(s)", value: 2 },
    { label: "To Email(s)", value: 3 },
    { label: "CC Name(s)", value: 4 },
    { label: "CC Email(s)", value: 5 },
    { label: "Subject", value: 6 },
    { label: "Body", value: 7 }
  ];

  RetrieveValuesFromEmailModel.prototype.config = {
    id: 40,
    category: "Advanced",
    name: "Retrieve Value From Email Gadget",
    description: {
      short: "Takes a value from the currently open email.",
      long:
        "Takes a value from the currently open email and loads it into an Action Result variable, which can then be used in subsequent actions."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2528068-retrieve-value-from-email-gadget-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  RetrieveValuesFromEmailModel.prototype.getActionResultSet = function() {
    var array = [];

    angular.forEach(this.Bindings, function(item) {
      if (item.ResultToSet !== null && !item.ResultToSet.IsSharedResult) {
        array.push(item.ResultToSet.getValues());
      }
    });

    return array;
  };

  RetrieveValuesFromEmailModel.prototype.newSubModel = {
    ValueName: null,
    UpdateControl: false,
    ControlToUpdate: null,
    ResultToSet: new ResultToSetModel()
  };

  RetrieveValuesFromEmailModel.prototype.addItem = function() {
    this.Bindings.push(angular.copy(this.newSubModel));
  };

  RetrieveValuesFromEmailModel.prototype.isUsingControl = function(control) {
    var result = false;

    angular.forEach(this.Bindings, function(item) {
      if (item.ControlToUpdate !== null &&  item.ControlToUpdate.ControlId === control)
      {
        result = true;
      }
    });

    return result;
  };


  RetrieveValuesFromEmailModel.prototype.validate = function() {
    var self = this;
    self.InValid = false;
    self.ValidationMessages = [];

    if (!self.InValid) {
      angular.forEach(this.Bindings, function(item) {
        item.ValidationMessages = [];

        self.validateItem(item);

        if (
          item.ControlToUpdate !== null &&
          (item.ControlToUpdate.ControlId === null ||
            item.ControlToUpdate.ControlId === guidSvc.empty)
        ) {
          self.InValid = true;
          item.ValidationMessages.push({
            Property: "ControlId",
            Message: 100
          });
        }

        if (item.ResultToSet !== null && !item.ResultToSet.validate()) {
          self.InValid = true;
        }
      });
    }
  };

  RetrieveValuesFromEmailModel.prototype.validateItem = function(item) {
    if (item.ValueName === null) {
      this.InValid = true;
      item.ValidationMessages.push({
        Property: "ValueName",
        Message: 136
      });
    } else {
      item.ValidationMessages = [];
    }
  };

  return RetrieveValuesFromEmailModel;
};

RetrieveValuesFromEmailModel.$inject = [
  "BaseModel",
  "guidSvc",
  "ResultToSetModel",
  "ControlModel"
];