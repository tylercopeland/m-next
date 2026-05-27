// import { ResponsiveDisplayData } from '@m-next/layout-canvas';
import { RootState, ScreenProperties } from '../../types/screenLayoutTypes';

// Re-export types from screenLayoutTypes to avoid circular dependencies
export * from '../../types/screenLayoutTypes';

// Selectors
export function selectControls(state: RootState): Record<string, ControlType>;

export const screenStates: {
  idle: string;
  ready: string;
  editing: string;
  saving: string;
  refreshed: string;
  error: string;
};

export function selectData(state: RootState): Record<string, unknown>;
export function selectLayout(state: RootState): unknown;
export function selectAppRibbonType(state: RootState): string | null;
export function selectStatus(state: RootState): string;
export function selectChanges(state: RootState): Record<string, unknown>;
export function selectActionUpserts(state: RootState): Record<string, unknown>;
export function selectLastControlUpdated(state: RootState): string | null;
export function selectActiveRecordId(state: RootState): string | null;
export function selectFocusOn(state: RootState): unknown;
export function selectRibbonList(state: RootState): unknown;
export function selectBaseModel(state: RootState): string;
export function selectBaseModelJoins(state: RootState): unknown[];
export function selectSelectedControlId(state: RootState): string | null;
export function selectHoveredControlId(state: RootState): string | null;
export function selectSelectedControlProperty(state: RootState): string | null;
export function selectCanvasClickDisabled(state: RootState): boolean;
export function selectIsV4Screen(state: RootState): boolean;
export function selectLayoutV4(state: RootState): unknown[];
export function selectDataModels(state: RootState): unknown[];
export function selectProjections(state: RootState): unknown[];
export function selectLoadedScreenId(state: RootState): string | null;
export function selectCurrentRibbonConfiguration(state: RootState): Record<string, unknown> | null;
export function selectCurrentRibbonVisualization(state: RootState): Record<string, unknown> | null;
export function selectRibbonConfiguration(state: RootState): Record<string, Record<string, unknown>>;
export function selectRibbonVisualization(state: RootState): Record<string, Record<string, unknown>>;
export function selectRibbonStatus(state: RootState): string;
export function selectScreenFields(state: RootState): unknown[];
export function selectScreenProperties(state: RootState): ScreenProperties;
export function selectShowHiddenComponents(state: RootState): boolean;
export function selectResolution(state: RootState): 'desktop' | 'tablet' | 'mobile';
export function selectDefaultFocusControl(state: RootState): string | null;
export function selectControlResponsiveData(state: RootState, controlId: string): { 
  desktop: ResponsiveData, 
  tabletOverride?: ResponsiveData, 
  mobileOverride?: ResponsiveData } | null;

// Action creators
export function screenLoaded(payload: Record<string, unknown>): ActionPayload<Record<string, unknown>>;
export function controlUpdated(payload: ControlType): ActionPayload<ControlType>;
export function saveScreen(): { type: string };
export function screenSaved(): { type: string };
export function clearLastControlUsed(): { type: string };
export function focusOn(payload: unknown): ActionPayload<unknown>;
export function changeActiveRecord(payload: string): ActionPayload<string>;
export function screenFieldsLoaded(payload: unknown[]): ActionPayload<unknown[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function controlSelected(payload: { controlId: string; property?: any; canvasClickDisabled?: boolean } | null): ActionPayload<{ controlId: string; property?: any; canvasClickDisabled?: boolean } | null>;
export function actionUpdated(payload: { id: string; controlId: string; actionSet: unknown }): ActionPayload<{ id: string; controlId: string; actionSet: unknown }>;
export function ribbonUpdated(payload: { ribbonId: string; [key: string]: unknown }): ActionPayload<{ ribbonId: string; [key: string]: unknown }>;
export function ribbonVisualizationUpdated(payload: Record<string, unknown>): ActionPayload<Record<string, unknown>>;
export function ribbonsRefreshComplete(): { type: string };
export function reloadRibbons(): { type: string };
export function removeRibbonConfiguration(payload: string): ActionPayload<string>;
export function controlHovered(payload: { controlId: string } | null): ActionPayload<{ controlId: string } | null>;
export function setShowHiddenComponents(payload: boolean): ActionPayload<boolean>;
export function setResolution(payload: 'desktop' | 'tablet' | 'mobile'): ActionPayload<'desktop' | 'tablet' | 'mobile'>;
export function updateControlResponsiveData(payload: { controlId: string; resolution: 'desktop' | 'tablet' | 'mobile'; currentState: number }): ActionPayload<{ controlId: string; resolution: 'desktop' | 'tablet' | 'mobile'; currentState: number }>;