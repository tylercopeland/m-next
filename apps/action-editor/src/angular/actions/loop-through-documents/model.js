import template from './tmpl.html';

export default function LoopThroughDocumentsModel(BaseModel, ActionSetModel, ComplexValueModel) {
  function LoopThroughDocumentsModel(data) {
    this.ViewNameFriendly = null;
    this.RecordId = new ComplexValueModel({ ValueType: 10 });
    this.LoopActionSet = new ActionSetModel(null);
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.RecordId = new ComplexValueModel(data.RecordId);
      this.LoopActionSet = new ActionSetModel(data.LoopActionSet);
    }
  }

  LoopThroughDocumentsModel.prototype = angular.copy(BaseModel.prototype);

  LoopThroughDocumentsModel.prototype.config = {
    id: 38,
    category: 'Attachments',
    name: 'Loop Through Attachments',
    description: {
      short: 'Loop through attachments for a given Record ID',
      long: 'Loop through attachments for a given Record ID',
    },
    learnMore: [['Learn More', 'https://help.method.me/en/articles/2551184-loop-through-attachments-action']],
    template: template,
    active: true,
    hasNested: true, // Only needed if this model contains a nested action set
    nestedProperties: ['LoopActionSet'], // List the property names that contain a nested action set
  };

  LoopThroughDocumentsModel.prototype.validate = function () {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.ViewNameFriendly === null || this.ViewNameFriendly === undefined || this.ViewNameFriendly === '') {
      this.ValidationMessages = [
        {
          Property: 'ViewNameFriendly',
          Message: 104,
        },
      ];
      this.InValid = true;
    }
  };

  LoopThroughDocumentsModel.prototype.getActionResultSet = function () {
    var array = [];

    if (this.LoopActionSet.Actions.length > 0) {
      angular.forEach(this.LoopActionSet.Actions, function (action) {
        if (typeof action.getActionResultSet === 'function') {
          array.push(action.getActionResultSet());
        }
      });
    }

    return [].concat.apply([], array);
  };

  LoopThroughDocumentsModel.prototype.isUsingControl = function (control) {
    var result = false;

    if (this.RecordId !== null && this.RecordId.isUsingControl(control)) {
      return true;
    }

    return result;
  };

  LoopThroughDocumentsModel.prototype.generateNewIds = function () {
    this.LoopActionSet.setNewId();
    if(Array.isArray(this.LoopActionSet.Actions) && this.LoopActionSet.Actions.length > 0 ) {        
      this.LoopActionSet.Actions.forEach(element => {
        if (element.ActionId === 1 || element.ActionId === 26 || element.ActionId === 29 || element.ActionId === 38 || element.ActionId === 53 ||
          element.ActionId === 55) {
          element.generateNewIds();            
        }
      });
    }
  };

  return LoopThroughDocumentsModel;
}

LoopThroughDocumentsModel.$inject = ['BaseModel', 'ActionSetModel', 'ComplexValueModel'];
