export default function BaseModel($filter, currentScreenSvc) {
  function BaseModel(id, name) {
    this.ActionId = id;
    this.Name = name;
    this.Notes = '';
    this.Disabled = false;
    this.InValid = false;
    this.ValidationMessages = [];
  }

  BaseModel.prototype.getInfo = function () {
    return this.config;
  };

  // this logic for copy actions from screens to approutine
  // need to make sure any unsupported values be flagged as validation error
  BaseModel.prototype.ValidateAppRoutineAction = function (model) {
    if (currentScreenSvc.getOption('isAppRoutineEditor')) {
      var filter = [
        'BrowserWindowSize',
        'EmailContactRecordId',
        'EmailEntityRecordId',
        'EntityFullName',
        'EntityRecordID',
        'ContactRecordID',
        'ActiveRecordID',
      ];

      if (model.WhereClause !== undefined || model.ExpressionList !== undefined) {
        var list;

        if (model.WhereClause !== undefined) {
          list = model.WhereClause;
        } else {
          list = model.ExpressionList;
        }

        angular.forEach(list, function (obj) {
          if (obj.Source && obj.Source.ValueType === 6) {
            //session
            var check = filter.some(function (item) {
              return item === obj.Source.Value;
            });

            if (check) {
              model.InValid = true;
            }
          } else if (obj.Source && obj.Source.ValueType === 5) {
            //control
            model.InValid = true;
          }
        });
      } else {
        if (model.ValueType === 6) {
          var check = filter.some(function (item) {
            //session
            return item === model.Value;
          });

          if (check) {
            model.ValidationMessage = 138;
          }
        } else if (model.ValueType === 5) {
          //control
          model.ValidationMessage = 138;
        }
      }
    }
  };

  BaseModel.prototype.hasConsumption = function (actionResult) {
    var self = this,
      isConsumed = [];

    if (!actionResult && typeof this.getActionResultSet === 'function') {
      angular.forEach(this.getActionResultSet(), function (ar) {
        var name = self.validateConsumption(ar.id, ar.name);
        if (name) {
          isConsumed.push(name);
        }
      });
    }

    if (actionResult) {
      var name = self.validateConsumption(actionResult.ActionResultId, actionResult.ActionResultName);
      if (name) {
        isConsumed.push(name);
      }
    }
    return isConsumed.length > 0 ? isConsumed : false;
  };

  BaseModel.prototype.validateConsumption = function (id, name) {
    return this.childAr.indexOf(id) !== -1 ? name : false;
  };

  BaseModel.prototype.validateConsumptionPosition = function (obj) {
    if (obj !== null && obj.getConsumedActionResult()) {
      var found = $filter('filter')(this.parentAr, { id: obj.getValues() });
      if (found && found.length === 0) {
        obj.ValidationMessage = 106;
        this.InValid = true;
      } else {
        obj.ValidationMessage = '';
      }
    }
  };

  // Flag if actions are in a loop or are specific ones that use criteria builder and require fields
  BaseModel.prototype.flagInALoop = function (inLoop, tableName, distinctColumn) {
    var self = this;
    this.loop = {
      inLoop: inLoop ? inLoop : false,
      tableName: tableName,
      distinctColumn: distinctColumn,
    };

    // This action has nested action sets
    if (this.config.hasNested) {
      angular.forEach(this.config.nestedProperties, function (prop) {
        if (self.ActionId === 26 || self.ActionId === 38) {
          // loop through table or attachments
          inLoop = true;
          tableName = self.ActionId === 38 ? 'LoopAttachments' : self.ViewNameFriendly;
          distinctColumn = self.DistinctColumn ? self.DistinctColumn : null;
        }
        if (self.ActionId === 29) {
          // loop through grid
          inLoop = true;
          tableName = self.ViewFriendlyName;
          distinctColumn = self.DistinctColumn ? self.DistinctColumn : null;
        }
        if (self.ActionId === 55) {
          // loop through list
          inLoop = true;
          tableName = 'LoopThroughList'; // special value, not a real table
          distinctColumn = null; // Loop Through List doesn't use distinct column
        }
        self[prop].flagActionsAreInALoop(inLoop, tableName, distinctColumn);
      });
    }
  };

  BaseModel.prototype.validationPropertyExists = function (validationArray, property) {
    var found = $filter('filter')(validationArray, { Property: property });
    return found.length === 1 ? validationArray.indexOf(found[0]) : null;
  };

  BaseModel.prototype.toggleVisibility = function (isVisible) {
    if (isVisible) {
      this.config.isVisible = isVisible;
      return;
    }

    this.config.isVisible = !this.config.isVisible;
  };

  return BaseModel;
}

BaseModel.$inject = ['$filter', 'currentScreenSvc'];
