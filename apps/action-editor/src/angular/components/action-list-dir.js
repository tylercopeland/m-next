import template from "./action-list-tmpl.html";

export default function miActionList($rootScope, $compile, editorSvc, $timeout) {
    function link(scope, element, _attr) {

        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

        scope.query = "";
        scope.showDescription = false;

        // Set category array
        scope.categories = [];

        // Load all categories
        scope.loadCategories = function () {
            scope.categories = editorSvc.getAvailableActions();
            // console.debug("Available Action Listing", scope.categories);
        };

        $timeout(function () {
            angular.element(".mi-ae-main-content-full").scrollTop(0);
            angular.element("#actionSearch").focus();
        }, 200);

        scope.loadCategories();
    };

    return {
        restrict: "E",
        scope: {
            actionIdx: "=?",
            parentId: "=?",
            switchPage: "&"
        },
        link: link
    };
};

miActionList.$inject = ["$rootScope", "$compile", "editorSvc", "$timeout"];