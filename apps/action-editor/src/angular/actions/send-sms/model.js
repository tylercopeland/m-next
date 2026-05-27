import template from "./tmpl.html";

export default function SendSmsModel(BaseModel, ComplexValueModel) {
  function SendSmsModel(data) {

    this.PhoneTo = new ComplexValueModel({ ValueType: 9 });
    this.Message = new ComplexValueModel({ ValueType: 9 });

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.PhoneTo = new ComplexValueModel(data.PhoneTo);
      this.Message = new ComplexValueModel(data.Message);
    }
  }

  SendSmsModel.prototype = angular.copy(BaseModel.prototype);

  SendSmsModel.prototype.config = {
    id: 49,
    category: "Advanced",
    name: "Send SMS",
    description: {
      short: "Sends a SMS to the specified recipient's phone number.",
      long: "Sends a SMS to the specified recipient's phone number.",
    },
    learnMore: [
      [
        "Learn more (link needs to be updated)",
        "https://help.method.me/en/articles/2589684-send-sms-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  SendSmsModel.prototype.getActionResultUsed = function () {
    var array = [];

    if (this.PhoneTo !== null && this.PhoneTo.getConsumedActionResult()) {
      array.push(this.PhoneTo.getValues());
    }

    if (this.Message !== null && this.Message.getConsumedActionResult()) {
      array.push(this.Message.getValues());
    }

    return array;
  };

  SendSmsModel.prototype.validate = function () {
    this.InValid = false;
    this.ValidationMessages = [];

    if (!this.PhoneTo.validate([{ type: 9, message: 135 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.PhoneTo);

    if (!this.Message.validate([{ type: 9, message: 135 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.Message);
  };

  return SendSmsModel;
};

SendSmsModel.$inject = ["BaseModel", "ComplexValueModel"];