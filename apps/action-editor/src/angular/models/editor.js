export default function EditorModel(
  $filter,
  guidSvc,
  editorSvc,
  currentScreenSvc,
  screenToJsonSvc,
  ActionSetModel,
  ActionResultModel,
  ConditionalModel,
  UpdateControlsModel,
  SaveAllModel,
  StopProcessingModel,
  LoopThroughTableModel,
  SharedResultModel,
  EnableDisableControlsModel,
  CallActionSetModel,
  ClearScreenModel,
  CheckPermissionModel,
  DateFunctionsModel,
  SetActiveRecordModel,
  RefreshControlModel,
  SetControlFocusModel,
  ShowHideControlsModel,
  SetViewFilterModel,
  TextFunctionsModel,
  MathFunctionsModel,
  UpdateRecordModel,
  InsertRecordModel,
  RetrieveValuesModel,
  DeleteRecordModel,
  GoToScreenModel,
  ShowMessageModel,
  GenerateReportModel,
  SendEmailModel,
  PrepareAccountingModel,
  CreateShortUrlModel,
  LoopThroughGridModel,
  CallWebServiceModel,
  ProcessPaymentsModel,
  ProcessPaymentsV2Model,
  GoToWebpageModel,
  ExpandCollapseSectionModel,
  ShowRightPanelModel,
  ValidateControlsModel,
  LoopThroughDocumentsModel,
  LoopThroughListModel,
  AddAttachmentModel,
  RetrieveValuesFromEmailModel,
  IsReadOnlyModel,
  RetrieveExchangeRateModel,
  CurrencyConversionModel,
  MergeEntitiesModel,
  MappingModel,
  SendMobilePushNotificationModel,
  SendSmsModel,
  OpenPopUpModel,
  ClosePopUpModel,
  ShowToastModel,
) {
  var actionsNotSupportedByApproutine = [
    UpdateControlsModel,
    SaveAllModel,
    EnableDisableControlsModel,
    CallActionSetModel,
    ClearScreenModel,
    SetActiveRecordModel,
    RefreshControlModel,
    SetControlFocusModel,
    ShowHideControlsModel,
    SetViewFilterModel,
    GoToScreenModel,
    ShowMessageModel,
    LoopThroughGridModel,
    GoToWebpageModel,
    ExpandCollapseSectionModel,
    ShowRightPanelModel,
    ValidateControlsModel,
    OpenPopUpModel,
    ClosePopUpModel,
    ShowToastModel,
  ];

  function EditorModel(isAppRoutineEditor, referencedControl, isReactWrapper = false) {
    if (!currentScreenSvc.initialize() && !isAppRoutineEditor) {
      return;
    }

    this.isAppRoutineEditor = isAppRoutineEditor;
    this.isReactWrapper = isReactWrapper;
    
    this.title = currentScreenSvc.getOption('Name');
    this.menu = this.buildMenu();
    this.screenEvents = angular.copy(currentScreenSvc.getScreenEventsFromProperties());
    this.selectedControl = null;
    this.actions = this.getActions(true);
    this.filteredAction = this.getActions();
    this.appRoutineVersion = null;
    this.referencedControl = referencedControl;
    this.buildScreenEvents();
    editorSvc.createControlListing(currentScreenSvc.getControls());
  }

  const getActionModels = function (isAppRoutineEditor) {
    var actions = [
      ActionResultModel,
      ConditionalModel,
      StopProcessingModel,
      LoopThroughTableModel,
      SharedResultModel,
      CheckPermissionModel,
      DateFunctionsModel,
      TextFunctionsModel,
      MathFunctionsModel,
      UpdateRecordModel,
      InsertRecordModel,
      RetrieveValuesModel,
      DeleteRecordModel,
      GenerateReportModel,
      SendEmailModel,
      PrepareAccountingModel,
      CreateShortUrlModel,
      CallWebServiceModel,
      ProcessPaymentsModel,
      LoopThroughDocumentsModel,
      AddAttachmentModel,
      RetrieveValuesFromEmailModel,
      IsReadOnlyModel,
      RetrieveExchangeRateModel,
      CurrencyConversionModel,
      ProcessPaymentsV2Model,
      MappingModel,
      MergeEntitiesModel,
      SendMobilePushNotificationModel,
      SendSmsModel,
      LoopThroughListModel,
    ];

    if (isAppRoutineEditor) {
      return actions;
    }

    return actions.concat(actionsNotSupportedByApproutine);
  };

  EditorModel.prototype.setAppRoutine = function (appRoutineVersion) {
    this.appRoutineVersion = appRoutineVersion;
  };

  EditorModel.prototype.buildMenu = function () {
    var screenJson;
    if (this.isAppRoutineEditor) {
      screenJson = [{ id: '776fda16-7611-e32a-d6c0-495af1bfd07b' }];
    } else {
      screenJson = screenToJsonSvc.makeJson();
    }

    var menu = [];
    var isV4 = currentScreenSvc.getOption('isV4Screen');

    // NON-V4: Original logic exactly as before
    if (!isV4) {
      angular.forEach(screenJson, function (obj) {
        // Get this control/section information
        var control = $filter('filter')(currentScreenSvc.getControls(), { options: { id: obj.id } });

        // Add Section to menu
        menu.push({
          id: obj.id,
          type: obj.type,
          name: control[0].options.name,
          controls: getControls(obj),
          open: true,
        });
      });

      return menu;
    }

    // V4 ONLY: Add all controls to a single "Controls" section
    var allControls = currentScreenSvc.getControls();
    var controlsList = [];

    angular.forEach(allControls, function(control) {
      // Skip sections - V4 screens don't use sections in the same way
      if (control.type !== 'SEC') {
        var data = {
          id: control.options.id,
          type: control.type,
          name: control.options.name,
          events: setControlEvents(control),
          columns: [],
          open: false,
        };

        if (control.type === 'GRD') {
          data.columns = setAltColumnEvents(control);
        }

        if (control.type === 'EDT') {
          data.columns = setEditableColumnEvents(control);
        }

        if (control.type === 'CHT') {
          data.columns = setAltColumnEvents(control, 1);
        }

        if (control.type === 'BGR' || control.type === 'CAL') {
          data.buttons = setAltButtonEvents(control);
        }

        controlsList.push(data);
      }
    });

    // Add all controls to a single section
    if (controlsList.length > 0) {
      menu.push({
        id: 'v4-controls-section',
        type: 'SEC',
        name: 'Controls',
        controls: controlsList,
        open: true,
      });
    }

    return menu;
  };

  EditorModel.prototype.buildScreenEvents = function () {
    angular.forEach(this.screenEvents, function (event) {
      var eventId = currentScreenSvc.getOption(event.func);
      var actionSetId = eventId !== null && currentScreenSvc.getEventById(eventId) ? currentScreenSvc.getEventById(eventId)[0] : null;

      event.id = eventId;
      event.actionSetId = eventId !== null ? actionSetId : null;
      event.actionSet =
        actionSetId !== null ? new ActionSetModel(angular.copy(currentScreenSvc.getActionSetById(actionSetId))) : null;
    });
  };

  EditorModel.prototype.getActions = function (forceAll) {
    var categories = [],
      sortCategoryOrder = [
        { value: 1, category: 'Action Results' },
        { value: 2, category: 'Function' },
        { value: 3, category: 'Table' },
        { value: 4, category: 'Grid' },
        { value: 5, category: 'Pop-Ups' },
        { value: 6, category: 'Report' },
        { value: 7, category: 'Screen' },
        { value: 8, category: 'Attachments' },
        { value: 9, category: 'Advanced' },
        { value: 10, category: 'List' },

      ];

    var models = getActionModels(forceAll ? false : this.isAppRoutineEditor);
    angular.forEach(models, function (model) {
      var config = new model().config;
      
      var categoryIdx = null,
        foundCategory = $filter('filter')(categories, { name: config.category }),
        sortOrder = $filter('filter')(sortCategoryOrder, { category: config.category }, true)[0];

      if (config.active) {
        if (foundCategory.length > 0) {
          categoryIdx = categories.indexOf(foundCategory[0]);
        } else {
          var newCategory = {
            name: config.category,
            sortOrder: sortOrder.value,
            actions: [],
          };
          categories.push(newCategory);
          categoryIdx = categories.indexOf(newCategory);
        }

        // Add Directive to this category
        categories[categoryIdx].actions.push({
          id: config.id,
          category: config.category,
          name: config.name,
          description: config.description,
          template: config.template,
          model: model,
        });
      }
    });
    return categories;
  };

  EditorModel.prototype.getTables = function () {
    var list = [];
    angular.forEach(currentScreenSvc.getOption('tableList'), function (table) {
      list.push({
        id: table[0],
        value: table[1],
      });
    });
    return list;
  };

  EditorModel.prototype.selectEvent = function (targetId, eventName, isColumn, isReadOnly) {
    // Get Control event
    var section, control, event, type, name, id;
    if (targetId !== 'Screen') {
      if (isColumn === undefined || !isColumn) {
        section = $filter('filter')(this.menu, { controls: { id: targetId } }, true);
        console.log('section', section);
        console.log('targetId', targetId);
        control = $filter('filter')(section[0].controls, { id: targetId });
        event = $filter('filter')(control[0].events, { name: eventName }, true)[0];
        if (control[0].type === 'EDT' && event === undefined) {
          event = $filter('filter')(control[0].columns, { name: eventName }, true)[0];
        }
        if (control[0].type === 'BGR' || (control[0].type === 'CAL' && event === undefined)) {
          event = $filter('filter')(control[0].buttons, { name: eventName }, true)[0];
        }
        if (control[0].type === 'CHT' && event === undefined) {
          event = control[0].columns[0];
        }
        type = 'control';
        name = control[0].name;
        id = control[0].id;
      } else {
        section = $filter('filter')(this.menu, { controls: { id: targetId } }, true);
        control = $filter('filter')(section[0].controls, { id: targetId });
        event =
          control[0].type !== 'BGR' && control[0].type !== 'CAL'
            ? control[0].columns[eventName]
            : control[0].buttons[eventName];
        type = 'control';
        name = control[0].name;
        id = control[0].id;
      }
    } else {
      event = $filter('filter')(this.screenEvents, { name: eventName }, true)[0];
      type = 'Screen';
      name = 'Screen';
      id = eventName;
    }

    if (currentScreenSvc.getOption('appRoutineId')) {
      var actionSet = new ActionSetModel();
      var routineEvent = currentScreenSvc.getControls()[0].options.events[0];
      event.id = routineEvent.id;
      event.actionSetId = routineEvent.actionSet.ActionSetId;
      actionSet.ActionSetId = routineEvent.actionSet.ActionSetId;
      actionSet.Actions = routineEvent.actionSet.Actions;
      actionSet.Key = routineEvent.actionSet.Key;
      actionSet.Name = routineEvent.actionSet.name;
      actionSet.InputValues = routineEvent.actionSet.InputValues;
      actionSet.OutputValues = routineEvent.actionSet.OutputValues;
      actionSet.AppRoutineId = routineEvent.actionSet.AppRoutineId;
      actionSet.Scope = routineEvent.actionSet.Scope;
      event.actionSet = actionSet;
    }

    // Check if we need to create a new event
    if (event.id === null) {
      event.id = guidSvc.create();
    }

    // Check if we need to create a new action set
    if (event.actionSetId === null) {
      actionSet = new ActionSetModel();
      event.actionSetId = actionSet.ActionSetId;
      actionSet.Scope = control && control[0].type === 'EDT' ? 1 : 0;
      event.actionSet = actionSet;
    }

    // Convert Action Set to Models
    createModelsFromValues(event.actionSet, this, isReadOnly);

    this.selectedControl = {
      type: type,
      id: id,
      name: name,
      func: event.func,
      funcName: event.name,
      actionSetId: event.actionSetId,
      actionSet: event.actionSet,
      load: {
        targetId: targetId,
        eventName: eventName,
        isColumn: isColumn,
      },
    };

    return this;
  };

  EditorModel.prototype.addActionScope = function (action) {
    var currentScope = this.selectedControl.actionSet.Scope;

    if (action.ActionId === 1) {
      action.ActionSetOnFalse.Scope = currentScope;
      action.ActionSetOnTrue.Scope = currentScope;
    }

    if ([26, 29, 38, 55].indexOf(action.ActionId) > -1) {
      action.LoopActionSet.Scope = currentScope;
    }

    return action;
  };

  EditorModel.prototype.addAction = function (action, position) {
    action = this.addActionScope(action);
    if (position == null) {
      this.selectedControl.actionSet.Actions.push(action);
    } else if (position && this.selectedControl.actionSet.ActionSetId === position.actionSetId) {
      this.selectedControl.actionSet.Actions.splice(position.idx, 0, action);
    } else {
      const targetActionSet = this.selectedControl.actionSet.isSpecifiedId(position.actionSetId, null);
      if (targetActionSet) {
        targetActionSet.Actions.splice(position.idx, 0, action);
      } else {
        alert('We could not find where to insert this action');
      }
    }
    this.flagActionsAreInALoop();
  };

  EditorModel.prototype.deleteAction = function (actionSetId, loopIndex) {
    if (this.selectedControl.actionSet.ActionSetId === actionSetId) {
      this.selectedControl.actionSet.Actions.splice(loopIndex, 1);
    } else {
      var elseWhere = this.selectedControl.actionSet.isSpecifiedId(actionSetId, null);
      if (elseWhere) {
        elseWhere.Actions.splice(loopIndex, 1);
      } else {
        alert('We could not delete this action');
      }
    }
  };

  EditorModel.prototype.validate = function () {
    this.linkActionResults();
    this.selectedControl.actionSet.validate();
    if (this.isAppRoutineEditor) {
      validateAppRoutineCompatibility(this.selectedControl.actionSet.Actions);
    }
    this.flagActionsAreInALoop();
  };

  EditorModel.prototype.flagActionsAreInALoop = function () {
    this.selectedControl.actionSet.flagActionsAreInALoop(false, null, null);
  };

  EditorModel.prototype.linkActionResults = function () {
    this.selectedControl.actionSet.linkActionResults();
  };

  EditorModel.prototype.renameActionResult = function (name, id) {
    editorSvc.renameActionResult(name, id);
  };

  EditorModel.prototype.cleanUpActionResults = function (array) {
    var arList = [];
    angular.forEach(array, function (item) {
      arList.push(item.id);
    });
    this.selectedControl.actionSet.clearActionResult(arList);
  };

  EditorModel.prototype.filterUsedActionSetByName = function (value) {
    return this.selectedControl.actionSet.Actions.filter(function (actionSet) {
      if (typeof actionSet.getActionResultSet === 'function') {
        var actionSetUsed = actionSet.getActionResultSet();
        if (actionSetUsed) {
          return actionSetUsed.find((item) => item.name === value);
        }
      }
    });
  };

  EditorModel.prototype.listAllActionSets = function (ignore) {
    var actionSetList = [];
    var category = 'Screen';
    // Loop through the menu
    angular.forEach(this.menu, function (section) {
      angular.forEach(section.controls, function (control) {
        angular.forEach(control.events, function (event) {
          if (event.actionSetId !== null && (ignore === undefined || ignore !== event.actionSetId)) {
            if (event.actionSet.Actions.length > 0) {
              actionSetList.push({
                label: control.name + ' (' + event.name + ')',
                value: event.actionSetId,
                event: event.name,
                id: control.id,
                category: category,
              });
            }
          }
        });

        angular.forEach(control.columns, function (event) {
          if (event.actionSetId !== null && (ignore === undefined || ignore !== event.actionSetId)) {
            actionSetList.push({
              label: control.name + ' (' + event.name + ')',
              value: event.actionSetId,
              event: event.name,
              id: control.id,
              category: category,
            });
          }
        });

        angular.forEach(control.buttons, function (event) {
          if (event.actionSetId !== null && (ignore === undefined || ignore !== event.actionSetId)) {
            actionSetList.push({
              label: control.name + ' (' + event.name + ')',
              value: event.actionSetId,
              event: event.name,
              id: control.id,
              category: category,
            });
          }
        });
      });
    });

    // Loop through the screenEvents
    angular.forEach(this.screenEvents, function (event) {
      if (event.actionSetId !== null) {
        if (event.actionSet.Actions.length > 0) {
          actionSetList.push({
            label: 'Screen (' + event.name + ')',
            value: event.actionSetId,
            event: event.name,
            id: 'Screen',
            category: category,
          });
        }
      }
    });

    return actionSetList;
  };

  EditorModel.prototype.getCopyActionModel = function (action) {
    var self = this;
    var newAction = null;

    newAction = returnActionModel(action);

    if (newAction.ActionId === 1) {
      newAction.ActionSetOnFalse.Actions.forEach(function (item, idx) {
        newAction.ActionSetOnFalse.Actions[idx] = self.getCopyActionModel(item);
      });
      newAction.ActionSetOnTrue.Actions.forEach(function (item, idx) {
        newAction.ActionSetOnTrue.Actions[idx] = self.getCopyActionModel(item);
      });
    }

    if (newAction.ActionId === 26 || newAction.ActionId === 29 || newAction.ActionId === 38 || newAction.ActionId === 55) {
      newAction.LoopActionSet.Actions.forEach(function (item, idx) {
        newAction.LoopActionSet.Actions[idx] = self.getCopyActionModel(item);
      });
    }

    return newAction;
  };

  EditorModel.prototype.isEditorValid = function (actions) {
    var self = this;
    var isValid = true;
    if (actions) {
      angular.forEach(actions, function (action) {
        if (action.IsAppRoutineInputValue) {
          return;
        }

        if (action.InValid) {
          isValid = false;
        }

        if (action.ActionId === 1) {
          if (!self.isEditorValid(action.ActionSetOnFalse.Actions)) {
            isValid = false;
          }
          if (!self.isEditorValid(action.ActionSetOnTrue.Actions)) {
            isValid = false;
          }
        }

        if (action.ActionId === 26 || action.ActionId === 29 || action.ActionId === 38 || action.ActionId === 55) {
          if (!self.isEditorValid(action.LoopActionSet.Actions)) {
            isValid = false;
          }
        }
      });

      return isValid;
    }
  };

  const validateAppRoutineCompatibility = function (actions) {
    angular.forEach(actions, function (action) {
      var isNotSupported = actionsNotSupportedByApproutine.some(function (model) {
        return new model().config.id === action.config.id;
      });

      var isPaymentSetup = action.ActionId == 46 && action.ActionType == 2;

      if (isNotSupported || isPaymentSetup) {
        action.InValid = true;
        var exist =
          action.ValidationMessages &&
          action.ValidationMessages.some(function (validation) {
            return validation.Message === 138;
          });

        if (!exist) {
          action.ValidationMessages.push({
            Property: '', //incompatible approutine action
            Message: 138,
          });
        }
      }

      if (action.ActionId === 1) {
        validateAppRoutineCompatibility(action.ActionSetOnFalse.Actions);
        validateAppRoutineCompatibility(action.ActionSetOnTrue.Actions);
      }

      if (action.ActionId === 26 || action.ActionId === 29 || action.ActionId === 38 || action.ActionId === 55) {
        validateAppRoutineCompatibility(action.LoopActionSet.Actions);
      }

      //Generate report action is valid for app routine, but should never display report
      if (action.ActionId === 20) {
        action.DisplayReport = false;
      }
    });

    return actions;
  };

  // Private Functions
  const returnActionModel = function (opts) {
    var newModel = null;

    var models = getActionModels();

    angular.forEach(models, function (model) {
      var config = new model().config;

      if (opts.ActionId === config.id) {
        newModel = new model(opts);
      }
    });

    return newModel;
  };

  const getControls = function (obj) {
    var controls = [];
    if (obj.type === 'SEC') {
      // Loop through all the rows
      angular.forEach(obj.rows, function (row) {
        // Loop through all the columns
        angular.forEach(row.columns, function (column) {
          // Loop through all the items
          angular.forEach(column, function (item) {
            // This is a regular control
            if (item.type !== 'SEC') {
              var control = $filter('filter')(currentScreenSvc.getControls(), { options: { id: item.id } });

              if (control.length === 1) {
                var data = {
                  id: item.id,
                  type: item.type,
                  name: control[0].options.name,
                  events: setControlEvents(control[0]),
                  columns: [],
                  open: false,
                };

                if (item.type === 'GRD') {
                  data.columns = setAltColumnEvents(control[0]);
                }

                if (item.type === 'EDT') {
                  data.columns = setEditableColumnEvents(control[0]);
                }

                if (item.type === 'CHT') {
                  data.columns = setAltColumnEvents(control[0], 1);
                }

                if (item.type === 'BGR' || item.type === 'CAL') {
                  data.buttons = setAltButtonEvents(control[0]);
                }

                controls.push(data);
              }
            } else {
              // console.debug('******* Adding another section to json');
              angular.forEach(getControls(item), function (ctrl) {
                controls.push(ctrl);
              });
            }
          });
        });
      });
    }
    return controls;
  };

  const setControlEvents = function (control) {
    var events = [];

    angular.forEach(control.properties.events, function (event) {
      var eventId = control.options[event.func] ? control.options[event.func] : null,
        actionSetId = eventId
          ? currentScreenSvc.getEventById(eventId)
            ? currentScreenSvc.getEventById(eventId)[0]
            : null
          : null,
        actionSet = actionSetId
          ? new ActionSetModel(angular.copy(currentScreenSvc.getActionSetById(actionSetId)))
          : null;

      events.push({
        id: eventId,
        name: event.name,
        func: event.func,
        actionSetId: actionSetId,
        actionSet: actionSet,
        total: 0,
      });
    });

    return events;
  };

  const setAltColumnEvents = function (control, limit) {
    var events = [];

    angular.forEach(control.options.model.columns, function (column, idx) {
      if (limit === undefined || limit - 1 >= idx) {
        var eventId = column.onClick ? column.onClick : null,
          actionSetId = eventId
            ? currentScreenSvc.getEventById(eventId)
              ? currentScreenSvc.getEventById(eventId)[0]
              : null
            : null,
          actionSet = actionSetId
            ? new ActionSetModel(angular.copy(currentScreenSvc.getActionSetById(actionSetId)))
            : null;

        events.push({
          idx: idx,
          id: eventId,
          name: column.name !== '' ? column.name + ' Click' : 'Column Click',
          func: 'onClick',
          actionSetId: actionSetId,
          actionSet: actionSet,
          total: 0,
        });
      }
    });

    return events;
  };

  /**
   * Events for editable columns
   */
  const setEditableColumnEvents = function (control, limit) {
    var events = [];

    angular.forEach(control.options.columns, function (column, idx) {
      if (limit === undefined || limit - 1 >= idx) {
        var eventId = column.onChangeEvent ? column.onChangeEvent : null;
        var event = eventId ? currentScreenSvc.getEventById(eventId) : null;
        var actionSetId = event ? event[0] : null;
        var actionSet = actionSetId
          ? new ActionSetModel(angular.copy(currentScreenSvc.getActionSetById(actionSetId)))
          : null;

        //Change event not to be shown on formula columns
        if (column.fieldType !== 21)
          events.push({
            idx: idx,
            id: eventId,
            name: column.field !== '' ? `${column.field} Change` : 'Column Change',
            func: 'onChange',
            actionSetId: actionSetId,
            actionSet: actionSet,
            total: 0,
          });
      }

      //Click event not shown on button, card, picture columns
      // hide until runtime requirements are decided.
      /*
      if (column.fieldType !== 10 && column.fieldType !== 11 && column.fieldType !== 7) {
        events.push({
          idx: idx,
          id: eventId,
          name: column.header !== '' ? column.header + ' Column Click' : 'Column Click',
          func: 'onColumnClick',
          actionSetId: actionSetId,
          actionSet: actionSet,
          total: 0,
        });
      }
        */
    });

    return events;
  };

  const setAltButtonEvents = function (control, _limit) {
    var events = [];

    angular.forEach(control.options.buttons, function (button, idx) {
      var eventId = button.onClick ? button.onClick : null,
        actionSetId =
          eventId && currentScreenSvc.getEventById(eventId) ? currentScreenSvc.getEventById(eventId)[0] : null,
        actionSet = actionSetId
          ? new ActionSetModel(angular.copy(currentScreenSvc.getActionSetById(actionSetId)))
          : null;

      events.push({
        idx: idx,
        id: eventId,
        name: button.caption !== '' ? button.caption + ' Click' : 'Button Click',
        func: 'onClick',
        actionSetId: actionSetId,
        actionSet: actionSet,
        total: 0,
      });
    });

    return events;
  };

  const createModelsFromValues = function (actionSet, self, isReadOnly) {
    angular.forEach(actionSet.Actions, function (action, idx) {
      var category = $filter('filter')(self.actions, { actions: { id: action.ActionId } }, true),
        model = category.length > 0 ? $filter('filter')(category[0].actions, { id: action.ActionId }, true) : null;

      action.isReadOnly = isReadOnly;
      actionSet.Actions[idx] = model !== null ? new model[0].model(action) : action;

      if (action.ActionId === 1) {
        createModelsFromValues(actionSet.Actions[idx].ActionSetOnFalse, self, isReadOnly);
        createModelsFromValues(actionSet.Actions[idx].ActionSetOnTrue, self, isReadOnly);
      }

      if (action.ActionId === 26 || action.ActionId === 29 || action.ActionId === 38 || action.ActionId === 55) {
        createModelsFromValues(actionSet.Actions[idx].LoopActionSet, self, isReadOnly);
      }
    });
    // console.warn('actionSet', actionSet);
    // console.groupEnd();
  };

  return EditorModel;
}

EditorModel.$inject = [
  '$filter',
  'guidSvc',
  'editorSvc',
  'currentScreenSvc',
  'screenToJsonSvc',
  'ActionSetModel',
  'ActionResultModel',
  'ConditionalModel',
  'UpdateControlsModel',
  'SaveAllModel',
  'StopProcessingModel',
  'LoopThroughTableModel',
  'SharedResultModel',
  'EnableDisableControlsModel',
  'CallActionSetModel',
  'ClearScreenModel',
  'CheckPermissionModel',
  'DateFunctionsModel',
  'SetActiveRecordModel',
  'RefreshControlModel',
  'SetControlFocusModel',
  'ShowHideControlsModel',
  'SetViewFilterModel',
  'TextFunctionsModel',
  'MathFunctionsModel',
  'UpdateRecordModel',
  'InsertRecordModel',
  'RetrieveValuesModel',
  'DeleteRecordModel',
  'GoToScreenModel',
  'ShowMessageModel',
  'GenerateReportModel',
  'SendEmailModel',
  'PrepareAccountingModel',
  'CreateShortUrlModel',
  'LoopThroughGridModel',
  'CallWebServiceModel',
  'ProcessPaymentsModel',
  'ProcessPaymentsV2Model',
  'GoToWebpageModel',
  'ExpandCollapseSectionModel',
  'ShowRightPanelModel',
  'ValidateControlsModel',
  'LoopThroughDocumentsModel',
  'LoopThroughListModel',
  'AddAttachmentModel',
  'RetrieveValuesFromEmailModel',
  'IsReadOnlyModel',
  'RetrieveExchangeRateModel',
  'CurrencyConversionModel',
  'MergeEntitiesModel',
  'MappingModel',
  'SendMobilePushNotificationModel',
  'SendSmsModel',
  'OpenPopUpModel',
  'ClosePopUpModel',
  'ShowToastModel',
];
