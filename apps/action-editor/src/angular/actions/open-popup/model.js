import template from "./tmpl.html";

// Character limit for popup header title
const POPUP_HEADER_MAX_LENGTH = 100;

export default function OpenPopUpModel(BaseModel, ComplexValueModel, ResultToSetModel, guidSvc) {
  function OpenPopUpModel(data) {
    this.ScreenId = null; // Screen GUID
    this.popUpHeaderMaxLength = POPUP_HEADER_MAX_LENGTH; // Expose for controller access
    this.AppName = null; // App Name
    this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });
    this.Params = [];
    this.OpenIn = null;
    this.isReadOnly = false;
    this.ValidationMessages = [];
    this.ModalTitle = null;
    this.PopUpHeader = null;
    this.ModalWidth = null;
    this.ModalHeight = null;
    this.CloseOnOutsideClick = true;
    this.RefreshOnTransition = false;
    this.RefreshCurrent = false;
    this.ResultToSet = new ResultToSetModel();
    this.ModalStatusResult = new ResultToSetModel();
    this.resultLabel = "Store Pop-Up Results in";

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data?.ResultToSet) {
      this.ResultToSet = new ResultToSetModel(data.ResultToSet);
    }

    if (data?.ModalStatusResult) {
      this.ModalStatusResult = new ResultToSetModel(data.ModalStatusResult);
    }

    if (data !== undefined) {
      if (this.ActiveRecordId !== null) {
        this.ActiveRecordId = new ComplexValueModel(data.ActiveRecordId);
      }

      var self = this;
      angular.forEach(data.Params, function(param, idx) {
        self.Params[idx].Value = new ComplexValueModel(param.Value);
      });
    }
  }

  OpenPopUpModel.prototype = angular.copy(BaseModel.prototype);

  OpenPopUpModel.prototype.config = {
    id: 53,
    ActionType: 53,
    category: "Pop-Ups",
    name: "Open Screen as a Pop-Up",
    description: {
      short: "Opens a screen as a Pop-Up.",
      long: "Open a screen that the user has access to as a Pop-Up."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/12148880-open-screen-as-a-pop-up-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  OpenPopUpModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.Params, function(param) {
      if (param.Value !== null && param.Value.getConsumedActionResult()) {
        array.push(param.Value.getValues());
      }
    });

    if (
      this.ActiveRecordId !== null &&
      this.ActiveRecordId.getConsumedActionResult()
    ) {
      array.push(this.ActiveRecordId.getValues());
    }

    return array;
  };

  OpenPopUpModel.prototype.getActionResultSet = function() {
    let array = [];

    if (this.ResultToSet !== null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }

    if (this.ModalStatusResult !== null && !this.ModalStatusResult.IsSharedResult) {
      array.push(this.ModalStatusResult.getValues());
    }

    return array;
  };

  OpenPopUpModel.prototype.addParam = function() {
    var param = {
      Key: null,
      Value: new ComplexValueModel({ ValueType: 9 }),
      ValidationMessage: null
    };

    this.Params.push(param);
  };

  OpenPopUpModel.prototype.switchActiveRecordId = function(type) {
    if (type === 0) {
      if (this.ActiveRecordId === null || this.ActiveRecordId.Value === -1) {
        this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });
      }
      return;
    }

    if (this.ActiveRecordId === null) {
      this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: -1 });
      return;
    }

    this.ActiveRecordId.Value = -1;
  };

  OpenPopUpModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.Params, function(item) {
      if (item.Value !== null && item.Value.Value === control) {
        result = true;
      }
    });

    if (this.ActiveRecordId !== null && this.ActiveRecordId.isUsingControl(control)) {
      return true;
    }

    return result;
  };

  OpenPopUpModel.prototype.validateFields = function() {
    var self = this;
    angular.forEach(this.Params, function(obj) {
      obj.ValidationMessages = [];
      if (obj.Key === "") {
        self.InValid = true;
        obj.ValidationMessages.push({
          Property: "Key",
          Message: 108
        });
      }
    });
  };

  OpenPopUpModel.prototype.validate = function() {
    this.ValidationMessages = [];
    this.InValid = false;
    if (
      this.ScreenId === "" ||
      this.ScreenId === undefined ||
      this.ScreenId === null
    ) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: "ScreenId",
        Message: 111
      });
    }
    if (this.PopUpHeader === '' || this.PopUpHeader === undefined || this.PopUpHeader === null) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: 'PopUpHeader',
        Message: 139
      });
    }
    if (this.PopUpHeader && this.PopUpHeader.length > POPUP_HEADER_MAX_LENGTH) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: 'PopUpHeader',
        Message: 140
      });
    }
    if (this.ActiveRecordId !== null) {
      if (!this.ActiveRecordId.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.ActiveRecordId);
    }
    if (this.ResultToSet !== null && !this.ResultToSet.validate()) {
      this.InValid = true;
    }
  };

  OpenPopUpModel.prototype.generateNewIds = function() {
    // Regenerate ActionResult IDs to avoid conflicts when copying/pasting
    // Only regenerate the ID, preserve the ActionResultName
    if (this.ResultToSet !== null && this.ResultToSet.ActionResultId !== null) {
      this.ResultToSet.ActionResultId = guidSvc.create();
    }
    
    if (this.ModalStatusResult !== null && this.ModalStatusResult.ActionResultId !== null) {
      this.ModalStatusResult.ActionResultId = guidSvc.create();
    }
  };

  return OpenPopUpModel;
}

OpenPopUpModel.$inject = ["BaseModel", "ComplexValueModel", "ResultToSetModel", "guidSvc"];
