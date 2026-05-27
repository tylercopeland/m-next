declare global {
    interface Window {
        angular: {
            bootstrap: (element: HTMLElement, modules: string[]) => void;
            element: (selector: string) => {
                scope: () => {
                    openEditor: (type: any, eventName: string) => void;
                    exportedFunctions: any,
                };
            };
        };
    }
}

export interface ReactActionEditorWrapperProps {
    appId: string;
    screenId: string;
    versionId: string;
    userSession: any; //{ tokenRTC: string; tokenV2: string };
    // EXTERNAL PROPS from legacy code
    isAppRoutineEditor?: boolean; // to be set false everywhere except where action-editor is invoked from the app routines interface.
    // INTERNAL PROPS specific to this wrapper implementation
    reactActionEditorContainerId?: string;
    isReactWrapper?: boolean;
    toast?: function; // parent pass toast implementation for notifications from Action Editor
    onAfterSave?: function;
    // 🔧 V4 SCREEN PROPS
    isV4Screen?: boolean; // Whether this is a V4 screen
}
