import template from "./tmpl.html";

export default function SetControlFocusModel(BaseModel, guidSvc) {
  function SetControlFocusModel(data) {
    this.ControlId = null;
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);
  }

  SetControlFocusModel.prototype = angular.copy(BaseModel.prototype);

  SetControlFocusModel.prototype.config = {
    id: 12,
    category: 'Screen',
    name: 'Set Focus To Control',
    description: {
      short: 'Set Focus To Control navigates the user to a specified field on the screen.',
      long: 'Set Focus To Control navigates the user to a specified field on the screen.'
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623136-set-focus-to-control-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  SetControlFocusModel.prototype.isUsingControl = function(control) {
    return this.ControlId === control;
  };

  SetControlFocusModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.ControlId === null || this.ControlId === undefined || this.ControlId === '' || this.ControlId === guidSvc.empty) {
      this.InValid = true;
      this.ValidationMessages = [
        {
          Property: 'ControlId',
          Message: 100
        }
      ];
    }
  };

  return SetControlFocusModel;
};

SetControlFocusModel.$inject = ['BaseModel', 'guidSvc'];