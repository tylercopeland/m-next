import template from "./tmpl.html";

export default function ClearScreenModel(BaseModel) {
  function ClearScreenModel(data) {
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);
  }

  ClearScreenModel.prototype = angular.copy(BaseModel.prototype);

  ClearScreenModel.prototype.config = {
    id: 13,
    category: 'Screen',
    name: 'Clear Screen For New Entry',
    description: {
      short: 'Prepares the screen for the entry of a new record',
      long: "Prepares the screen for the entry of a new record by resetting all fields to their default values and resetting the screen's Active Record ID."
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623493-clear-screen-for-new-entry-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  ClearScreenModel.prototype.validate = function() {};

  return ClearScreenModel;
};

ClearScreenModel.$inject = ['BaseModel'];