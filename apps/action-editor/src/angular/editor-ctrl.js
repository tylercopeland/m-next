import copyActionTmpl from './copy-action-tmpl.html';
import newActionTmpl from './new-action-tmpl.html';
import moment from 'moment';

export default function ActionEditorCtrl(
    $scope,
    $rootScope,
    $injector,
    $q,
    $timeout,
    $compile,
    $sessionStorage,
    $filter,
    $interval,
    editorSvc,
    currentScreenSvc,
    EditorModel,
) {
    this.$postLink = () => { // Otherwise isReactWrapper and isAppRoutineEditor will not be reliably set.
        console.log('ActionEditorCtrl $postLink');
        if (typeof mi === 'undefined') {
            var mi = {
                constants: {
                    errorMessages: {
                        generic: "An unexpected error has occurred. Please try again, or if the issue persists, contact support@method.me."
                    }
                }
            }
        }

        currentScreenSvc.initialize($scope.isReactWrapper);
        const exportedFunctions = currentScreenSvc.getReactFunctions();
        if (typeof exportedFunctions !== 'undefined') {
            console.debug('Attaching exportedFunctions to scope');
            $scope.exportedFunctions = exportedFunctions;
        }

        $scope.svgIconStyle = {
            display: 'inline-block'
        };

        $scope.templates = {
            newActionTmpl,
            copyActionTmpl,
        };

        console.debug('ActionEditorCtrl', {
            '$scope.isReactWrapper': $scope.isReactWrapper,
            '$scope.isAppRoutineEditor': $scope.isAppRoutineEditor,
            '$scope.authToken': $scope.authToken,
            '$rootScope.isReactWrapper': $rootScope.isReactWrapper,
            '$rootScope.isAppRoutineEditor': $rootScope.isAppRoutineEditor,
        });

        var appRoutinesSvc;
        if ($injector.has('appRoutinesSvc')) {
            try {
                appRoutinesSvc = $injector.get('appRoutinesSvc');
                console.debug(`I am "ActionEditorCtrl" and I found "appRoutinesSvc" by asking $injector.`);
            } catch (error) {
                console.error(`I am "ActionEditorCtrl" and "appRoutinesSvc" exists but failed to instantiate:`, error);
                appRoutinesSvc = undefined;
            }
        } else {
            console.debug(`I am "ActionEditorCtrl" and I needed access to "appRoutinesSvc" from legacy and I did not get it!`);
        }

        var notificationSvc;
        if ($injector.has('notificationSvc')) {
            notificationSvc = $injector.get('notificationSvc');
            console.debug(`I am "ActionEditorCtrl" and I found "notificationSvc" by asking $injector.`);
        } else {
            console.debug(`I am "ActionEditorCtrl" and I needed access to "notificationSvc" from legacy and I did not get it!`);
        }

        const nestableActionIds = [1, 26, 29, 38, 55];
        var autoSaveTimer = 60000, // Every Minute
            modified = false,
            editorModalId = '#actionEditorModal',
            editorModalContentId = '#actionEditorContent',
            newScope = null,
            isNew = false,
            position = null,
            didShowComments = true,
            autoSave = function () {
                if (currentScreenSvc.getOption('designerMode') !== angular.element.mi.Constants.DesignerMode.ReadOnly && !$scope.layout.saving) {
                    $scope.saveEditor();
                }
            },
            stopSaving = null;
        const isNestableAction = function (actionId) {
            return nestableActionIds.includes(actionId);
        };
        $rootScope.actionEditor = {};
        $scope.copyActions = {
            controls: {
                all: [],
                selected: null
            },
            control: null,
            action: null,
            menu: [],
            actionList: [],
            groupByFilter: ['Control Events', 'Column Click', 'Editable Grid Field', 'Button Click'],
            screens: {
                all: [],
                selected: null
            },
            events: {
                all: [],
                selected: null
            }
        };
        $scope.editor = {};
        $scope.referencedControl = "Button1";
        $scope.referencedControlId = null;
        $scope.eventStack = [];
        $scope.firstEvent = {};
        $scope.currentEvent = null;
        $scope.layout = {
            showExpressionBuilder: false,
            showComments: true,
            showDescription: true,
            collapsedList: false,
            showScreenEvents: true,
            readonly: false,
            saving: false,
            saved: null,
            lastSaved: null,
            isAppRoutine: false,
            buttonLabel: 'Close',
            query: {
                controls: '',
                actions: ''
            },
            panels: {
                leftOpen: false,
                rightOpen: false
            },
            sortableConfig: {
                // Object that controls the drag and drop sorting
                animation: 150,
                group: 'actions',
                handle: '.mi-ae-drag-handle',
                disabled: false,
                scroll: true,
                filter: '.ignore-elements',
                onStart: function (_evt) {
                    angular.element('.can-move').addClass('mi-ae-moving');
                },
                onEnd: function (_evt) {
                    angular.element('.can-move').removeClass('mi-ae-moving');
                    if (didShowComments) {
                        $scope.layout.showComments = true;
                    }
                },
                onAdd: function (_evt) {
                    $scope.editor.validate();
                    if (didShowComments) {
                        $scope.layout.showComments = true;
                    }
                },
                onUpdate: function (_evt) {
                    $scope.editor.validate();
                }
            }
        };
        const cleanUpActions = (actions) => {
            let modifiedActions = [...actions];
            modifiedActions.forEach(action => {
                if (isNestableAction(action.ActionId)) {
                    let groupOfDuplicates = modifiedActions.filter(x => x.ActionId === action.ActionId);
                    if (groupOfDuplicates.length > 0) {
                        // Duplicate ID found so we generate new ids for the action
                        action.generateNewIds();
                    }
                    //Handle nested actions recursively
                    switch (action.ActionId) {
                        case 1:
                            action.ActionSetOnTrue.Actions = cleanUpActions(action.ActionSetOnTrue.Actions);
                            action.ActionSetOnFalse.Actions = cleanUpActions(action.ActionSetOnFalse.Actions);
                            break;
                        case 26:
                        case 29:
                        case 38:
                            action.LoopActionSet.Actions = cleanUpActions(action.LoopActionSet.Actions);
                            break;
                        default:
                            break;
                    }
                }
            });
            return modifiedActions;
        };
        // Open Action Editor
        $scope.openEditor = async function (widget, eventName, isNested, canGoBack, isReadOnly, referencedControl, referencedControlId) {
            await currentScreenSvc.triggerScreenRefreshIfNeeded();
            console.debug('openEditor called:', {
                widget, eventName, isNested, canGoBack, isReadOnly, referencedControl, referencedControlId
            });
            console.warn('ADD FLAG TO base.js/flagInALoop() FOR LOOP THROUGH CALENDAR!!!');

            $scope.layout.showExpressionBuilder = false;

            // I know this is bad design, but considering the dealine and since we are going to change the action editor
            // we descided to verify whether the editor is for routine or just normal action editor
            $rootScope.actionEditor = {
                isAppRoutineEditor: $scope.isAppRoutineEditor,
                isReactWrapper: $scope.isReactWrapper,
                authToken: $scope.authToken,
            };

            $scope.referencedControl = referencedControl;
            $scope.referencedControlId = referencedControlId;

            if ($scope.isAppRoutineEditor) {
                initializeRoutineEditor(widget, eventName, isNested, canGoBack, isReadOnly);
            } else {
                initializeEditor(widget, eventName, isNested, canGoBack, referencedControl, referencedControlId);
            }

            var firstReferenced = document.querySelector('.is-referencing-control');
            if (firstReferenced) {
                firstReferenced.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            //Solution for PL-42724 for certain actions that need to be cleaned up, since there could be duplicate ids
            let actions = $scope.editor.selectedControl?.actionSet?.Actions;
            const shouldGenerateNewIds = actions?.some(action => isNestableAction(action.ActionId));
            if (shouldGenerateNewIds) {
                $scope.editor.selectedControl.actionSet.Actions = cleanUpActions(actions);
            }
            //end of solution for PL-42724
        };

        window.openEditor = $scope.openEditor; // TODO remove this hack

        var initializeRoutineEditor = function (widget, eventName, isNested, canGoBack, isReadOnly) {
            // This object is only created to be used for appRoutine (to save time!)
            var dummyScreenObject = {
                properties: {
                    events: [{
                        name: 'Load',
                        func: 'onLoad'
                    }]
                },
                options: {
                    Controls: [{
                        options: {
                            id: '776fda16-7611-e32a-d6c0-495af1bfd07b',
                            type: 'BTN',
                            name: 'ButtonCopy',
                            events: [{
                                id: 'a30c21dc-4bf1-82ea-caae-cdcb3d9ec37b',
                                name: 'Click',
                                func: 'onClick',
                                actionSetId: '1ec27e65-e570-6504-dd44-e3f295c424fa',
                                actionSet: {},
                                total: 0
                            }],
                            columns: [],
                            open: false
                        }
                    }],
                    Fields: [],
                    disabled: false,
                    actionSets: [],
                    events: [],
                    tableList: [],
                    canvasRef: null,
                    pageId: '00000000-0000-0000-0000-000000000000',
                    screenId: '6e7c6a60-8a22-4bd0-ac65-51494350beab',
                    versionId: '6e7c6a60-8a22-4bd0-ac65-51494350beab',
                    versionNumber: 1,
                    versionName: 'Ver.1 - 2/7/2018 2:15:08 PM',
                    screenMode: 'TEST',
                    viewName: 'Contacts',
                    isPreview: false,
                    AppRef: null,
                    Name: 'App Routine',
                    layoutHTML: '',
                    focusControl: '',
                    Type: 'SCD',
                    isModified: false,
                    designerMode: 1,
                    versionTarget: 0,
                    isDeveloper: false,
                    isShared: false,
                    onLoad: null,
                    isAppRoutineEditor: true,
                    appRoutineVersion: null,
                    featureFlags: currentScreenSvc.getFeatureFlags(),
                }
            };

            $scope.layout.isAppRoutineEditor = true;

            if (isReadOnly) {
                dummyScreenObject.options.designerMode = angular.element.mi.Constants.DesignerMode.ReadOnly;

                if ($scope.appRoutineVersion.liveVersion.Actions) {
                    $scope.routineVersion = angular.copy($scope.appRoutineVersion.liveVersion);
                }
            } else {
                if ($scope.appRoutineVersion.draftVersion.Actions) {
                    $scope.routineVersion = angular.copy($scope.appRoutineVersion.draftVersion);
                }
            }

            if (appRoutinesSvc) appRoutinesSvc.getTableList().then(
                function (tableList) {
                    currentScreenSvc.setEntireScreen(dummyScreenObject);
                    currentScreenSvc.setOption('tableList', tableList);

                    if ($scope.routineVersion) {
                        currentScreenSvc.setRoutineActionSet(angular.copy($scope.routineVersion));
                        currentScreenSvc.setOption('Name', $scope.appRoutineVersion.name);
                        currentScreenSvc.setRoutineActionSetId($scope.appRoutineVersion.routineId);
                        // Note: the next line is NOT the same as setRoutineActionSetId, the below sets on options on purpose.
                        currentScreenSvc.setOption('appRoutineId', $scope.appRoutineVersion.routineId);
                        currentScreenSvc.setOption('AppRef', $scope.appRoutineVersion.appId);
                    }

                    initializeEditor(widget, eventName, isNested, canGoBack);
                },
                function () {
                    if (notificationSvc) notificationSvc.error(mi.constants.errorMessages.generic);
                }
            );
        };

        var initializeEditor = function (widget, eventName, isNested, canGoBack, referencedControl, referencedControlId) {
            console.debug('initializeEditor called', {
                widget, eventName, isNested, canGoBack, referencedControl, referencedControlId
            });

            $scope.editor = new EditorModel($scope.isAppRoutineEditor, referencedControl, $scope.isReactWrapper);

            $scope.layout.readonly = currentScreenSvc.getOption('designerMode') === angular.element.mi.Constants.DesignerMode.ReadOnly;

            //PL-27121 Can't completely remove ProcessPayments action (legacy) because customers use it. We can filter it out from the action list.
            //Temporary method below until no customer is using "PAY" Widget or ProcessPayments (legacy) anymore. Complete removal will be from editor.js
            // if (!featureFlagSvc.canViewLegacyPaymentAction()) { // always false according to Alex
            removeLegacyPaymentAction($scope); // TODO: Refactor this out, as it's no longer needed!!!!!
            // }

            if ($scope.isAppRoutineEditor) {
                $scope.editor.setAppRoutine($scope.appRoutineVersion);
            }

            var eventId = widget === 'Screen' ? 'Screen' : widget.options.id;
            $scope.loadSelectedEvent(eventId, eventName, isNested, false);

            // Is this read only

            $scope.layout.archived = currentScreenSvc.getOption('screenMode') == 'INACTIVE';
            $scope.layout.v4 = true;
            if ($scope.layout.archived) {
                $scope.layout.pillMessage = 'Archived (Read-only)';
            } else if ($scope.layout.readonly) {
                $scope.layout.pillMessage = 'Published (Read-only)';
            } else {
                $scope.layout.pillMessage = 'Draft';
            }
            // Clear out any queries
            $scope.layout.query = {
                controls: '',
                actions: ''
            };

            // Change button label
            $scope.layout.buttonLabel = canGoBack ? 'Back' : 'Close';

            // Show Action Editor Modal
            $scope.isEditorOpen = true;
            $scope.isCopilotEnabled = currentScreenSvc.isFeatureFlagEnabled({ id: 49, name: "ActionEditorCopilot" });
            $scope.isCopilotOpen = true;
            angular.element(editorModalId).addClass('mi-ae-framework-open');

            // Resolve accountName for copilot
            if ($injector.has('sessionSvc')) {
                var copilotSessionSvc = $injector.get('sessionSvc');
                if (copilotSessionSvc.sessionData && copilotSessionSvc.sessionData.account) {
                    $scope.copilotAccountName = copilotSessionSvc.sessionData.account.name;
                } else if (typeof copilotSessionSvc.getSessionData === 'function') {
                    copilotSessionSvc.getSessionData().then(function (session) {
                        $scope.copilotAccountName = session.account.name;
                    });
                }
            }

            // Copilot: replace current action set with AI-generated one
            var toPascalCase = function (obj) {
                if (Array.isArray(obj)) return obj.map(toPascalCase);
                if (obj !== null && typeof obj === 'object') {
                    var result = {};
                    Object.keys(obj).forEach(function (key) {
                        if (obj[key] === undefined) return; // skip undefined so model defaults are preserved
                        var pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
                        result[pascalKey] = toPascalCase(obj[key]);
                    });
                    return result;
                }
                return obj;
            };

            $scope.onCopilotActionSetReplace = function (actions) {
                $scope.$apply(function () {
                    var parsedActions = toPascalCase(actions).map(function (action) {
                        // Ensure properties the model constructors check with ternary are null, not undefined
                        if (!Object.prototype.hasOwnProperty.call(action, 'ControlToUpdate')) action.ControlToUpdate = null;
                        if (!Object.prototype.hasOwnProperty.call(action, 'ResultToSet')) action.ResultToSet = null;
                        return action;
                    });
                    var modelActions = parsedActions.map(function (action) {
                        return $scope.editor.getCopyActionModel(action);
                    }).filter(Boolean);
                    $scope.editor.selectedControl.actionSet.Actions = modelActions;
                    modified = true;
                    $scope.saveEditor();
                });
            };

            // Toggle Copilot
            $scope.toggleCopilot = () => {
                $scope.isCopilotOpen = !$scope.isCopilotOpen;
                console.log('toggleCopilot:', $scope.isCopilotOpen);
            }

            // Hide intercom icon from page
            angular.element('#intercom-container').hide();

            // Setup Auto Save
            stopSaving = $interval(autoSave, autoSaveTimer);
        };

        var removeLegacyPaymentAction = function ($scope) {
            var AdvancedActionsIndex = $scope.editor.filteredAction.findIndex(function (action, index) {
                if (action.name === 'Advanced') {
                    return index;
                }
            });
            var legacyPaymentActionIndex = $scope.editor.filteredAction[AdvancedActionsIndex].actions.findIndex(function (action, index) {
                if (action.id === 28) {
                    return index;
                }
            });
            if (legacyPaymentActionIndex !== -1) {
                $scope.editor.filteredAction[AdvancedActionsIndex].actions.splice(legacyPaymentActionIndex, 1);
            }
        };

        // Close Action Editor
        $scope.closeEditor = function (dontSave) {
            function closePanel() {
                $timeout(function () {
                    $interval.cancel(stopSaving);
                    $scope.isEditorOpen = false;
                    angular.element(editorModalId).removeClass('mi-ae-framework-open');
                    angular.element('#intercom-container').show();
                    $rootScope.$broadcast('miae:closed');

                    if ($scope.isAppRoutineEditor) {
                        // This is required to unhide new shell
                        miStore.dispatch({
                            type: 'ROUTE.CHANGE_NAME',
                            payload: 'appManager.routinesEditVersion'
                        });
                    }
                }, 250);
            }

            if (dontSave === undefined && currentScreenSvc.getOption('designerMode') !== angular.element.mi.Constants.DesignerMode.ReadOnly) {
                $scope.saveEditor().then(
                    function () {
                        closePanel();
                    },
                    function () {
                        closePanel();
                    }
                );
            } else {
                closePanel();
            }
        };

        $scope.saveEditor = function () {
            var deferred = $q.defer();

            if (!modified) {
                deferred.resolve();
                return deferred.promise;
            }

            // console.info("Running AutoSave");
            $scope.layout.saving = true;
            editorSvc.saveActionEditor($scope.editor);

            if ($scope.isAppRoutineEditor) {
                saveAppRoutineVersion().then(
                    function () {
                        deferred.resolve();
                    },
                    function () {
                        deferred.reject();
                    }
                );

                return deferred.promise;
            }

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

            if (typeof this.dsSave !== "undefined") {
                this.dsSave(true).then(
                    function () {
                        $scope.layout.saving = false;
                        $scope.layout.saved = moment();
                        modified = false;
                        deferred.resolve();
                    },
                    function (error) {
                        const errorMessage = error?.message || mi.constants.errorMessages.generic;
                        if (notificationSvc) notificationSvc.error(errorMessage);
                        deferred.reject(error);
                    }
                );
            } else {
                deferred.reject();
            }

            return deferred.promise;
        };

        var saveAppRoutineVersion = function () {
            var deferred = $q.defer();

            const actionSets = currentScreenSvc.getActionSets();
            if (!actionSets || actionSets.length === 0) {
                deferred.resolve();
                return deferred.promise;
            }

            function resetEditor() {
                $scope.layout.saving = false;
                $scope.layout.saved = moment();
                modified = false;
            }

            $scope.appRoutineVersion.draftVersion.Actions = angular.copy($scope.editor.selectedControl.actionSet.Actions);
            var appId = $scope.appRoutineVersion.appId;
            var routineId = $scope.appRoutineVersion.routineId;
            var versionId = $scope.appRoutineVersion.draftVersion.VersionId;

            var appRoutine = angular.copy($scope.appRoutineVersion.draftVersion);
            appRoutine.Actions = angular.copy($scope.editor.selectedControl.actionSet);

            // Backend expects actionSet
            // $scope.appRoutineVersion.draftVersion.ActionSet = appRoutine.Actions;

            if (appRoutinesSvc) appRoutinesSvc.updateRoutineVersion(appId, routineId, $scope.appRoutineVersion.name, versionId, appRoutine).then(
                function (_version) {
                    resetEditor();
                    deferred.resolve();
                    $scope.triggerSave({
                        version: $scope.appRoutineVersion.draftVersion
                    });
                },
                function () {
                    deferred.reject();
                    resetEditor();
                }
            );

            return deferred.promise;
        };

        // Open Left Panel
        $scope.openLeftPanel = function ($event) {
            currentScreenSvc.sendAnalytics('Opened action navigator');
            if ($event !== undefined) {
                $event.stopPropagation();
            }
            $scope.layout.panels = {
                leftOpen: true,
                rightOpen: false
            };
            $timeout(function () {
                angular.element('#aeControlSearch').focus();
            }, 100);
        };

        // Open Right Panel
        $scope.openRightPanel = function ($event, helpInfo) {
            if ($event !== undefined) {
                $event.stopPropagation();
            }
            $scope.layout.panels = {
                leftOpen: false,
                rightOpen: true
            };
            $scope.layout.helper = helpInfo;
        };

        // Close all side panels
        $scope.closePanels = function ($event) {
            if ($event !== undefined) {
                $event.stopPropagation();
            }
            $scope.layout.panels = {
                leftOpen: false,
                rightOpen: false
            };
        };

        // Select Control Event
        $scope.loadSelectedEvent = function (eventId, eventName, isNested, sendAnalytics) {
            if (sendAnalytics) {
                currentScreenSvc.sendAnalytics('Clicked event in action navigator');
            }

            if (newScope) {
                newScope.$destroy();
            }

            $scope.collapsedList = false;

            $scope.editor = $scope.editor.selectEvent(eventId, eventName, isNested, $scope.layout && $scope.layout.readonly);
            $scope.eventStack = [];

            $scope.firstEvent = {
                eventId,
                eventName: eventName,
                caption: $scope.editor.selectedControl.name + ' (' + $scope.editor.selectedControl.funcName + ')',
                isNested
            };
            $scope.currentEvent = $scope.firstEvent;

            // Close All Panels
            $scope.closePanels();

            // Open Control Menu in Left Panel
            $scope.openControlMenu();

            // Load new action page
            $scope.loadPage(newActionTmpl);
        };

        $scope.pushSelectedEvent = function (eventId, eventName, isNested) {
            $scope.eventStack.push({
                eventId: $scope.currentEvent.eventId,
                eventName: $scope.currentEvent.eventName,
                caption: $scope.currentEvent.caption,
                isNested: $scope.currentEvent.isNested
            });
            $scope.editor = $scope.editor.selectEvent(eventId, eventName, isNested);
            $scope.currentEvent = {
                eventId,
                eventName: eventName,
                caption: $scope.editor.selectedControl.name + ' (' + $scope.editor.selectedControl.funcName + ')',
                isNested
            };

            $scope.collapsedList = false;
            // Close All Panels
            $scope.closePanels();
            $scope.loadPage(newActionTmpl);
        };

        $scope.popEventStack = function () {
            var previous = $scope.eventStack.pop();
            $scope.currentEvent = previous;
            $scope.collapsedList = false;
            // Close All Panels
            $scope.closePanels();
            $scope.editor = $scope.editor.selectEvent(previous.eventId, previous.eventName, previous.isNested);
            $scope.loadPage(newActionTmpl);
        };

        $scope.jumpToFirstEventInStack = function () {
            $scope.eventStack = [];
            $scope.currentEvent = $scope.firstEvent;
            $scope.collapsedList = false;
            // Close All Panels
            $scope.closePanels();
            $scope.editor = $scope.editor.selectEvent($scope.firstEvent.eventId, $scope.firstEvent.eventName, $scope.firstEvent.isNested);
            $scope.loadPage(newActionTmpl);
        };

        // Set Control Menu as Open
        $scope.openControlMenu = function () {
            if ($scope.editor.selectedControl.id !== null) {
                angular.forEach($scope.editor.menu, function (section) {
                    angular.forEach(section.controls, function (cntrl) {
                        cntrl.open = $scope.editor.selectedControl.id !== cntrl.id ? false : true;
                    });
                });
            }
        };

        $scope.addAction = function (action) {
            isNew = true;
            $scope.action = new action.model();
            $scope.editor.addAction($scope.action, position);
            position = null;
            $scope.loadPage(action.template);
        };

        $scope.isActionSelected = function (thisAction) {
            return thisAction === $scope.action;
        };

        $scope.isIncompatible = function (thisAction) {
            return (
                thisAction.ValidationMessages &&
                thisAction.ValidationMessages.some(function (validation) {
                    return validation.Message === 138;
                })
            );
        };

        $scope.isUsingControl = function (thisAction) {
            if (typeof thisAction.isUsingControl === 'function') {
                var actionSets = thisAction.ActionId === 30 ? $scope.editor.listAllActionSets($scope.editor.selectedControl.actionSetId) : [];

                return thisAction.isUsingControl($scope.referencedControlId, actionSets);
            }

            return false;
        };

        // Load new page
        $scope.loadPage = function (template) {
            if (newScope) {
                newScope.$destroy();
            }

            // Clear existing action from scope if adding new page
            if (template === newActionTmpl) {
                $scope.action = null;
                $timeout(function () {
                    angular.element('#actionSearch').focus();
                }, 200);
            }

            // Don't validate the action editor when creating a new action
            if ($scope?.editor) {
                if (!isNew) {
                    $scope.editor.validate();
                } else {
                    isNew = false;
                }
                $scope.editor.linkActionResults();
            } else {
                alert('Oops! Something went wrong.');
                $scope.closeEditor(true);
                return;
            }

            $scope.layout.query = '';

            newScope = $scope.$new();

            let templateElement = $compile(template)(newScope);

            angular.element(editorModalContentId).html(templateElement);
            $scope.$applyAsync();
        };

        // Process copy action
        $scope.processCopyAction = function () {
            var currentAr = editorSvc.getArSet();
            // Copy and create each action
            $scope.copyActions.action.value.forEach(function (action) {
                var newAction = $scope.editor.getCopyActionModel(angular.copy(action));
                if (newAction) {
                    if (isNestableAction(newAction.ActionId)) {
                        newAction.generateNewIds();
                    }
                    $scope.editor.addAction(newAction);
                }
            });

            // Link the new action results
            $scope.editor.linkActionResults();

            // Get all the new action results
            var newAr = editorSvc.getArSet();

            var replace = function findAndReplace(object, value, replacevalue) {
                for (var x in object) {
                    if (Object.prototype.hasOwnProperty.call(object, x)) {
                        if (typeof object[x] === 'object') {
                            findAndReplace(object[x], value, replacevalue);
                        }
                        if (object[x] === value) {
                            object[x] = replacevalue;
                        }
                    }
                }
            };

            angular.forEach(currentAr, function (prevAr) {
                // Loop through the current action results
                angular.forEach(newAr, function (currAr) {
                    if (prevAr.name === currAr.name && prevAr.id !== currAr.id) {
                        replace($scope.editor.selectedControl.actionSet.Actions, prevAr.id, currAr.id);
                    }
                });
            });

            $scope.editor.linkActionResults();

            // Re-link action results
            $scope.copyActions.control = $scope.copyActions.menu[0];
            $scope.loadPage(newActionTmpl);
        };

        // Get the total number of actions
        $scope.getAcountCount = function (arr, total) {
            arr.forEach(function (action) {
                total++;

                if (action.ActionId === 1) {
                    if (action.ActionSetOnTrue !== null) {
                        total = $scope.getAcountCount(action.ActionSetOnTrue.Actions, total);
                    }
                    if (action.ActionSetOnFalse !== null) {
                        total = $scope.getAcountCount(action.ActionSetOnFalse.Actions, total);
                    }
                }

                if (action.ActionId === 26 || action.ActionId === 29 || action.ActionId === 38 || action.ActionId === 55) {
                    total = $scope.getAcountCount(action.LoopActionSet.Actions, total);
                }
            });

            return total;
        };

        // When selected control has changed get all available actions a user can copy
        $scope.$watch('editor.selectedControl', function (curr, _prev) {
            $scope.copyActions.menu = [];

            if (curr !== null) {
                if ($scope.editor?.menu) {
                    $scope.editor.menu.forEach(function (section) {

                        section.controls.forEach(function (menu) {
                            //   if(menu.id !== $scope.editor.selectedControl.id) {
                            var eventList = [];

                            // Events
                            menu.events.forEach(function (evt) {
                                if (evt.actionSet !== null && evt.actionSet.Actions.length > 0) {
                                    var actions = evt.actionSet.Actions,
                                        count = actions.length > 0 ? $scope.getAcountCount(actions, 0) : 0;

                                    eventList.push({
                                        category: 'Control Events',
                                        name: evt.name + ' (' + count + ')',
                                        actions: actions
                                    });
                                }
                            });

                            // Columns
                            if (menu?.columns) {
                                menu.columns.forEach(function (evt) {
                                    if (evt.actionSet !== null && evt.actionSet.Actions.length > 0) {
                                        var actions = evt.actionSet.Actions,
                                            count = actions.length > 0 ? $scope.getAcountCount(actions, 0) : 0;

                                        eventList.push({
                                            category: menu.type === 'GRD' ? 'Column Click' : 'Editable Grid Field',
                                            name: evt.name + ' (' + count + ')',
                                            actions: actions
                                        });
                                    }
                                });
                            }

                            // Buttons
                            if (menu?.buttons) {
                                menu.buttons.forEach(function (evt) {
                                    if (evt.actionSet !== null && evt.actionSet.Actions.length > 0) {
                                        var actions = evt.actionSet.Actions,
                                            count = actions.length > 0 ? $scope.getAcountCount(actions, 0) : 0;

                                        eventList.push({
                                            category: 'Button Click',
                                            name: evt.name + ' (' + count + ')',
                                            actions: actions
                                        });
                                    }
                                });
                            }

                            if (eventList.length > 0) {
                                $scope.copyActions.menu.push({
                                    label: menu.name,
                                    id: menu.id,
                                    category: section.name,
                                    events: eventList.sort((a, b) => a.name.localeCompare(b.name))
                                });
                            }
                            //  }
                        });
                    });

                    $scope.editor.screenEvents.forEach(function (screenEvent) {
                        var actionSet = screenEvent.actionSet;

                        if (actionSet !== null && actionSet.Actions.length > 0) {
                            var count = $scope.getAcountCount(actionSet.Actions, 0);

                            $scope.copyActions.menu.push({
                                label: screenEvent.name + ' (' + count + ')',
                                id: screenEvent.id,
                                category: 'Screen',
                                actions: actionSet.Actions
                            });
                        }
                    });

                    $scope.copyActions.menu = $scope.copyActions.menu.sort((a, b) => a.label.localeCompare(b.label));
                    $scope.copyActions.control = $scope.copyActions.menu[0];
                }
            }
        });

        // When a new control is selected build the events listing
        $scope.$watch(
            'copyActions.control',
            function (curr, prev) {
                if (curr !== prev && curr !== null && curr !== undefined) {
                    $scope.copyActions.actionList = [];

                    if (curr.category !== 'Screen') {
                        curr.events.forEach(function (evt) {
                            $scope.copyActions.actionList.push({
                                category: evt.category,
                                label: evt.name,
                                value: evt.actions
                            });
                        });
                    }

                    $scope.copyActions.action =
                        $scope.copyActions.actionList.length > 0 ?
                            $scope.copyActions.actionList[0] :
                            {
                                label: curr.label,
                                value: curr.actions
                            };
                }
            },
            true
        );

        $scope.$watch(
            'editor.menu',
            function (curr, prev) {

                if (curr !== undefined && curr !== prev && prev !== undefined) {
                    modified = true;
                }
            },
            true
        );

        $scope.$watch(
            'editor.screenEvents',
            function (curr, prev) {
                if (curr !== undefined && curr !== prev && prev !== undefined) {
                    modified = true;
                }
            },
            true
        );

        // Event listeners
        $scope.$on('miae:newaction', function (evt, params) {
            position = params !== undefined && params.position ? params.position : null;
            $scope.loadPage(newActionTmpl);
        });

        $scope.$on('miae:editaction', function (evt, params) {
            $scope.layout.showExpressionBuilder = false;
            $scope.action = params.action;
            $scope.loadPage(params.action.config.template);
        });

        $scope.$on('miae:pasteaction', function (evt, params) {
            var copy = $sessionStorage['miae:copyaction'],
                group = $filter('filter')($scope.editor.actions, {
                    actions: {
                        id: copy.ActionId
                    }
                }, true),
                action = $filter('filter')(group[0].actions, {
                    id: copy.ActionId
                }, true);


            if (action.length === 1) {
                var newAction = new action[0].model(copy);

                if (isNestableAction(newAction.ActionId)) {
                    newAction.generateNewIds();
                }

                $scope.editor.addAction(newAction, params.position);
                $sessionStorage['miae:copyaction'] = null;
                $rootScope.$broadcast('miae:hasPaste', {
                    trigger: false
                });
            }
        });

        $scope.$on('miae:renameAR', function (evt, params) {
            $scope.editor.renameActionResult(params.name, params.id);
        });

        $scope.filterAppRoutineInputValue = function (action) {
            // Only ActionResultModel is an input value for app routine            
            return action.ActionId === 0 ? !action.IsAppRoutineInputValue : true;
        };

        $scope.filterCategories = function (category) {
            if (!$scope.layout.query.actions) return true; // Show all categories if no filter is applied

            // Filter the actions based on the search query
            let filteredActions = category.actions.filter(action =>
                action.name.toLowerCase().includes($scope.layout.query.actions.toLowerCase())
            );

            return filteredActions.length > 0; // Keep category if it has at least one matching action
        };

        $scope.getScreensForApp = function (appId) {
            // NOTE: This function is ONLY CALLED from one template conditionally and it's App Routines Only!!
            $scope.copyActions.screens = {
                all: [],
                selected: null
            };
            $scope.copyActions.controls = {
                all: [],
                selected: null
            };
            $scope.copyActions.events = {
                all: [],
                selected: null
            };

            $scope.copyActions.action = null;

            var manageAppsSvc;
            if ($injector.has('manageAppsSvc')) {
                manageAppsSvc = $injector.get('manageAppsSvc');
                console.debug(`I am "ActionEditorCtrl" and I found "manageAppsSvc" by asking $injector.`);
            } else {
                console.debug(`I am "ActionEditorCtrl" and I needed access to "manageAppsSvc" from legacy and I did not get it!`);
            }

            if (manageAppsSvc) manageAppsSvc.getScreensForApp(appId).then(function (screens) {
                $scope.copyActions.screens.all = screens;
            });
        };

        $scope.getControlsFroScreen = function (screenId) {
            $scope.copyActions.controls = {
                all: [],
                selected: null
            };
            $scope.copyActions.events = {
                all: [],
                selected: null
            };
            var sessionSvc;
            if ($injector.has('sessionSvc')) {
                sessionSvc = $injector.get('sessionSvc');
                console.debug(`I am "ActionEditorCtrl" and I found "sessionSvc" by asking $injector.`);
                sessionSvc.getSessionData().then(function (session) {
                    var accountName = session.account.name;
                    var userIdentity = session.user.methodIdentity;
                    if (appRoutinesSvc) appRoutinesSvc.getScreen(accountName, userIdentity, screenId).then(
                        function (screen) {
                            $scope.copyActions.controls.all = screen.controls.filter(function (control) {
                                return control.caption;
                            });
                            $scope.copyActions.screens.selected.isShared = screen.isShared;
                        },
                        function (_err) {
                            if (notificationSvc) notificationSvc.error(mi.constants.errorMessages.generic);
                        }
                    );
                });
            } else {
                console.debug(`I am "ActionEditorCtrl" and I needed access to "sessionSvc" from legacy and I did not get it!`);
            }
        };

        $scope.getEventsForControl = function (control) {
            $scope.copyActions.events = {
                all: [],
                selected: null
            };
            $scope.copyActions.events.all = [];

            // Dev notes September 2024: PL-48500 I don't know whether the original author's intention below was to include the fallthrough effect,
            // or whether it was simply an oversight that they did not inlude break statements. I found that the logic under BGR and CAL was identical,
            // so I collapsed those on purpose. My inclination is there should probably be break statements here, however it has been operating
            // this way for who-knows-how-long, so I did not want to risk changing it at the time of the m-one build spike, to avoid possible defects.
            /* eslint-disable no-fallthrough */
            switch (control.type) {
                case 'EDT':
                    var editableGrid = [control];
                    var editableGridControls = control.columns.concat(editableGrid);

                    angular.forEach(editableGridControls, function (gridControl) {
                        var columnName = '';
                        if (gridControl.header) {
                            columnName = gridControl.header;
                        }

                        angular.forEach(gridControl, function (value, key) {
                            if (key.startsWith('on') && value) {
                                $scope.copyActions.events.all.push({
                                    id: value,
                                    label: columnName + ' ' + key
                                });
                            }
                        });
                    });
                case 'BGR':
                case 'CAL':
                    angular.forEach(control.buttons, function (button) {
                        if (button.onClick) {
                            $scope.copyActions.events.all.push({
                                id: button.onClick,
                                label: button.name
                            });
                        }
                    });
                default:
                    angular.forEach(control, function (value, key) {
                        if (key.startsWith('on') && value) {
                            $scope.copyActions.events.all.push({
                                id: value,
                                label: key
                            });
                        }
                    });
            }
            /* eslint-enable no-fallthrough */
        };

        $scope.getActionSet = function (screen, eventId) {
            if (appRoutinesSvc) appRoutinesSvc.getActionSet(screen.id, eventId, screen.isShared).then(
                function (result) {
                    if (result.length > 0) {
                        $scope.copyActions.action = {
                            value: result[0].Actions
                        };
                    }
                },
                function (_err) {
                    if (notificationSvc) notificationSvc.error(mi.constants.errorMessages.generic);
                }
            );
        };
    }
};

ActionEditorCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$injector',
    '$q',
    '$timeout',
    '$compile',
    '$sessionStorage',
    '$filter',
    '$interval',
    'editorSvc',
    'currentScreenSvc',
    'EditorModel',
];
