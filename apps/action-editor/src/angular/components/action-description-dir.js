import template from './action-description-tmpl.html';

export default function miActionDescription($rootScope, $compile, currentScreenSvc) {
    function link(scope, element, _attr) {
        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

        scope.hideHelp = (scope.hideHelp === undefined) ? false : scope.hideHelp;
        scope.showBack = (scope.showBack) ? scope.showBack : false;

        scope.backFunction = function () {
            scope.backButton();
        };

        scope.showHelper = function ($event) {
            currentScreenSvc.sendAnalytics("Opened action help", { ActionName: scope.info.Name });

            scope.$parent.$parent.openRightPanel($event, scope.info);
        };
    };

    return {
        restrict: "E",
        replace: true,
        scope: {
            info: "=",
            hideHelp: "=?",
            showBack: "=?",
            backButton: "&?",
            altTitle: "=?",
        },
        link: link
    };
};

miActionDescription.$inject = ['$rootScope', '$compile', 'currentScreenSvc'];