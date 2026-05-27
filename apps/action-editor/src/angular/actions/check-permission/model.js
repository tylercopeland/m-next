import template from "./tmpl.html";

export default function CheckPermissionModel(BaseModel, ResultToSetModel, guidSvc, ComplexValueModel) {
  function CheckPermissionModel(data) {
    this.AppId = null;
    this.Permission = null;
    this.User = new ComplexValueModel({ ValueType: 6, Value: "UserRecordID" });
    this.ShowMessage = false;
    this.DenialMessage = null;
    this.ResultToSet = new ResultToSetModel();
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.User = data.User ? new ComplexValueModel(data.User) : new ComplexValueModel({ ValueType: 6, Value: "UserRecordID" });
      this.ResultToSet = new ResultToSetModel(data.ResultToSet);
    }
  }

  CheckPermissionModel.prototype = angular.copy(BaseModel.prototype);

  CheckPermissionModel.prototype.config = {
    id: 19,
    category: 'Advanced',
    name: 'Check Permission',
    description: {
      short: 'Checks if a user has permission to the selected app.',
      long: "Checks if a user has permission to the selected app. This action will return 'false' for Guest or Public users."
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623060-check-permission-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  CheckPermissionModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];
    //validates the dropdown value and display the message error
    if (!this.User.validate([{ type: 6, message: 135 }])) {
      this.InValid = true;
    }
    this.validateConsumptionPosition(this.User);

    if (this.AppId === '' || this.AppId === undefined || this.AppId === null || this.AppId === guidSvc.empty) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: 'AppId',
        Message: 102
      });
    }

    if (this.Permission === '' || this.Permission === undefined || this.Permission === null || (this.Permission === 0 && this.AppId === guidSvc.empty)) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: 'Permission',
        Message: 102
      });
    }

    if (this.ShowMessage && (this.DenialMessage === null || this.DenialMessage === '')) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: 'DenialMessage',
        Message: 109
      });
    }

    if (!this.ShowMessage) {
      if (!this.ResultToSet.validate()) {
        this.InValid = true;
      }
    }
  };

  CheckPermissionModel.prototype.getActionResultSet = function() {
    var action = this;
    var array = [];
    if (this.User !== null && this.User.getConsumedActionResult()) {
      array.push(this.User.getValues());
    }
    if (!action.ResultToSet.isShared()) {
      array.push(action.ResultToSet.getValues());
    }
    return array;
  };

  CheckPermissionModel.prototype.removeSetAR = function(arList) {
    this.ResultToSet.clear(arList);
  };

  return CheckPermissionModel;
};

CheckPermissionModel.$inject = ['BaseModel', 'ResultToSetModel', 'guidSvc', 'ComplexValueModel'];