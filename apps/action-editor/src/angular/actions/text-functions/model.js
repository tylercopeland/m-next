import template from "./tmpl.html";

export default function TextFunctionsModel(BaseModel, ResultToSetModel, ComplexValueModel, ControlModel) {
  function TextFunctionsModel(data) {
    this.Source = new ComplexValueModel({ ValueType: 9 });
    this.Options = null;
    this.UpdateControl = false;
    this.ControlToUpdate = null;
    this.SecondControlToUpdate = null;
    this.ResultToSet = null;
    this.SecondResultToSet = null;
    this.TextFunctionType = 5; // Default Type
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.Source = new ComplexValueModel(data.Source);
      this.ResultToSet = data.ResultToSet ? new ResultToSetModel(data.ResultToSet) : data.ResultToSet;
      this.SecondResultToSet = data.SecondResultToSet ? new ResultToSetModel(data.SecondResultToSet) : data.SecondResultToSet;
      this.ControlToUpdate = data.ControlToUpdate ? new ControlModel(data.ControlToUpdate) : data.ControlToUpdate;
      this.SecondControlToUpdate = data.SecondControlToUpdate ? new ControlModel(data.SecondControlToUpdate) : data.SecondControlToUpdate;

      if (this.Options !== null) {
        if (this.Options.TextValues) {
          this.SetupTextValueModels();
        }
        if (this.Options.EndText && this.Options.EndText !== '' && this.Options.EndText !== null) {
          this.Options.EndText = new ComplexValueModel(data.Options.EndText);
        }
        if (this.Options.Length && this.Options.Length !== '' && this.Options.Length !== null) {
          this.Options.Length = new ComplexValueModel(data.Options.Length);
        }
        if (this.Options.SearchText && this.Options.SearchText !== '' && this.Options.SearchText !== null) {
          this.Options.SearchText = new ComplexValueModel(data.Options.SearchText);
        }
        if (this.Options.StartIndex && this.Options.StartIndex !== '' && this.Options.StartIndex !== null) {
          this.Options.StartIndex = new ComplexValueModel(data.Options.StartIndex);
        }
        if (this.Options.StartText && this.Options.StartText !== '' && this.Options.StartText !== null) {
          this.Options.StartText = new ComplexValueModel(data.Options.StartText);
        }
        if (this.Options.ReplacementText && this.Options.ReplacementText !== '' && this.Options.ReplacementText !== null) {
          this.Options.ReplacementText = new ComplexValueModel(data.Options.ReplacementText);
        }
        if (this.Options.TextToReplace && this.Options.TextToReplace !== '' && this.Options.TextToReplace !== null) {
          this.Options.TextToReplace = new ComplexValueModel(data.Options.TextToReplace);
        }
        if (this.Options.ViewFriendlyName && this.Options.ViewFriendlyName !== '' && this.Options.ViewFriendlyName !== null) {
          this.Options.ViewFriendlyName = new ComplexValueModel(data.Options.ViewFriendlyName);
        }
        if (this.Options.RecordId && this.Options.RecordId !== '' && this.Options.RecordId !== null) {
          this.Options.RecordId = new ComplexValueModel(data.Options.RecordId);
        }
      }
    } else {
      this.ResultToSet = new ResultToSetModel();
      this.setupModelValues(this.TextFunctionType);
    }
  }

  TextFunctionsModel.prototype = angular.copy(BaseModel.prototype);

  TextFunctionsModel.prototype.config = {
    id: 8,
    category: 'Function',
    name: 'Character Functions',
    description: {
      short: 'This action either alters or provides information on a specified value.',
      long:
        "This action either alters or provides information on a specified value and stores the outcome in an Action Result variable that can be used in subsequent actions. For example, you may want to join two values together such as 'First Name' and 'Last Name', or you may want to find out whether a value is numeric."
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2625609-character-function-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  TextFunctionsModel.prototype.functionOptions = [
    { value: 0, label: 'Find In Json' },
    { value: 1, label: 'Find In Text' },
    { value: 2, label: 'Is Date' },
    { value: 15, label: 'Is Email Address' },
    { value: 3, label: 'Is Empty' },
    { value: 4, label: 'Is Numeric' },
    { value: 5, label: 'Join' },
    { value: 6, label: 'Left' },
    { value: 7, label: 'Right' },
    { value: 8, label: 'Middle' },
    { value: 9, label: 'Length' },
    { value: 10, label: 'Replace' },
    { value: 11, label: 'Replace Merge Fields' },
    { value: 16, label: 'Split Name' },
    { value: 12, label: 'To Lower Case' },
    { value: 13, label: 'To Upper Case' },
    { value: 14, label: 'To Title Case' }
  ];

  TextFunctionsModel.prototype.separatorOptions = [
    {
      label: 'Text',
      category: 'User Defined',
      value: ''
    },
    {
      label: 'Comma',
      category: 'Common',
      value: ','
    },
    {
      label: 'New Line',
      category: 'Common',
      value: '\\n\\r'
    },
    {
      label: 'No Separator',
      category: 'Common',
      value: ''
    },
    {
      label: 'Space',
      category: 'Common',
      value: ' '
    },
    {
      label: 'Pipe',
      category: 'Common',
      value: '|'
    }
  ];

  TextFunctionsModel.prototype.setupModelValues = function(type) {
    // Clear Split Name specific properties when switching to a different type
    if (type !== 16) {
      this.SecondResultToSet = null;
      this.SecondControlToUpdate = null;
    }

    switch (type) {
      case 0:
        this.Options = {
          SearchText: new ComplexValueModel({ ValueType: 9 })
        };
        break;
      case 1:
        this.Options = {
          SearchText: new ComplexValueModel({ ValueType: 9 }),
          StartIndex: new ComplexValueModel({ ValueType: 10, Value: 1 }),
          FindLast: false
        };
        break;
      case 2:
      case 3:
      case 4:
        this.Options = null;
        break;
      case 5:
        this.Options = {
          Separator: '',
          TextValues: []
        };
        // Requires min of two text values
        this.addJoinValue();
        this.addJoinValue();
        break;
      case 6:
      case 7:
        this.Options = {
          Length: new ComplexValueModel({ ValueType: 10, Value: 1 }),
          SearchText: null
        };
        break;
      case 8:
        this.Options = {
          Length: new ComplexValueModel({ ValueType: 10, Value: 1 }),
          StartIndex: new ComplexValueModel({ ValueType: 10, Value: 1 }),
          StartText: null,
          EndText: null
        };
        break;
      case 10:
        this.Options = {
          ReplacementText: new ComplexValueModel({ ValueType: 9 }),
          TextToReplace: new ComplexValueModel({ ValueType: 9 })
        };
        break;
      case 11:
        this.Options = {
          ViewFriendlyName: new ComplexValueModel({ ValueType: 9 }),
          RecordId: new ComplexValueModel({ ValueType: 9 })
        };
        break;
      case 16:
        this.Options = null;
        if (!this.SecondResultToSet) {
          this.SecondResultToSet = new ResultToSetModel();
        }
        break;
      default:
        this.Options = null;
        break;
    }
  };

  TextFunctionsModel.prototype.addJoinValue = function() {
    this.Options.TextValues.push(new ComplexValueModel({ ValueType: 9 }));
  };

  TextFunctionsModel.prototype.SetupTextValueModels = function() {
    const self = this;
    angular.forEach(this.Options.TextValues, function(obj, idx) {
      self.Options.TextValues[idx] = new ComplexValueModel(obj);
    });
  };

  TextFunctionsModel.prototype.getActionResultSet = function() {
    const array = [];
    if (this.ResultToSet != null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }
    if (this.SecondResultToSet != null && !this.SecondResultToSet.IsSharedResult) {
      array.push(this.SecondResultToSet.getValues());
    }

    return array;
  };

  TextFunctionsModel.prototype.getActionResultUsed = function() {
    const array = [];

    if (this.Source !== null && this.Source.getConsumedActionResult()) {
      array.push(this.Source.getValues());
    }

    if (this.Options) {
      switch (this.TextFunctionType) {
        case 0:
          if (this.Options.SearchText !== null && this.Options.SearchText.getConsumedActionResult()) {
            array.push(this.Options.SearchText.getValues());
          }
          break;
        case 1:
          if (this.Options.SearchText !== null && this.Options.SearchText.getConsumedActionResult()) {
            array.push(this.Options.SearchText.getValues());
          }
          if (this.Options.StartIndex !== null && this.Options.StartIndex.getConsumedActionResult()) {
            array.push(this.Options.StartIndex.getValues());
          }
          break;
        case 5:
          angular.forEach(this.Options.TextValues, function(obj) {
            if (obj !== null && obj.getConsumedActionResult()) {
              array.push(obj.getValues());
            }
          });
          break;
        case 6:
        case 7:
          if (this.Options.Length !== null && this.Options.Length.getConsumedActionResult()) {
            array.push(this.Options.Length.getValues());
          }
          if (this.Options.SearchText !== null && this.Options.SearchText.getConsumedActionResult()) {
            array.push(this.Options.SearchText.getValues());
          }
          break;
        case 8:
          if (this.Options.EndText !== null && this.Options.EndText.getConsumedActionResult()) {
            array.push(this.Options.EndText.getValues());
          }
          if (this.Options.Length !== null && this.Options.Length.getConsumedActionResult()) {
            array.push(this.Options.Length.getValues());
          }
          if (this.Options.StartIndex !== null && this.Options.StartIndex.getConsumedActionResult()) {
            array.push(this.Options.StartIndex.getValues());
          }
          if (this.Options.StartText !== null && this.Options.StartText.getConsumedActionResult()) {
            array.push(this.Options.StartText.getValues());
          }
          break;
        case 10:
          if (this.Options.ReplacementText !== null && this.Options.ReplacementText.getConsumedActionResult()) {
            array.push(this.Options.ReplacementText.getValues());
          }
          if (this.Options.TextToReplace !== null && this.Options.TextToReplace.getConsumedActionResult()) {
            array.push(this.Options.TextToReplace.getValues());
          }
          break;
        case 11:
          if (this.Options.ViewFriendlyName !== null && this.Options.ViewFriendlyName.getConsumedActionResult()) {
            array.push(this.Options.ViewFriendlyName.getValues());
          }
          if (this.Options.RecordId !== null && this.Options.RecordId.getConsumedActionResult()) {
            array.push(this.Options.RecordId.getValues());
          }
          break;
      }
    }

    return array;
  };

  TextFunctionsModel.prototype.isUsingControl = function(control) {
    if (this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return true;
    }
    if (this.SecondControlToUpdate !== null && this.SecondControlToUpdate.ControlId === control) {
      return true;
    }
    let result = false;

    if (this.Source !== null && this.Source.isUsingControl(control)) {
      result = true;
    }
    switch (this.TextFunctionType) {
      case 0:
        if (this.Options.SearchText.isUsingControl(control)) {
          result = true;
        }
        break;
      case 1:
        if ((this.Options.SearchText && this.Options.SearchText.isUsingControl(control)) ||
            (this.Options.StartIndex && this.Options.StartIndex.isUsingControl(control))) {
          result = true;
        }
        break;
      case 5:
        angular.forEach(this.Options.TextValues, function(obj) {
          if (obj.isUsingControl(control)) {
            result = true;
          }
        });
        break;
      case 10:
        if (this.Options.ReplacementText.isUsingControl(control)) {
          result = true;
        }

        if (this.Options.TextToReplace.isUsingControl(control)) {
          result = true;
        }
        break;
      case 11:
        if (this.Options.ViewFriendlyName.isUsingControl(control)) {
          result = true;
        }

        if (this.Options.RecordId.isUsingControl(control)) {
          result = true;
        }
        break;

    }
    return result;
  };

  TextFunctionsModel.prototype.validate = function() {
    const self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.ResultToSet != null && !this.ResultToSet.validate()) {
      this.InValid = true;
    }
    if (this.ControlToUpdate !== null && !this.ControlToUpdate.validate()) {
      this.InValid = true;
    }
    if (this.TextFunctionType === 16 && this.SecondControlToUpdate !== null && !this.SecondControlToUpdate.validate()) {
      this.InValid = true;
    }
    if (this.TextFunctionType === 16 && this.SecondResultToSet != null && !this.SecondResultToSet.validate()) {
      this.InValid = true;
    }

    switch (this.TextFunctionType) {
      case 0:
        if (!this.Options.SearchText.validate()) {
          this.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.SearchText);
        break;
      case 1:
        if (!this.Options.SearchText.validate()) {
          this.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.SearchText);

        if (!this.Options.StartIndex.validate()) {
          this.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.StartIndex);
        break;
      case 5:
        angular.forEach(this.Options.TextValues, function(obj) {
          if (!obj.validate()) {
            self.InValid = true;
          }
          self.validateConsumptionPosition(obj);
        });
        break;
      case 10:
        if (!this.Options.ReplacementText.validate()) {
          this.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.ReplacementText);

        if (!this.Options.TextToReplace.validate()) {
          this.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.TextToReplace);
        break;
      case 11:
        if (!this.Options.ViewFriendlyName.validate()) {
          this.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.ViewFriendlyName);

        if (!this.Options.RecordId.validate()) {
          this.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.RecordId);
        break;
    }
  };

  return TextFunctionsModel;
};

TextFunctionsModel.$inject = ['BaseModel', 'ResultToSetModel', 'ComplexValueModel', 'ControlModel'];