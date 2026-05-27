import template from "./tmpl.html";

export default function ValidateControlsModel(BaseModel) {
  function ValidateControlsModel(data) {
    this.ValidateAllControls = true;
    this.ControlsToValidate = [];

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );
  }

  ValidateControlsModel.prototype = angular.copy(BaseModel.prototype);

  ValidateControlsModel.prototype.config = {
    id: 37,
    category: "Screen",
    name: "Validate Controls on Screen",
    description: {
      short:
        "Validates controls on screen to ensure validation rules (if any) have passed.",
      long:
        "Validates controls on screen to ensure validation rules (if any) have passed."
    },
    learnMore: [
      [
        "Learn More",
        "https://help.method.me/en/articles/2517577-validate-controls-on-screen-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  ValidateControlsModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ControlsToValidate, function(item) {
      if (item === control) {
        result = true;
      }
    });

    return result;
  };

  ValidateControlsModel.prototype.validate = function() {};

  return ValidateControlsModel;
};

ValidateControlsModel.$inject = ["BaseModel"];