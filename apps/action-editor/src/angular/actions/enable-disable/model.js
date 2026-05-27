import template from "./tmpl.html";

export default function EnableDisableControlsModel(BaseModel) {
  function EnableDisableControlsModel(data) {
    this.ControlsToUpdate = [];
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

  EnableDisableControlsModel.prototype = angular.copy(BaseModel.prototype);

  EnableDisableControlsModel.prototype.config = {
    id: 11,
    category: "Screen",
    name: "Enable/Disable Controls",
    description: {
      short: "Enables or Disables Controls on Screen.",
      long: "Enables or Disables Controls on Screen."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623476-enable-disable-controls"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  EnableDisableControlsModel.prototype.addNewItem = function() {
    this.ControlsToUpdate.push({
      ControlId: null,
      ToggleOptions: 0
    });
  };

  EnableDisableControlsModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ControlsToUpdate, function(item) {
      if (item.ControlId === control) {
        result =  true;
      }
    });

    return result;
  };

  EnableDisableControlsModel.prototype.validate = function() {
    var self = this;

    this.InValid = false;
    this.ValidationMessages = [];

    angular.forEach(this.ControlsToUpdate, function(obj, _idx) {
      if (
        obj.ControlId === null ||
        obj.ControlId === undefined ||
        obj.ControlId === "" ||
        obj.ControlId === "00000000-0000-0000-0000-000000000000"
      ) {
        self.InValid = true;
        obj.ValidationMessages = [
          {
            Property: "ControlId",
            Message: 100
          }
        ];
      } else {
        obj.ValidationMessages = [];
      }
    });
  };

  return EnableDisableControlsModel;
};

EnableDisableControlsModel.$inject = ["BaseModel"];