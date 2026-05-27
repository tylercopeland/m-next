import template from "./tmpl.html";

export default function UpdateRecordModel(BaseModel, ComplexValueModel) {
  function UpdateRecordModel(data) {
    this.Fields = [];
    this.ViewNameFriendly = null;
    this.WhereClause = [];
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      var self = this;
      angular.forEach(this.Fields, function(obj, idx) {
        self.Fields[idx].Source = new ComplexValueModel(obj.Source);
      });
    }

    if (this.WhereClause === null) {
      this.WhereClause = [];
    }
  }

  UpdateRecordModel.prototype = angular.copy(BaseModel.prototype);

  UpdateRecordModel.prototype.config = {
    id: 6,
    category: "Table",
    name: "Update Fields In Table",
    description: {
      short:
        "Updates the value of the specified field in the specified table for all records that meet the 'Where' condition.",
      long:
        "Updates the value of the specified field in the specified table for all records that meet the 'Where' condition."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2579931-update-fields-in-table-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  UpdateRecordModel.prototype.blankSubModel = {
    Field: "",
    Source: null,
    ValidationMessages: []
  };

  UpdateRecordModel.prototype.addNewField = function() {
    var field = angular.copy(this.blankSubModel);
    field.Source = new ComplexValueModel({ ValueType: 9 });
    this.Fields.push(field);
  };

  UpdateRecordModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.Fields, function(obj) {
      if (obj.Source !== null && obj.Source.getConsumedActionResult()) {
        array.push(obj.Source.getValues());
      }
    });

    return array;
  };

  UpdateRecordModel.prototype.validateViewNameFriendly = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.ViewNameFriendly === null || this.ViewNameFriendly === "") {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: "ViewNameFriendly",
        Message: 104
      });
    }
  };

  UpdateRecordModel.prototype.isUsingControl = function(control) {
    var result = false;

    angular.forEach(this.WhereClause, function(item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    angular.forEach(this.Fields, function(item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    return result;
  };

  UpdateRecordModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateViewNameFriendly();

    if (!this.InValid) {
      if (this.WhereClause.length <= 2) {
        this.ValidationMessages.push({
          Property: "WhereClause",
          Message: 116
        });
        this.InValid = true;
      }

      //validate action for app routine
      UpdateRecordModel.prototype.ValidateAppRoutineAction(self);
      
      angular.forEach(this.Fields, function(obj) {
        obj.ValidationMessages = [];
        if (obj.Field === "") {
          self.InValid = true;
          obj.ValidationMessages.push({
            Property: "Field",
            Message: 105
          });
        }
        self.validateConsumptionPosition(obj.Source);
      });
    }
  };

  return UpdateRecordModel;
};

UpdateRecordModel.$inject = ["BaseModel", "ComplexValueModel"];