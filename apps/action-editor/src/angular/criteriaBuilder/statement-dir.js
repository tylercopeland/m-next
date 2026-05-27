export default function miaeCriteriaStatement(editorSvc) {
    function link(scope, _element, _attr) {
        scope.$watch('item', function () {
            // console.log('item change', scope.item);
            const start = (scope.item.length === 3) ? 0 : 1;

            const strA = editorSvc.valueObjectToString(scope.item[start].Source),
                strB = editorSvc.operatorToString(scope.item[start + 1]),
                strC = editorSvc.valueObjectToString(scope.item[start + 2].Source);

            scope.statement = (strB === "Is Empty" || strB === "Is Not Empty" || strB === "Is True" || strB === "Is False") ?
                strA + " " + strB :
                strA + " " + strB + " " + strC;
        }, true);
    }

    return {
        restrict: "E",
        replace: true,
        scope: {
            item: "=",
            myClass: "="
        },
        template: "<span class='{{ myClass }}'>{{ statement }}</span>",
        link: link
    };
};

miaeCriteriaStatement.$inject = ["editorSvc"];
