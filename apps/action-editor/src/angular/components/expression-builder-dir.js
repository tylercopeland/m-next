import template from './expression-builder-tmpl.html';

export default function miExpressionBuilder($rootScope, $compile, ComplexValueModel) {
  function link(scope, element, attr) {

      const linkFn = $compile(template);
      const content = linkFn(scope);
      element.append(content);

    var guid = null,
      expression = {
        DateField: null,
        Operation: null,
        Source: null
      };

    scope.allow = [0, 2, 3, 5, 6, 8, 9, 10, 11, 12];
    scope.list = null;
    scope.isReadOnly = false;
    scope.title = "";
    scope.dropdown = {
      selected: 22
    };

    scope.joins = [
      { value: 22, label: '+' },
      { value: 23, label: '-' },
      { value: 25, label: '*' },
      { value: 24, label: '/' }
    ];

    scope.backFunction = function () {
      scope.layout.showExpressionBuilder = false;
    };

    scope.addItem = function () {
      var newObj = scope.blankNewObj();
      newObj.Operation = 22;
      newObj.Source = new ComplexValueModel();
      scope.list.push(newObj);
    };

    scope.removeItem = function (idx, _item) {
      scope.list.splice(idx, 1);
    };

    scope.createExpressionList = function () {
      var list = [];


      angular.forEach(scope.list, function (obj, idx) {
        var insert = null;

        if (idx > 0) {
          insert = angular.copy(expression);
          insert.Operation = (obj.Operation === 2 || obj.Operation === null) ? 22 : obj.Operation;
          list.push(insert);
        }

        insert = angular.copy(expression);
        insert.Source = angular.copy(obj.Source);

        list.push(insert);
      });

      return list;
    };

    scope.$watch('list', function (_curr, _prev) {
      $rootScope.$broadcast("mi:expression:update", {
        id: guid,
        value: scope.createExpressionList(scope.list)
      });
    }, true);

    scope.$on("mi:expression.close", function () {
      scope.backFunction();
    });

    scope.blankNewObj = function () {
      return {
        Operation: null,
        Source: null
      };
    };

    scope.$on("mi:expression", function (e, params) {
      if (params.builder === attr.builder) {
        guid = params.id;
        scope.title = (params.title) ? params.title : scope.action.Name;
        scope.list = [];

        if (params.value === '' || params.value === null) {
          scope.addItem();
        } else {

          var newObj = scope.blankNewObj();

          angular.forEach(params.value, function (obj, idx) {
            if (obj.Operation === null && idx === 0) {
              newObj.Source = new ComplexValueModel(obj.Source);
              scope.list.push(newObj);
              newObj = scope.blankNewObj();
            } else if (obj.Operation === null && idx > 0 && obj.Source !== null) {
              if (newObj.Operation === null) {
                newObj.Operation = (obj.Operation === 2 || obj.Operation === null) ? 22 : obj.Operation;
              }
              newObj.Source = new ComplexValueModel(obj.Source);
              scope.list.push(newObj);
              newObj = scope.blankNewObj();
            } else {
              newObj.Operation = (obj.Operation === 2 || obj.Operation === null) ? 22 : obj.Operation;
            }
          });
        }

        scope.layout.showExpressionBuilder = true;
        scope.tableName = attr?.tableName ?? '';
      }
    });
  };

  return {
    restrict: "E",
    link: link
  };
};

miExpressionBuilder.$inject = ["$rootScope", "$compile", "ComplexValueModel"];