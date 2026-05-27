import template from './modal-tmpl.html';

const ComponentModalDir = function () {

    function link(scope, element, attr) {
        console.debug('ComponentModalDir', scope.setBasePath);
        scope.basePath = scope.setBasePath;
    };

    return {
        restrict: "E",
        scope: {
            setBasePath: "="
        },
        template: template,
        controller: "ComponentModalCtrl",
        link: link,
    };
};

export default ComponentModalDir;