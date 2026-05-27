import template from "./tmpl.html";

export default function ShowHideControlsModel(BaseModel, guidSvc) {
  function ShowHideControlsModel(data) {
    this.ControlsToUpdate = [];
    this.isReadOnly = false;
    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data === undefined) {
      this.addNewItem();
    }
  }

  ShowHideControlsModel.prototype = angular.copy(BaseModel.prototype);

  ShowHideControlsModel.prototype.config = {
    id: 10,
    category: 'Screen',
    name: 'Show/Hide Controls',
    description: {
      short: 'Shows or Hides Controls on Screen.',
      long: 'Shows or Hides Controls on Screen.'
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623119-show-hide-controls-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  ShowHideControlsModel.prototype.subModel = {
    ControlId: null,
    ToggleOptions: 1,
    ValidationMessages: []
  };

  ShowHideControlsModel.prototype.addNewItem = function() {
    this.ControlsToUpdate.push(angular.copy(this.subModel));
  };

  ShowHideControlsModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ControlsToUpdate, function(item) {
      if (item.ControlId === control) {
        result = true;
      }
    });

    return result;
  };

  ShowHideControlsModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    angular.forEach(this.ControlsToUpdate, function(obj, _idx) {
      if (obj.ControlId === null || obj.ControlId === undefined || obj.ControlId === '' || obj.ControlId === guidSvc.empty) {
        self.InValid = true;
        obj.ValidationMessages = [
          {
            Property: 'ControlId',
            Message: 100
          }
        ];
      } else {
        obj.ValidationMessages = [];
      }
    });
  };

  return ShowHideControlsModel;
};

ShowHideControlsModel.$inject = ['BaseModel', 'guidSvc'];