import template from './editor-tmpl.html';

export default function ActionEditorDir($q, $rootScope, $compile) {
    function link(scope, element, attr) {
        ['isReactWrapper', 'isAppRoutineEditor'].forEach(k => {
            scope[k] = attr[k] !== undefined ? attr[k] === 'true' : false;
        });

        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);
    }

    return {
        restrict: "E",
        transclude: true,
        // replace: true,
        scope: {
            isAppRoutineEditor: "=?",
            appRoutineVersion: "=?",
            triggerSave: "&",
            isReactWrapper: "=?",
            authToken: "=?",
            authTokenV2: "=?",
            copilotScreenId: "=?",
            copilotVersionId: "=?"
        },
        controller: "ActionEditorCtrl",
        link: link,
    };
};

ActionEditorDir.$inject = ["$q", "$rootScope", "$compile"];
