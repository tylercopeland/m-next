import template from './tmpl.html';

export default function LoopThroughGridModel(BaseModel, ActionSetModel, editorSvc, guidSvc) {
  function LoopThroughGridModel(data) {
    this.GridId = null;
    this.OnlyCheckedRecords = false;
    this.LoopActionSet = new ActionSetModel(data ? data.LoopActionSet : null);
    this.isReadOnly = false;

    if (data) {
      delete data.LoopActionSet;
    }

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    this.getViewName();
  }

  LoopThroughGridModel.prototype = angular.copy(BaseModel.prototype);

  LoopThroughGridModel.prototype.config = {
    id: 29,
    category: 'Grid',
    name: 'Loop Through Grid',
    description: {
      short:
        "In 'Loop Through Grid' section all subsequent actions will be processed for each record in the specified grid.",
      long: "In 'Loop Through Grid' section all subsequent actions will be processed for each record in the specified grid.",
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623512-loop-through-grid-action']],
    template: template,
    active: true,
    hasNested: true, // Only needed if this model contains a nested action set
    nestedProperties: ['LoopActionSet'], // List the property names that contain a nested action set
  };

  LoopThroughGridModel.prototype.containsActionSetId = function (actionSetId) {
    return this.LoopActionSet.ActionSetId === actionSetId ? this.LoopActionSet : false;
  };

  LoopThroughGridModel.prototype.isUsingControl = function (control) {
    var result = false;
    if (this.GridId === control) {
      return true;
    }

    return result;
  };
  LoopThroughGridModel.prototype.validate = function () {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.GridId === null || this.GridId === undefined || this.GridId === '' || this.GridId === guidSvc.empty) {
      this.ValidationMessages = [
        {
          Property: 'GridId',
          Message: 117,
        },
      ];
      this.InValid = true;
    }

    this.LoopActionSet.validate();
  };

  LoopThroughGridModel.prototype.removeSetAR = function (arList) {
    this.LoopActionSet.clearActionResult(arList);
  };

  LoopThroughGridModel.prototype.generateNewIds = function () {
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

  LoopThroughGridModel.prototype.getViewName = function () {
    this.DistinctColumn = null;
    this.ViewFriendlyName =
      this.GridId !== null && this.GridId !== guidSvc.empty ? editorSvc.getGridViewName(this.GridId) : null;
  };

  return LoopThroughGridModel;
}

LoopThroughGridModel.$inject = ['BaseModel', 'ActionSetModel', 'editorSvc', 'guidSvc'];
