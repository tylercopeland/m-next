import template from "./tmpl.html";

export default function MathFunctionsModel(
  BaseModel,
  ResultToSetModel,
  ComplexValueModel,
  ControlModel
) {
  function MathFunctionsModel(data) {
    this.Values = [];
    this.UpdateControl = false;
    this.ControlToUpdate = null;
    this.ResultToSet = new ResultToSetModel();
    this.MathFunctionType = 4;
    this.Rounding = 0;
    this.DecimalPlaces = 0;
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      var self = this;
      this.ControlToUpdate = data.ControlToUpdate
        ? new ControlModel(data.ControlToUpdate)
        : data.ControlToUpdate;
      this.ResultToSet = data.ResultToSet
        ? new ResultToSetModel(data.ResultToSet)
        : data.ResultToSet;

      angular.forEach(this.Values, function(obj, idx) {
        self.Values[idx] = new ComplexValueModel(obj);
      });
    } else {
      this.setupModelValues(this.MathFunctionType);
    }
  }

  MathFunctionsModel.prototype = angular.copy(BaseModel.prototype);

  MathFunctionsModel.prototype.config = {
    id: 9,
    category: "Function",
    name: "Math Functions",
    description: {
      short: "This action performs advanced Math Functions.",
      long:
        "This action performs advanced Math Functions and stores the outcome in an Action Result or Shared Result variable that can be used in subsequent actions. For basic math calculations use Expression Builder from Assign Value To Action Result action."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623601-math-function-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  MathFunctionsModel.prototype.mathOptions = [
    { value: 4, label: "Add" },
    { value: 5, label: "Subtract" },
    { value: 6, label: "Multiply" },
    { value: 7, label: "Divide" },

    { value: 8, label: "Max" },
    { value: 9, label: "Min" },
    { value: 2, label: "Power" },
    { value: 10, label: "DivRem" },
    { value: 16, label: "Percentage" },
    { value: 1, label: "Round" },
    { value: 0, label: "Absolute Value" },
    { value: 3, label: "Square Root" },
    { value: 11, label: "Sin" },
    { value: 12, label: "Cos" },
    { value: 13, label: "Tan" },
    { value: 14, label: "Log" },
    { value: 15, label: "Log10" }
  ];

  MathFunctionsModel.prototype.setupModelValues = function(type) {
    this.Values = [];
    this.Rounding = 0;
    this.DecimalPlaces = 0;

    switch (type) {
      case 1:
        this.addNewValue();
        this.Rounding = 3;
        break;
      case 2:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        this.addNewValue();
        this.addNewValue();
        break;
      case 10:
        this.addNewValue();
        this.addNewValue(1);
        break;
      case 16:
        this.addNewValue();
        this.addNewValue(100);
        break;
      default:
        this.addNewValue();
        break;
    }
  };

  MathFunctionsModel.prototype.addNewValue = function(value) {
    value = value === null || value === undefined ? 0 : value;
    this.Values.push(new ComplexValueModel({ ValueType: 10, Value: value }));
  };

  MathFunctionsModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ResultToSet != null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }

    return array;
  };

  MathFunctionsModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.Values, function(obj) {
      if (obj !== null && obj.getConsumedActionResult()) {
        array.push(obj.getValues());
      }
    });

    return array;
  };

  MathFunctionsModel.prototype.isUsingControl = function(control) {
    if (this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return true;
    }
    var result = false;
    angular.forEach(this.Values, function(obj) {
      if (obj !== null && obj.isUsingControl(control)) {
        result = true;
      }
    });
    return result;
  };

  MathFunctionsModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.ResultToSet !== null && !this.ResultToSet.validate()) {
      this.InValid = true;
    }
    if (this.ControlToUpdate !== null && !this.ControlToUpdate.validate()) {
      this.InValid = true;
    }

    angular.forEach(this.Values, function(value) {
      if (!value.validate()) {
        self.InValid = true;
      }
      self.validateConsumptionPosition(value);
    });
  };

  return MathFunctionsModel;
};

MathFunctionsModel.$inject = [
  "BaseModel",
  "ResultToSetModel",
  "ComplexValueModel",
  "ControlModel"
];