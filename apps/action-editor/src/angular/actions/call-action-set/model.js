import template from "./tmpl.html";

export default function CallActionSetModel(BaseModel, guidSvc, ComplexValueModel, ResultToSetModel, ControlModel) {
  function CallActionSetModel(data) {
    this.ActionSetId = null;
    this.AppRoutineId = null;
    this.AppRoutineVersionId = null;
    this.InputValues = [];
    this.OutputValues = [];
    this.IsSync = true;
    this.isReadOnly = false;
    this.ActionSetControl = null;
    this.ShowMessage = false;
    this.CustomMessage = null;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      var self = this;
      angular.forEach(data.InputValues, function(input, idx) {
        self.InputValues[idx].Value = new ComplexValueModel(input.Value);
      });

      angular.forEach(this.OutputValues, function(output, idx) {
        self.OutputValues[idx].Value.ResultToSet = output.Value.ResultToSet ? new ResultToSetModel(output.Value.ResultToSet) : output.Value.ResultToSet;
        self.OutputValues[idx].Value.ControlToUpdate = output.Value.ControlToUpdate ? new ControlModel(output.Value.ControlToUpdate) : output.Value.ControlToUpdate;
      });

      this.CustomMessage = data. CustomMessage? new ComplexValueModel(data.CustomMessage): null;

    }
  }

  CallActionSetModel.prototype = angular.copy(BaseModel.prototype);

  CallActionSetModel.prototype.config = {
    id: 30,
    category: 'Advanced',
    name: 'Call Routine',
    description: {
      short: 'Call Routine',
      long: 'Call Routine'
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623070-call-routine-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  CallActionSetModel.prototype.resetAppRoutineModel = function() {
    this.AppRoutineId = null;
    this.AppRoutineVersionId = null;
    this.InputValues = [];
    this.OutputValues = [];
    this.IsSync = true;
  };

  CallActionSetModel.prototype.addInputValue = function(key, value) {
    var param = {
      Key: key,
      Value: new ComplexValueModel({ ValueType: value }),
      ValidationMessage: null
    };

    this.InputValues.push(param);
  };

  CallActionSetModel.prototype.addOutputValue = function(key) {
    var model = {
      UpdateControl: false,
      ControlToUpdate: null,
      ResultToSet: new ResultToSetModel()
    };

    model.ResultToSet.addComplexValue();

    var param = {
      Key: key,
      Value: model,
      ValidationMessage: null
    };

    this.OutputValues.push(param);
  };

  CallActionSetModel.prototype.isAppRoutine = function() {
    return this.AppRoutineId && this.AppRoutineId !== guidSvc.empty;
  };

  CallActionSetModel.prototype.getActionResultSet = function() {
    var array = [];

    if (this.IsSync) {
      angular.forEach(this.OutputValues, function(outputValue) {
        if (outputValue.Value.ResultToSet && !outputValue.Value.ResultToSet.IsSharedResult) {
          array.push(outputValue.Value.ResultToSet.getValues());
        }
      });
    }

    return array;
  };

  CallActionSetModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.InputValues, function(inputValue) {
      if (inputValue.Value && inputValue.Value.getConsumedActionResult()) {
        array.push(inputValue.Value.getValues());
      }
    });

    return array;
  };

  CallActionSetModel.prototype.isUsingControl = function(control, actionSets) {
    if (this.ActionSetControl !== null && this.ActionSetControl == control) {
      return true;
    }
    if (this.ActionSetId != null) {
      var actionSetId = this.ActionSetId;
      var actionSetControl = null;
      angular.forEach(actionSets, function(action) {
        if (action.value === actionSetId) {
          actionSetControl = action.id;
        }
      });

      this.ActionSetControl = actionSetControl;
    }

    return false;
  };

  CallActionSetModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.isAppRoutine()) {
      if (this.AppRoutineId === '' || this.AppRoutineId === null) {
        this.InValid = true;
        this.ValidationMessages = [
          {
            Property: 'AppRoutineId',
            Message: 102
          }
        ];
      }

      if (this.IsSync) {
        angular.forEach(this.OutputValues, function(outputValue) {
          if (outputValue.Value.ResultToSet != null && !outputValue.Value.ResultToSet.validate()) {
            self.InValid = true;
          }

          if (outputValue.Value.ResultToSet) {
            self.validateConsumptionPosition(outputValue.Value.ResultToSet.Source);
          }

          if (outputValue.Value.ControlToUpdate !== null && !outputValue.Value.ControlToUpdate.validate()) {
            self.InValid = true;
          }
        });
      }

      angular.forEach(this.InputValues, function(inputValue) {
        // Validate the model
        if (!inputValue.Value.validate()) {
          self.InValid = true;
        }

        // Validate the consumption of this model and make sure it was set
        self.validateConsumptionPosition(inputValue.Value);
      });

      return;
    }

    if (this.ActionSetId === '' || this.ActionSetId === null) {
      this.InValid = true;
      this.ValidationMessages = [
        {
          Property: 'ActionSetId',
          Message: 102
        }
      ];
    }
  };

  return CallActionSetModel;
};

CallActionSetModel.$inject = ['BaseModel', 'guidSvc', 'ComplexValueModel', 'ResultToSetModel', 'ControlModel'];