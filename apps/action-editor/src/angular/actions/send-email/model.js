import template from "./tmpl.html";

export default function SendEmailModel(BaseModel, ComplexValueModel) {
  function SendEmailModel(data) {
    this.From = new ComplexValueModel({ ValueType: 9 });
    this.FromName = new ComplexValueModel({ ValueType: 9 });
    this.To = new ComplexValueModel({ ValueType: 9 });
    this.CC = null;
    this.BCC = null;
    this.Subject = new ComplexValueModel({ ValueType: 9 });
    this.Message = new ComplexValueModel({ ValueType: 9 });
    this.Priority = 1; // normal
    this.Server = null;
    this.Username = null;
    this.Password = null;
    this.Port = null;
    this.Attachments = [];
    this.ContactRecordId = new ComplexValueModel({ ValueType: 9 });
    this.BatchName = new ComplexValueModel({ ValueType: 9 });
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data === undefined) {
      this.EmailType = 1;
    }

    if (data !== undefined) {
      this.From = new ComplexValueModel(data.From);
      this.FromName = new ComplexValueModel(data.FromName);
      this.To = new ComplexValueModel(data.To);
      this.Subject = new ComplexValueModel(data.Subject);
      this.Message = new ComplexValueModel(data.Message);
      this.ContactRecordId = new ComplexValueModel(data.ContactRecordId);
      this.BatchName = new ComplexValueModel(data.BatchName);
      this.EmailType = data.EmailType;

      if (data.CC != null) {
        this.CC = new ComplexValueModel(data.CC);
      }
      if (data.BCC != null) {
        this.BCC = new ComplexValueModel(data.BCC);
      }
      if (data.Server != null) {
        this.Server = new ComplexValueModel(data.Server);
      }
      if (data.Username != null) {
        this.Username = new ComplexValueModel(data.Username);
      }
      if (data.Password != null) {
        this.Password = new ComplexValueModel(data.Password);
      }
      if (data.Port != null) {
        this.Port = new ComplexValueModel(data.Port);
      }

      var self = this;
      angular.forEach(data.Attachments, function(attach, idx) {
        self.Attachments[idx] = new ComplexValueModel(attach);
      });
    }
  }

  SendEmailModel.prototype = angular.copy(BaseModel.prototype);

  SendEmailModel.prototype.config = {
    id: 18,
    category: "Advanced",
    name: "Send Email",
    description: {
      short: "Sends an email to the specified recipient.",
      long:
        "Sends an email to the specified recipient. Note: Server Address, User Name and Password are the SMTP settings of your company’s e-mail server. If you have already entered in your SMTP settings leave these fields blank."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2589684-send-email-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  SendEmailModel.prototype.priorityOptions = [
    { value: 1, label: "Normal" },
    { value: 0, label: "Low" },
    { value: 2, label: "High" }
  ];

  SendEmailModel.prototype.addProperty = function(property, data) {
    this[property] = data === null ? null : new ComplexValueModel(data);
  };

  SendEmailModel.prototype.addAttachment = function() {
    this.Attachments.push(new ComplexValueModel({ ValueType: 9 }));
  };

  SendEmailModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (this.From !== null && this.From.getConsumedActionResult()) {
      array.push(this.From.getValues());
    }
    if (this.FromName !== null && this.FromName.getConsumedActionResult()) {
      array.push(this.FromName.getValues());
    }
    if (this.To !== null && this.To.getConsumedActionResult()) {
      array.push(this.To.getValues());
    }
    if (this.CC !== null && this.CC.getConsumedActionResult()) {
      array.push(this.CC.getValues());
    }
    if (this.BCC !== null && this.BCC.getConsumedActionResult()) {
      array.push(this.BCC.getValues());
    }
    if (this.Subject !== null && this.Subject.getConsumedActionResult()) {
      array.push(this.Subject.getValues());
    }
    if (this.Message !== null && this.Message.getConsumedActionResult()) {
      array.push(this.Message.getValues());
    }
    if (this.Server !== null && this.Server.getConsumedActionResult()) {
      array.push(this.Server.getValues());
    }
    if (this.Username !== null && this.Username.getConsumedActionResult()) {
      array.push(this.Username.getValues());
    }
    if (this.Password !== null && this.Password.getConsumedActionResult()) {
      array.push(this.Password.getValues());
    }
    if (this.Port !== null && this.Port.getConsumedActionResult()) {
      array.push(this.Port.getValues());
    }
    if (
      this.ContactRecordId !== null &&
      this.ContactRecordId.getConsumedActionResult()
    ) {
      array.push(this.ContactRecordId.getValues());
    }
    if (this.BatchName !== null && this.BatchName.getConsumedActionResult()) {
      array.push(this.BatchName.getValues());
    }

    angular.forEach(this.Attachments, function(item) {
      if (item !== null && item.getConsumedActionResult()) {
        array.push(item.getValues());
      }
    });

    return array;
  };

  SendEmailModel.prototype.isUsingControl = function(control) {
    var result = false;




    if (this.From !== null && this.From.ValueType === 5 && this.From.Value === control) {
      return true;
    }
    if (this.FromName !== null && this.FromName.ValueType === 5 && this.FromName.Value === control) {
      return true;
    }
    if (this.To !== null && this.To.ValueType === 5 && this.To.Value === control) {
      return true;
    }
    if (this.CC !== null && this.CC.ValueType === 5 && this.CC.Value === control) {
      return true;
    }
    if (this.BCC !== null && this.BCC.ValueType === 5 && this.BCC.Value === control) {
      return true;
    }
    if (this.Subject !== null && this.Subject.ValueType === 5 && this.Subject.Value === control) {
      return true;
    }
    if (this.Message !== null && this.Message.ValueType === 5 && this.Message.Value === control) {
      return true;
    }
    if (this.Username !== null && this.Username.ValueType === 5 && this.Username.Value === control) {
      return true;
    }
    if (this.Password !== null && this.Password.ValueType === 5 && this.Password.Value === control) {
      return true;
    }
    if (this.Port !== null && this.Port.ValueType === 5 && this.Port.Value === control) {
      return true;
    }
    if (this.ContactRecordId !== null && this.ContactRecordId.ValueType === 5 && this.ContactRecordId.Value === control) {
      return true;
    }
    if (this.BatchName !== null && this.BatchName.ValueType === 5 && this.BatchName.Value === control) {
      return true;
    }
    if (this.FromName !== null && this.FromName.ValueType === 5 && this.FromName.Value === control) {
      return true;
    }

    angular.forEach(this.Attachments, function(attach, _idx) {
      if (attach.ValueType === 5 && attach.Value === control) {
        result = true;
      }
    });

    return result;
  };

  SendEmailModel.prototype.validate = function() {
    var self = this;

    this.InValid = false;
    this.ValidationMessages = [];

    if (!this.From.validate([{ type: 9, message: 113 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.From);

    if (!this.FromName.validate()) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.FromName);

    if (!this.To.validate([{ type: 9, message: 114 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.To);

    if (this.CC !== null) {
      if (!this.CC.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.CC);
    }

    if (this.BCC !== null) {
      if (!this.BCC.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.BCC);
    }

    if (!this.Subject.validate([{ type: 9, message: 115 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.Subject);

    if (!this.Message.validate()) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.Message);

    if (this.Server !== null) {
      if (!this.Server.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.Server);
    }

    if (this.Username !== null) {
      if (!this.Username.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.Username);
    }

    if (this.Password !== null) {
      if (!this.Password.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.Password);
    }

    if (this.Port !== null) {
      if (!this.Port.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.Port);
    }

    if (!this.ContactRecordId.validate()) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.ContactRecordId);

    if (this.EmailType === null || this.EmailType === undefined) {
      self.InValid = true;
      this.ValidationMessages.push({
        Property: "action.EmailType",
        Message: 102
      });
    }

    if (!this.BatchName.validate()) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.BatchName);

    angular.forEach(this.Attachments, function(item) {
      // Validate the model
      if (!item.validate()) {
        self.InValid = true;
      }

      // Validate the consumption of this model and make sure it was set
      self.validateConsumptionPosition(item);
    });
  };

  return SendEmailModel;
};

SendEmailModel.$inject = ["BaseModel", "ComplexValueModel"];