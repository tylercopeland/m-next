import template from "./tmpl.html";

export default function SetActiveRecordModel(BaseModel, ComplexValueModel) {
  function SetActiveRecordModel(data) {
    this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      this.ActiveRecordId = new ComplexValueModel(data.ActiveRecordId);
    }
  }

  SetActiveRecordModel.prototype = angular.copy(BaseModel.prototype);

  SetActiveRecordModel.prototype.config = {
    id: 7,
    category: "Screen",
    name: "Set Active Record ID For Screen",
    description: {
      short: "Sets the screen's active record.",
      long:
        "Sets the screen's active record to the specified RecordID. A RecordID is a unique value that exists in all Tables records."
    },
    learnMore: [
      [
        "Learn more",
        " https://help.method.me/en/articles/2623143-set-active-record-id-for-screen-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  SetActiveRecordModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (
      this.ActiveRecordId !== null &&
      this.ActiveRecordId.getConsumedActionResult()
    ) {
      array.push(this.ActiveRecordId.getValues());
    }

    return array;
  };

  SetActiveRecordModel.prototype.isUsingControl = function(control) {
    var result = false;

    if (this.ActiveRecordId !== null && this.ActiveRecordId.ValueType === 5 && this.ActiveRecordId.Value === control) {
      return true;
    }

    return result;
  };

  SetActiveRecordModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    this.ActiveRecordId.validate();
    // Validate the consumption of this model and make sure it was set
    this.validateConsumptionPosition(this.ActiveRecordId);
  };

  return SetActiveRecordModel;
};

SetActiveRecordModel.$inject = [
  "BaseModel",
  "ComplexValueModel"
];