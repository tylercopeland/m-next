import template from "./tmpl.html";

export default function CreateShortUrlModel(BaseModel, ResultToSetModel, ComplexValueModel, ControlModel, guidSvc) {
  function CreateShortUrlModel(data) {
    this.Domain = 0;
    this.InviteType = 1; //0 - User, 1 - Guest, 2 - Public
    this.ResultToSet = new ResultToSetModel();
    this.ScreenId = null;
    this.ControlToUpdate = null;
    this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });
    this.ActivityRecordId = null;
    this.CampaignRecordId = null;
    this.ContactRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.ControlToUpdate = data.ControlToUpdate ? new ControlModel(data.ControlToUpdate) : data.ControlToUpdate;
      this.ResultToSet = data.ResultToSet ? new ResultToSetModel(data.ResultToSet) : data.ResultToSet;

      this.ActiveRecordId = new ComplexValueModel(data.ActiveRecordId);

      if (data.ControlToUpdate !== null) {
        this.ControlToUpdate = new ControlModel(data.ControlToUpdate);
      }

      if (data.ActivityRecordId !== null) {
        this.ActivityRecordId = new ComplexValueModel(data.ActivityRecordId);
      }

      if (data.ActivityRecordId !== null) {
        this.ActivityRecordId = new ComplexValueModel(data.ActivityRecordId);
      }

      if (data.ContactRecordId !== null) {
        this.ContactRecordId = new ComplexValueModel(data.ContactRecordId);
      }
    }
  }

  CreateShortUrlModel.prototype = angular.copy(BaseModel.prototype);

  CreateShortUrlModel.prototype.config = {
    id: 23,
    category: 'Advanced',
    name: 'Create Short Method URL',
    description: {
      short: 'Provides you with an Action Result that contains the URL of a unique link you can provide to customers.',
      long:
        "Provides you with an Action Result that contains the URL of a unique link you can provide to customers, vendors, partners or other Method users. This unique URL will be directed to the screen of your choice within Method and can include a specific Screen RecordID. If the Customer/User is not currently logged in, they will be first directed to the login page before being redirected. If an Activity Record ID is provided, the date and time the link is clicked is added to the end of the specified Activity's comments. For Portal links, you can select a specific customer to allow your portal user to login using their email address instead of setting up their own username/password. For Email opt-out, a link is used in an email that gives the contact the ability to opt-out of receiving future emails. When a user opts-out using this link, a new activity is added to their account for the specified user and campaign."
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2565958-create-short-method-url-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  CreateShortUrlModel.prototype.switchInviteType = function() {
    this.InviteType = parseInt(this.InviteType);
    switch (this.InviteType) {
      case 1:
        if (this.ContactRecordId === null) {
          this.ContactRecordId = new ComplexValueModel({
            ValueType: 10,
            Value: 0
          });
        }
        break;
      default:
        this.ContactRecordId = null;
        break;
    }
  };

  CreateShortUrlModel.prototype.getActionResultSet = function() {
    var array = [];

    if (this.ResultToSet !== null && !this.ResultToSet.isShared()) {
      array.push(this.ResultToSet.getValues());
    }

    return array;
  };

  CreateShortUrlModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (this.ActiveRecordId !== null && this.ActiveRecordId.getConsumedActionResult()) {
      array.push(this.ActiveRecordId.getValues());
    }
    if (this.ContactRecordId !== null && this.ContactRecordId.getConsumedActionResult()) {
      array.push(this.ContactRecordId.getValues());
    }

    return array;
  };

  CreateShortUrlModel.prototype.validateScreen = function() {
    var screenId = this.validationPropertyExists(this.ValidationMessages, 'ScreenId'),
      appScreen = this.validationPropertyExists(this.ValidationMessages, 'AppScreen');

    // Check if a screen was selected
    if (this.ScreenId === '' || this.ScreenId === undefined || this.ScreenId === null || this.ScreenId === guidSvc.empty) {
      this.InValid = true;

      // Check if an app was selected but not a screen
      if (this?.AppName) {
        this.ValidationMessages.push({
          Property: 'AppScreen',
          Message: 130
        });

        // Remove Screen ID validation
        if (screenId !== null) {
          this.ValidationMessages.splice(screenId, 1);
        }

        // App wasn't selected and a screen wasn't
      } else {
        if (screenId === null) {
          this.ValidationMessages.push({
            Property: 'ScreenId',
            Message: 111
          });
        }

        if (appScreen !== null) {
          this.ValidationMessages.splice(appScreen, 1);
        }
      }
    } else {
      this.ValidationMessages.splice(screenId, 1);
      this.ValidationMessages.splice(appScreen, 1);
    }

    if (this.ValidationMessages.length === 0) {
      this.InValid = false;
    }
  };

  CreateShortUrlModel.prototype.isUsingControl = function(control) {
    var result = false;
    
    if (this.ScreenId !== null && this.ScreenId.ValueType === 5 && this.ScreenId.Value === control) {
      return true;
    }
    if (this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return true;
    }
    if (this.ActiveRecordId !== null && this.ActiveRecordId.ValueType === 5 && this.ActiveRecordId.Value === control) {
      return true;
    }
    if (this.ActivityRecordId !== null && this.ActivityRecordId.ValueType === 5 && this.ActivityRecordId.Value === control) {
      return true;
    }
    if (this.CampaignRecordId !== null && this.CampaignRecordId.ValueType === 5 && this.CampaignRecordId.Value === control) {
      return true;
    }
    if (this.ContactRecordId !== null && this.ContactRecordId.ValueType === 5 && this.ContactRecordId.Value === control) {
      return true;
    }
    
    return result;
  };

  CreateShortUrlModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateScreen();

    if (this.ActiveRecordId !== null) {
      if (!this.ActiveRecordId.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.ActiveRecordId);
    }

    if (this.ContactRecordId !== null) {
      if (!this.ContactRecordId.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.ContactRecordId);
    }

    if (this.ResultToSet !== null && !this.ResultToSet.validate()) {
      this.InValid = true;
    }
    if (this.ControlToUpdate !== null && !this.ControlToUpdate.validate()) {
      this.InValid = true;
    }
  };

  CreateShortUrlModel.prototype.removeSetAR = function(arList) {
    this.ResultToSet.clear(arList);
  };

  return CreateShortUrlModel;
};

CreateShortUrlModel.$inject = ['BaseModel', 'ResultToSetModel', 'ComplexValueModel', 'ControlModel', 'guidSvc'];