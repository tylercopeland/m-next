import template from "./tmpl.html";

export default function GoToWebpageModel(BaseModel, ComplexValueModel) {
  function GoToWebpageModel(data) {
    this.Url = new ComplexValueModel({ ValueType: 9, Value: "" });
    this.NewTab = false;
    this.isReadOnly = false;
    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      if (data.Url !== null) {
        this.Url = new ComplexValueModel(data.Url);
      }
    }
  }

  GoToWebpageModel.prototype = angular.copy(BaseModel.prototype);

  GoToWebpageModel.prototype.config = {
    id: 33,
    category: "Screen",
    name: "Go To Web Page",
    description: {
      short:
        "Replace the current screen, launch a new web browser window with a specified URL or supply a phone number with tel: to open a mobile device's phone.",
      long:
        "Replace the current screen or launch a new web browser window with a specified URL. Also supports telephone numbers with the 'tel:' prefix."
    },
    learnMore: [
      [
        "Learn More",
        "https://help.method.me/en/articles/2583879-go-to-web-page"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  GoToWebpageModel.prototype.isUsingControl = function(control) {
    var result = false;

    if (this.Url !== null && this.Url.isUsingControl(control)) {
      return true;
    }

    return result;
  };

  GoToWebpageModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.Url !== null) {
      if (!this.Url.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.Url);
    }
  };

  GoToWebpageModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (this.Url !== null && this.Url.getConsumedActionResult()) {
      array.push(this.Url.getValues());
    }
    return array;
  };

  return GoToWebpageModel;
};

GoToWebpageModel.$inject = ["BaseModel", "ComplexValueModel"];