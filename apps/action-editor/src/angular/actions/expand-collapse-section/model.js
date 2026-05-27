import template from "./tmpl.html";

export default function ExpandCollapseSectionModel(BaseModel) {
  function ExpandCollapseSectionModel(data) {
    this.ControlsToUpdate = [];
    this.isReadOnly = false;
    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);
  }

  ExpandCollapseSectionModel.prototype = angular.copy(BaseModel.prototype);

  ExpandCollapseSectionModel.prototype.config = {
    id: 34,
    category: 'Screen',
    name: 'Expand/Collapse Section',
    description: {
      short: 'Expand or collapse a section on screen.',
      long: 'The Expand/Collapse Section action will allow you to set the state of a section between being expanded or collapsed.'
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2583703-expand-collapse-section']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  ExpandCollapseSectionModel.prototype.addNewItem = function(value) {
    this.ControlsToUpdate.push({
      ControlId: value,
      ToggleOptions: 0
    });
  };

  ExpandCollapseSectionModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ControlsToUpdate, function(item) {
      if (item.ControlId === control) {
        result = true;
      }
    });

    return result;
  };
  ExpandCollapseSectionModel.prototype.validate = function() {
    var self = this;

    this.InValid = false;
    this.ValidationMessages = [];

    angular.forEach(this.ControlsToUpdate, function(obj, _idx) {
      if (obj.ControlId === null || obj.ControlId === undefined || obj.ControlId === '' || obj.ControlId === '00000000-0000-0000-0000-000000000000') {
        self.InValid = true;
        obj.ValidationMessages = [
          {
            Property: 'ControlId',
            Message: 134
          }
        ];
      } else {
        obj.ValidationMessages = [];
      }
    });
  };

  return ExpandCollapseSectionModel;
};

ExpandCollapseSectionModel.$inject = ['BaseModel'];