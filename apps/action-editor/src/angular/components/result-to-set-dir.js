import template from './result-to-set-tmpl.html';
export default function miResultToSet($rootScope,  $compile,  editorSvc,  guidSvc,  ControlModel,  ResultToSetModel,  renameModalSvc) {
  function link(scope, element, _attr) {
    const linkFn = $compile(template);
    const content = linkFn(scope);
    element.append(content);

    // Default configuration
    if (scope.item != null) {
      scope.inputVal = scope.item.ActionResultName;
    }

    scope.config = {
      label: scope.label ? scope.label : 'Store result in',
      storeIn: {
        options: [
          {
            label: 'Action Result',
            category: 'User Defined',
            value: '',
          },
          {
            label: 'Shared Result',
            category: 'User Defined',
            value: '',
          },
        ],
        selected: {},
        isShared: false,
        visible: scope.hideStoreIn ? !scope.hideStoreIn : true,
      },
      nameIt: {
        options: editorSvc.getSuggestedActionResults(),
      },
    };
    scope.columnWidths = scope.colWidths ? scope.colWidths : [4, 10];
    scope.secondaryCol = scope.hideStoreIn ? scope.columnWidths[1] : scope.columnWidths[1] / 2;

    // Preset Selected Values
    if (scope.controlModel === undefined || scope.controlModel === null) {
      scope.config.storeIn.selected = scope.item.IsSharedResult
        ? scope.config.storeIn.options[1]
        : scope.config.storeIn.options[0];
    }

    var getUsage = function (prev) {
      var usage = 0;
      angular.forEach(scope.config.nameIt.options, function (opt) {
        if (opt.value === prev) {
          usage = opt.usage;
        }
      });

      return usage;
    };

    scope.searchList = function (value) {
      value = value.replace(/\s/g, '');
      scope.config.nameIt.options = editorSvc.getSuggestedActionResults();
      var matches = [];

      if (value !== '') {
        var found = 0;
        angular.forEach(scope.config.nameIt.options, function (opt) {
          if (opt.label.toLowerCase().indexOf(value.toString().toLowerCase()) > -1) {
            matches.push(opt);
          }
          if (opt.label.toLowerCase() === value.toString().toLowerCase()) {
            found++;
          }
        });

        if (found === 0) {
          var newObj = {
            label: value + ' (New)',
            guid: guidSvc.create(),
            value: value,
            usage: 0,
          };
          // scope.config.nameIt.options.unshift(newObj);
          matches.unshift(newObj);
        }
      }
      return matches;
    };

    scope.storeSelected = function (selected) {
      if (selected.category === 'User Defined') {
        scope.item = new ResultToSetModel();
        scope.item.IsSharedResult = selected.label === 'Action Result' ? false : true;
        scope.controlModel = null;
        scope.$broadcast('angucomplete-alt:clearInput', 'autocomplete');
      }
      if (selected.category === 'Screen Controls') {
        scope.item = null;
        scope.controlModel = new ControlModel({
          ControlId: selected.value,
          Property: selected.property,
        });
      }
    };

    scope.selectedItem = function (value) {
      if (value !== undefined && value.originalObject) {
        value.originalObject.label = value.originalObject.label.replace(' (New)', '');
        value.title = value.title.replace(' (New)', '');
        scope.tmp = value.originalObject;

        var updateValue = function (newValue) {
          scope.item.ActionResultName = newValue.originalObject.value;
          scope.item.ActionResultId = newValue.originalObject.guid;
          scope.item.validate();
        };

        var promptForChange = function () {
          renameModalSvc.showModal({
            title: 'Rename Action Result?',
            message:"<p>We noticed that '" + scope.item.ActionResultName + "' is being used multiple times in your action list.  Would you like us to update <strong>'" + scope.item.ActionResultName + "'</strong> to <strong>'" + value.originalObject.value + "'</strong> throughout this action list?</p>",
            cancelLabel: 'Cancel',
            cancelCallback: function () {
              scope.cancelChanges();
            },
            renameHereLabel: 'Rename Here',
            renameHereCallback: function () {
              scope.renameHere();
            },
            renameAllLabel: 'Rename All (' + oldUsage + ')',
            renameAllCallback: function () {
              scope.renameAll();
            },
          });
          /*$rootScope.$broadcast("mimodal:open", {
                        title: "Rename Action Result?",
                        message: "<p>We noticed that '" + scope.item.ActionResultName + "' is being used multiple times in your action list.  Would you like us to update <strong>'" + scope.item.ActionResultName + "'</strong> to <strong>'" + value.originalObject.value + "'</strong> throughout this action list?</p>",
                        onClose: scope.cancelChanges,
                        buttons: [
                            {
                                label: "Cancel",
                                class: "mi-button blank",
                                click: scope.cancelChanges
                            },
                            {
                                label: "Rename Here",
                                class: "mi-button ghost",
                                click: scope.renameHere
                            },
                            {
                                label: "Rename All (" + oldUsage + ")",
                                class: "mi-button blue",
                                click: scope.renameAll
                            }
                        ]
                    });
                    */
        };

        // Check if the selected item already exists
        var oldUsage = getUsage(scope.item.ActionResultName);
        // This was originally blank so update
        if (scope.item.ActionResultName === value.originalObject.value) {
          return;

          // Check to see if it was used in app routine
          // This only matters if there is a live version already, because once there is a live version,
          // output values should not be changed
        } else if (scope.$parent.isAppRoutineEditor && scope.$parent.appRoutineVersion.liveVersion) {
          var outputValues = scope.$parent.appRoutineVersion.liveVersion.OutputValues;
          var matchedValue = outputValues.find((value) => scope.item.ActionResultName === value.Value);

          var canModify = true;

          if (matchedValue) {
            var matched = scope.$parent.editor.filterUsedActionSetByName(matchedValue.Value);
            canModify = matched.length > 1 || matched.length === 0;
          }

          if (!canModify) {
            $rootScope.$broadcast('mimodal:open', {
              title: 'Rename Action Result?',
              message:
                "<p>We noticed that '" +
                scope.item.ActionResultName +
                "' is being used in app routine output values.  You cannot change an action result name once it is used in the output value of a published App Routine.</p>",
              onClose: scope.cancelChanges,
              buttons: [
                {
                  label: 'OK',
                  class: 'mi-button blue',
                  click: scope.cancelChanges,
                },
              ],
            });
          } else {
            if (scope.item.ActionResultName === '' || oldUsage === 0) {
              updateValue(value);
            } else {
              promptForChange();
            }
          }
        } else if (scope.item.ActionResultName === '' || oldUsage === 0) {
          updateValue(value);

          // There was a preselection alert user of change
        } else {
          promptForChange();
        }
      }
    };

    scope.inputChanged = function (value) {
      scope.inputVal = value.replace(/\s/g, '');
    };

    scope.validateInput = function (_value) {
      if (scope.inputVal === '') {
        scope.item.ActionResultName = '';
        scope.item.ActionResultId = '';
      }
    };

    scope.renameHere = function () {
      scope.item.ActionResultName = scope.tmp.value;
      scope.item.ActionResultId = scope.tmp.guid;
    };

    scope.renameAll = function () {
      $rootScope.$broadcast('miae:renameAR', {
        id: scope.item.ActionResultId,
        name: scope.tmp.value,
      });
      scope.item.ActionResultName = scope.tmp.value;
      $rootScope.$broadcast('miae:refreshSelect');
    };

    scope.cancelChanges = function () {
      scope.$broadcast('angucomplete-alt:changeInput', 'autocomplete', scope.item.ActionResultName);
    };

    scope.loadControls = function () {
      angular.forEach(editorSvc.getControlValues(scope.controlsIgnore, false, true), function (control) {
        var obj = {
          label: control.type === 'PAY' ? control.name + ' - Card Holder Name' : control.name,
          category: 'Screen Controls',
          value: control.id,
          property: control.type === 'PAY' ? 'CardHolderName' : control.property,
        };

        scope.config.storeIn.options.push(obj);

        if (scope.controlModel !== undefined && scope.controlModel !== null) {
          if (
            scope.controlModel.ControlId === obj.value &&
            (scope.controlModel.Property === obj.property ||
              (scope.controlModel.Property === null && obj.property === '') ||
              (scope.controlModel.Property === '' && obj.property === null))
          ) {
            scope.config.storeIn.selected = obj;
          }
        }
      });
    };

    if (scope.includeControls) {
      scope.loadControls();
    }
  }

  return {
    restrict: 'E',
    scope: {
      item: '=',
      action: '=',
      label: '=?',
      hideStoreIn: '=?',
      hideLabel: '=?',
      includeControls: '=',
      controlsIgnore: '=?',
      controlModel: '=?',
      colWidths: '=?',
      thinLabel: '=?',
      isReadOnly: '=?',
    },
    link: link,
  };
}

miResultToSet.$inject = [  '$rootScope',  '$compile',  'editorSvc',  'guidSvc',  'ControlModel',  'ResultToSetModel',  'renameModalSvc'];
