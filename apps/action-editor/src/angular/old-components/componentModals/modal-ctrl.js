import validationTemplate from './validation/tmpl.html'

const ComponentModalCtrl = function ($scope, $rootScope, $q, $timeout, $templateRequest, $compile, $interval, $filter, currentScreenSvc) {
  console.debug('ComponentModalCtrl', $scope);

  $scope.svgIconStyle = {
      display: 'inline-block'
  };

  var thisControl = null,
    autoSaveTimer = 60000, // Every Minute
    modified = false,
    modalId = '#componentModal',
    modalContentId = '#componentModalContent',
    newScope = null,
    stopSaving = null,
    autoSave = function () {
      console.info('AutoSave Triggered');
      // console.info('Not Read Only', glblScreenWidget.options.designerMode !== $.mi.Constants.DesignerMode.ReadOnly);
      // console.info('Modified', modified);
      if (currentScreenSvc.getOption('designerMode') !== $.mi.Constants.DesignerMode.ReadOnly && modified) {
        console.log('run Save');
        $scope.saveProperties();
      }
      // console.groupEnd();
    },
    stopSaving = null;

  $scope.layout = {
    showExpressionBuilder: false,
    title: '',
    readonly: false,
    saving: false,
    buttonLabel: 'Close',
  };
  $scope.action = {
    parentAr: [],
    loop: {
      inLoop: false,
    },
  };

  // Load the external template
  $scope.loadTemplate = function (url) {
    var deferred = $q.defer();
    if (url !== null) {
      $templateRequest(url).then(function (html) {
        deferred.resolve(html);
      });
    } else {
      deferred.reject;
    }
    return deferred.promise;
  };

  // Open the modal
  $scope.openModal = function (type, controlWidget, aboveAll, canGoBack) {
    // console.clear();
    console.debug('property type', type);
    console.debug('controlWidget', controlWidget);

    $scope.layout.showExpressionBuilder = false;
    $scope.selectedControl = controlWidget;
    const validationOptsByFieldTypeMap = {
      '0': [0,1,2,3,6],
      '1': [0,4,5,6],
      '2': [0,4,5,6],
      '4': [0,4,5,6],
    };
    if (!controlWidget.options.hasOwnProperty('validationOpts')) {
      controlWidget.options.validationOpts = validationOptsByFieldTypeMap[controlWidget.options.FieldType.toString()] || [0,6];
    }
    $scope.controlValidationProperties = controlWidget.options.hasOwnProperty('validationOpts') ? controlWidget.options.validationOpts : null;
    thisControl = controlWidget.options;
    $scope.control = angular.copy(thisControl);
    console.debug('Main $scope', $scope);
    console.debug('$scope.control', $scope.control);

    // Above Action Editor
    if (aboveAll) {
      angular.element('#componentModal').addClass('open-above-ae');
    } else {
      angular.element('#componentModal').removeClass('open-above-ae');
    }

    // Is this read only
    $scope.layout.readonly = currentScreenSvc.getOption('designerMode') === $.mi.Constants.DesignerMode.ReadOnly;
    $scope.layout.archived = currentScreenSvc.getOption('screenMode') == 'INACTIVE';
    $scope.layout.v4 = true;
    if ($scope.layout.archived) {
      $scope.layout.pillMessage = 'Archived (Read-only)';
    } else if ($scope.layout.readonly) {
      $scope.layout.pillMessage = 'Published (Read-only)';
    } else {
      $scope.layout.pillMessage = 'Draft';
    }
    // Convert property type to path
    var path = type.replace('.', '/');
    console.log('path', path)
    if (path == 'validation') {
      $scope.makeValidationView();
    } else {
      $scope.loadView($scope.basePath + path + '/tmpl.html');
    }

    // Show Action Editor Modal
    angular.element(modalId).addClass('mi-ae-framework-open');

    // Hide intercom icon from page
    angular.element('#intercom-container').hide();

    // Setup Auto Save
    stopSaving = $interval(autoSave, autoSaveTimer);

    // Button Label
    $scope.layout.buttonLabel = canGoBack ? 'Back' : 'Close';

    // Action editor was closed update this control
    $rootScope.$on('miae:closed', function () {
      if (thisControl !== null) {
        var control = $filter('filter')(currentScreenSvc.getControls(), { options: { id: thisControl.id } }, true)[0];
        $scope.selectedControl = control;
        thisControl = control.options;
        $scope.control = angular.copy(thisControl);
      }
    });
  };

  // Function to close the modal
  $scope.closeModal = function (saveChanges) {
    if (currentScreenSvc.getOption('designerMode') !== $.mi.Constants.DesignerMode.ReadOnly) {
      $scope.saveProperties().then(function () {
        $scope.removeModal();
      });
    } else {
      $scope.removeModal();
    }
  };

  $scope.removeModal = function () {
    $scope.layout.showExpressionBuilder = false;
    $interval.cancel(stopSaving);
    $timeout(function () {
      thisControl = null;
      angular.element(modalId).removeClass('mi-ae-framework-open');
      angular.element('#intercom-container').show();
    }, 250);
  };

  // Save this Control Properties
  $scope.saveProperties = function () {
    // console.log('saveProperties');
    var deferred = $q.defer();
      
    currentScreenSvc.setControl($scope.control.id, $scope.control);
    

    $scope.layout.saving = true;
    
    if (window.setScreenAsDirty) {
      this.setScreenAsDirty = window.setScreenAsDirty;
    } else {
        this.setScreenAsDirty = (() => null);
    }

    if (window.dsSave) {
        this.dsSave = window.dsSave;
    } else {
        this.dsSave = currentScreenSvc.saveScreen;
    }

    this.setScreenAsDirty(true);

    this.dsSave(true).then(
      function () {
        $scope.layout.saving = false;
        modified = false;
        deferred.resolve();
      },
      function () {
        deferred.reject();
      }
    );

    return deferred.promise;
  };

  // Load the template that has been passed to this modal
  $scope.loadView = function (url) {
    if (newScope) {
      console.log('newScope');
      newScope.$destroy();
    }

    $scope.loadTemplate(url).then(function (html) {
      var element = angular.element(modalContentId).html(html);

      newScope = $scope.$new();
      $compile(element.contents())(newScope);
    });
  };

  $scope.makeValidationView = () => {
    if (newScope) {
      console.log('newScope');
      newScope.$destroy();
    }

    // Directly use the existing validationTemplate string
    var element = angular.element(modalContentId).html(validationTemplate);

    newScope = $scope.$new();
    $compile(element.contents())(newScope);
  }

  $scope.hideExpression = function () {
    console.log('hideExpression');
    $rootScope.$broadcast('mi:expression.close');
  };

  $scope.$on('component:modal:isModified', function () {
    modified = true;
  });

  $scope.$on('component:modal:autoSave', function () {
    modified = true;
    $scope.saveProperties();
  });

  $scope.TryDelete = function (controlwidget) {
    var controlId = controlwidget.id;
    var actionSets = currentScreenSvc.getActionSets();
    var screenEvents = currentScreenSvc.getEvents();
    var buttonIds = GetButtonMenuItems(controlwidget);
    var errorList = [];

    // console.log('buttonIds', buttonIds);

    // Loop through all controls on the screen
    angular.forEach(currentScreenSvc.getControls(), function (control, idx) {
      var events = control.properties.events;

      // Check to ensure we aren't checking this control
      if (control.options.id !== controlId) {
        // Only search controls that offer event properties
        if (events.length > 0) {
          angular.forEach(events, function (event, idx) {
            // If control has an event created
            var eventId = control.options[event.func];
            if (eventId !== null && eventId !== undefined) {
              // Check for undefined in case screen eventID is an orphan
              var actions = screenEvents[eventId] && actionSets[screenEvents[eventId][0]] ? actionSets[screenEvents[eventId][0]].Actions : [];
              var array = FindIdReference(controlId, actions, []);

              if (array.length > 0) {
                errorList.push({
                  type: 'Reference',
                  controlName: control.options.caption,
                  event: event.name,
                  references: array.length,
                });
              }

              var btnReferences = 0;
              buttonIds.forEach(function (btn) {
                if (btn.onClick !== null && btn.onClick !== undefined) {
                  var array = FindIdReference(btn.id, actionSets[screenEvents[eventId][0]].Actions, []);

                  if (array.length > 0) {
                    btnReferences += array.length;
                  }
                }
              });

              if (btnReferences > 0) {
                errorList.push({
                  type: 'Reference',
                  controlName: control.options.caption,
                  event: event.name,
                  references: btnReferences,
                });
              }
            }
          });
        }

        // check grid filters

        if (control.options.hasOwnProperty('filterDef') && control.options.filterDef) {
          control.options.filterDef.forEach(function (filterDef) {
            var expression = JSON.stringify(filterDef.expression),
              matches = expression.match(new RegExp(controlId, 'g') || []),
              occurences = matches ? matches.length : 0;

            if (occurences > 0) {
              errorList.push({
                type: 'Reference',
                controlName: control.options.caption,
                event: 'Filter[' + filterDef.filterName + ']',
                references: occurences,
              });
            }
          });
        }
      }

      // Now check if this controls action sets are being used elswhere
      if (control.options.id === controlId) {
        if (events.length > 0) {
          angular.forEach(events, function (event, idx) {
            var eventId = control.options[event.func];
            if (eventId !== null && eventId !== undefined) {
              // Check if this eventId is being referenced by call another action set
              var array = IsActionSetBeingCalled(screenEvents[eventId][0]);
              if (array.length > 0) {
                angular.forEach(array, function (item, idx) {
                  errorList.push({
                    type: 'ActionSet',
                    controlName: item.controlName,
                    event: item.event,
                    references: event.name,
                  });
                });
              }
            }
          });
        }

        buttonIds.forEach(function (btn) {
          if (btn.onClick !== null && btn.onClick !== undefined) {
            var array = IsActionSetBeingCalled(screenEvents[btn.onClick][0]);

            if (array.length > 0) {
              angular.forEach(array, function (item, idx) {
                errorList.push({
                  type: 'ActionSet',
                  controlName: item.controlName,
                  event: item.event,
                  references: btn.caption + ': Click',
                });
              });
            }
          }
        });
      }
    });


    if (controlwidget.Type === 'BGI' && controlwidget.onClick) {
      var array = IsActionSetBeingCalled(screenEvents[controlwidget.onClick][0]);
      if (array.length > 0) {
        angular.forEach(array, function (item, idx) {
          errorList.push({
            type: 'ActionSet',
            controlName: item.controlName,
            event: item.event,
            references: 'Click',
          });
        });
      }
    }
    // Check for screen references
    var screenErrorList = findRefOnScreen(controlId, actionSets, screenEvents);
    errorList.push.apply(errorList, screenErrorList);

    if (errorList.length === 0) {
      // Loop through each control events
      /*   angular.forEach(controlwidget.properties.events, function (obj, idx) {
           var eventId = controlwidget[obj.func];
           if (eventId !== null && eventId !== undefined) {
             var actionSetId = screenEvents[eventId][0];
             delete actionSets[screenEvents[eventId][0]];
             delete screenEvents[eventId];
           }
         });
         var controlIdx = glblScreenWidget.options.Controls.indexOf(controlwidget);
         if (controlIdx > -1) {
           glblScreenWidget.options.Controls.splice(controlIdx, 1);
         }
         */
      return true;
    } else {
      var errors = '<ul>';
      angular.forEach(errorList, function (obj, idx) {
        if (obj.type === 'Reference') {
          errors += '<li><b>' + obj.controlName + ': ' + obj.event + '</b> has <b>' + obj.references + '</b> reference(s).</li>';
        } else {
          errors += '<li><b>' + obj.controlName + ': ' + obj.event + '</b> references this controls <b>' + obj.references + '</b> action.</li>';
        }
      });
      errors += '</ul>';

      $('<p/>').newDialog({
        mode: 'alert',
        title: 'Unable to Remove Control',
        message: 'This control is being used in the following location(s):<br>' + errors,
      });
      return false;
    }
  };

  /**
   * FindScreenEvent() loops through onload/focus/activerecord
   * to see if any of their eventId -> actionSetIds matches the input.
   * If yes, it returns the event info
   */
  const FindScreenEvent = function (actionSetId) {
    var allEvents = currentScreenSvc.getEvents();
    var found = null;

    angular.forEach(currentScreenSvc.getScreenEventsFromProperties(), function (screenEventType, idx) {
      var eventId = currentScreenSvc.getOption(screenEventType.func);
      if (eventId && allEvents[eventId][0] === actionSetId) {
        found = {
          controlName: 'Screen',
          event: screenEventType['name'],
        };
      }
    });
    return found;
  };

  const FindControlAndEvent = function (actionSetId) {
    // console.warn('FindControlAndEvent actionSetId', actionSetId);
    var allEvents = currentScreenSvc.getEvents();
    var found = null;
    angular.forEach(currentScreenSvc.getControls(), function (control, idx) {
      var events = control.properties.events;
      if (events.length > 0) {
        angular.forEach(events, function (event, idx) {
          // If control has an event created
          var eventId = control.options[event.func];

          // Check if this actionSetId matches this event ID
          if (eventId !== null && eventId !== undefined && allEvents[eventId] !== null && allEvents[eventId] !== undefined) {
            if (allEvents[eventId][0] === actionSetId) {
              // console.log('match Found', eventId, actionSetId);
              found = {
                controlName: control.options.caption,
                event: event.name,
              };
            }
          }
        });
      }
      // check EG columns
      if (control.options.Type === 'EDT' && control.options.columns) {
        control.options.columns.forEach(function (column) {
          if (column.onChangeEvent) {
            if (allEvents[column.onChangeEvent][0] === actionSetId) {
              // console.log('match Found', eventId, actionSetId);
              found = {
                controlName: control.options.caption,
                event: column.header,
              };
            }
          }
        });
      }

      if (control.options.Type === 'BGR' && control.options.buttons) {
        control.options.buttons.forEach(function (button) {
          if (button.onClick) {
            if (allEvents[button.onClick][0] === actionSetId) {
              // console.log('match Found', eventId, actionSetId);
              found = {
                controlName: control.options.caption,
                event: button.caption,
              };
            }
          }
        });
      }
    });

    return found;
  };

  const IsActionSetBeingCalled = function (actionSetId) {
    var errors = [];

    // console.warn('IsActionSetBeingCalled', actionSetId);
    angular.forEach(currentScreenSvc.getActionSets(), function (set, idx) {
      // console.info('look in set', set.ActionSetId);
      var found = FindIdReference(actionSetId, set.Actions, []);
      if (found.length > 0) {
        var getControlEvent = FindControlAndEvent(set.ActionSetId);
        if (getControlEvent !== null) {
          errors.push(getControlEvent);
        } else {
          var fetchedScreenEvent = FindScreenEvent(set.ActionSetId);
          fetchedScreenEvent && errors.push(fetchedScreenEvent);
        }
      }
    });

    // console.log('Any Errors', errors);
    return errors;
  };

  const FindIdReference = function (controlId, searchItem, array) {
    if (!(searchItem instanceof Function)) {
      if (searchItem instanceof Array) {
        if (searchItem.indexOf(controlId) > -1) {
          array.push(searchItem);
        } else {
          for (var i = 0; i < searchItem.length; i++) {
            this.FindIdReference(controlId, searchItem[i], array);
          }
        }
      } else {
        for (var prop in searchItem) {
          if (searchItem[prop] instanceof Object || searchItem[prop] instanceof Array) {
            this.FindIdReference(controlId, searchItem[prop], array);
          }
          if (searchItem[prop] === controlId) {
            array.push(searchItem);
          }
        }
      }
    }
    return array;
  };

  const GetButtonMenuItems = function (opts) {
    var buttonIds = [];

    if (opts.Type === 'BGR') {
      opts.buttons.forEach(function (btn) {
        buttonIds.push(btn);
      });
    }

    return buttonIds;
  };

  /**
   * findRefOnScreen() looks through the list of available Screen events
   * and returns an array of "Reference" errors
   * if the target control is referenced on the Screen
   */
  const findRefOnScreen = function (controlId, actionSets, screenEvents) {
    // default list of available events on Screen
    var screenEventTypes = currentScreenSvc.getEvents();
    var errList = [];
    // loop throgh events available on Screen widget
    for (var i = 0; i < screenEventTypes.length; i++) {
      // event name
      var event = screenEventTypes[i]['func'];
      // is that screen event used or null
      if (screenEvents[currentScreenSvc.getOption(event)]) {
        // Do screen events reference our target widget's id(controlId)?
        // Create a new error object for it result not empty
        var idRefResult = FindIdReference(controlId, actionSets[screenEvents[currentScreenSvc.getOption(event)]].Actions, []);
        if (idRefResult.length > 0) {
          errList.push({
            type: 'Reference',
            controlName: 'Screen',
            event: screenEventTypes[i]['name'],
            references: idRefResult.length,
          });
        }
      }
    }
    return errList;
  };
};

ComponentModalCtrl.$inject = ['$scope', '$rootScope', '$q', '$timeout', '$templateRequest', '$compile', '$interval', '$filter', 'currentScreenSvc'];

export default ComponentModalCtrl;