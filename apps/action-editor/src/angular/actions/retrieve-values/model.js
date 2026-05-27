import template from "./tmpl.html";

export default function RetrieveValuesModel(
  BaseModel,
  guidSvc,
  ResultToSetModel,
  ControlModel
) {
  function RetrieveValuesModel(data) {
    this.ViewNameFriendly = null;
    this.WhereClause = [];
    this.AggregationType = 0;
    this.Bindings = [];
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data === undefined) {
      this.addItem();
    } else {
      var self = this;
      angular.forEach(self.Bindings, function(value, idx) {
        self.Bindings[idx].ControlToUpdate = value.ControlToUpdate
          ? new ControlModel(value.ControlToUpdate)
          : value.ControlToUpdate;
        self.Bindings[idx].ResultToSet = value.ResultToSet
          ? new ResultToSetModel(value.ResultToSet)
          : value.ResultToSet;
      });

      if (self.WhereClause === null) {
        self.WhereClause = [];
      }
    }
  }

  RetrieveValuesModel.prototype = angular.copy(BaseModel.prototype);

  RetrieveValuesModel.prototype.aggregateTypes = [
    { label: "First", value: 0 },
    { label: "Last", value: 1 },
    { label: "Minimum", value: 2 },
    { label: "Maximum", value: 3 },
    { label: "Sum", value: 4 },
    { label: "Avg", value: 5 },
    { label: "Count", value: 6 }
  ];

  RetrieveValuesModel.prototype.config = {
    id: 22,
    category: "Table",
    name: "Retrieve Values From Table",
    description: {
      short: "Takes a value from the specified field in the specified table.",
      long:
        "Takes a value from the specified field in the specified table and loads it into an Action Result variable, which can then be used in subsequent actions."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2583472-retrieve-values-from-table-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  RetrieveValuesModel.prototype.getActionResultSet = function() {
    var array = [];

    angular.forEach(this.Bindings, function(item) {
      if (item.ResultToSet !== null && !item.ResultToSet.IsSharedResult) {
        array.push(item.ResultToSet.getValues());
      }
    });

    return array;
  };

  RetrieveValuesModel.prototype.newSubModel = {
    FieldName: null,
    UpdateControl: false,
    ControlToUpdate: null,
    ResultToSet: new ResultToSetModel()
  };

  RetrieveValuesModel.prototype.addItem = function() {
    this.Bindings.push(angular.copy(this.newSubModel));
  };

  RetrieveValuesModel.prototype.validateViewNameFriendly = function() {
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

  RetrieveValuesModel.prototype.isUsingControl = function(control) {
    var result = false;

    angular.forEach(this.Bindings, function(item) {
      if (item.ControlToUpdate !== null &&  item.ControlToUpdate.ControlId === control)
      {
        result = true;
      }
    });


    angular.forEach(this.WhereClause, function(item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });


    return result;
  };

  RetrieveValuesModel.prototype.validate = function() {
    var self = this;
    self.InValid = false;
    self.ValidationMessages = [];

    self.validateViewNameFriendly();

    //validate action for app routine
    RetrieveValuesModel.prototype.ValidateAppRoutineAction(self);

    if (!self.InValid) {
      // if(this.WhereClause.length <= 2) {
      //     this.ValidationMessages = [
      //         {
      //             Property: "WhereClause",
      //             Message: 116
      //         }
      //     ];
      //     this.InValid = true;
      // }

      angular.forEach(self.Bindings, function(item) {
        item.ValidationMessages = [];
        if (
          item.ControlToUpdate !== null &&
          (item.ControlToUpdate.ControlId === null ||
            item.ControlToUpdate.ControlId === guidSvc.empty)
        ) {
          self.InValid = true;
          item.ValidationMessages.push({
            Property: "ControlId",
            Message: 100
          });
        }

        if (item.ResultToSet !== null && !item.ResultToSet.validate()) {
          self.InValid = true;
        }
      });
    }
  };

  return RetrieveValuesModel;
};

RetrieveValuesModel.$inject = [
  "BaseModel",
  "guidSvc",
  "ResultToSetModel",
  "ControlModel"
];