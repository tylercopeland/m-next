import template from './row-tmpl.html';

export default function miaeCriteriaRow($q, $rootScope, $timeout, $compile, aeCriteriaBuilderSvc, noSqlSvc) {
  function link(scope, element, _attr) {
    let pendingTimeout = null; // Track pending $timeout for cleanup

    scope.joiners = aeCriteriaBuilderSvc.anyAll;
    scope.operators = aeCriteriaBuilderSvc.comparisonOptions;
    scope.compare = aeCriteriaBuilderSvc.dateOptions;
    scope.showCompare = false;
    scope.showRight = true;

    const dynamicDateOptions = {
      start: 4,
      end: 5,
    };

    const complexOpts = {
      default: [0, 2, 5, 6, 7, 8, 9, 10, 11, 12],
      dynamic: [0, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    };

    scope.allow1st = scope.fieldsOnly ? [3] : [0, 2, 5, 6, 8];
    if (scope.additionalValueTypes != null) {
      scope.allow1st = [...new Set(scope.allow1st.concat(scope.additionalValueTypes))];
    }
    scope.allow2nd = complexOpts.default;

    // Object that controls the drag and drop sorting
    scope.sortConfig = {
      animation: 150,
      group: 'criteria',
      handle: '.mi-ae-drag-handle',
      disabled: false,
      scroll: true,
      filter: '.ignore-elements',
      onAdd: function (_evt) {
        // console.warn("item added", evt);
      },
      onUpdate: function (_evt) {
        // console.warn("item moved", evt);
      },
    };

    scope.addCondition = function () {
      // console.log('addNewCondition dir', scope.loopIndex);
      if (Object.prototype.hasOwnProperty.call(scope.item, 'items')) {
        scope.builder.addCondition(scope.item.items, scope.item.items.length + 1, scope.fieldsOnly);
      } else {
        scope.builder.addCondition(scope.parentArray, scope.loopIndex + 1, scope.fieldsOnly);
      }
    };

    scope.addGroup = function () {
      // console.log('addNewGroup dir', scope.loopIndex);
      scope.builder.addGroup(scope.parentArray, scope.loopIndex + 1, scope.fieldsOnly);
    };

    scope.deleteItem = function () {
      // console.log('deleteItem dir', scope.loopIndex);
      scope.builder.deleteItem(scope.parentArray, scope.loopIndex);
    };

    scope.isDateItem = function (source) {
      const deferred = $q.defer();
      const tableName = scope.tableName ? scope.tableName : scope.action.loop.tableName;
      if (tableName === 'LoopAttachments' && source.Value === 'CreatedDate') {
        deferred.resolve(true);
      } else {
        source.checkIfFieldType(3, tableName, source.Property).then(function (isDate) {
          // console.log('isDate', isDate);
          return deferred.resolve(isDate);
        });
      }
      return deferred.promise;
    };

    scope.$watch('tableName', function () {
      if (noSqlSvc.isNoSql(scope.tableName)) {
        scope.operators = aeCriteriaBuilderSvc.mongoComparisonOptions;
      } else {
        scope.operators = aeCriteriaBuilderSvc.comparisonOptions;
      }
    });

    scope.$watch(
      'item',
      function (curr, prev) {
        // console.log('item.left', curr.left, prev.left);
        // console.log('item.compare', curr.compare, prev.compare);
        // console.log('item.right', curr.right, prev.right);
        if (curr.left) {
          scope.isDateItem(curr.left.Source).then(function (compare) {
            if (
              curr.left &&
              scope.showDynamic &&
              curr.right &&
              Object.prototype.hasOwnProperty.call(curr.right, 'Source') &&
              curr.right.Source.ValueType === 13
            ) {
              scope.showCompare = false;
              curr.compare.DateField = null;
            } else {
              scope.showCompare = compare;
              curr.compare.DateField = !scope.showCompare ? null : curr.compare.DateField;
            }
          });
          scope.showRight =
            scope.item.compare.Operation === 10 ||
            scope.item.compare.Operation === 11 ||
            scope.item.compare.Operation === 20 ||
            scope.item.compare.Operation === 21
              ? false
              : true;

          if (!scope.showRight) {
            scope.showCompare = false;
          }

          if (!scope.showRight) {
            // console.log('curr.right should be null', curr.right);
            if (curr.right !== null) {
              curr.right = null;
            }
          } else {
            if (curr.right === null) {
              curr.right = scope.builder.newOperation(null, null, true, 9);
            }
          }

          // if(curr.left !== prev.left) {
          //   if(scope.showCompare && scope.showRight) {
          //     if(!scope.item.right.Source.checkIfFieldType(3)) {
          //       scope.item.right.Source.ValueType = 11;
          //       scope.item.right.Source.Value = moment().format("YYYY-MM-DD HH:mm:ss");
          //     }
          //   }
          // }
        }

        if (curr.left && scope.showDynamic) {
          scope.allow2nd =
            curr.compare.Operation >= dynamicDateOptions.start && curr.compare.Operation <= dynamicDateOptions.end
              ? complexOpts.dynamic
              : complexOpts.default;

          if (
            curr.right &&
            Object.prototype.hasOwnProperty.call(curr.right, 'Source') &&
            curr.right.Source.ValueType === 13
          ) {
            scope.showCompare = false;
            curr.compare.DateField = null;
          }

          // Reset the right hand side if switching from a dynamic date operation to a non-dynamic operation
          if (
            scope.showRight &&
            curr.compare.Operation > dynamicDateOptions.end &&
            prev.compare.Operation <= dynamicDateOptions.end
          ) {
            curr.right = scope.builder.newOperation(null, null, true, 9);
          }

          // Cancel any existing timeout before creating a new one
          // This prevents multiple broadcasts if the watcher fires rapidly
          if (pendingTimeout) {
            $timeout.cancel(pendingTimeout);
          }
          pendingTimeout = $timeout(function () {
            $rootScope.$broadcast('miae:refreshSelect');
          }, 150);
        }

        if (Object.prototype.hasOwnProperty.call(curr, 'items') && curr.items.length === 0) {
          // console.log('empty items');
          scope.deleteItem();
        }
      },
      true,
    );

    const linkFn = $compile(template);
    const content = linkFn(scope);
    element.append(content);

    // CLEANUP: Cancel pending $timeout when scope is destroyed
    // This prevents memory leaks from orphaned timeout callbacks
    scope.$on('$destroy', function() {
      if (pendingTimeout) {
        $timeout.cancel(pendingTimeout);
        pendingTimeout = null;
      }
    });
  }

  return {
    restrict: 'E',
    scope: {
      item: '=',
      action: '=',
      parentArray: '=',
      builder: '=',
      loopIndex: '=',
      additionalValueTypes: '=',
      fieldsOnly: '=',
      tableName: '=?',
      showDynamic: '=?',
      isReadOnly: '=?',
    },
    link: link,
  };
}

miaeCriteriaRow.$inject = ['$q', '$rootScope', '$timeout', '$compile', 'aeCriteriaBuilderSvc', 'noSqlSvc'];
