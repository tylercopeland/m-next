import React, { createContext, useContext } from 'react';
import type {
  ChartValidationApi,
  ChartFieldTypesApi,
  DesignerChartDataResult,
  DesignerDrilldownApi,
  DesignerDrilldownRequest,
} from '../wrappers/chart/types';

interface AuthContext {
  account: string;
  identity: string;
  authToken: string;
  runtimeCoreUrl: string;
  secureToken: string;
}

interface DesignerContextData {
  selectedControlId?: string | null;
  selectedControlProperty?: any;
  panelName?: string;
  screenKey?: string | null;
  screenId: string | null;
  activeRecordId: string | null;
  authContext: AuthContext;
  onLoadGridData: (arg: any) => any;
  onLoadDropdownData: (arg: any) => any;
  onLoadDropdownDataLazy?: (arg: any) => Promise<any>;
  onLoadGalleryData: (arg: any, options?: any) => any;
  onControlSelected: (payload: { controlId: string; property?: any; canvasClickDisabled?: boolean } | null) => void;
  selectControlById: (id: string) => any;
  /** Injected by host (e.g. app-builder) so layout-canvas does not import app-builder/criteria-builder */
  chartValidation?: ChartValidationApi | null;
  /** Injected by host so layout-canvas does not import @m-next/types */
  chartFieldTypes?: ChartFieldTypesApi | null;
  /** Keyed by control id – host populates so designer chart data works without app-builder import */
  designerChartDataResults?: Record<string, DesignerChartDataResult> | null;
  /** Host calls this to set chart data result for a control (e.g. when RTK Query resolves) */
  setDesignerChartDataResult?: (controlId: string, result: DesignerChartDataResult) => void;
  /** Keyed by control id – host populates from drilldown request so designer drilldown works */
  designerDrilldownResults?: Record<string, DesignerDrilldownApi> | null;
  /** Hook publishes drilldown request; host runs queries and sets designerDrilldownResults */
  setDesignerDrilldownRequest?: (controlId: string, request: DesignerDrilldownRequest | null) => void;
}

const DesignerContext = createContext<DesignerContextData | null>(null);

export const useDesignerContext = () => {
  return useContext(DesignerContext);
};

interface DesignerContextProviderProps {
  children: React.ReactNode;
  selectedControlId?: string | null;
  selectedControlProperty?: any;
  panelName?: string;
  screenKey?: string | null;
  screenId: string | null;
  activeRecordId: string | null;
  authContext: AuthContext;
  onControlSelected: (payload: { controlId: string; property?: any; canvasClickDisabled?: boolean } | null) => void;
  selectControlById: (id: string) => any;
  onLoadGridData: (arg: any) => any;
  onLoadDropdownData: (arg: any) => any;
  onLoadDropdownDataLazy?: (arg: any) => Promise<any>;
  onLoadGalleryData: (arg: any, options?: any) => any;
  chartValidation?: ChartValidationApi | null;
  chartFieldTypes?: ChartFieldTypesApi | null;
  designerChartDataResults?: Record<string, DesignerChartDataResult> | null;
  setDesignerChartDataResult?: (controlId: string, result: DesignerChartDataResult) => void;
  designerDrilldownResults?: Record<string, DesignerDrilldownApi> | null;
  setDesignerDrilldownRequest?: (controlId: string, request: DesignerDrilldownRequest | null) => void;
}

export const DesignerContextProvider: React.FC<DesignerContextProviderProps> = ({
  children,
  onControlSelected,
  selectControlById,
  selectedControlId,
  selectedControlProperty,
  onLoadGridData,
  onLoadDropdownData,
  onLoadDropdownDataLazy,
  onLoadGalleryData,
  panelName,
  screenKey,
  screenId,
  activeRecordId,
  authContext,
  chartValidation = null,
  chartFieldTypes = null,
  designerChartDataResults = null,
  setDesignerChartDataResult,
  designerDrilldownResults = null,
  setDesignerDrilldownRequest,
}) => {
  return (
    <DesignerContext.Provider
      value={{
        onControlSelected,
        selectControlById,
        onLoadGridData,
        onLoadDropdownData,
        onLoadDropdownDataLazy,
        onLoadGalleryData,
        selectedControlId,
        selectedControlProperty,
        panelName,
        screenKey,
        screenId,
        activeRecordId,
        authContext,
        chartValidation,
        chartFieldTypes,
        designerChartDataResults,
        setDesignerChartDataResult,
        designerDrilldownResults,
        setDesignerDrilldownRequest,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
};
