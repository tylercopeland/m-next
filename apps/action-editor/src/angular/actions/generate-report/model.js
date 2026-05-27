import template from "./tmpl.html";

export default function GenerateReportModel(
  $filter,
  BaseModel,
  ResultToSetModel,
  ComplexValueModel
) {
  function GenerateReportModel(data) {
    this.ReportName = null;
    this.ReportNameOverride = new ComplexValueModel();
    this.ReportDisplayName = new ComplexValueModel();
    this.ViewFriendlyName = null;
    this.WhereClause = [];
    this.SafeGuard = 0;
    this.ReportType = 0;
    this.DisplayReport = true;
    this.OptimizeFields = true;
    this.ResultToSet = new ResultToSetModel();
    this.isReadOnly = false;


    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data !== undefined) {
      this.ResultToSet = new ResultToSetModel(data.ResultToSet);
      this.ReportNameOverride = new ComplexValueModel(
        data.ReportNameOverride
      );
      this.ReportDisplayName = new ComplexValueModel(data.ReportDisplayName);
    }

    if (this.WhereClause === null) {
      this.WhereClause = [];
    }
  }

  GenerateReportModel.prototype = angular.copy(BaseModel.prototype);

  GenerateReportModel.prototype.config = {
    id: 20,
    category: "Report",
    name: "Generate Report",
    description: {
      short: "Generates a report based on specified filter criteria.",
      long:
        "Generates a report based on specified filter criteria and saves the report on the server. The name and location of the report is saved as an Action Result, so that it can be used later as a file attachment in a Send Email action."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623502-generate-report-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  GenerateReportModel.prototype.safeGuards = [
    {
      label: "Only generate report when filter criteria produces 1 record",
      value: 0
    },
    {
      label:
        "Only generate report when filter criteria produces 10 or fewer records",
      value: 1
    },
    {
      label:
        "Only generate report when filter criteria produces 100 or fewer records",
      value: 2
    },
    {
      label:
        "Only generate report when filter criteria produces 1,000 or fewer records",
      value: 3
    },
    {
      label:
        "Only generate report when filter criteria produces 10,000 or fewer records",
      value: 4
    },
    {
      label:
        "Only generate report when filter criteria produces 100,000 or fewer records",
      value: 5
    },
    { label: "Always generate", value: 6 }
  ];

  GenerateReportModel.prototype.reportTypes = [
    { label: "CSV", value: 7 },
    { label: "HTM", value: 1 },
    { label: "PDF", value: 0 },
    { label: "PNG", value: 2 },
    { label: "RTF", value: 3 },
    { label: "TXT", value: 6 },
    { label: "XLS", value: 4 }
  ];

  GenerateReportModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ResultToSet != null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }

    return array;
  };

  GenerateReportModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (
      this.ReportNameOverride !== null &&
      this.ReportNameOverride.getConsumedActionResult()
    ) {
      array.push(this.ReportNameOverride.getValues());
    }

    return array;
  };

  GenerateReportModel.prototype.validateReportName = function() {
    var found = $filter("filter")(this.ValidationMessages, {
      Property: "ReportName"
    });

    if (this.ReportName === null && found.length === 0) {
      this.ValidationMessages.push({
        Property: "ReportName",
        Message: 112
      });
    }

    if (this.ReportName !== null && found.length > 0) {
      var index = this.ValidationMessages.indexOf(found[0]);
      this.ValidationMessages.splice(index, 1);
    }

    this.InValid = this.ValidationMessages.length > 0 ? true : this.InValid;
  };

  GenerateReportModel.prototype.validateViewFriendlyName = function() {
    var found = $filter("filter")(this.ValidationMessages, {
      Property: "ViewFriendlyName"
    });

    if (this.ViewFriendlyName === null && found.length === 0) {
      this.ValidationMessages.push({
        Property: "ViewFriendlyName",
        Message: 104
      });
    }

    if (this.ViewFriendlyName !== null && found.length > 0) {
      var index = this.ValidationMessages.indexOf(found[0]);
      this.ValidationMessages.splice(index, 1);
    }

    this.InValid = this.ValidationMessages.length > 0 ? true : this.InValid;
  };

  GenerateReportModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ExpressionList, function(item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    if (this.ReportDisplayName !== null && this.ReportDisplayName.isUsingControl(control)) {
      return true;
    }

    if (this.ReportNameOverride !== null && this.ReportNameOverride.isUsingControl(control)) {
      return true;
    }
    return result;
  };


  GenerateReportModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateReportName();

    //validate action for app routine
    GenerateReportModel.prototype.ValidateAppRoutineAction(this);

    if (this.ReportName !== null) {
      this.validateViewFriendlyName();

      //if(!this.ResultToSet.validate()) {
      //  this.InValid = true;
      //}

      if (!this.ReportNameOverride.validate()) {
        this.InValid = true;
      }
      this.validateConsumptionPosition(this.ReportNameOverride);

      if (this.WhereClause.length <= 2) {
        this.ValidationMessages.push({
          Property: "WhereClause",
          Message: 116
        });
        this.InValid = true;
      }
    }

    this.InValid = this.ValidationMessages.length > 0 ? true : this.InValid;
  };

  return GenerateReportModel;
};

GenerateReportModel.$inject = [
  "$filter",
  "BaseModel",
  "ResultToSetModel",
  "ComplexValueModel"
];