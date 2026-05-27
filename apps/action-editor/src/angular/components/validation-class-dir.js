export default function miValidationClass($rootScope, editorValidationSvc) {
  function link(scope, element, _attr) {
    var validationMessages = editorValidationSvc.validationMessages;

    scope.addError = function (msg) {
      var message = '<div class="mi-ae-error-label">' + msg + '</div>';

      element.addClass("mi-ae-has-error");
      if (element.find(".mi-ae-error-label").length === 0) {
        element.append(message);
      }
    };

    scope.applyErrors = function () {
      angular.forEach(scope.miValidationClass, function (message) {
        if (message.Property === scope.errorProperty) {
          scope.addError(validationMessages[message.Message]);
        }
      });
    };

    scope.removeErrors = function () {
      element.removeClass("mi-ae-has-error");
      element.find(".mi-ae-error-label").remove();
    };

    scope.$watch('miValidationClass', function (curr, _prev) {
      scope.removeErrors();
      if (Array.isArray(curr)) {
        if (curr.length > 0) {
          scope.applyErrors();
        };
      } else {
        // Used for complex values
        if (curr !== "" && curr !== undefined && curr !== null) {
          if (Array.isArray(scope.errorProperty)) {
            if (scope.errorProperty.indexOf(curr.toString()) > -1) {
              scope.addError(validationMessages[curr]);
            }
          } else {
            if (curr.toString() === scope.errorProperty) {
              scope.addError(validationMessages[curr]);
            }
            if ((scope.errorProperty === 11 || scope.errorProperty === 8 || scope.errorProperty === 9) && curr !== "") {
              scope.addError(validationMessages[curr]);
            }
          }
        } else {
          scope.removeErrors();
        }
      }
    }, true);
  };

  return {
    restrict: "A",
    scope: {
      miValidationClass: "=",
      errorProperty: "="
    },
    link: link
  };
};

miValidationClass.$inject = ["$rootScope", "editorValidationSvc"];