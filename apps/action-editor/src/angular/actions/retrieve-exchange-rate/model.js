import template from "./tmpl.html";

export default function RetrieveExchangeRateModel(
  BaseModel,
  guidSvc,
  ResultToSetModel,
  ControlModel,
  ComplexValueModel
) {
  function RetrieveExchangeRateModel(data) {
    this.ResultToSet = new ResultToSetModel();
    this.ControlToUpdate = null;
    this.CurrencyCode = new ComplexValueModel({
      ValueType: 6,
      Value: "CompanyAccountCurrency"
    });
    this.AsOfDate = new ComplexValueModel({
      ValueType: 6,
      Value: "CurrentDateTime"
    });
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data === undefined) {
      this.ResultToSet = new ResultToSetModel();
      this.ControlToUpdate = null;
      this.CurrencyCode = new ComplexValueModel({
        ValueType: 6,
        Value: "CompanyAccountCurrency"
      });
      this.AsOfDate = new ComplexValueModel({
        ValueType: 6,
        Value: "CurrentDateTime"
      });
    } else {
      var self = this;
      self.ControlToUpdate = data.ControlToUpdate
        ? new ControlModel(data.ControlToUpdate)
        : data.ControlToUpdate;
      self.ResultToSet = data.ResultToSet
        ? new ResultToSetModel(data.ResultToSet)
        : null;
      self.AsOfDate = this.AsOfDate
        ? new ComplexValueModel(this.AsOfDate)
        : this.AsOfDate;
      self.CurrencyCode = this.CurrencyCode
        ? new ComplexValueModel(this.CurrencyCode)
        : this.CurrencyCode;
    }
  }

  RetrieveExchangeRateModel.prototype = angular.copy(BaseModel.prototype);

  RetrieveExchangeRateModel.prototype.config = {
    id: 43,
    category: "Screen",
    name: "Retrieve Exchange Rate",
    description: {
      short: "Retrieve Exchange Rate",
      long: "Obtain the specific day's exchange rate"
    },
    learnMore: [
      [
        "Learn More",
        "https://help.method.me/en/articles/2530653-retrieve-exchange-rate-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  RetrieveExchangeRateModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ResultToSet !== null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }
    return array;
  };

  RetrieveExchangeRateModel.prototype.isUsingControl = function(control) {
    var result = false;

    if (this.CurrencyCode !== null && this.CurrencyCode.ValueType === 5 && this.CurrencyCode.Value === control) {
      return true;
    }
    if (this.AsOfDate !== null && this.AsOfDate.ValueType === 5 && this.AsOfDate.Value === control) {
      return true;
    }
    if (this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return true;
    }

    return result;
  };
  RetrieveExchangeRateModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (!this.CurrencyCode.validate()) {
      this.InValid = true;
    }

    if (!this.AsOfDate.validate()) {
      this.InValid = true;
    }

    if (
      this.ControlToUpdate !== null &&
      (this.ControlToUpdate.ControlId === null ||
        this.ControlToUpdate.ControlId === guidSvc.empty)
    ) {
      self.InValid = true;
      this.ValidationMessages.Push({
        Property: "ControlId",
        Message: 100
      });
    }

    if (this.ResultToSet !== null && !this.ResultToSet.validate()) {
      self.InValid = true;
    }
  };

  return RetrieveExchangeRateModel;
};

RetrieveExchangeRateModel.$inject = [
  "BaseModel",
  "guidSvc",
  "ResultToSetModel",
  "ControlModel",
  "ComplexValueModel"
];