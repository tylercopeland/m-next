import template from "./tmpl.html";

export default function CallWebServiceModel(BaseModel, ResultToSetModel, ComplexValueModel) {
  function CallWebServiceModel(data) {
    this.Url = null;
    this.Function = null;
    this.Checked = false;
    this.Params = [];
    this.ResultToSet = new ResultToSetModel();
    this.StatusCodeToSet = new ResultToSetModel();
    this.HttpMethod = 0;
    this.WebServiceType = 1;
    this.Headers = [];
    this.Payload = new ComplexValueModel({ ValueType: 9 });
    this.ContentType = 0;
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.ResultToSet = new ResultToSetModel(data.ResultToSet);
      this.StatusCodeToSet = new ResultToSetModel(data.StatusCodeToSet);
      this.Payload = new ComplexValueModel(data.Payload);

      var self = this;
      angular.forEach(data.Params, function(param, idx) {
        self.Params[idx].Value = new ComplexValueModel(param.Value);
      });

      angular.forEach(data.Headers, function(header, idx) {
        self.Headers[idx].Value = new ComplexValueModel(header.Value);
      });
    } else {
      this.addParam();
      this.addHeader();
    }
  }

  CallWebServiceModel.prototype = angular.copy(BaseModel.prototype);

  CallWebServiceModel.prototype.config = {
    id: 24,
    category: 'Advanced',
    name: 'Call Web Service',
    description: {
      short: 'You may call a web service within method. Just provide the URL.',
      long:
        'You may call a web service within method. Just provide the URL (i.e. https://webservice.com/web/service.asmx), the function name being called in the web service (i.e. MyFunctionCall) and if it returns a result, the action result which will hold the information. Add any parameters to the web service call in the order in which they are sent to the web service.'
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2629076-call-web-service-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  CallWebServiceModel.prototype.addParam = function() {
    var param = {
      Key: null,
      Value: new ComplexValueModel({ ValueType: 9 }),
      ValidationMessage: null
    };

    this.Params.push(param);
  };

  CallWebServiceModel.prototype.addHeader = function() {
    var header = {
      Key: null,
      Value: new ComplexValueModel({ ValueType: 9 }),
      ValidationMessage: null
    };

    this.Headers.push(header);
  };

  CallWebServiceModel.prototype.getActionResultSet = function() {
    var array = [];

    if (this.Checked && this.ResultToSet !== null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }

    if (this.Checked && this.StatusCodeToSet !== null && !this.StatusCodeToSet.IsSharedResult) {
      array.push(this.StatusCodeToSet.getValues());
    }

    return array;
  };

  CallWebServiceModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.Params, function(param) {
      if (param.Value !== null && param.Value.getConsumedActionResult()) {
        array.push(param.Value.getValues());
      }
    });

    angular.forEach(this.Headers, function(header) {
      if (header.Value !== null && header.Value.getConsumedActionResult()) {
        array.push(header.Value.getValues());
      }
    });

    return array;
  };

  CallWebServiceModel.prototype.isUsingControl = function(control, _actionSets) {
    var result = false;
    if (this.Params != null) {
      angular.forEach(this.Params, function(item) {
        if (item.Value !== null && item.Value.isUsingControl(control)) {
          result = true;
        }
      });
    }
    if (this.Headers) {
      angular.forEach(this.Headers, function(item) {
        if (item.Value !== null && item.Value.isUsingControl(control)) {
          result = true;
        }
      });
    }
    return result;
  };

  CallWebServiceModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.Url === '' || this.Url === null) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: 'Url',
        Message: 108
      });
    }

    if (this.Checked && (!this.ResultToSet.validate() || !this.StatusCodeToSet.validate())) {
      this.InValid = true;
    }

    angular.forEach(this.Params, function(param) {
      // Validate the model
      if (!param.Value.validate()) {
        self.InValid = true;
      }

      // Validate blank key name
      param.ValidationMessage = null;
      if (param.Key === '' || param.Key === null) {
        param.ValidationMessage = 108;
        self.InValid = true;
      }

      // Validate the consumption of this model and make sure it was set
      self.validateConsumptionPosition(param.Value);
    });

    if(this.WebServiceType === 1) {
      angular.forEach(this.Headers, function(header) {
        // Validate the model
        if (!header.Value.validate()) {
          self.InValid = true;
        }

        // Validate blank key name
        header.ValidationMessage = null;
        if (header.Key === '' || header.Key === null) {
          header.ValidationMessage = 108;
          self.InValid = true;
        }

        // Validate the consumption of this model and make sure it was set
        self.validateConsumptionPosition(header.Value);
      });        
    }

    // Validate payload only for value from text(Payload.ValueType)
    if (this.Payload.ValueType === 9 && this.Payload.Value) {
      // JSON
      if (this.ContentType === 0) {
        try {
          JSON.parse(this.Payload.Value);
        } catch (e) {
          console.warn('JSON failed validation:', e);
          this.Payload.ValidationMessage = 137;
          this.InValid = true;
        }
      }

      // XML
      if (this.ContentType === 1) {
        try {
          $.parseXML(this.Payload.Value);
        } catch (err) {
          console.warn('XML failed validation:', err);
          this.Payload.ValidationMessage = 137;
          this.InValid = true;
        }
      }
    }
  };

  return CallWebServiceModel;
};

CallWebServiceModel.$inject = ['BaseModel', 'ResultToSetModel', 'ComplexValueModel'];