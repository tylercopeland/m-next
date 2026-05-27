/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import loadActionEditor from '../entrypoint.for-react-wrapper';
import { ReactActionEditorWrapperProps } from '../types/ReactActionEditorWrapper';
import { ConvertJsonKeysToCamelCase } from './ConvertJsonKeysToCamelCase';
import { sanitizeHTMLLayout } from './SanitizeHtmlLayout';
import { GrabControlEvents } from './MapControlsToEvents';
import { findReferences, handleFoundReferences } from './References';

interface RefreshOverride {
  id: string;
  field: string; // field can be a nested property separated by '.' ex model.drilldownEnabled
  value: any;
}

const getHostName = () => {
  const { hostname } = window.location;

  const parts = hostname.split('.');

  if (parts.length > 2 && ((parts[parts.length - 2]?.length ?? 0) <= 3 || (parts[parts.length - 1]?.length ?? 0) <= 3)) {
    // Check if it's a known TLD like 'co.uk' or a short TLD
    return parts.slice(-2).join('.'); // For example, 'example.co.uk'
  } else if (parts.length > 2) {
    // General case for subdomains, e.g., 'sub.example.com'
    return parts.slice(-2).join('.'); // Returns 'example.com'
  } else {
    // Case for naked domains, e.g., 'example.com'
    return hostname;
  }
};

const getGatewayUrl = () => {
  const host = getHostName();
  return host === 'methodlocal.com' ? `https://api.${host}/v2/` : `https://api.${host}/`;
};

const getDesignerUrl = () => {
  const host = getHostName();
  return `https://designer.${host}/`;
};

const ReactActionEditorWrapper: React.FC<ReactActionEditorWrapperProps> = ({
  appId,
  screenId,
  versionId,
  userSession,
  isAppRoutineEditor = false,
  isReactWrapper = true,
  toast = null,
  onAfterSave = null,
  isV4Screen = false,
}) => {
  const actionEditorElement = useRef<HTMLDivElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSvcsInitialized, setIsSvcsInitialized] = useState(false);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [screenData, setScreenData] = useState<any | null>(null);
  const [screenList, setScreenList] = useState<any | null>(null);
  const [sessionData, setSessionData] = useState<any | null>(null);
  const [controlsData, setControlsData] = useState<any | null>(null);
  const [eventsData, setEventsData] = useState<any | null>(null);
  const [actionSetsData, setActionSetsData] = useState<any | null>(null);
  const [accountTables, setAccountTables] = useState<any | null>(null);
  const [needsSave, setNeedsSave] = useState(false);
  const [afterSaveCallback, setAfterSaveCallback] = useState<((...args: any[]) => void) | null>(null);
  const [afterSaveFailback, setAfterSaveFailback] = useState<((...args: any[]) => void) | null>(null);
  const [refreshOverride, setRefreshOverride] = useState<RefreshOverride | null>(null);

  // activate debugging:
  const _debug = (_str: string, _data?: any) => {
    // console.debug(`ReactActionEditorWrapper: ${_str}`, typeof _data === 'string' ? _data : { ..._data });
  }; //*/

  /* suppress debugging:
    const _debug = (_a: string, _b?: any) => null; //*/

  const stripUnwantedProperties = (obj: any): any => {
    // Strip AngularJS garbage $$properties
    if (typeof obj !== 'object' || obj === null) return obj;
    return Array.isArray(obj)
      ? obj.map(stripUnwantedProperties)
      : Object.fromEntries(
          Object.entries(obj)
            .filter(([key]) => !key.startsWith('$$'))
            .map(([key, value]) => [key, stripUnwantedProperties(value)]),
        );
  };

  const dynamicSessionSvc = useCallback(
    () => ({
      getSessionData: () => sessionData,
      sessionData: sessionData,
    }),
    [sessionData],
  );

  const dynamicAppRoutinesSvc = () => ({
    appRoutineStatus: {
      inDev: 0,
      archived: 1,
      live: 2,
    },
    getRoutine: (appId: string, routineId: string, status: number) => {
      const url = status
        ? `/apps/${appId}/routines/${routineId}?status=${status}`
        : `/apps/${appId}/routines/${routineId}`;
      return fetch(window.location.origin + url)
        .then((response) => response.json())
        .then((json) => {
          _debug('Got Routine Data:', json.Data);
          return ConvertJsonKeysToCamelCase(json.Data);
        });
    },
    getAllRoutines: (appId: string, status: number) => {
      const url = status ? `/apps/${appId}/routines?status=${status}` : `/apps/${appId}/routines`;
      return fetch(window.location.origin + url)
        .then((response) => response.json())
        .then((json) => {
          _debug('Got All Routines Data:', json.Data);
          return ConvertJsonKeysToCamelCase(json.Data);
        });
    },
  });

  useEffect(() => {
    // Initialize everything (first load of angular action editor).
    loadActionEditor();
    fetch(window.location.origin + '/apps/api/system/GetSessionData')
      .then((response) => response.json())
      .then((json) => {
        _debug('Session Data:', json.Data);
        setSessionData(ConvertJsonKeysToCamelCase(json.Data));
        setIsInitialized(true);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Initialize additional services if the session data is ready.
    if (!sessionData) return;
    const module = window.angular.module('method');
    if (toast) module.service('notificationSvc', () => toast); // 😎😎😎 Action-Editor only ever calls `notificationSvc.error(str)`
    module.service('sessionSvc', dynamicSessionSvc);
    module.service('appRoutinesSvc', dynamicAppRoutinesSvc);
    setIsSvcsInitialized(true);
  }, [sessionData]);

  useEffect(() => {
    // Trigger Save when needed.
    if (!needsSave) return;
    saveScreenDataToV1Endpoint();
  }, [needsSave, actionSetsData, eventsData]);

  const performRefreshScreenDataFromServer = () => {
    _debug('performRefreshScreenDataFromServer()');
    return fetchScreenDataFromV1Endpoint().then((screen) => {
      setControlsData(ConvertJsonKeysToCamelCase(screen.controls));
      setActionSetsData(screen.actionSets);
      setEventsData(screen.events);
      setScreenData(ConvertJsonKeysToCamelCase(screen));
      _debug('performRefreshScreenDataFromServer finished successfully!');
    });
  };

  useEffect(() => {
    if ([accountTables, isBootstrapped, screenData].some((v) => !v)) return;
    // Grab the handle for replacement functions exposed from AngularJS "currentScreenSvc"
    const exportedFunctions = window.angular.element('#actionEditorModal').scope().exportedFunctions;
    if (!exportedFunctions) return console.error('Something has gone terribly wrong with exportedFunctions!');
    // Now we build the replacement functions we will be plugging down to AngularJS "currentScreenSvc"
    const protoFunctions = {
      findReferences: (control: any) => findReferences(control, exportedFunctions),
      getActionSets: () => actionSetsData,
      getActionSetById: (actionSetId: string) => actionSetsData[actionSetId],
      getControls: () => {
        const controls = controlsData
          .filter((x: any) => x.type !== 'BGI')
          .map((control: any) => {
            const newControl = {
              ...control,
              options: control,
              properties: {
                events: GrabControlEvents(control.type),
              },
            };
            return newControl;
          });
        return controls;
      },
      getEvents: () => eventsData,
      // isFeatureFlagEnabled: (featureFlagName: string) => userSession?.featureFlags[featureFlagName] ?? false,
      isFeatureFlagEnabled: (featureFlagName: string) => {
        const camelName = featureFlagName.charAt(0).toLowerCase() + featureFlagName.slice(1);
        const result = userSession?.featureFlags[camelName];
        console.log('userSession?.featureFlags', userSession?.featureFlags);
        console.log('isFeatureFlagEnabled', featureFlagName, result);
        return result ? result : false;
      },
      getEventById: (eventId: string) => eventsData[eventId],
      getOption: (option: string) => {
        switch (option) {
          case 'AppRef':
            return appId;
          case 'appRoutineId':
            return null;
          case 'canvasRef':
            return {
              html: () => screenData.layoutHTML,
            };
          case 'designerMode':
            return screenData.operationMode;
          case 'isAppRoutineEditor':
            return isAppRoutineEditor;
          case 'isDeveloper':
            return screenData.isDeveloper;
          case 'Name':
            return screenData.name;
          case 'onActiveRecordChange':
            return screenData.onActiveRecordChange;
          case 'onFocus':
            return screenData.onFocus;
          case 'onLoad':
            return screenData.onLoad;
          case 'screenMode':
            return screenData.screenMode;
          case 'tableList':
            return accountTables;
          case 'versionTarget':
            return screenData.versionTarget;
          case 'Fields':
            return screenData.fields;
          case 'isV4Screen':
            return isV4Screen; // 🔧 V4 FIX: Pass V4 screen flag to action editor
          default: {
            console.error(`Unknown option: ${option}`);
            return null;
          }
        }
      },
      getScreenEventsFromProperties: () => [
        { name: 'Load', func: 'onLoad' },
        { name: 'Focus', func: 'onFocus' },
        { name: 'Active Record Change', func: 'onActiveRecordChange' },
      ],
      getScreenList: () => screenList,
      getTableFields: (tableName: string) => {
        console.log('gatewayUrl', getGatewayUrl());
        const url = `${getGatewayUrl()}tables-fields/field/${sessionData.account.name}/GetFieldNamesWithRestriction?viewFriendlyName=${tableName}&showComplexFields=true`;

        return fetch(url, {
          headers: {
            Authorization: `Bearer ${userSession.tokenV2}`,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            // Expand combined address fields into individual element fields for backwards compatibility
            const expandedData: any[] = [];
            for (const field of json.Data) {
              if (field.Value?.elements && Array.isArray(field.Value.elements)) {
                for (const element of field.Value.elements) {
                  expandedData.push({
                    Key: element.columnNameRef,
                    Value: {
                      ...element,
                      sourceType: field.Value.sourceType,
                    },
                  });
                }
              } else {
                expandedData.push(field);
              }
            }
            return { Data: ConvertJsonKeysToCamelCase(expandedData) };
          });
      },
      HandleFoundReferences: handleFoundReferences,
      sendAnalytics: (message: string) => {
        const clientSessionId = JSON.parse(localStorage.getItem('userSession') || '{id: ""}').id;
        const url = `${getDesignerUrl}api/v1/analytics/Designer Action/${clientSessionId}/${screenId}`;
        fetch(url, {
          // no need to return this, can just fire it off.
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userSession.tokenRTC}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: message,
          }),
        });
      },
      sanitizeHTMLLayout,
      setActionSets: setActionSetsData,
      setEvents: setEventsData,
      setOption: (optionName: string, value: any) => setScreenData({ ...screenData, [optionName]: value }),
      setControl: (controlId: string, value: any) => {
        const updatedControls = controlsData.map((c: any) => (c.id === controlId ? value : c));
        setControlsData(updatedControls);
      },
      saveScreen: (
        _opt: boolean = true, // always boolean true in action-editor, useless really except legacy support for dsSave
        resolveFn: (value: void | unknown) => void,
        rejectFn: (reason?: any) => void,
      ) => {
        _debug('saveScreen called and received typeof rejectFn:', typeof rejectFn);
        setAfterSaveCallback(() => resolveFn);
        setAfterSaveFailback(() => rejectFn);
        setNeedsSave(true);
        _debug('set save flag.');
      },
      // Fix for race condition.
      // Before saving action data, the process queries the backend for 
      // the 'current' data. If a related field on the control has changed,
      // it might(!) not have propagated to the backend yet causing this save
      // to make a stale write. Potentially, the backend has invalid data and
      // the UI state is disentangled from the saved state.
      // Remedy: notify this component of a pending change to a control field
      // that overrides data received from the server.
      setRefreshOverride: setRefreshOverride,
      triggerScreenRefreshIfNeeded: performRefreshScreenDataFromServer,
    };
    // Now one does not simply assign exportedFunctions = protoFunctions, we need to inject each one into the existing reference.
    Object.keys(exportedFunctions).forEach(
      (k) => (exportedFunctions[k] = protoFunctions[k as keyof typeof protoFunctions]),
    );
  }, [accountTables, isBootstrapped, screenData, controlsData, actionSetsData, eventsData]);

  useEffect(() => {
    if ([isInitialized, isSvcsInitialized].some((v) => !v)) return;
    const angularContainer = actionEditorElement.current;
    let didBootstrap = false;

    if (angularContainer) {
      angularContainer.innerHTML = `<div>
      <mi-component-modal set-base-path="'public/src/componentModals/'"></mi-component-modal>
      <mi-action-editor
        is-app-routine-editor="${isAppRoutineEditor}"
        is-react-wrapper="${isReactWrapper}"
        auth-token="'${userSession.tokenRTC}'"
        auth-token-v2="'${userSession.tokenV2}'"
        copilot-screen-id="'${screenId}'"
        copilot-version-id="'${versionId}'"
      ></mi-action-editor></div>`;
      window.angular.bootstrap(angularContainer, ['method']);
      setIsBootstrapped(true);
      didBootstrap = true;
    } else {
      console.error(`Was expecting to find Action Editor angular container, but didn't.`);
    }

    // CLEANUP: Destroy AngularJS app when React component unmounts
    return () => {
      if (!didBootstrap || !angularContainer) {
        return;
      }

      // Defensive: AngularJS may already be torn down or unavailable
      const angularGlobal = (window as any).angular;
      const hasAngularElement = angularGlobal && typeof angularGlobal.element === 'function';

      if (!hasAngularElement) {
        angularContainer.innerHTML = '';
        return;
      }

      const elementWrapper = angularGlobal.element(angularContainer);
      const scope = elementWrapper && typeof elementWrapper.scope === 'function' ? elementWrapper.scope() : undefined;

      if (scope && typeof scope.$destroy === 'function' && scope.$$destroyed !== true) {
        scope.$destroy();
      }

      angularContainer.innerHTML = '';
    };
  }, [isInitialized, isSvcsInitialized]);

  const fetchScreenDataFromV1Endpoint = async (): Promise<any> => {
    try {
      const response = await fetch(`${getDesignerUrl()}api/v1/Designer/${appId}/${screenId}/${versionId}`, {
        headers: {
          Authorization: `Bearer ${userSession.tokenRTC}`,
        },
      });
      const json = await response.json();
      _debug('Screen Data:', json.Data.screen);
      return json.Data.screen;
    } catch (error) {
      console.error(error);
    }
  };

  const saveScreenDataToV1Endpoint = useCallback(async () => {
    try {
      // First I need an unmodified screen to perform deltas against.
      const fetchedScreen = await fetchScreenDataFromV1Endpoint();

      let saveControlsData = controlsData;
      // apply override to potentially nested field
      if (refreshOverride) {
        saveControlsData = controlsData.map((control: any) => {
          if (control.id === refreshOverride.id) {
            const fieldPath = refreshOverride.field.split('.');
            const updated = { ...control };
            let layer = updated;
            for(let i = 0; i < fieldPath.length - 1; i++) {
              const property = fieldPath[i];
              if (!layer[property]) {
                console.error(`Error overwriting object. Invalid field path: ${refreshOverride.field} at ${property}`);
                return control;
              }
              const nextLayer = { ...layer[property] };
              layer[property] = nextLayer;
              layer = nextLayer;
            }
            layer[fieldPath[fieldPath.length - 1]] = refreshOverride.value;
            return updated;
          } else {
            return control;
          }
        });
      }
      setRefreshOverride(null);
      // Now we start building our "new" screen to POST.
      const newScreen: any = {
        // Updated Screen Data:
        controls: saveControlsData,
        // Three Screen Action Values:
        onLoad: screenData['onLoad'],
        onFocus: screenData['onFocus'],
        onActiveRecordChange: screenData['onActiveRecordChange'],
        // Updated Action Sets and Events
        actionSets: stripUnwantedProperties(actionSetsData),
        events: eventsData,
      };
      // We merge with our fetched screen data, keeping only properties that are expected by the V1 save endpoint:
      [
        // "controls", // Already dealt with above
        // "onLoad", // Already dealt with above
        // "onFocus", // Already dealt with above
        // "onActiveRecordChange", // Already dealt with above
        'versionId',
        'id',
        'name',
        'viewFriendlyName',
        'operationMode',
        'icon',
        'order',
        'comments',
        'isScreenlet',
        'layoutHTML',
        'focusControl',
        'onClose',
        'Type',
        'AppRef',
        'isShared',
        'versionTarget',
        'appRibbonType',
        // "actionSets", // Already dealt with above
        // "events", // Already dealt with above
      ].forEach((k) => (newScreen[k] = fetchedScreen[k]));

      // Preserve V4 layout metadata so runtime/designer stay in sync after saving actions
      const fetchedLayoutV4 = fetchedScreen?.LayoutV4 ?? fetchedScreen?.layoutV4;
      const stateLayoutV4 = screenData?.layoutV4 ?? (screenData as any)?.LayoutV4;
      if (fetchedLayoutV4 !== undefined || stateLayoutV4 !== undefined) {
        newScreen.LayoutV4 = fetchedLayoutV4 ?? stateLayoutV4 ?? null;
      }

      const fetchedIsV4 =
        fetchedScreen?.IsV4Screen ?? fetchedScreen?.isV4Screen ?? fetchedScreen?.isv4screen;
      const stateIsV4 =
        screenData?.isV4Screen ?? (screenData as any)?.IsV4Screen ?? isV4Screen;
      if (fetchedIsV4 !== undefined || stateIsV4 !== undefined) {
        const resolvedIsV4 = fetchedIsV4 ?? stateIsV4 ?? false;
        // Set both casing variants to be safe with legacy API expectations
        newScreen.IsV4Screen = resolvedIsV4;
        newScreen.isV4Screen = resolvedIsV4;
      }
      // Now we execute the save action against the old save API
      try {
        const response = await fetch(`${getDesignerUrl()}api/v1/Designer/${appId}/${screenId}/${versionId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userSession.tokenRTC}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newScreen),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Invalid JSON response' }));
          throw new Error(
            `Server Error: ${response.status} ${response.statusText} - ${errorData.message || 'No error message provided'}`,
          );
        }
        const result = await response.json();
        
        if (typeof afterSaveCallback === 'function') {
          performRefreshScreenDataFromServer().then(() => {
            afterSaveCallback(result); // Tell angular (child)
          });
          if (onAfterSave) {
            onAfterSave(); // Trigger app-builder (parent)
          }
        }
      } catch (error: any) {
        if (typeof afterSaveFailback === 'function') afterSaveFailback(error);
      }
      setNeedsSave(false);
    } catch (error) {
      if (typeof afterSaveFailback === 'function') afterSaveFailback(error);
    }
  }, [controlsData, eventsData, actionSetsData, afterSaveCallback, afterSaveFailback]);

  useEffect(() => {
    if ([isInitialized, appId, screenId, versionId, userSession, sessionData].some((v) => !v)) return;
    const { tokenRTC, tokenV2 } = userSession;

    performRefreshScreenDataFromServer().catch((error) => console.error(error));

    fetch(`${getDesignerUrl()}api/v1/Designer/GoToScreenList`, {
      headers: {
        Authorization: `Bearer ${tokenRTC}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        _debug('Screen List:', json.Data);
        setScreenList(ConvertJsonKeysToCamelCase(json.Data));
      })
      .catch((error) => console.error(error));

    fetch(`${getGatewayUrl()}tables-fields/view/${sessionData.account.name}/GetViewNames`, {
      headers: {
        Authorization: `Bearer ${tokenV2}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        _debug('Account Tables:', json);
        setAccountTables(
          ConvertJsonKeysToCamelCase(json)
            .sort((a: any, b: any) => a.viewNameFriendly.localeCompare(b.viewNameFriendly))
            .map((table: any) => [table.viewName, table.viewNameFriendly]),
        );
      })
      .catch((error) => console.error(error));
  }, [appId, screenId, versionId, isInitialized, sessionData, open]);

  return <div ref={actionEditorElement} data-testid='react-action-editor-wrapper' />;
};

export const openActionEditor = (
  widget: any,
  eventName: string,
  referencedControl?: string,
  referencedControlId?: string,
  refreshOverride?: RefreshOverride,
) => {
  if (refreshOverride) {
    const modal = (window.angular.element('#actionEditorModal').scope() as any);
    if (modal && modal.exportedFunctions) {
      modal.exportedFunctions.setRefreshOverride(refreshOverride);
    }
  }

  // Use window.openEditor which is exposed by the AngularJS controller (editor-ctrl.js:232)
  // instead of trying to access it through the scope, which might not be ready yet
  if (typeof (window as any).openEditor === 'function') {
    (window as any).openEditor(widget, eventName, undefined, undefined, undefined, referencedControl, referencedControlId);
  } else {
    console.error('AngularJS openEditor function is not available yet. The action editor may not be initialized.');
  }
};

export default ReactActionEditorWrapper;
