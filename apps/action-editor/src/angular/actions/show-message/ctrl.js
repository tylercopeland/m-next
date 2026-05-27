export default function ShowMessageCtrl($rootScope, $scope, $window, $filter, editorSvc, editorApiSvc, ComplexValueModel) {
  var complexModel = new ComplexValueModel(),
    cursorPosition = null;

  var loadingExtraLoopFields = false;

  $window.inputor = null;
  $scope.insertItem = new ComplexValueModel({ ValueType: "" });
  $scope.groupFilter = ['Action Result', 'Control', 'Payment Widget', 'Loop', 'Session'];
  $scope.editableMessage = null;
  $scope.allow = [0, 2, 5, 6, 7];
  $scope.selection = {
    options: [],
    dropdown: null,
    tags: []
  };
  $scope.buttonOpts = [
    { value: 'ok', label: 'OK' },
    { value: 'cancel', label: 'OK/Cancel' },
    { value: 'no', label: 'Yes/No' }
  ];

  // This is no longer needed thanks to the scope watch method for updating this value.
  // Create At.js Instance
  // var createAtJsInstance = function() {
  //   $window.inputor = angular.element("#showMessage");
  //   $window.inputor
  //     .on("keyup keydown focus click", function() {
  //       cursorPosition = angular.element("#showMessage").prop("selectionStart");
  //       createProperMessage();
  //     });
  // };

  // Convert Editable Div to Proper message format
  var createProperMessage = function () {
    var newMessage = $scope.editableMessage,
      // Get Hashtags from the newMessage, also sort them in descending order
      hashtags = newMessage.match(/(#[a-z0-9][a-z0-9\-_.]*)/ig)?.sort((a, b) => b.length - a.length);

    $scope.action.MessageParameters = [];

    // All Options sorted in descending order by hashtag string lengths
    const sortedOptions = $scope.selection.options.sort((a, b) => b.hashtag.length - a.hashtag.length);

    if (hashtags?.length > 0) {
      var optionsToReplace = [];

      // Do an initial pass to account for cases like {#actionresult.somthing...wow!!!!} and {#actionresult.somethingelse}
      angular.forEach(hashtags, (hashTag) => {
        var matchedOption = sortedOptions.find((option) => hashTag.startsWith(`#${option.hashtag}`));

        if (matchedOption && matchedOption.hashtag) {
          optionsToReplace.push(matchedOption);
        }
      });

      angular.forEach(optionsToReplace.sort((a, b) => b.hashtag.length - a.hashtag.length), (option, idx) => {
        newMessage = newMessage.replace(`#${option.hashtag}`, "{" + idx + "}");
        $scope.action.MessageParameters.push(option.source);
      });
    }

    $scope.action.Message = newMessage;
  };

  // Convert Proper message format to Editable Div
  var createEditableMessage = function () {
    var message = angular.copy($scope.action.Message);

    angular.forEach($scope.action.MessageParameters, function (param, idx) {
      var found = $filter('filter')($scope.selection.options, {
        source: {
          ValueType: param.ValueType,
          Value: param.Value,
          Property: param.Property,
          ChildProperty: param.ChildProperty
        }
      }, true);

      if (found && found.length === 1) {
        message = message.replace("{" + idx + "}", "#" + found[0].hashtag);
      }
    });

    message = message.replace("&nbsp;", " "); // Replace all escaped spaces
    $scope.editableMessage = message;
  };

  var insertHashTag = function (tag) {
    var message = $scope.editableMessage,
      newPosition = tag.length + 1 + cursorPosition;

    if (cursorPosition !== null || cursorPosition !== undefined) {
      var textBefore = message.substring(0, cursorPosition),
        textAfter = message.substring(cursorPosition, message.length);
      if (cursorPosition === 0)
        $scope.editableMessage = tag + " " + textAfter;
      else
        $scope.editableMessage = textBefore + " " + tag + " " + textAfter;
    } else {
      $scope.editableMessage = message + " " + tag;
    }

    cursorPosition = newPosition;
  }

  // Build Hashtag Options
  $scope.buildHashtagOptions = function () {
    $scope.selection.options = [];
    $scope.selection.tags = [];
    angular.forEach($scope.allow, function (valueType) {
      switch (valueType) {
        case 0:
          angular.forEach($scope.action.parentAr, function (ar) {

            var found = $filter('filter')($scope.selection.options, {
              source: {
                ValueType: 0,
                Value: ar.id
              }
            }, true);

            if (!found || found.length === 0) {
              var hashtag = "actionresult." + ar.name;
              $scope.selection.options.push({
                category: "Action Result",
                hashtag: hashtag,
                label: ar.name,
                source: new ComplexValueModel({
                  ValueType: 0,
                  Value: ar.id,
                  Property: ""
                })
              });
              $scope.selection.tags.push(hashtag);
            }
          });
          break;
        case 2:
          if ($scope.action.loop.inLoop) {
            loadingExtraLoopFields = true;
            editorApiSvc
              .getAllLoopFieldValues($scope.action.loop)
              .then(function (fields) {
                if (fields) {
                  angular.forEach(fields, function (field) {
                    var hashtag = "loop." + field.value;
                    $scope.selection.options.push({
                      category: "Loop",
                      hashtag: hashtag,
                      label: field.label,
                      source: new ComplexValueModel({
                        ValueType: 2,
                        Value: field.value,
                        Property: ""
                      })
                    });
                    $scope.selection.tags.push(hashtag);
                  });
                  loadingExtraLoopFields = false;
                  createEditableMessage();
                  // createAtJsInstance();
                }
              });
          }
          break;
        case 5:
          // Get all screen controls
          angular.forEach(editorSvc.getControlValues(['SEC', 'L-CON', 'PAY', 'DOC', 'DTF']), function (control) {
            if (control.fieldType == angular.element.mi.Constants.FieldType.CardColumn) return;

            var property = (control.property) ? "." + control.property : "",
              hashtag = "control." + control.uniqueName + property;

            if (control.type === "EDT" && control.fieldType === angular.element.mi.Constants.FieldType.Dropdown) {
              var altTag = hashtag + ".Display";
              $scope.selection.options.push({
                category: "Control",
                hashtag: altTag,
                label: control.name + " - Display",
                source: new ComplexValueModel({
                  ValueType: 5,
                  Value: control.id,
                  Property: control.property,
                  ChildProperty: "Display"
                })
              });
              $scope.selection.tags.push(altTag);
            }
            $scope.selection.options.push({
              category: "Control",
              hashtag: hashtag,
              label: control.name,
              source: new ComplexValueModel({
                ValueType: 5,
                Value: control.id,
                Property: control.property
              })
            });
            $scope.selection.tags.push(hashtag);
          });
          break;
        case 6:
          angular.forEach(complexModel.sessionOptions(), function (session) {
            var hashtag = "session." + session.value;
            $scope.selection.options.push({
              category: "Session",
              hashtag: hashtag,
              label: session.label,
              source: new ComplexValueModel({
                ValueType: 6,
                Value: session.value,
                Property: ""
              })
            });
            $scope.selection.tags.push(hashtag);
          });
          break;
        case 7:
          // Get all screen controls
          angular.forEach(editorSvc.getControlValues(['PAY'], ['PAY']), function (control) {
            var property = (control.property) ? "." + control.property : "",
              hashtag = "paymet." + control.uniqueName + property;

            $scope.selection.options.push({
              category: "Payment Widget",
              hashtag: hashtag,
              label: control.name,
              source: new ComplexValueModel({
                ValueType: 7,
                Value: control.id,
                Property: control.property
              })
            });
            $scope.selection.tags.push(hashtag);
          });
          break;
      }
    });
    createEditableMessage();
    // createAtJsInstance();
  };
  $scope.buildHashtagOptions();

  $scope.$watch('selection.dropdown', function (curr, _prev) {
    if (curr !== null) {
      $scope.selection.dropdown = null;
      insertHashTag("#" + curr.hashtag);
      createProperMessage();
    }
  }, true);

  $scope.$watch('editableMessage', function (value) {
    if (value && !loadingExtraLoopFields) {
      createProperMessage();
    }
  });

  // Watch for cursor position changes (tracks cursor movement without typing)
  var cursorTrackingInitialized = false;
  $scope.$watch(function () {
    var element = angular.element("#showMessage");
    if (element.length > 0 && !cursorTrackingInitialized) {
      element.on("keyup keydown focus click blur", function () {
        cursorPosition = angular.element("#showMessage").prop("selectionStart");
      });
      cursorTrackingInitialized = true;
    }
    return element.length > 0 ? element.prop("selectionStart") : null;
  });
};

ShowMessageCtrl.$inject = ["$rootScope", "$scope", "$window", "$filter", "editorSvc", "editorApiSvc", "ComplexValueModel"];