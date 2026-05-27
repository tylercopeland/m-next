import template from "./button-tmpl.html";

export default function miaeButton($compile) {
    function link(scope, element, _attr) {
        scope.customClass = (scope.buttonClass) ? scope.buttonClass : "blue";
        scope.customStyle = (scope.buttonStyle) ? scope.buttonStyle : "";

        scope.isRight = false;
        scope.hasIcon = false;

        if (scope.svgIconType) {
            scope.hasIcon = true;
        }

        if (scope.customClass.split(" ").includes("icon-right")) {
            scope.isRight = true;
        }

        if (scope.name) {
            scope.customClass += (scope.customClass ? " " : "") + "svg-inline-text";
        }

        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

        scope.disableButton = function () {
            scope.isLocalDisabled = true;
        };
        scope.$on("disableButton", function (event, data) {
            scope.disableButton();
        });
        scope.enableButton = function () {
            scope.isLocalDisabled = false;
        };
        scope.$on("enableButton", function (event, data) {
            scope.enableButton();
        });
    };

    return {
        restrict: "E",
        replace: true,
        scope: {
            name: "=",
            hideButton: "=?",
            buttonClass: "=?",
            buttonStyle: "=?",
            isDisabled: "=?",
            clickevent: '&',
            svgIconType: "=?",
            svgIconSize: "=?",
        },
        link: link
    };
};

miaeButton.$inject = ['$compile'];