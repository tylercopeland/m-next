import { toPascalCaseRecursive } from '../old-components/utilities.js';

export default function aeCriteriaBuilderModel(ComplexValueModel, aeCriteriaBuilderSvc, $filter) {
  var defaultJoiner = aeCriteriaBuilderSvc.defaultJoiner;

  function CriteriaBuilderModel(data) {
    this.WhereClause = data;
    this.Display = (data?.length > 0) ? this.convertWhereToDisplay() 
    : {
      type: "Group",
      joiner: defaultJoiner,
      items: []
    };
  };

  CriteriaBuilderModel.prototype.newWhereObject = function (operation, dateField, source) {
    return {
      Operation: (operation !== null && operation !== undefined) ? operation : null,
      DateField: (dateField !== null && dateField !== undefined) ? dateField : null,
      Source: (source !== null && source !== undefined) ? source : null
    }
  };

  CriteriaBuilderModel.prototype.newDisplayGroup = function (joiner) {
    return {
      type: "Group",
      joiner: joiner,
      items: []
    };
  };

  CriteriaBuilderModel.prototype.newDisplayCondition = function () {
    return {
      type: "Condition",
      left: null,
      compare: null,
      right: null
    };
  };

  CriteriaBuilderModel.prototype.convertWhereToDisplay = function () {
    // console.log('CriteriaBuilderModel init');
    var self = this,
      joiner = defaultJoiner,
      counter = 0,
      clauseLength = this.WhereClause.length - 1,
      baseIndexes = [],
      rootGroup = this.newDisplayGroup(joiner),
      //currentGroup = null,
      currentGroups = [],
      condition = null;

    // Function to insert this new object based on the baseIndexes length 
    var addNewObject = function (obj) {
      var insertArray = rootGroup.items;

      baseIndexes.forEach(function (thisIdx) {
        insertArray = insertArray[thisIdx].items;
        // console.log('insertArray', insertArray);
      });

      insertArray.push(obj);

      return (insertArray.length - 1);
    };

    var pushCondition = function () {
      if (condition !== null) {
        addNewObject(condition);
        condition = null;
      }
    }

    // console.log('initialWhere', JSON.parse(JSON.stringify(this.WhereClause)));
    var clauseCase = toPascalCaseRecursive(this.WhereClause);
    // console.log('clauseCase', clauseCase);

    angular.forEach(clauseCase, function (obj, idx) {
      // console.log('newForEach', obj, counter)
      // Ignore First & Last Index
      if (idx !== 0 && idx !== clauseLength) {
        if (counter === 2 && (obj.Operation !== null && obj.Operation < 4)) {
          // console.log('push it');
          counter = 0;
          pushCondition();
        }

        // Open Operator add new group and update baseIndexes
        if (obj.Operation === 0) {
          // currentGroup = self.newDisplayGroup(defaultJoiner);
          currentGroups.push(self.newDisplayGroup(defaultJoiner));
          var newIdx = addNewObject(currentGroups[currentGroups.length - 1]);
          baseIndexes.push(newIdx);
          counter = 0;
          // console.log(currentGroup);
          pushCondition();
        }

        // Close Operator remove last entry from baseIndexes
        if (obj.Operation === 1) {
          baseIndexes.pop();
          currentGroups.pop();
          counter = 0;
          // console.log(currentGroup);
          pushCondition();
        }

        // And/Or Operator update joiner reference
        if (obj.Operation === 2 || obj.Operation === 3) {
          // console.log('rootGroup', rootGroup, condition, baseIndexes, obj.Operation);
          if (baseIndexes.length === 0) {
            rootGroup.joiner = obj.Operation;
          } else {
            currentGroups[currentGroups.length - 1].joiner = obj.Operation;
          }
          counter = 0;
          pushCondition();
        }

        // Regular item
        if (obj.Operation === null || obj.Operation >= 4) {
          var position = (counter === 0) ? 'left' : (counter === 1) ? 'compare' : 'right';

          if (counter === 0 && condition !== null) {
            // console.log('add this condition and blank it out', condition);
            pushCondition();
          }

          if (counter === 0 && condition === null) {
            // console.log('create a new condition');
            condition = self.newDisplayCondition();
          }

          var pushObj = angular.copy(obj);

          // console.log('counter', counter);
          if (counter !== 1) {
            pushObj.Source = new ComplexValueModel(obj.Source);
          }

          condition[position] = pushObj;

          if (counter === 2) {
            counter = 0;
            pushCondition();
          } else {
            counter++;
          }
        }
      }

      if (idx === clauseLength) {
        pushCondition();
      }
    });

    // console.log('rootGroup', rootGroup);
    return rootGroup;
  };

  CriteriaBuilderModel.prototype.createWhereClause = function () {
    var whereClause = [];

    // Add opening bracket
    whereClause.push(this.newWhereObject(0));

    whereClause = this.loopThroughDisplayItems(this.Display.items, this.Display.joiner, whereClause);

    whereClause.push(this.newWhereObject(1));

    // console.log('whereClause', whereClause);

    return whereClause;
  };

  CriteriaBuilderModel.prototype.outputAsString = function () {
    // console.log('CriteriaBuilderModel init');
    var string = "";
    var counter = 0,
      clauseLength = this.WhereClause.length - 1,
      hideRight = false;

    // Function to insert this new object based on the baseIndexes length 
    angular.forEach(this.WhereClause, function (obj, idx) {
      // Ignore First & Last Index
      if (idx !== 0 && idx !== clauseLength) {
        // Used for when there is nothing on the right
        if (counter === 2 && (obj.Operation !== null && obj.Operation < 4)) {
          counter = 0;
        }

        // Open Operator add new group and update baseIndexes
        if (obj.Operation === 0) {
          string += "( ";
          counter = 0;
        }

        // Close Operator remove last entry from baseIndexes
        if (obj.Operation === 1) {
          string += " )";
          counter = 0;
        }

        // And Operator
        if (obj.Operation === 2) {
          string += " AND ";
          counter = 0;
        }

        // Or Operator
        if (obj.Operation === 3) {
          string += " OR ";
          counter = 0;
        }

        // Regular item
        if (obj.Operation === null || obj.Operation >= 4) {
          var complexModel = new ComplexValueModel(obj.Source);

          // Left Side
          if (counter === 0) {
            string += complexModel.toString();
            hideRight = false;
          }

          // Compare
          if (counter === 1) {
            var compareType = $filter('filter')(aeCriteriaBuilderSvc.operators, { value: obj.Operation }, true);
            string += compareType[0].label;
            if (obj.Operation === 10 || obj.Operation === 11 || obj.Operation === 20 || obj.Operation === 21) {
              hideRight = true;
            }
          }

          if (counter === 2) {
            if (!hideRight) {
              string += complexModel.toString();
            }
            hideRight = false;
            counter = 0;
          } else {
            counter++;
          }
        }
      }
    });

    return string;
  };

  CriteriaBuilderModel.prototype.loopThroughDisplayItems = function (items, joiner, whereArray) {
    // console.log('loop', items, joiner);
    // console.group('Loop Begins');
    var self = this;

    angular.forEach(items, function (item, idx) {
      // console.log('item', item);
      if (idx !== 0) {
        // console.info("Add Joiner");
        whereArray.push(self.newWhereObject(joiner));
      }
      if (item.type === "Condition") {
        // console.info("Add Conditions");
        whereArray.push(item.left);
        whereArray.push(item.compare);
        if (item.right !== null) {
          whereArray.push(item.right);
        }
      }

      if (item.type === "Group") {
        // console.info("Insert Another Group");
        whereArray.push(self.newWhereObject(0));
        whereArray = self.loopThroughDisplayItems(item.items, item.joiner, whereArray);
        whereArray.push(self.newWhereObject(1));
      }
    });
    // console.groupEnd();

    // console.log('whereArray', whereArray);
    return whereArray
  };

  CriteriaBuilderModel.prototype.newOperation = function (operation, dateField, source, valueType) {
    return {
      Operation: operation,
      DateField: dateField,
      Source: (source) ? new ComplexValueModel({ ValueType: valueType, Value: "" }) : null
    };
  };

  CriteriaBuilderModel.prototype.addCondition = function (insertArray, position, fieldsOnly) {
    // console.log('addCondition', insertArray, position);
    var condition = this.newDisplayCondition(),
      defaultValueType = (fieldsOnly) ? 3 : 5;

    condition.left = this.newOperation(null, null, true, defaultValueType);
    condition.compare = this.newOperation(4, null, false);
    condition.right = this.newOperation(null, null, true, 9);

    if (position === null || position === undefined) {
      insertArray.push(condition);
    } else {
      insertArray.splice(position, 0, condition);
    }

    this.createWhereClause();
  };

  CriteriaBuilderModel.prototype.addGroup = function (insertArray, position, fieldsOnly) {
    // console.log('addGroup', insertArray, position);
    var newGroup = this.newDisplayGroup(defaultJoiner);
    this.addCondition(newGroup.items, null, fieldsOnly);
    // console.log('newGroup', newGroup);

    if (position === null || position === undefined) {
      insertArray.push(newGroup);
    } else {
      insertArray.splice(position, 0, newGroup);
    }

    this.createWhereClause();
  };

  CriteriaBuilderModel.prototype.deleteItem = function (insertArray, position) {
    // console.log('insertArray', insertArray, position);
    var obj = insertArray[position];
    if (Object.prototype.hasOwnProperty.call(obj, 'items')) {
      var newPosition = position;
      newPosition++;
      obj.items.forEach(function (item) {
        // console.log('item', item);
        insertArray.splice(newPosition, 0, item);
        newPosition++;
      });
    }
    insertArray.splice(position, 1);
    this.createWhereClause();
  };

  return CriteriaBuilderModel;
};

aeCriteriaBuilderModel.$inject = ["ComplexValueModel", "aeCriteriaBuilderSvc", "$filter"];
