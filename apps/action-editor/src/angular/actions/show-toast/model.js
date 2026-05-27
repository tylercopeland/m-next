import template from "./tmpl.html";

export default function ShowToastModel(BaseModel, ComplexValueModel) {
  function ShowToastModel(data) {
    this.isReadOnly = false;
    this.ToastType = 'success';
    this.Message = null;
    this.ValidationMessages = [];

    // Navigation properties
    this.IncludeNavigationButton = false;
    this.ButtonText = '';
    this.NavigateToAppName = null;
    this.NavigateToScreenId = null;
    this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      this.Message = data.Message ? new ComplexValueModel(data.Message) : null;
      if (data.ActiveRecordId !== null && data.ActiveRecordId !== undefined) {
        this.ActiveRecordId = new ComplexValueModel(data.ActiveRecordId);
      }
    }

    if (!this.Message) {
      this.Message = new ComplexValueModel({ ValueType: 9, Value: '' });
    }

    if (!this.Message) {
      this.Message = new ComplexValueModel({ ValueType: 9, Value: '' });
  }
  }

  ShowToastModel.prototype = angular.copy(BaseModel.prototype);

  ShowToastModel.prototype.config = {
    id: 56,
    category: "Screen",
    name: "Show Toast Notification",
    description: {
      short: "Shows a toast notification after an action is completed.",
      long:
        "Shows a temporary notification message at the top-right of the screen. Toast messages automatically dismiss after a set duration and can display different types (success, error, warning, custom) with optional icons."
    },
    learnMore: [],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  ShowToastModel.prototype.validate = function() {
    this.ValidationMessages = [];
    this.InValid = false;

    // Message is required - use Message.ValidationMessage for complex-value error display
    var messageEmpty = !this.Message || this.Message.Value === null || this.Message.Value === undefined ||
      (typeof this.Message.Value === 'string' && this.Message.Value.trim() === '');
    if (messageEmpty) {
      this.InValid = true;
      this.Message.ValidationMessage = 109;
    } else if (this.Message.ValidationMessage === 109) {
      this.Message.ValidationMessage = null;
    }

    // Validation for navigation fields when enabled
    if (this.IncludeNavigationButton) {
      // ButtonText is required
      if (!this.ButtonText || this.ButtonText.trim() === '') {
        this.InValid = true;
        this.ValidationMessages.push({
          Property: "ButtonText",
          Message: 143
        });
      }
      // Note: ButtonText max length (40 chars) validation is handled in ctrl.js watcher
      // to match the same show-on-type/hide-on-blur behavior as the Message field

      // NavigateToScreenId is required
      if (!this.NavigateToScreenId) {
        this.InValid = true;
        this.ValidationMessages.push({
          Property: "ScreenId",
          Message: 111
        });
      }
    }
  };

  ShowToastModel.prototype.switchActiveRecordId = function(type) {
    const VALUE_TYPE_NUMBER = 10;
    const DEFAULT_SET_ACTIVE_VALUE = 0;
    const DEFAULT_CLEAR_SCREEN_VALUE = -1;

    if (!this.ActiveRecordId) {
      this.ActiveRecordId = type === 0
        ? new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_SET_ACTIVE_VALUE })
        : new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_CLEAR_SCREEN_VALUE });
      return;
    }

    if (type === 0 && this.ActiveRecordId.ValueType !== VALUE_TYPE_NUMBER) {
      return;
    }

    this.ActiveRecordId = type === 0
      ? new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_SET_ACTIVE_VALUE })
      : new ComplexValueModel({ ValueType: VALUE_TYPE_NUMBER, Value: DEFAULT_CLEAR_SCREEN_VALUE });
  };

  ShowToastModel.prototype.getActionResultUsed = function() {
    var results = [];
    if (this.Message && this.Message.ValueType === 0) {
      results.push(this.Message);
    }
    if (this.IncludeNavigationButton && this.ActiveRecordId && this.ActiveRecordId.ValueType === 0) {
      results.push(this.ActiveRecordId);
    }
    return results;
  };

  ShowToastModel.prototype.isUsingControl = function(controlId) {
    if (this.Message && this.Message.isUsingControl(controlId)) {
      return true;
    }
    if (this.IncludeNavigationButton && this.ActiveRecordId && this.ActiveRecordId.isUsingControl(controlId)) {
      return true;
    }
    return false;
  };

  ShowToastModel.prototype.removeSetAR = function(arList) {
    if (this.Message) {
      this.Message.clear(arList);
    }
    if (this.ActiveRecordId) {
      this.ActiveRecordId.clear(arList);
    }
  };

  return ShowToastModel;
}

ShowToastModel.$inject = ["BaseModel", "ComplexValueModel"];
