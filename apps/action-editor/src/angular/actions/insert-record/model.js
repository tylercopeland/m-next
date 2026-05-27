import template from "./tmpl.html";

export default function InsertRecordModel(
  BaseModel,
  ResultToSetModel,
  ComplexValueModel
) {
  function InsertRecordModel(data) {
    this.Fields = [];
    this.ResultToSet = new ResultToSetModel();
    this.ViewNameFriendly = "";
    this.SourceRecordId = new ComplexValueModel({ ValueType: 10 });
    this.InsertType = 0;
    this.Overrides = [];
    this.FieldsToOmit = [];
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      var self = this;
      this.ResultToSet = new ResultToSetModel(data.ResultToSet);
      this.SourceRecordId = new ComplexValueModel(data.SourceRecordId);
      angular.forEach(this.Fields, function(obj, idx) {
        self.Fields[idx].Source = new ComplexValueModel(obj.Source);
      });
    }
  }

  InsertRecordModel.prototype = angular.copy(BaseModel.prototype);

  InsertRecordModel.prototype.config = {
    id: 5,
    category: "Table",
    name: "Insert Records Into Table",
    description: {
      short: "Creates new records in the specified table.",
      long:
        "Creates new records in the specified table. You can enter values into as many of the fields in the table that you desire with this one action. Take note of the required fields listed that must be inserted into the table."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623543-insert-records-into-table-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  InsertRecordModel.prototype.blankSubModel = {
    Field: "",
    Required: false,
    Source: null,
    Unique: false,
    ValidationMessages: []
  };

  InsertRecordModel.prototype.addNewField = function(
    name,
    isRequired,
    isUnique,
    valueType
  ) {
    var field = angular.copy(this.blankSubModel);
    field.Field = name ? name : "";
    field.Source = new ComplexValueModel({
      ValueType: valueType ? valueType : 9
    });
    field.Required = isRequired ? isRequired : false;
    field.Unique = isUnique ? isUnique : false;
    this.Fields.push(field);
  };

  InsertRecordModel.prototype.addNewOmittedField = function(name) {
    var field = angular.copy(this.blankSubModel);
    field.Field = name ? name : "";
    field.Required = false;
    field.Unique = false;
    this.FieldsToOmit.push(field);
  };

  InsertRecordModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ResultToSet != null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }

    return array;
  };

  InsertRecordModel.prototype.getActionResultUsed = function() {
    var array = [];

    angular.forEach(this.Fields, function(obj) {
      if (obj.Source !== null && obj.Source.getConsumedActionResult()) {
        array.push(obj.Source.getValues());
      }
    });

    return array;
  };

  InsertRecordModel.prototype.validateViewNameFriendly = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.ViewNameFriendly === null || this.ViewNameFriendly === "") {
      var index = this.validationPropertyExists(
        this.ValidationMessages,
        "ViewNameFriendly"
      );

      if (index === null) {
        this.InValid = true;
        this.ValidationMessages.push({
          Property: "ViewNameFriendly",
          Message: 104
        });
      }
    }
  };

  InsertRecordModel.prototype.validateFields = function() {
    var self = this;
    angular.forEach(this.Fields, function(obj) {
      obj.ValidationMessages = [];
      if (obj.Field === "") {
        self.InValid = true;
        obj.ValidationMessages.push({
          Property: "Field",
          Message: 105
        });
      }
    });
  };

  InsertRecordModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.Fields, function(item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    if (this.SourceRecordId !== null && this.SourceRecordId.isUsingControl(control)) {
      return true;
    }

    return result;
  };

  InsertRecordModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateViewNameFriendly();
    var self = this;

    // Only continue validation if a table was selected
    if (
      this.validationPropertyExists(
        this.ValidationMessages,
        "ViewNameFriendly"
      ) === null
    ) {
      if (!this.ResultToSet.validate()) {
        this.InValid = true;
      }

      this.validateFields();

      angular.forEach(this.Fields, function(obj) {
        self.validateConsumptionPosition(obj.Source);
      });
    }
  };

  return InsertRecordModel;
};

InsertRecordModel.$inject = [
  "BaseModel",
  "ResultToSetModel",
  "ComplexValueModel"
];