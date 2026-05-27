import template from "./tmpl.html";

export default function GoToScreenModel(BaseModel, ComplexValueModel) {
  function GoToScreenModel(data) {
    this.ScreenId = "dashboard"; // Screen GUID
    this.ScreenTransition = ""; // enum (0 Runtime, 1 Dashboard, 2 Back)
    this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });
    this.ReplaceHistory = false;
    this.RefreshOnTransition = false;
    this.RefreshCurrent = false;
    this.Params = [];
    this.OpenIn = null;
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      if (this.ActiveRecordId !== null) {
        this.ActiveRecordId = new ComplexValueModel(data.ActiveRecordId);
      }
      if (this.ScreenId === null) {
        this.ScreenId = "dashboard";
      }

      var self = this;
      angular.forEach(data.Params, function(param, idx) {
        self.Params[idx].Value = new ComplexValueModel(param.Value);
      });
    }
  }

  GoToScreenModel.prototype = angular.copy(BaseModel.prototype);

  GoToScreenModel.prototype.config = {
    id: 14,
    category: "Screen",
    name: "Go To Screen",
    description: {
      short: "Navigates the user to the specified screen.",
      long: "Navigates the user to the specified screen."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623402-go-to-screen"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  GoToScreenModel.prototype.getActionResultUsed = function() {
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

  GoToScreenModel.prototype.addParam = function() {
    var param = {
      Key: null,
      Value: new ComplexValueModel({ ValueType: 9 }),
      ValidationMessage: null
    };

    this.Params.push(param);
  };

  GoToScreenModel.prototype.switchActiveRecordId = function(type) {
    const VALUE_TYPE_NUMBER = 10; // Number type from ComplexValueModel
    const DEFAULT_SET_ACTIVE_VALUE = 0; // default for "Set Active RecordID"
    const DEFAULT_CLEAR_SCREEN_VALUE = -1; // default for "Clear screen"

    // Don't change if ActiveRecordId doesn't exist
    if (!this.ActiveRecordId) {
      // Create new ActiveRecordId
      this.ActiveRecordId =
        type === 0
          ? new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_SET_ACTIVE_VALUE })
          : new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_CLEAR_SCREEN_VALUE });
      return;
    }

    // Preserve non-number types (Component, Expression, Action Result, etc.) when switching TO "Set Active RecordID"
    // This prevents overwriting saved Component/Expression references during scope reuse/reinitialization
    // But allow changing to "Clear screen" even from Component (if user explicitly clicks Clear screen)
    if (type === 0 && this.ActiveRecordId.ValueType !== VALUE_TYPE_NUMBER) {
      return;
    }

    // If switching to "Clear screen" (type === 1), always allow it regardless of current type
    // This ensures users can clear the screen even if they had a Component reference

    // Update ActiveRecordId based on the selected type
    // type === 0: Set Active RecordID (default to 0)
    // type === 1: Clear screen (Value: -1)
    this.ActiveRecordId =
      type === 0
        ? new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_SET_ACTIVE_VALUE })
        : new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_CLEAR_SCREEN_VALUE });
  };

  GoToScreenModel.prototype.isUsingControl = function(control) {
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


  GoToScreenModel.prototype.validateFields = function() {
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

  GoToScreenModel.prototype.validate = function() {
    // var self = this;
    this.InValid = false;

    var incompatibeWithAppRoutine = this.ValidationMessages.filter(
      function(validation) {
        return validation.Message === 138;
      }
    );

    this.ValidationMessages = [];

    if (this.ScreenId !== "dashboard" && this.ScreenId !== "back") {
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
    }

    // if(this.Params !== null && this.Params.length !== 0 && (this.ScreenId !== "dashboard" && this.ScreenId !== "back")) {
    //   angular.forEach(this.Params, function(param) {
    //     // Validate the model
    //     if(!param.Value.validate()) {
    //       self.InValid = true;
    //     }

    //     // Validate blank key name
    //     param.ValidationMessage =  null;
    //     if (param.Key === "" || param.Key === null) {
    //       param.ValidationMessage = 108;
    //       self.InValid = true;
    //     };

    //     // Validate the consumption of this model and make sure it was set
    //     self.validateConsumptionPosition(param.Value);
    //   });
    // }

    if (this.ActiveRecordId !== null) {
      if (!this.ActiveRecordId.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.ActiveRecordId);
    }

    if (incompatibeWithAppRoutine && incompatibeWithAppRoutine.length > 0) {
      this.InValid = true;
      this.ValidationMessages = this.ValidationMessages.concat(
        incompatibeWithAppRoutine[0]
      );
    }
  };

  return GoToScreenModel;
};

GoToScreenModel.$inject = ["BaseModel", "ComplexValueModel"];