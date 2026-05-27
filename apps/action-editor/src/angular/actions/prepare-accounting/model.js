import template from "./tmpl.html";

export default function PrepareAccountingModel(BaseModel, $filter) {
  function PrepareAccountingModel(data) {
    this.ViewNameFriendly = null;
    this.SyncOverride = true;
    this.WhereClause = this.defaultWhere();
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );
  }

  PrepareAccountingModel.prototype = angular.copy(BaseModel.prototype);

  PrepareAccountingModel.prototype.config = {
    id: 27,
    category: "Screen",
    name: "Prepare For Accounting",
    description: {
      short:
        "Performs accounting calculations, and optionally attempts to sync the record to your accounting software.",
      long:
        "Performs accounting calculations, and optionally attempts to sync the record to your accounting software. This is useful for when you want to finalize a transaction with multiple line items, or when you want to get tax and subtotals on a partially saved transaction. Note: This is already built into Save/Update/Insert actions."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623347-prepare-for-accounting-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  PrepareAccountingModel.prototype.defaultWhere = function() {
    return [
      { Operation: 0, DateField: null, Source: null },
      {
        Operation: null,
        DateField: null,
        Source: {
          ValueType: 3,
          Value: "RecordID",
          Property: "Integer",
          ValidationMessage: null
        }
      },
      {
        Operation: 4,
        DateField: null,
        Source: {
          ValueType: 9,
          Value: "",
          Property: "",
          ValidationMessage: ""
        }
      },
      {
        Operation: null,
        DateField: null,
        Source: {
          ValueType: 6,
          Value: "ActiveRecordID",
          Property: "",
          ValidationMessage: null
        }
      },
      { Operation: 1, DateField: null, Source: null }
    ];
  };

  PrepareAccountingModel.prototype.validateViewNameFriendly = function() {
    var found = $filter("filter")(this.ValidationMessages, {
      Property: "ViewNameFriendly"
    });

    if (this.ViewNameFriendly === null && found.length === 0) {
      this.ValidationMessages.push({
        Property: "ViewNameFriendly",
        Message: 104
      });
    }

    if (this.ViewNameFriendly !== null && found.length > 0) {
      var index = this.ValidationMessages.indexOf(found[0]);
      this.ValidationMessages.splice(index, 1);
    }

    this.InValid = this.ValidationMessages.length > 0 ? true : this.InValid;
  };

  PrepareAccountingModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.WhereClause, function(item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    return result;
  };

  PrepareAccountingModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateViewNameFriendly();

    //validate action for app routine
    PrepareAccountingModel.prototype.ValidateAppRoutineAction(this);

    if (this.ViewNameFriendly !== null && this.WhereClause.length === 0) {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: "WhereClause",
        Message: 116
      });
    }

    if (!this.InValid) {
      if (this.WhereClause.length <= 2) {
        this.ValidationMessages.push({
          Property: "WhereClause",
          Message: 116
        });
        this.InValid = true;
      }
    }
  };

  return PrepareAccountingModel;
};

PrepareAccountingModel.$inject = ["BaseModel", "$filter"];