import template from './tmpl.html';

export default function ConditionalModel(BaseModel, ActionSetModel) {
  function ConditionalModel(data) {
    this.ExpressionList = [];
    this.isReadOnly = false;

    this.ActionSetOnTrue = new ActionSetModel(data ? data.ActionSetOnTrue : null);
    this.ActionSetOnFalse = new ActionSetModel(data ? data.ActionSetOnFalse : null);

    if (data) {
      delete data.ActionSetOnTrue;
    }
    if (data) {
      delete data.ActionSetOnFalse;
    }

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);
  }

  ConditionalModel.prototype = angular.copy(BaseModel.prototype);

  ConditionalModel.prototype.config = {
    id: 1,
    category: 'Advanced',
    name: 'Conditional Statement',
    description: {
      short: "Create an 'if/else' statement.",
      long: "If the 'Conditional Statement' is true, all 'IF' subsequent actions will be processed, otherwise all 'ELSE' subsequent actions will be processed.",
    },
    learnMore: [['Learn More', 'https://help.method.me/en/articles/2593853-conditional-statement-action']],
    template: template,
    active: true,
    hasNested: true,
    nestedProperties: ['ActionSetOnTrue', 'ActionSetOnFalse'],
  };

  ConditionalModel.prototype.containsActionSetId = function (actionSetId) {
    const response =
      this.ActionSetOnTrue.ActionSetId === actionSetId
        ? this.ActionSetOnTrue
        : this.ActionSetOnFalse.ActionSetId === actionSetId
          ? this.ActionSetOnFalse
          : false;
    return response;
  };

  ConditionalModel.prototype.validate = function () {
    this.InValid = false;
    this.ValidationMessages = [];
    //validate action for app routine
    ConditionalModel.prototype.ValidateAppRoutineAction(this);

    this.ActionSetOnTrue.validate();
    this.ActionSetOnFalse.validate();
  };

  ConditionalModel.prototype.removeSetAR = function (arList) {
    this.ActionSetOnTrue.clearActionResult(arList);
    this.ActionSetOnFalse.clearActionResult(arList);
  };

  ConditionalModel.prototype.isUsingControl = function (control) {
    var result = false;
    angular.forEach(this.ExpressionList, function (item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    return result;
  };

  ConditionalModel.prototype.generateNewIds = function () {
    this.ActionSetOnTrue.setNewId();
    if (Array.isArray(this.ActionSetOnTrue.Actions) && this.ActionSetOnTrue.Actions.length > 0) {
      this.ActionSetOnTrue.Actions.forEach((element) => {
        if (
          element.ActionId === 1 ||
          element.ActionId === 26 ||
          element.ActionId === 29 ||
          element.ActionId === 38 ||
          element.ActionId === 55
        ) {
          element.generateNewIds();
        }
      });
    }

    this.ActionSetOnFalse.setNewId();
    if (Array.isArray(this.ActionSetOnFalse.Actions) && this.ActionSetOnFalse.Actions.length > 0) {
      this.ActionSetOnFalse.Actions.forEach((element) => {
        if (
          element.ActionId === 1 ||
          element.ActionId === 26 ||
          element.ActionId === 29 ||
          element.ActionId === 38 ||
          element.ActionId === 55
        ) {
          element.generateNewIds();
        }
      });
    }
  };

  return ConditionalModel;
}

ConditionalModel.$inject = ['BaseModel', 'ActionSetModel'];
