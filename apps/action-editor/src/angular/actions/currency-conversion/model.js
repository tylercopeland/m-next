import template from "./tmpl.html";

export default function CurrencyConversionModel (BaseModel, guidSvc, ResultToSetModel, ControlModel, ComplexValueModel) {
  function CurrencyConversionModel(data) {
    this.Value = new ComplexValueModel({ ValueType: 10, Value: 1 });
    this.ExchangeRate = new ComplexValueModel({ ValueType: 10, Value: 1 });
    this.ControlToUpdate = null;
    this.ResultToSet = new ResultToSetModel();
    this.ToHomeCurrency = false;
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);
    // console.debug(this);
    if (data === undefined) {
      this.Value = new ComplexValueModel({ ValueType: 10, Value: 1 });
      this.ExchangeRate = new ComplexValueModel({ ValueType: 10, Value: 1 });
      this.ControlToUpdate = null;
      this.ResultToSet = new ResultToSetModel();
      this.ToHomeCurrency = false;
    } else {
      var self = this;
      self.Value = this.Value ? new ComplexValueModel(this.Value) : this.Value;
      self.ExchangeRate = this.ExchangeRate ? new ComplexValueModel(this.ExchangeRate) : this.ExchangeRate;
      self.ControlToUpdate = data.ControlToUpdate ? new ControlModel(data.ControlToUpdate) : data.ControlToUpdate;
      self.ResultToSet = data.ResultToSet ? new ResultToSetModel(data.ResultToSet) : data.ResultToSet;
      self.ToHomeCurrency = this.ToHomeCurrency === null ? false : this.ToHomeCurrency;
    }
  }

  CurrencyConversionModel.prototype = angular.copy(BaseModel.prototype);

  CurrencyConversionModel.prototype.config = {
    id: 44,
    category: 'Advanced',
    name: 'Calculate Currency Conversion',
    description: {
      short: "For multi-currency accounts, convert a value to, or from the company's home currency",
      long: "A simple function that applies exchange rates to, or from the company's home currency to the customer's currency"
    },
    learnMore: [['Learn More', 'https://help.method.me/en/articles/2569033-calculate-currency-conversion-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  CurrencyConversionModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ResultToSet !== null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }
    return array;
  };

  CurrencyConversionModel.prototype.isUsingControl = function(control) {
    if (this.Value !== null && this.Value.isUsingControl(control)) {
      return true;
    }
    if (this.ExchangeRate !== null && this.ExchangeRate.isUsingControl(control)) {
      return true;
    }
    if (this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return false;
    }
  };

  CurrencyConversionModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (!this.Value.validate()) {
      this.InValid = true;
    }

    if (!this.ExchangeRate.validate()) {
      this.InValid = true;
    }

    if (this.ControlToUpdate !== null && (this.ControlToUpdate.ControlId === null || this.ControlToUpdate.ControlId === guidSvc.empty)) {
      self.InValid = true;
      this.ValidationMessages.Push({
        Property: 'ControlId',
        Message: 100
      });
    }

    if (this.ResultToSet !== null && !this.ResultToSet.validate()) {
      self.InValid = true;
    }

    if (this.ToHomeCurrency === null) {
      self.InValid = true;
    }
  };

  return CurrencyConversionModel;
};

CurrencyConversionModel.$inject = ['BaseModel', 'guidSvc', 'ResultToSetModel', 'ControlModel', 'ComplexValueModel'];