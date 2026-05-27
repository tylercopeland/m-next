export default function miCriteriaString(aeCriteriaBuilderModel) {
    function link(scope, _element, _attr) {
        scope.whereToString = "";

        scope.$watch("whereClause", function () {
            scope.whereToString = "";
            var criteria = new aeCriteriaBuilderModel(scope.whereClause);
            scope.whereToString = criteria.outputAsString();
        });
    };

    return {
        restrict: "E",
        replace: true,
        scope: {
            whereClause: "="
        },
        template: "<p class='mi-ae-padding-t-5'>{{ whereToString }}</p>",
        link: link
    };
};

miCriteriaString.$inject = ["aeCriteriaBuilderModel"];