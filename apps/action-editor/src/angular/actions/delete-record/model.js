import template from "./tmpl.html";

export default function DeleteRecordModel(BaseModel, ResultToSetModel, $filter) {
  function DeleteRecordModel(data) {
    this.ViewNameFriendly = null;
    this.WhereClause = [];
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (this.WhereClause === null) {
      this.WhereClause = [];
    }
  }

  DeleteRecordModel.prototype = angular.copy(BaseModel.prototype);

  DeleteRecordModel.prototype.config = {
    id: 21,
    category: 'Table',
    name: 'Delete Records From Table',
    description: {
      short: 'Deletes all records in the specified table.',
      long:
        "Deletes all records in the specified table that meet the 'Where' condition. Note: if an accounting table is specified, the record will be marked for deletion, but will not actually be deleted until permission is given from your accounting software."
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623567-delete-records-from-table-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  DeleteRecordModel.prototype.validateViewNameFriendly = function() {
    var found = $filter('filter')(this.ValidationMessages, {
      Property: 'ViewNameFriendly'
    });

    if (this.ViewNameFriendly === null && found.length === 0) {
      this.ValidationMessages.push({
        Property: 'ViewNameFriendly',
        Message: 104
      });
    }

    if (this.ViewNameFriendly !== null && found.length > 0) {
      var index = this.ValidationMessages.indexOf(found[0]);
      this.ValidationMessages.splice(index, 1);
    }

    this.InValid = this.ValidationMessages.length > 0 ? true : this.InValid;
  };

  DeleteRecordModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.WhereClause, function(item) {
      if (item.Source !== null && item.Source.ValueType === 5 && item.Source.Value === control) {
        result = true;
      }
    });

    return result;
  };

  DeleteRecordModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateViewNameFriendly();

    //validate action for app routine
    DeleteRecordModel.prototype.ValidateAppRoutineAction(this);

    if (this.ViewNameFriendly !== null && this.WhereClause.length === 0) {
      if (this.WhereClause.length <= 2) {
        this.ValidationMessages = [
          {
            Property: 'WhereClause',
            Message: 116
          }
        ];
        this.InValid = true;
      }
    }
  };

  return DeleteRecordModel;
};

DeleteRecordModel.$inject = ['BaseModel', 'ResultToSetModel', '$filter'];