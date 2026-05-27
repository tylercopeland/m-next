// NOTE: This service is written as part of 2024 conversion of `Action Editor` for use
// in new `App Builder` without breaking `Designer.` It is designed to centralize references
// to glblScreenWidget. PL-50048
export default function currentScreenSvc() {

    // PRIVATE FUNCTIONS AND DATA
    let _initialized = false;
    let _mode; // 'GLOBAL', 'REACT'

    let _getOldWidget = () => window.glblScreenWidget;

    /* activate debugging:
    const _debug = (str, _data) => {
        console.debug(`currentScreenSvc: ${str}`, { _mode, ..._data });
    } //*/

    // suppress debugging:
    const _debug = () => null; //*/

    // PUBLIC FUNCTIONS
    let _reactFunctions;
    const getReactFunctions = () => {
        _debug('getReactFunctions();');
        return _reactFunctions; // avoid stale reference
    }

    const initialize = (isReactWrapper) => {
        _debug('initialize();', { _initialized });
        if (_initialized) return true;
        if (isReactWrapper) {
            _mode = 'REACT';

            // We need to surface a collection of named function references that React can overwrite on $scope.
            _reactFunctions = {
                // refresher:
                triggerScreenRefreshIfNeeded : () => null,

                // getters
                getActionSets: () => null, // implemented
                getActionSetById: () => null, // implemented
                getControls: () => null, // implemented
                getEvents: () => null, // implemented
                getEventById: () => null, // implemented
                getOption: () => null, // implemented
                getScreenEventsFromProperties: () => null, // implemented
                getScreenList: () => null, // implemented
                getTableFields: () => null,
                isFeatureFlagEnabled: () => null,
                getFeatureFlags: () => null,

                // setters
                setActionSets: () => null, // implemented
                setEvents: () => null, // implemented
                setOption: () => null, // implemented
                setControl: () => null, // implemented

                // smuggled helpers ( REACT NEEDS ALL )
                findReferences: () => null, // implemented
                HandleFoundReferences: () => null, // implemented
                sanitizeHTMLLayout: () => null, // implemented
                saveScreen: () => null,
                sendAnalytics: () => null, // implemented
                setRefreshOverride: () => null, // implemented
            }

            _debug('reactFunctions', _reactFunctions);

            _initialized = true;
            return true;
        } else if (typeof window.glblScreenWidget !== "undefined") {
            _mode = 'GLOBAL';
            _debug(`"glblScreenWidget" was found on window and will be used by currentScreenSvc.`);
            _initialized = true;
            return true;
        }
        console.error(`currentScreenSvc: "glblScreenWidget" was undefined and isReactWrapper is false. Action Editor cannot start.`);
        return false;
    }

    // GETTERS
    const getActionSets = () => {
        _debug('getActionSets();');
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getActionSets();
            case 'GLOBAL':
                return _getOldWidget().options.actionSets;
        }
    };

    const getActionSetById = (actionSetId) => {
        _debug('getActionSetById(actionSetId);', { actionSetId });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getActionSetById(actionSetId);
            case 'GLOBAL':
                return getActionSets()[actionSetId];
        }
    };

    const getControls = () => {
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getControls();
            case 'GLOBAL':
                return _getOldWidget().options.Controls;
        }
    };

    const getEvents = () => {
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getEvents();
            case 'GLOBAL':
                // Note: options.events is different from properties.events.
                return _getOldWidget().options.events;
        }
    };

    const getEventById = (eventId) => {
        _debug('getEventById(eventId);', { eventId });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getEventById(eventId);
            case 'GLOBAL':
                return getEvents()[eventId];
        }
    };

    const isFeatureFlagEnabled = (featureFlag) => {
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.isFeatureFlagEnabled(featureFlag.name);
            case 'GLOBAL':
                return _getOldWidget().options?.featureFlags[featureFlag.id] ?? false;
        }
    };

    const getFeatureFlags = () => {
        switch (_mode) {
            case 'REACT':
                // Not implemented
                break;
            case 'GLOBAL':
                return _getOldWidget().options?.featureFlags;
        }
    };

    const getOption = (optionName) => {
        // Here is a complete list of optionNames that are GOT by `getOption` in action-editor: [
        // AppRef (used as appId),
        // appRoutineId (probably safe to ignore)
        // canvasRef (some tricky html thing where if it doesn't work it will break screenToJsonSvc)
        // designerMode,
        // isAppRoutineEditor (safe to ignore in react as undefined will test falsy)
        // isDeveloper,
        // Name (used as editor title)
        // onActiveRecordChange
        // onFocus
        // onLoad
        // screenMode,
        // tableList
        // versionTarget,
        // ]
        let foundOption;
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getOption(optionName);
            case 'GLOBAL':
                foundOption = _getOldWidget()?.options[optionName];
                _debug(`currentScreenSvc.getOption('${optionName}'): ${foundOption}`);
                return foundOption;
        }
    };

    const getScreenEventsFromProperties = () => {
        // this seems only used once at the beginning, but it's important (I think!)
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getScreenEventsFromProperties();
            case 'GLOBAL':
                // Note: `events` that comes in from properties.events is NOT the same as options.events
                return _getOldWidget().properties.events;
        }
    };

    const getScreenList = () => {
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getScreenList();
            case 'GLOBAL':
                // Global shouldn't need this function
                _debug('currentScreenSvc.getScreenList() is not implemented for GLOBAL mode.');
                return [];
        }
    }

    const getTableFields = (tableName) => {
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.getTableFields(tableName);
            case 'GLOBAL':
                // Global shouldn't need this function
                _debug('currentScreenSvc.getTableFields() is not implemented for GLOBAL mode.');
                return [];
        }
    }


    // SETTERS
    const setActionSets = (newActionSets) => {
        _debug('setActionSets(newActionSets);', { newActionSets });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.setActionSets(newActionSets);
            case 'GLOBAL':
                window.glblScreenWidget.options.actionSets = newActionSets;
        }
    };

    const setRoutineActionSet = (actionSet) => {
        // THIS IS ONLY USED BY APP ROUTINE EDITOR, Can ignore for react!!        
        window.glblScreenWidget.options.Controls[0].options.events[0].actionSet = actionSet;
    };

    const setRoutineActionSetId = (actionSetId) => {
        // THIS IS ONLY USED BY APP ROUTINE EDITOR, Can ignore for react!!        
        window.glblScreenWidget.options.Controls[0].options.events[0].actionSet.ActionSetId = actionSetId;
    };

    const setEntireScreen = (newScreenWidget) => {
        // THIS IS ONLY USED BY APP ROUTINE EDITOR, Can ignore for react!!        
        window.glblScreenWidget = angular.copy(newScreenWidget);
    };

    const setEvents = (newEvents) => {
        _debug('setEvents(newEvents);', { newEvents });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.setEvents(newEvents);
            case 'GLOBAL':
                // Note: options.events is different from properties.events.
                window.glblScreenWidget.options.events = newEvents;
        }
    };

    const setOption = (optionName, value) => {
        // Here is a complete list of optionNames that are SET by `setOption` in action-editor: [
        // AppRef, (app routines only for setOption, but used by getOption)
        // appRoutineId, (app routines only)
        // Name, (app routines only)
        // ScreenEvents, fires saveActionEditor
        // tableList, (app routines only)
        // ]
        _debug(`currentScreenSvc.setOption('${optionName}'):`, { value });
        switch (_mode) {
            case 'REACT':
                _reactFunctions.setOption(optionName, value);
                break;
            case 'GLOBAL':
                window.glblScreenWidget.options[optionName] = value;
                break;
        }
    };

    const setControl = (controlId, value) => {
        // Here is a complete list of optionNames that are SET by `setOption` in action-editor: [
        // AppRef, (app routines only for setOption, but used by getOption)
        // appRoutineId, (app routines only)
        // Name, (app routines only)
        // ScreenEvents, fires saveActionEditor
        // tableList, (app routines only)
        // ]
        _debug(`currentScreenSvc.setControl('${controlId}'):`, { value });
        switch (_mode) {
            case 'REACT':
                _reactFunctions.setControl(controlId, value);
                break;
            case 'GLOBAL':
                // Do nothing (this is never called, a different function is assigned as 'dsSave' in editor-ctrl)
                break;
        }
    };

    // OLD SMUGGLED HELPER FUNCTIONS
    const findReferences = (obj) => {
        _debug('findReferences(obj);', { obj });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.findReferences(obj);
            case 'GLOBAL':
                if (typeof _getOldWidget().findReferences === 'function')
                    return _getOldWidget().findReferences(obj);
                return false; // unsafe to return obj.
        }
    };

    const HandleFoundReferences = (obj) => {
        _debug('HandleFoundReferences(obj);', { obj });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.HandleFoundReferences(obj);
            case 'GLOBAL':
                if (typeof _getOldWidget().HandleFoundReferences === 'function')
                    /* return */ _getOldWidget().HandleFoundReferences(obj);
            // No return value is expected
        }
    };

    const sanitizeHTMLLayout = (str) => {
        _debug('sanitizeHTMLLayout(str);', { str });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.sanitizeHTMLLayout(str);
            case 'GLOBAL':
                if (typeof _getOldWidget()._sanitizeHTMLLayout === 'function')
                    return _getOldWidget()._sanitizeHTMLLayout(str);
                return false; // unsafe to return str.
        }
    };

    const saveScreen = (opt) => { // Note: opt is always boolean true in action-editor
        switch (_mode) {
            case 'REACT': {
                // _reactFunctions.saveScreen is not a Promise but it will handle like one.
                var deferred = $.Deferred();
                const resolveFn = (result) => {
                    _debug('resolveFn was called', { result });
                    deferred.resolve(result);
                }
                const rejectFn = (error) => {
                    _debug('rejectFn was called', { error });
                    deferred.reject(error);
                }
                _reactFunctions.saveScreen(opt, resolveFn, rejectFn);
                return deferred.promise();
            }
            case 'GLOBAL': {
                // Do nothing (this is never called, a different function is assigned as 'dsSave' in editor-ctrl)
            }
        }
    }

    const sendAnalytics = (str) => {
        _debug('sendAnalytics(str);', { str });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.sendAnalytics(str);
            case 'GLOBAL':
                if (typeof _getOldWidget().SendAnalytics === 'function') {
                    _getOldWidget().SendAnalytics(str);
                }
                else {
                    _debug(`No 'SendAnalytics' found to sent this message: "${str}"`);
                }
        }
    };

    const triggerScreenRefreshIfNeeded = async () => {
        _debug('triggerScreenRefreshIfNeeded();');
        switch (_mode) {
            case 'REACT':
                return await _reactFunctions.triggerScreenRefreshIfNeeded();
            case 'GLOBAL':
                return true; // GNDN
        }
    };

    const setRefreshOverride = (override) => {
        _debug('setRefreshOverride(override);', { override });
        switch (_mode) {
            case 'REACT':
                return _reactFunctions.setRefreshOverride(override);
            case 'GLOBAL':
                return; // do nothing, should never be called
        }
    };

    return {

        // public
        initialize,
        getReactFunctions, // To be attached to scope in editor-ctrl
        triggerScreenRefreshIfNeeded, // Will only trigger functionality in React Wrapper.

        // getters
        getActionSets, // REACT NEEDS
        getActionSetById, // REACT NEEDS
        getControls, // REACT NEEDS
        getEvents, // REACT NEEDS
        getEventById, // REACT NEEDS
        getOption, // REACT NEEDS
        getScreenEventsFromProperties, // REACT NEEDS
        getScreenList, // REACT ONLY
        getTableFields, // REACT ONLY
        isFeatureFlagEnabled, // REACT NEEDS
        getFeatureFlags, // REACT NEEDS

        // setters
        setActionSets, // REACT NEEDS
        setRoutineActionSet, // Only for App-Routines
        setRoutineActionSetId, // Only for App-Routines
        setEntireScreen, // Only for App-Routines
        setEvents, // REACT NEEDS
        setOption, // Only for App-Routines
        setControl,

        // smuggled helpers ( REACT NEEDS ALL )
        findReferences,
        HandleFoundReferences,
        sanitizeHTMLLayout,
        saveScreen,
        sendAnalytics,
        setRefreshOverride,

    };
}

currentScreenSvc.$inject = [];