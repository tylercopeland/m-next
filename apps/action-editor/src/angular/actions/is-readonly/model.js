import template from "./tmpl.html";

export default function IsReadOnlyModel(BaseModel) {
  function IsReadOnlyModel(data) {
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

  IsReadOnlyModel.prototype = angular.copy(BaseModel.prototype);

  IsReadOnlyModel.prototype.config = {
    id: 42,
    category: "Screen",
    name: "Update Editable Grid Read Only Property",
    description: {
      short: "Changes the read only property for editable grids.",
      long: "Changes the read only property for editable grids."
    },
    learnMore: [
      [
        "Learn More",
        "https://help.method.me/en/articles/2527838-update-editable-grid-read-only-property-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  IsReadOnlyModel.prototype.addNewItem = function() {
    this.ControlsToUpdate.push({
      ControlId: null,
      ToggleOptions: 0
    });
  };

  IsReadOnlyModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ControlsToUpdate, function(item) {
      if (item.ControlId === control) {
        result = true;
      }
    });

    return result;
  };
  IsReadOnlyModel.prototype.validate = function() {
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

  return IsReadOnlyModel;
};

IsReadOnlyModel.$inject = ["BaseModel"];