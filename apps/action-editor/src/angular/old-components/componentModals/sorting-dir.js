import template from './sorting-tmpl.html';

const SortingDir = function ($rootScope, replacementEditorApiSvc, ComponentModalSvc) {

    function link(scope, element, attr) {
        console.log('SortingDir', scope);

        if (scope.filterDef.sorting === undefined) {
            scope.filterDef.sorting = [];
        }

        scope.sortButtonLabel = (scope.filterDef.sorting.length === 0) ? " Add sort criteria" : " Add another sort criteria";
        scope.fields = [];
        scope.sortOrder = [
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" }
        ];

        scope.$watch("viewName", function () {
            replacementEditorApiSvc.loadTableFields(scope.viewName);

            ComponentModalSvc
                .loadFields(scope.viewName)
                .then(function (resp) {
                    // console.log('resp', resp);
                    scope.fields = resp;
                });
        });

        scope.updateSortButton = function () {
            scope.sortButtonLabel = (scope.filterDef.sorting.length === 0) ? " Add sort criteria" : " Add another sort criteria";
        };

        scope.addSorting = function () {
            scope.filterDef.sorting.push(
                ComponentModalSvc.newSortObject(scope.fields[0].key, scope.sortOrder[0].value)
            );
            scope.updateSortButton();
            $rootScope.$emit("component:modal:autoSave");
        };

        scope.deleteSorting = function (idx) {
            scope.filterDef.sorting.splice(idx, 1);
            scope.updateSortButton();
        };
    };

    return {
        restrict: "E",
        scope: {
            filterDef: "=",
            viewName: "="
        },
        template: template,
        link: link,
    };
};
SortingDir.$inject = ['$rootScope', 'replacementEditorApiSvc', 'ComponentModalSvc'];
export default SortingDir;