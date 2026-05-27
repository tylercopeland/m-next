import template from './more-options-menu-tmpl.html';
export default function miMoreOptionsMenu($rootScope, $compile, $sessionStorage) {
    function link(scope, element, attr) {

        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

        var paste = $sessionStorage["miae:copyaction"];
        scope.hasPaste = (paste);
        scope.limited = (attr.limitedVersion) ? true : false;
        scope.setId = (attr.actionSetId) ? attr.actionSetId : null;

        scope.$on("miae:hasPaste", function (evt, params) {
            scope.hasPaste = params.trigger;
        });
        
        scope.svgIconStyle = {
            display: 'block',
            float: 'left',
            backgroundColor: '#f00!important'
        };
    };

    return {
        restrict: "E",
        link: link
    };
};

miMoreOptionsMenu.$inject = ["$rootScope", "$compile", "$sessionStorage"];
