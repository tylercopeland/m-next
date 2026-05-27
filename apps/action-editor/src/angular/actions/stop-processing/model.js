import template from "./tmpl.html";

export default function StopProcessingModel(BaseModel) {
  function StopProcessingModel(data) {
    this.isReadOnly = false;
    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );
  }

  StopProcessingModel.prototype = angular.copy(BaseModel.prototype);

  StopProcessingModel.prototype.config = {
    id: 25,
    category: "Advanced",
    name: "Stop Processing More Actions",
    description: {
      short: "This action skips processing all remaining actions.",
      long:
        'This action skips processing all remaining actions. This is often used when a "Conditional Statement" gives an undesired result.'
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2622889-stop-processing-more-actions"
      ]
    ],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  StopProcessingModel.prototype.validate = function() {};

  return StopProcessingModel;
};

StopProcessingModel.$inject = ["BaseModel"];