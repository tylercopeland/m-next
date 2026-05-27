import template from './builder-tmpl.html';

export default function miaeCriteriaBuilder($compile, aeCriteriaBuilderModel, aeCriteriaBuilderSvc, editorSvc, currentScreenSvc, editorApiSvc) {
  function link(scope, element, _attr) {
    // console.log('miCriteriaBuilder', scope)

    // Initialize the builder
    scope.init = function (whereClause) {
      // console.log('init', whereClause);
      scope.builder = new aeCriteriaBuilderModel(whereClause);
      scope.joiners = aeCriteriaBuilderSvc.anyAll;
      scope.fieldsOnly = (scope.fieldsOnly) ? scope.fieldsOnly : false;
      editorSvc.createControlListing(currentScreenSvc.getControls());
      if (scope.tableName) {
        // Preload table fields
        editorApiSvc.getAllLoopFieldValues(scope.action.loop);
      }
      // console.debug('whereClause', scope.builder);
    };
    scope.init(scope.whereClause);

    // Object that controls the drag and drop sorting
    scope.sortConfig = {
      animation: 150,
      group: 'criteria',
      handle: '.mi-ae-drag-handle',
      disabled: false,
      scroll: true,
      filter: '.ignore-elements',
      onAdd: function (evt) {
        console.warn("item added", evt);
      },
      onUpdate: function (evt) {
        console.warn("item moved", evt);
      }
    };

    scope.conditionBtn = ' Add a condition';
    scope.updateButtonText = function () {
      scope.conditionBtn = (scope.builder.Display.items.length === 0) ? ' Add a condition' : ' Add another condition';
    };
    scope.updateButtonText();

    scope.addCondition = function (insertArray) {
      // console.log('builderDir addNewCondition', insertArray);
      scope.builder.addCondition(insertArray, null, scope.fieldsOnly);
      scope.updateButtonText();
    };

    scope.addGroup = function (insertArray) {
      // console.log('builderDir addNewGroup', insertArray);
      scope.builder.addGroup(insertArray, null, scope.fieldsOnly);
      scope.updateButtonText();
    };

    scope.$watch('builder.Display', function (curr, prev) {
      // console.info('display change');
      if (curr !== prev) {
        scope.whereClause = scope.builder.createWhereClause();
      }
      scope.updateButtonText();
    }, true);

    scope.$on("micb:refresh", function (evt, params) {
      // console.log('micb:refresh', params);
      scope.init(params.whereClause);
    });

    scope.$on("action", function () {
      // console.log('action updated', $scope.action);
    });

    scope.$watch('tableName', function (curr, prev) {
      if (curr !== prev) {
        scope.init(scope.whereClause);
      }
    });

    const linkFn = $compile(template);
    const content = linkFn(scope);
    element.append(content);
  }

  return {
    restrict: "E",
    scope: {
      action: "=",
      whereClause: "=",
      additionalValueTypes: "=?",
      fieldsOnly: "=?",
      tableName: "=",
      showDynamic: "=?",
      isReadOnly: "=?"
    },
    link: link
  };
};

miaeCriteriaBuilder.$inject = ["$compile", "aeCriteriaBuilderModel", "aeCriteriaBuilderSvc", "editorSvc", "currentScreenSvc", "editorApiSvc"];