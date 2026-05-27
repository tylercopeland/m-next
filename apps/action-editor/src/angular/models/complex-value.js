export default function ComplexValueModel(
  $q,
  $filter,
  $injector,
  editorSvc,
  editorApiSvc,
  currentScreenSvc,
  BaseModel
) {
  function ComplexValueModel(data) {
    this.ValueType = 9;
    this.Value = "";
    this.Property = "";
    this.ValidationMessage = "";
    this.ChildProperty = null;
    this.ignoreValidation = false;
    angular.extend(this, data);
  }

   /**
      Pass additional validation

      [{ type: 9, message: xxx }]
    */

  ComplexValueModel.prototype.validate = function (requiredTypes) {
    var self = this;
    if (this.ignoreValidation) {
      this.ValidationMessage = null;
    }
    else {
      if (
        (this.ValueType === "" ||
          this.ValueType === 8) &&
        (this.Value === "" || this.Value === null)
      ) {
        this.ValidationMessage =
          this.ValueType === 8 ? 101 : 102;
      } else {
        this.ValidationMessage = null;
      }
    }

    if (requiredTypes) {
      angular.forEach(requiredTypes, function (validate) {
        if (
          self.ValueType === validate.type &&
          (self.Value === "" || self.Value === null)
        ) {
          self.ValidationMessage = validate.message;
        }
      });
    }

    if (currentScreenSvc.getOption('isAppRoutineEditor')) {
      var baseModel = new BaseModel();
      baseModel.ValidateAppRoutineAction(self);
    }

    return this.ValidationMessage === null ? true : false;
  };

  ComplexValueModel.prototype.valueTypes = [
    { value: 0, label: "Action Result", showMore: false },
    {
      value: 1,
      label: "Expression",
      showMore: true,
      category: "User Defined",
      fieldType: 0
    },
    { value: 2, label: "Loop", showMore: false },
    { value: 3, label: "Field", showMore: false },
    { value: 4, label: "Screen", showMore: false },
    { value: 5, label: "Control", showMore: false },
    { value: 6, label: "Session", showMore: false },
    { value: 7, label: "Payment Widget", showMore: false },
    {
      value: 8,
      label: "Shared Result",
      showMore: true,
      category: "User Defined"
    },
    {
      value: 9,
      label: "Text",
      showMore: true,
      category: "User Defined",
      fieldType: 0
    },
    {
      value: 10,
      label: "Number",
      showMore: true,
      category: "User Defined",
      fieldType: 1
    },
    {
      value: 11,
      label: "Date",
      showMore: true,
      category: "User Defined",
      fieldType: 3
    },
    {
      value: 12,
      label: "Yes/No",
      showMore: true,
      category: "User Defined",
      fieldType: 2
    },
    {
      value: 13,
      label: "Dynamic Dates",
      showMore: false,
      category: "Dynamic Dates",
      fieldType: 3
    },
    {
      value: 14,
      label: "Signature Component",
      showMore: false
    },
    {
      value: 15,
      label: "Address Lookup Component",
      showMore: false
    },
    {}, //Date 
    {}, //Time
    { 
      value: 18, 
      label: "Process Payments", 
      showMore: false 
    },
  ];

  ComplexValueModel.prototype.sessionOptions = function () {
    var sessionSvc;
    if ($injector.has('sessionSvc')) {
      sessionSvc = $injector.get('sessionSvc');
      console.debug(`I am "ComplexValueModel" and I found "sessionSvc" by asking $injector.`);
    } else {
      console.debug(`I am "ComplexValueModel" and I needed access to "sessionSvc" from legacy and I did not get it!`);
    }
    var session = sessionSvc?.sessionData || {};
    var values = [
        { value: "AccountName", label: "Account Name", fieldType: 0 },
        {
          value: "AccountingSoftware",
          label: "Accounting Software",
          fieldType: 0
        },
        {
          value: "BrowserWindowSize",
          label: "Browser Window Size",
          fieldType: 0
        },
        {
          value: "CurrentDateTime",
          label: "Current Date / Time",
          fieldType: 3
        },
        {
          value: "EmailContactRecordId",
          label: "Email Gadget - Contact Record ID",
          fieldType: 1
        },
        {
          value: "EmailEntityRecordId",
          label: "Email Gadget - Entity Record ID",
          fieldType: 1
        },
        {
          value: "EntityFullName",
          label: "Guest - Entity Full Name",
          fieldType: 0
        },
        {
          value: "EntityRecordID",
          label: "Guest - Entity Record ID",
          fieldType: 1
        },
        {
          value: "ContactRecordID",
          label: "Guest - Contact Record ID",
          fieldType: 1
        },
        {
          value: "MasterAdminUserRecordID",
          label: "Master Admin User Record ID",
          fieldType: 1
        },
        {
          value: "MethodIDEmail",
          label: "Method Identity Email",
          fieldType: 0
        },
        {
          value: "MethodIDName",
          label: "Method Identity Name",
          fieldType: 0
        },
        {
          value: "ActiveRecordID",
          label: "Screen Active Record ID",
          fieldType: 1
        },
        {
          value: "SharedListEntity",
          label: "Shared users - listed by Entity Record ID",
          fieldType: 1
        },
        {
          value: "SharedListSalesRep",
          label: "Shared users - listed by Sales Rep Record ID",
          fieldType: 1
        },
        {
          value: "SharedListUser",
          label: "Shared users - listed by User Record ID",
          fieldType: 1
        },
        {
          value: "UserEmailSignature",
          label: "User - Email Signature",
          fieldType: 0
        },
        { value: "UserName", label: "User - UserName", fieldType: 0 },
        { value: "UserRecordID", label: "User - Record ID", fieldType: 1 },
        { value: "UserType", label: "User - Type", fieldType: 0 },
        {
          value: "UserSalesRepInitial",
          label: "User - Sales Rep Initial",
          fieldType: 0
        },
        {
          value: "CompanyAccountCurrency",
          label: "Company Account Currency",
          fieldType: 0
        },
        {
          value: "HasAdminPermissions",
          label: "User - Has Admin Permissions",
          fieldType: 2
        },
        {
          value: "ClientIPAddress",
          label: "User - IP Address",
          fieldType: 0
        },
        {
          value: "IsPaymentConnected",
          label: "Account - Has Payments Setup",
          fieldType: 2
        },
        {
          value: "MethodMarketingEmailsEnabled",
          label: "Company - Method Marketing Emails Enabled",
          fieldType: 2
        },
        {
          value: "MethodRemainingEmails",
          label: "Company - Method Remaining Emails",
          fieldType: 1
        },
        {
          value: "CompanyEmailProvider",
          label: "Company - Email Provider",
          fieldType: 0
        },
        {
          value: "SMSRemaining",
          label: "Company - Method Remaining SMS",
          fieldType: 1
        },
        {
          value: "SMSLimit",
          label: "Company - Method Free SMS Allowance",
          fieldType: 1
        },
        {
          value: "SMSTier",
          label: "Company - Method SMS Pricing Tier",
          fieldType: 1
        },
        {
          value: "SMSEnabled",
          label: "Company - Method SMS Enabled",
          fieldType: 2
        },
        {
          value: "FreeLimit",
          label: "Company - Method Free Email Allowance",
          fieldType: 1
        },
        {
          value: "EmailTier",
          label: "Company - Method Email Pricing Tier",
          fieldType: 1
        }
      ];

    if (sessionSvc?.sessionData?.account?.accountingSoftware === 4) {
      values.push({
        value: "XeroSyncRegion",
        label: "Xero Sync Region",
        fieldType: 0
      });
    } else {
      values.push({
        value: "QuickBooksSyncRegion",
        label: "QuickBooks Sync Region",
        fieldType: 0
      });
    }

    if (session?.account?.isMultiTenant) {      
      values.push({
        value: "CurrentTenantId",
        label: "Multi-Entity - Current Entity",
        fieldType: 0
      });
      values.push({
        value: "PermittedTenantIds",
        label: "Multi-Entity - Permitted Entities",
        fieldType: 0
      });
    }

    return values;
  };

  ComplexValueModel.prototype.paymentOptions = function() {
    return [
      { 
        value: "GatewayResponse", 
        label: "Gateway Response", 
        fieldType: 0 
      },
      {
        value: "IsProcessedSuccessfully",
        label: "Is Processed Successfully?",
        fieldType: 0
      },
      {
        value: "ReferenceNumber",
        label: "Reference Number",
        fieldType: 0
      },
    ];
  };

  ComplexValueModel.prototype.dynamicDates = function () {
    return [
      { value: 0, label: "Last 7 Days", fieldType: 3 },
      { value: 1, label: "This Month", fieldType: 3 },
      { value: 2, label: "Last Month", fieldType: 3 },
      { value: 3, label: "Next Month", fieldType: 3 },
      { value: 4, label: "Last 30 Days", fieldType: 3 },
      { value: 5, label: "This Year", fieldType: 3 },
      { value: 6, label: "Last Year", fieldType: 3 },
      { value: 7, label: "Next Year", fieldType: 3 },
      { value: 8, label: "Year to Date", fieldType: 3 }
    ];
  };

  ComplexValueModel.prototype.checkIfFieldType = function (fieldType, tableName, colName) {
    var deferred = $q.defer();
    var found = $filter("filter")(
      this.valueTypes,
      { value: this.ValueType },
      true
    );

    if (found.length > 0) {
      // Value Type is found and has a fieldType property
      if (found[0].fieldType) {
        deferred.resolve(found[0].fieldType === fieldType);
      }

      // Value Type is a Field
      if (found[0].value === 3 || found[0].value === 2) {
        if (editorApiSvc.getFields(tableName).length === 0 && tableName) {
          var self = this;
          editorApiSvc.loadTableFields(tableName).then(function () {
            var field = $filter("filter")(
              editorApiSvc.getFields(tableName),
              { key: self.Value },
              true
            );
            if (field.length > 0) {
              deferred.resolve(field[0].value.fieldType === fieldType);
            }
          });
        } else {
          var field = $filter("filter")(
            editorApiSvc.getFields(tableName),
            { key: this.Value },
            true
          );
          if (field.length > 0) {
            deferred.resolve(field[0].value.fieldType === fieldType);
          }
        }
      }

      // Value Type is Session
      if (found[0].value === 6) {
        var session = $filter("filter")(
          this.sessionOptions(),
          { value: this.Value },
          true
        );
        if (session.length > 0) {
          deferred.resolve(session[0].fieldType === fieldType);
        }
      }

      // Value Type is Control
      if (found[0].value === 5) {
        var control = editorSvc.getControlById(this.Value);
        if (control.length > 0) {
          if (control[0].type === "GRD") {
            var column = $filter("filter")(
              control[0].columns,
              { name: colName },
              true
            );
            if (column.length > 0) {
              deferred.resolve(column[0].fieldType === fieldType);
            }
          }
          deferred.resolve(control[0].fieldType === fieldType);
        }
      }
    } else {
      deferred.resolve(false);
    }

    return deferred.promise;
  };

  ComplexValueModel.prototype.getConsumedActionResult = function () {
    return this.ValueType === 0 ? this : null;
  };
  ComplexValueModel.prototype.isUsingControl = function (control) {
    return this.ValueType === 5 && this.Value === control;
  };

  ComplexValueModel.prototype.getValues = function () {
    return this.Value;
  };

  ComplexValueModel.prototype.clear = function (arList) {
    if (this.ValueType === 0 && arList.indexOf(this.Value) !== -1) {
      this.ValueType = "";
      this.Value = "";
      this.Property = "";
      this.ChildProperty = null;
      this.ValidationMessage = "";
    }
  };

  ComplexValueModel.prototype.changeType = function (type) {
    this.ValueType = type;
    this.Value = "";
    this.Property = "";
    this.ChildProperty = null;
  };

  ComplexValueModel.prototype.toString = function () {
    var valueType = $filter("filter")(
      this.valueTypes,
      { value: this.ValueType },
      true
    ),
      string = valueType[0].label + ".";

    switch (this.ValueType) {
      case 0:
        string += editorSvc.getActionResultName(this.Value);
        break;
      case 1:
        break;
      case 2:
      case 3:
        string += this.Value;
        break;
      case 5:
        var control =
          this.Value !== "" && this.Value !== null
            ? editorSvc.getControlDisplayName(this.Value, this.Property)
            : "";
        if (control) {
          string += control.replace(" - ", ".");
        }
        break;
      case 6:
        string += this.Value;
        break;
      case 7:
      case 14:
      case 15:
        break;
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        string += this.Value;
        break;
    }

    return string;
  };

  return ComplexValueModel;
};

ComplexValueModel.$inject = [
  "$q",
  "$filter",
  "$injector",
  "editorSvc",
  "editorApiSvc",
  "currentScreenSvc",
  "BaseModel",
];
