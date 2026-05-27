import template from "./tmpl.html";

export default function MappingModel(
  BaseModel,
  ComplexValueModel
) {
  function MappingModel(data) {
    this.MappingAction = 0;
    this.ViewNameFriendly = null;
    this.MapWidget = null;
    this.AddressLine1 = null;
    this.AddressLine2 = null;
    this.AddressLine3 = null;
    this.City = null;
    this.State = null;
    this.PostalCode = null;
    this.Country = null;
    this.RecordIds = new ComplexValueModel({ ValueType: 9 });
    this.UpdateRouteField = null;
    this.OptimizeRoute = false;
    this.IsStartEndSpecified = false;
    this.Start = new ComplexValueModel({ ValueType: 9 });
    this.End = new ComplexValueModel({ ValueType: 9 });
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      this.RecordIds = new ComplexValueModel(data.RecordIds);
      this.Start = new ComplexValueModel(data.Start);
      this.End = new ComplexValueModel(data.End);
    }
  }

  MappingModel.prototype = angular.copy(BaseModel.prototype);

  MappingModel.prototype.config = {
    id: 47,
    category: "Advanced",
    name: "Mapping Functions",
    description: {
      short: "Mapping Functions",
      long: "Mapping Functions"
    },
    learnMore: [
      // TODO: add learn more link
      ["Learn more", "https://www.methodintegration.com/method/kb.aspx?folder=Method&id=609"]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  MappingModel.prototype.getAddressColumns = function(table) {
    var prefix = null;

    switch (table) {
      case "viewaccEntity":
      case "viewActivity":
      case "viewaccCustomer":
        prefix = "Ship";
        break;

      case "viewaccVendor":
        prefix = "Vendor";
        break;

      case "viewaccEmployee":
        prefix = "Employee";
        break;

      case "viewaccOtherName":
        prefix = "OtherName";
        break;

      default: 
        this.resetFieldsModel();
        return;
    }

    this.AddressLine1 = prefix + "AddressAddr1";
    this.AddressLine2 = prefix + "AddressAddr2";
    this.AddressLine3 = prefix + "AddressAddr3";
    this.City = prefix + "AddressCity";
    this.State = prefix + "AddressState";
    this.PostalCode = prefix + "AddressPostalCode";
    this.Country = prefix + "AddressCountry";
  };

  MappingModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (this.RecordIds.Value && this.RecordIds.getConsumedActionResult()) {
      array.push(this.RecordIds.getValues());
    }

    if (this.Start.Value && this.Start.getConsumedActionResult()) {
      array.push(this.Start.getValues());
    }

    if (this.End.Value && this.End.getConsumedActionResult()) {
      array.push(this.End.getValues());
    }

    return array;
  };

  MappingModel.prototype.resetFieldsModel = function() {
    this.AddressLine1 = null;
    this.AddressLine2 = null;
    this.AddressLine3 = null;
    this.City = null;
    this.State = null;
    this.PostalCode = null;
    this.Country = null;

    this.ValidationMessages = [];
  };

  MappingModel.prototype.isUsingControl = function(control) {
    var result = false;
    if (this.RecordIds !== null && this.RecordIds.isUsingControl(control)) {
      return true;
    }
    if (this.Start !== null && this.Start.isUsingControl(control)) {
      return true;
    }
    if (this.End !== null && this.End.isUsingControl(control)) {
      return true;
    }

    if (this.ControlToUpdate !== undefined && this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return true;
    }
    return result;
  };


  MappingModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (!this.ViewNameFriendly) {
      this.ValidationMessages.push({
        Property: "ViewNameFriendly",
        Message: 104
      });
      this.InValid = true;
    }

    if (!this.RecordIds.validate() || !this.RecordIds.Value) {
      self.InValid = true;
      this.validateConsumptionPosition(this.RecordIds);
      this.ValidationMessages.push({
        Property: "RecordIds",
        Message: 108
      });
    }

    if(this.IsStartEndSpecified) {
      if (!this.Start.validate() || !this.Start.Value) {
        self.InValid = true;
        this.validateConsumptionPosition(this.Start);
        this.ValidationMessages.push({
          Property: "Start",
          Message: 108
        });
      }

      if (!this.End.validate() || !this.End.Value) {
        self.InValid = true;
        this.validateConsumptionPosition(this.End);
        this.ValidationMessages.push({
          Property: "End",
          Message: 108
        });
      }
    }

    if (this.OptimizeRoute) {
      if (!this.UpdateRouteField) {
        self.InValid = true;
        this.ValidationMessages.push({
          Property: "UpdateRouteField",
          Message: 105
        });
      }
    }

    if (!this.AddressLine1) {
      self.InValid = true;
      this.ValidationMessages.push({
        Property: "AddressLine1",
        Message: 105
      });
    }

    if (!this.City) {
      self.InValid = true;
      this.ValidationMessages.push({
        Property: "City",
        Message: 105
      });
    }

    if (!this.Country) {
      self.InValid = true;
      this.ValidationMessages.push({
        Property: "Country",
        Message: 105
      });
    }
    
    if(this.MappingAction === 1) {
      if (!this.MapWidget) {
        self.InValid = true;
        this.ValidationMessages.push({
          Property: "MapWidget",
          Message: 100
        });
      }
    }
  };

  return MappingModel;
};

MappingModel.$inject = [
  "BaseModel",
  "ComplexValueModel"
];
