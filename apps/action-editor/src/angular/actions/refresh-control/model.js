import template from "./tmpl.html";

export default function RefreshControlModel(BaseModel, guidSvc) {
  function RefreshControlModel(data) {
    this.ControlsToRefresh = [];
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data === undefined) {
      this.addNewItem();
    }
  }

  RefreshControlModel.prototype = angular.copy(BaseModel.prototype);

  RefreshControlModel.prototype.config = {
    id: 15,
    category: "Screen",
    name: "Refresh Control",
    description: {
      short: "Refresh Control",
      long: "Refresh a grid, calendar or chart control."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623508-refresh-control-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  RefreshControlModel.prototype.newSubModel = {
    ControlId: null,
    ClearCheckboxes: true,
    isGrid: false,
    ValidationMessages: []
  };

  RefreshControlModel.prototype.addNewItem = function() {
    this.ControlsToRefresh.push(angular.copy(this.newSubModel));
  };

  RefreshControlModel.prototype.validateThis = function(item, action) {
    item.ValidationMessages = [];

    if (item.ControlId === null || item.ControlId === guidSvc.empty) {
      action.InValid = true;
      item.ValidationMessages.push({
        Property: "ControlId",
        Message: 100
      });
    }
  };

  RefreshControlModel.prototype.isUsingControl = function(control) {
    var result = false;

    angular.forEach(this.ControlsToRefresh, function(item) {
      if(item.ControlId === control)
      {
        result = true;
      }
    });

    return result;
  };

  RefreshControlModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    angular.forEach(this.ControlsToRefresh, function(item) {
      self.validateThis(item, self);
    });
  };

  return RefreshControlModel;
};

RefreshControlModel.$inject = ["BaseModel", "guidSvc"];