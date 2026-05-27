import { Api, BaseQueryFn } from '@reduxjs/toolkit/query/react';

interface DataModel {
  dataModelId: string;
  screenId?: string;
  activeRecordId?: string;
  joinKey?: string;
  isV4Control?: boolean;
  body?: Record<string, unknown>;
}

interface AnalyticsModel {
  name: string;
  screenId: string;
  body?: Record<string, unknown>;
}

interface FormulaModel {
  body: Record<string, unknown>;
}

type RuntimeApiEndpoints = 'getData' | 'getRibbons' | 'getDataLegacy' | 'getDropdownDataLegacy' | 'getGridDataLegacy' | 'getTotalGridRecordsLegacy' | 'getChipsDataLegacy' | 'getChartDataLegacy' | 'getReadOnlyGridDataLegacy' | 'getGalleryDataLegacy' | 'getCalendarData' | 'postAnalytics' | 'validateFormula' | 'getSharedUsers';

export declare const runtimeApi: Api<BaseQueryFn, Record<string, unknown>, RuntimeApiEndpoints, string>;

export declare const useGetDataQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetDataLegacyQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetRibbonsQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetChartDataLegacyQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetGridDataLegacyQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetChipsDataLegacyQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetTotalGridRecordsLegacyMutation: () => [(arg: DataModel) => Promise<unknown>, { isLoading: boolean }];
export declare const useGetReadOnlyGridDataLegacyQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const usePostAnalyticsMutation: () => [(arg: AnalyticsModel) => Promise<unknown>, { isLoading: boolean }];
export declare const useValidateFormulaMutation: () => [(arg: FormulaModel) => Promise<unknown>, { isLoading: boolean }];
export declare const useGetDropdownDataLegacyQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetGalleryDataLegacyQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetCalendarDataQuery: <T = unknown>(arg: DataModel) => { data: T; error?: unknown; isLoading: boolean };
export declare const useGetSharedUsersQuery: <T = unknown>() => { data: T; error?: unknown; isLoading: boolean };
