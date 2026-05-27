import template from "./tmpl.html";

export default function SendMobilePushNotificationModel(BaseModel, ComplexValueModel) {
  function SendMobilePushNotificationModel(data) {

    this.ToUser = new ComplexValueModel({ ValueType: 9 });
    this.RecordId = new ComplexValueModel({ ValueType: 10 });
    this.ScreenId = "dashboard"
    this.Title = new ComplexValueModel({ ValueType: 9 });
    this.Msg = new ComplexValueModel({ ValueType: 9 });

    this.Priority = 0;
    this.Sound = 0;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.ToUser = new ComplexValueModel(data.ToUser);
      this.RecordId = new ComplexValueModel(data.RecordId);
      this.ScreenId = data.ScreenId;
      this.Title = new ComplexValueModel(data.Title);
      this.Msg = new ComplexValueModel(data.Msg);

      this.Property = data.Property ?? 0;
      this.Sound = data.Sound ?? 0;
    }
  }

  SendMobilePushNotificationModel.prototype = angular.copy(BaseModel.prototype);

  SendMobilePushNotificationModel.prototype.config = {
    id: 48,
    category: "Advanced",
    name: "Send Mobile Push",
    description: {
      short: "Sends a push notification to the specified recipient's mobile device.",
      long: "Sends a push notification to the specified recipient's mobile device.",
    },
    learnMore: [
      [
        "Learn more (link needs updated)",
        "https://help.method.me/en/articles/2589684-send-email-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  SendMobilePushNotificationModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (this.ToUser !== null && this.ToUser.getConsumedActionResult()) {
      array.push(this.ToUser.getValues());
    }

    if (this.RecordId !== null && this.RecordId.getConsumedActionResult()) {
      array.push(this.RecordId.getValues());
    }

    if (this.Title !== null && this.Title.getConsumedActionResult()) {
      array.push(this.Title.getValues());
    }

    if (this.Msg !== null && this.Msg.getConsumedActionResult()) {
      array.push(this.Msg.getValues());
    }

    return array;
  };

  SendMobilePushNotificationModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    if (!this.ToUser.validate([{ type: 9, message: 135 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.ToUser);

    if (!this.RecordId.validate([{ type: 10, message: 135 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.RecordId);

    console.debug('this.ScreenId:', this.ScreenId)

    if (this.ScreenId === "" || this.ScreenId === undefined || this.ScreenId === null) {
      this.InValid = true;
      this.ValidationMessages.push({ Property: "ScreenId", Message: 135 });
    }


    if (!this.Title.validate([{ type: 9, message: 135 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.Msg);


    if (!this.Msg.validate([{ type: 9, message: 135 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.Msg);
  };

  return SendMobilePushNotificationModel;
};

SendMobilePushNotificationModel.$inject = ["BaseModel", "ComplexValueModel"];