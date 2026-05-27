import template from "./tmpl.html";

export default function ProcessPaymentsModel(
  BaseModel,
  ResultToSetModel,
  ComplexValueModel,
  $filter
) {
  function ProcessPaymentsModel(data) {
    this.ActionType = this.txnTypes[0].value;
    this.PaymentTotal = new ComplexValueModel({ ValueType: 10 });
    this.Currency = "USD";
    this.PaymentWidgetName = "";
    this.PaymentGateway = new ComplexValueModel();
    this.CustomerCompany = new ComplexValueModel();
    this.Address = new ComplexValueModel();
    this.City = new ComplexValueModel();
    this.State = new ComplexValueModel();
    this.Zip = new ComplexValueModel();
    this.Country = new ComplexValueModel();
    this.Email = new ComplexValueModel();
    this.ActionResultName = new ResultToSetModel();
    this.ActionResultSuccessOrFailName = new ResultToSetModel();
    this.ActionResultOrderIdName = new ResultToSetModel();
    this.ActionResultTxnNumName = new ResultToSetModel();
    this.ActionResultErrorsName = new ResultToSetModel();
    this.UseDefaultGateway = true;
    this.UsePaymentWidget = true;
    this.isReadOnly = false;

    // Legacy credit card processing action fields
    this.PaymentType = this.paymentTypes[0].value;
    this.OrderID = new ComplexValueModel();
    this.Card = {
      CreditCardNumber: new ComplexValueModel({ ValueType: 9 }),
      CVVorTransactionID: new ComplexValueModel({ ValueType: 9 }),
      ExpiryMonth: new ComplexValueModel({ ValueType: 10 }),
      ExpiryYear: new ComplexValueModel({ ValueType: 10 }),
      CustomerName: new ComplexValueModel()
    };
    this.Cheque = {
      RoutingNumber: new ComplexValueModel({ ValueType: 10 }),
      AccountNumber: new ComplexValueModel({ ValueType: 10 }),
      CheckType: new ComplexValueModel(),
      CustomerName: new ComplexValueModel(),
      ProductID: new ComplexValueModel()
    };

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      this.PaymentTotal = new ComplexValueModel(data.PaymentTotal);
      this.PaymentGateway = new ComplexValueModel(data.PaymentGateway);
      this.CustomerCompany = new ComplexValueModel(data.CustomerCompany);
      this.Address = new ComplexValueModel(data.Address);
      this.City = new ComplexValueModel(data.City);
      this.State = new ComplexValueModel(data.State);
      this.Zip = new ComplexValueModel(data.Zip);
      this.Country = new ComplexValueModel(data.Country);
      this.Email = new ComplexValueModel(data.Email);
      this.ActionResultName = new ResultToSetModel(data.ActionResultName);
      this.ActionResultSuccessOrFailName = new ResultToSetModel(
        data.ActionResultSuccessOrFailName
      );
      this.ActionResultOrderIdName = new ResultToSetModel(
        data.ActionResultOrderIdName
      );
      this.ActionResultTxnNumName = new ResultToSetModel(
        data.ActionResultTxnNumName
      );
      this.ActionResultErrorsName = new ResultToSetModel(
        data.ActionResultErrorsName
      );
      this.OrderID = new ComplexValueModel();

      if (data.Card !== undefined && data.Card !== null) {
        this.Card.CreditCardNumber = new ComplexValueModel(
          data.Card.CreditCardNumber
        );
        this.Card.CVVorTransactionID = new ComplexValueModel(
          data.Card.CVVorTransactionID
        );
        this.Card.ExpiryMonth = new ComplexValueModel(data.Card.ExpiryMonth);
        this.Card.ExpiryYear = new ComplexValueModel(data.Card.ExpiryYear);
        this.Card.CustomerName = new ComplexValueModel(
          data.Card.CustomerName
        );
      }

      if (data.Card === null) {
        this.Card = {
          CreditCardNumber: new ComplexValueModel({ ValueType: 9 }),
          CVVorTransactionID: new ComplexValueModel({ ValueType: 9 }),
          ExpiryMonth: new ComplexValueModel({ ValueType: 10 }),
          ExpiryYear: new ComplexValueModel({ ValueType: 10 }),
          CustomerName: new ComplexValueModel()
        };
      }

      if (data.Cheque !== undefined && data.Cheque !== null) {
        this.Cheque.RoutingNumber = new ComplexValueModel(
          data.Cheque.RoutingNumber
        );
        this.Cheque.AccountNumber = new ComplexValueModel(
          data.Cheque.AccountNumber
        );
        this.Cheque.CheckType = new ComplexValueModel(data.Cheque.CheckType);
        this.Cheque.CustomerName = new ComplexValueModel(
          data.Cheque.CustomerName
        );
        this.Cheque.ProductID = new ComplexValueModel(data.Cheque.ProductID);
      }

      if (data.Cheque === null) {
        this.Cheque = {
          RoutingNumber: new ComplexValueModel({ ValueType: 10 }),
          AccountNumber: new ComplexValueModel({ ValueType: 10 }),
          CheckType: new ComplexValueModel(),
          CustomerName: new ComplexValueModel(),
          ProductID: new ComplexValueModel()
        };
      }
    }
  }

  ProcessPaymentsModel.prototype = angular.copy(BaseModel.prototype);

  ProcessPaymentsModel.prototype.config = {
    id: 28,
    category: "Advanced",
    name: "Credit Card Processing",
    description: {
      short:
        "Performs accounting calculations, and optionally attempts to sync the record to your accounting software.",
      long:
        "Charges either a credit card or electronic check, and stores the value 'APPROVED' in the ‘Action Result Success or Fail’ if processed successfully. This can be used in a Start Conditional Statement to determine what action should be taken after the credit card has been processed. ‘Action Result’ will contain the message returned from the credit card processing company, giving the reason why the credit card failed. ‘Action Result Order ID’ returns the order number from credit card processing company. Note: you must have an existing merchant account with one of the supported processors."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2622923-credit-card-processing-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  ProcessPaymentsModel.prototype.txnTypes = [
    { label: "Charge", value: 2 },
    { label: "Refund", value: 1 },
    { label: "Void", value: 4 }
  ];

  ProcessPaymentsModel.prototype.paymentTypes = [
    { value: 1, label: "Credit Card" },
    { value: 2, label: "E Check" }
  ];

  ProcessPaymentsModel.prototype.defaultCurrencies = [
    { code: "USD", title: "$", label: "USD - U.S. Dollars" },
    { code: "AUD", title: "$", label: "AUD - Australian Dollars" },
    { code: "BRL", title: "R$", label: "BRL - Brazilian Reais" },
    { code: "GBP", title: "£", label: "GBP - British Pounds" },
    { code: "CAD", title: "$", label: "CAD - Canadian Dollars" },
    { code: "CZK", title: "", label: "CZK - Czech Koruny" },
    { code: "DKK", title: "", label: "DKK – Danish Kroner" },
    { code: "EUR", title: "€", label: "EUR - Euros" },
    { code: "HKD", title: "$", label: "HKD - Hong Kong Dollars" },
    { code: "HUF", title: "", label: "HUF - Hungarian Forints" },
    { code: "ILS", title: "₪", label: "ILS - Israeli New Shekels" },
    { code: "JPY", title: "¥", label: "JPY - Japanese Yen" },
    { code: "MXN", title: "$", label: "MXN - Mexican Pesos" },
    { code: "TWD", title: "NT$", label: "TWD - New Taiwan Dollars" },
    { code: "NZD", title: "$", label: "NZD - New Zealand Dollars" },
    { code: "NOK", title: "", label: "NOK - Norwegian Kroner" },
    { code: "PHP", title: "P", label: "PHP - Philippine Pesos" },
    { code: "PLN", title: "", label: "PLN - Polish Zlotys" },
    { code: "RUB", title: "", label: "RUB - Russian Rubles" },
    { code: "SGD", title: "$", label: "SGD - Singapore Dollars" },
    { code: "SEK", title: "", label: "SEK - Swedish Kronor" },
    { code: "CHF", title: "", label: "CHF - Swiss Francs" },
    { code: "THB", title: "฿", label: "THB - Thai Baht" }
  ];

  ProcessPaymentsModel.prototype.currencies = angular.copy(
    ProcessPaymentsModel.prototype.defaultCurrencies
  );
  ProcessPaymentsModel.prototype.currencies.unshift({
    code: "-1",
    title: "",
    label: "Use Payment Gateway Default"
  });

  ProcessPaymentsModel.prototype.clearPaymentGateway = function() {
    this.PaymentGateway.clear();
  };

  ProcessPaymentsModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ActionResultName && !this.ActionResultName.IsSharedResult) {
      array.push(this.ActionResultName.getValues());
    }

    if (
      this.ActionResultErrorsName &&
      !this.ActionResultErrorsName.IsSharedResult
    ) {
      array.push(this.ActionResultErrorsName.getValues());
    }

    if (
      this.ActionResultOrderIdName &&
      !this.ActionResultOrderIdName.IsSharedResult
    ) {
      array.push(this.ActionResultOrderIdName.getValues());
    }

    if (
      this.ActionResultTxnNumName &&
      !this.ActionResultTxnNumName.IsSharedResult
    ) {
      array.push(this.ActionResultTxnNumName.getValues());
    }

    if (
      this.ActionResultSuccessOrFailName &&
      !this.ActionResultSuccessOrFailName.IsSharedResult
    ) {
      array.push(this.ActionResultSuccessOrFailName.getValues());
    }

    return array;
  };

  ProcessPaymentsModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (this.PaymentTotal.getConsumedActionResult()) {
      array.push(this.PaymentTotal.getValues());
    }
    if (this.PaymentGateway.getConsumedActionResult()) {
      array.push(this.PaymentGateway.getValues());
    }
    if (this.CustomerCompany.getConsumedActionResult()) {
      array.push(this.CustomerCompany.getValues());
    }
    if (this.Address.getConsumedActionResult()) {
      array.push(this.Address.getValues());
    }
    if (this.City.getConsumedActionResult()) {
      array.push(this.City.getValues());
    }
    if (this.State.getConsumedActionResult()) {
      array.push(this.State.getValues());
    }
    if (this.Zip.getConsumedActionResult()) {
      array.push(this.Zip.getValues());
    }
    if (this.Country.getConsumedActionResult()) {
      array.push(this.Country.getValues());
    }
    if (this.Email.getConsumedActionResult()) {
      array.push(this.Email.getValues());
    }

    return array;
  };

  ProcessPaymentsModel.prototype.validateWidgetName = function() {
    var found = $filter("filter")(this.ValidationMessages, {
      Property: "UsePaymentWidget"
    });
    if (this.UsePaymentWidget && this.PaymentWidgetName === "") {
      this.ValidationMessages.push({
        Property: "UsePaymentWidget",
        Message: 120
      });
      this.InValid = true;
    } else {
      var index = this.ValidationMessages.indexOf(found[0]);
      this.ValidationMessages.splice(index, 1);
    }
  };

  ProcessPaymentsModel.prototype.isUsingControl = function(control) {
    var result = false;

    if (this.PaymentTotal !== null && this.PaymentTotal.isUsingControl(control)) {
      return true;
    }
    if (this.PaymentGateway !== null && this.PaymentGateway.isUsingControl(control)) {
      return true;
    }
    if (this.CustomerCompany !== null && this.CustomerCompany.isUsingControl(control)) {
      return true;
    }
    if (this.Address !== null && this.Address.isUsingControl(control)) {
      return true;
    }
    if (this.City !== null && this.City.isUsingControl(control)) {
      return true;
    }
    if (this.State !== null && this.State.isUsingControl(control)) {
      return true;
    }
    if (this.Zip !== null && this.Zip.isUsingControl(control)) {
      return true;
    }
    if (this.Country !== null && this.Country.isUsingControl(control)) {
      return true;
    }
    if (this.Email !== null && this.Email.isUsingControl(control)) {
      return true;
    }
    if (this.OrderID !== null && this.OrderID.isUsingControl(control)) {
      return true;
    }
    if (this.Card != null && this.Card.CreditCardNumber !== null && this.Card.CreditCardNumber.isUsingControl(control)) {
      return true;
    }
    if (this.Card != null && this.Card.CVVorTransactionID !== null && this.Card.CVVorTransactionID.isUsingControl(control)) {
      return true;
    }
    if (this.Card != null && this.Card.ExpiryMonth !== null && this.Card.ExpiryMonth.isUsingControl(control)) {
      return true;
    }
    if (this.Card != null && this.Card.ExpiryYear !== null && this.Card.ExpiryYear.isUsingControl(control)) {
      return true;
    }
    if (this.Card != null && this.Card.CustomerName !== null && this.Card.CustomerName.isUsingControl(control)) {
      return true;
    }
    if (this.Cheque != null && this.Cheque.RoutingNumber !== null && this.Cheque.RoutingNumber.isUsingControl(control)) {
      return true;
    }
    if (this.Cheque != null && this.Cheque.AccountNumber !== null && this.Cheque.AccountNumber.isUsingControl(control)) {
      return true;
    }
    if (this.Cheque != null && this.Cheque.CheckType !== null && this.Cheque.CheckType.isUsingControl(control)) {
      return true;
    }
    if (this.Cheque != null && this.Cheque.CustomerName !== null && this.Cheque.CustomerName.isUsingControl(control)) {
      return true;
    }
    if (this.Cheque != null && this.Cheque.ProductID !== null && this.Cheque.ProductID.isUsingControl(control)) {
      return true;
    }       
    
    return result;
  };
  ProcessPaymentsModel.prototype.validate = function() {
    var complexModelProps = [
      "PaymentTotal",
      "PaymentGateway",
      "CustomerCompany",
      "Address",
      "City",
      "State",
      "Zip",
      "Country",
      "Email",
      "OrderID",
      "Card.CreditCardNumber",
      "Card.CVVorTransactionID",
      "Card.ExpiryMonth",
      "Card.ExpiryYear",
      "Cheque.RoutingNumber",
      "Cheque.AccountNumber",
      "Cheque.CheckType",
      "Cheque.CustomerName",
      "Cheque.ProductID"
    ];
    var _this = this;
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateWidgetName();

    if (this.PaymentTotal.Value === null || this.PaymentTotal.Value === "") {
      this.ValidationMessages.push({
        Property: "PaymentTotal",
        Message: 118
      });
      this.InValid = true;
    }

    if (!this.UseDefaultGateway) {
      if (
        this.PaymentGateway.Value === null ||
        this.PaymentGateway.Value === ""
      ) {
        this.ValidationMessages.push({
          Property: "PaymentGateway",
          Message: 119
        });
        this.InValid = true;
      }
    }

    // validation for Charge and Refund
    if (
      !this.UsePaymentWidget &&
      (this.ActionType === 2 || this.ActionType === 1)
    ) {
      if (this.PaymentType === 1) {
        // credit card
        if (
          this.Card.CreditCardNumber.Value === null ||
          this.Card.CreditCardNumber.Value === ""
        ) {
          this.ValidationMessages.push({ Property: "CcNum", Message: 121 });
          this.InValid = true;
        }
        if (
          this.ActionType === 2 &&
          (this.Card.CVVorTransactionID.Value === null ||
            this.Card.CVVorTransactionID.Value === "")
        ) {
          this.ValidationMessages.push({ Property: "Cvv", Message: 124 });
          this.InValid = true;
        }
        if (
          this.Card.ExpiryMonth.Value === null ||
          this.Card.ExpiryMonth.Value === ""
        ) {
          this.ValidationMessages.push({
            Property: "ExpMonth",
            Message: 122
          });
          this.InValid = true;
        }
        if (
          this.Card.ExpiryYear.Value === null ||
          this.Card.ExpiryYear.Value === ""
        ) {
          this.ValidationMessages.push({ Property: "ExpYear", Message: 123 });
          this.InValid = true;
        }
      }

      if (this.PaymentType === 2 && this.Cheque !== null) {
        // e-check
        if (
          this.Cheque.AccountNumber.Value === null ||
          this.Cheque.AccountNumber.Value === ""
        ) {
          this.ValidationMessages.push({ Property: "Account", Message: 125 });
          this.InValid = true;
        }
        if (
          this.Cheque.RoutingNumber.Value === null ||
          this.Cheque.RoutingNumber.Value === ""
        ) {
          this.ValidationMessages.push({ Property: "Routing", Message: 126 });
          this.InValid = true;
        }
        if (
          this.Cheque.CheckType.Value === null ||
          this.Cheque.CheckType.Value === ""
        ) {
          this.ValidationMessages.push({
            Property: "CheckType",
            Message: 127
          });
          this.InValid = true;
        }
        if (
          this.Cheque.ProductID.Value === null ||
          this.Cheque.ProductID.Value === ""
        ) {
          this.ValidationMessages.push({
            Property: "ProductID",
            Message: 128
          });
          this.InValid = true;
        }
      }

      if (
        this.ActionType === 1 &&
        (this.OrderID.Value === null || this.OrderID.Value === "")
      ) {
        this.ValidationMessages.push({ Property: "OrderID", Message: 129 });
        this.InValid = true;
      }
    }

    // validation for Void
    if (!this.UsePaymentWidget && this.ActionType === 4) {
      if (
        this.PaymentType === 1 &&
        (this.Card.CVVorTransactionID.Value === null ||
          this.Card.CVVorTransactionID.Value === "")
      ) {
        this.ValidationMessages.push({ Property: "Cvv", Message: 124 });
        this.InValid = true;
      }

      if (
        this.PaymentType === 2 &&
        (this.Cheque.AccountNumber.Value === null ||
          this.Cheque.AccountNumber.Value === "")
      ) {
        this.ValidationMessages.push({ Property: "Account", Message: 125 });
        this.InValid = true;
      }

      if (this.OrderID.Value === null || this.OrderID.Value === "") {
        this.ValidationMessages.push({ Property: "OrderID", Message: 129 });
        this.InValid = true;
      }
    }

    this.InValid = !this.ActionResultName.validate() || this.InValid;
    this.InValid =
      !this.ActionResultSuccessOrFailName.validate() || this.InValid;
    this.InValid =
      (this.ActionType === 2 && !this.ActionResultTxnNumName.validate()) ||
      this.InValid;
    this.InValid =
      (this.ActionType === 2 && !this.ActionResultOrderIdName.validate()) ||
      this.InValid;
    this.InValid =
      (this.UsePaymentWidget && !this.ActionResultErrorsName.validate()) ||
      this.InValid;

    angular.forEach(complexModelProps, function(item) {
      if (
        _this[item] !== undefined &&
        _this[item] instanceof ComplexValueModel
      ) {
        _this.InValid = !_this[item].validate() || _this.InValid;
        _this.validateConsumptionPosition(_this[item]);
      }
    });
  };

  return ProcessPaymentsModel;
};

ProcessPaymentsModel.$inject = [
  "BaseModel",
  "ResultToSetModel",
  "ComplexValueModel",
  "$filter"
];