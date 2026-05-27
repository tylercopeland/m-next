import template from "./tmpl.html";

export default function ProcessPaymentsV2Model(BaseModel, ResultToSetModel, ComplexValueModel, currentScreenSvc, ProcessPaymentsModel) {
    function ProcessPaymentsV2Model(data){
        this.ActionType = null;
        this.Using = this.usingTypes[0].value;
        this.Amount = new ComplexValueModel({ ValueType: 10 });
        this.Currency = new ComplexValueModel({ ValueType: 9 });
        this.CurrencyOption = ""; 
        this.EntityId = new ComplexValueModel({ ValueType: 10 });
        this.SaveCardOption = 0; 
        this.ConfiguredPaymentMethods = 0; 
        this.IsSpecificEntity = false;
        this.StoredPayment = new ComplexValueModel({ ValueType: 10 });
        this.ReferenceNumber = new ComplexValueModel({ ValueType: 9 });
        this.ActionResultGatewayResponse = new ResultToSetModel();
        this.ActionResultSuccessOrFail = new ResultToSetModel();
        this.ActionResultReferenceNumber = new ResultToSetModel();
        this.isReadOnly = false;
        this.AppRoutineId = null;
        this.InputValues = [];
        
        angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

        ProcessPaymentsV2Model.prototype.currencies = angular.copy(ProcessPaymentsModel.prototype.defaultCurrencies);
        ProcessPaymentsV2Model.prototype.currencies.unshift({ code: "-1", title: "", label: "Dynamic Currency" });    

        if (data !== undefined) {
            this.ActionType = data.ActionType;
            this.Amount = new ComplexValueModel(data.Amount)
            this.Currency = new ComplexValueModel(data.Currency)
            this.EntityId = new ComplexValueModel(data.EntityId)
            this.SaveCardOption = data.SaveCardOption;
            this.ConfiguredPaymentMethods = data.ConfiguredPaymentMethods;
            this.IsSpecificEntity = data.IsSpecificEntity;
            this.StoredPayment = new ComplexValueModel(data.StoredPayment)
            this.ReferenceNumber = new ComplexValueModel(data.ReferenceNumber);
            this.ActionResultGatewayResponse = new ResultToSetModel(data.ActionResultGatewayResponse)
            this.ActionResultSuccessOrFail = new ResultToSetModel(data.ActionResultSuccessOrFail)
            this.ActionResultReferenceNumber = new ResultToSetModel(data.ActionResultReferenceNumber)
            this.AppRoutineId = data.AppRoutineId;
              
            var self = this;
            angular.forEach(data.InputValues, function(input, idx) {
              self.InputValues[idx].Value = new ComplexValueModel(input.Value);
            });

            if(data.IsSpecificEntity || data.Using === 1) {            
              ProcessPaymentsV2Model.prototype.currencies.unshift({ code: "-2", title: "", label: "Use Currency From Entity" });
            }  
        }
    }
    
    ProcessPaymentsV2Model.prototype = angular.copy(BaseModel.prototype);
    
    ProcessPaymentsV2Model.prototype.config = {
        id: 46,
        category: "Advanced",
        name: "Process Payment",
        description: {
            short: "Launches the payments pop-up and allows processing payments using stored payment information.",
            long: "<p>This action launches the <i>Payments</i> pop-up. It allows processing payments, securely saving payment details and using stored payment information for automated workflows like recurring payments." 
            + "</br></br>" 
            + "Note: This action does not work with legacy gateways. </p>",
        },
        learnMore: [
          ["Learn more", "https://help.method.me/en/articles/3493934-process-payment-action"]
        ],
        template: template,
        active: true,
        hasNested: false, // Only needed if this model contains a nested action set
        nestedProperties: [] // List the property names that contain a nested action set
      };

      ProcessPaymentsV2Model.prototype.txnTypes = [
        { label: "Charge", value: 0 },
        { label: "Pre-Authorization", value: 1 },
        { label: "Setup", value: 2},
        { label: "Refund", value: 3 },
        { label: "Void", value: 4 }
      ]

      ProcessPaymentsV2Model.prototype.usingTypes = [
        { label: "UI Widget", value: 0 },
        { label: "Stored Payment Details", value: 1 }
      ]

      ProcessPaymentsV2Model.prototype.handleCurrencyDropDown = function(value) {
        var currencies = ProcessPaymentsV2Model.prototype.currencies;
        if (!value) {
          ProcessPaymentsV2Model.prototype.currencies = currencies.filter(function(item) {
            return item.code !== "-2";
          });
        } else {
          var entityCurrencyExists = currencies.some(function(item) {
            return item.code === "-2";
          });
          if (!entityCurrencyExists) {
            currencies.unshift({
              code: "-2",
              title: "",
              label: "Use Currency From Entity"
            });
          }
        }
        // Reset CurrencyOption and StoredPayment
        this.CurrencyOption = "";
        this.StoredPayment = new ComplexValueModel({ ValueType: 10 });
        // If not a specific entity, reset EntityId
        if (!this.IsSpecificEntity) {
          this.EntityId = new ComplexValueModel({ ValueType: 10 });
        }
      };

      ProcessPaymentsV2Model.prototype.getActionResultUsed = function() {        
        var array = []
        
        if (this.Amount.getConsumedActionResult()) { array.push(this.Amount.getValues()); }
        if (this.EntityId.getConsumedActionResult()) { array.push(this.EntityId.getValues()); }
        if (this.StoredPayment.getConsumedActionResult()) { array.push(this.StoredPayment.getValues()); }
        if (this.ReferenceNumber.getConsumedActionResult()) { array.push(this.ReferenceNumber.getValues()); }
        
        return array
      };

      ProcessPaymentsV2Model.prototype.getActionResultSet = function() {
        var array = []
        if (this.ActionResultGatewayResponse && !this.ActionResultGatewayResponse.IsSharedResult) {
            array.push(this.ActionResultGatewayResponse.getValues())
        }

        if (this.ActionResultSuccessOrFail && !this.ActionResultSuccessOrFail.IsSharedResult) {
            array.push(this.ActionResultSuccessOrFail.getValues())
        }

        if (this.ActionResultReferenceNumber && !this.ActionResultReferenceNumber.IsSharedResult) {
            array.push(this.ActionResultReferenceNumber.getValues())
        }

        return array
      };

      ProcessPaymentsV2Model.prototype.isUsingControl = function(control) {
        var result = false;

        if (this.Amount !== null && this.Amount.ValueType === 5 && this.Amount.Value === control) {
          return true;
        }
        if (this.Currency !== null && this.Currency.ValueType === 5 && this.Currency.Value === control) {
          return true;
        }
        if (this.EntityId !== null && this.EntityId.ValueType === 5 && this.EntityId.Value === control) {
          return true;
        }
        if (this.StoredPayment !== null && this.StoredPayment.ValueType === 5 && this.StoredPayment.Value === control) {
          return true;
        }
        if (this.ReferenceNumber !== null && this.ReferenceNumber.ValueType === 5 && this.ReferenceNumber.Value === control) {
          return true;
        }
  
        return result;
      };

      ProcessPaymentsV2Model.prototype.validate = function() {
        this.InValid = false;
        this.ValidationMessages = [];

        if(this.ActionType === 2){
          this.InValid = false;

          return ProcessPaymentsV2Model
        }
        
        if (this.ActionType === null || this.ActionType === undefined) {
          this.ValidationMessages.push({
            Property: "ActionType",
            Message: 102
          });
          this.InValid = true;
        }

        // No need to validate Currency option for refund & void
        if(this.ActionType !== 3 && this.ActionType !== 4){
          if (this.CurrencyOption === null || this.CurrencyOption === "") {
            this.ValidationMessages.push({
              Property: "CurrencyOption",
              Message: 102
            });
            this.InValid = true;
          }
        }
      };

      ProcessPaymentsV2Model.prototype.isAppRoutineSet = function() {
        return this.AppRoutineId && this.AppRoutineId !== null;
      };

      ProcessPaymentsV2Model.prototype.resetAppRoutineModel = function() {
        this.AppRoutineId = null;
        this.InputValues = [];
      };

      ProcessPaymentsV2Model.prototype.addInputValue = function(key, value) {
        var param = {
          Key: key,
          Value: new ComplexValueModel({ ValueType: value }),
          ValidationMessage: null
        };
  
        this.InputValues.push(param);
      };

    return ProcessPaymentsV2Model
}

ProcessPaymentsV2Model.$inject = ["BaseModel", "ResultToSetModel", "ComplexValueModel", "currentScreenSvc", "ProcessPaymentsModel"]