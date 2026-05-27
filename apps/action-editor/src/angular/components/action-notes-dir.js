import template from './action-notes-tmpl.html';

export default function miActionNotes($rootScope, $compile) {
    function link(scope, element, _attr) {

        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

    };

    return {
        restrict: "E",
        replace: true,
        link: link
    };
};

miActionNotes.$inject = ['$rootScope', '$compile'];