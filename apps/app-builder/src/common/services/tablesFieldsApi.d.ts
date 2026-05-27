import { Api } from '@reduxjs/toolkit/query/react';

interface FieldsForTableModel {
  accountName: string;
  tableName: string;
  complexFields: boolean;
}

interface TablesModel {
  accountName: string;
}

interface Field {
  name: string;
  caption: string;
  type: string;
  size: number | null;
  isVisible: boolean;
  isRequired: boolean;
  isLinked: boolean;
  sourceModel: string;
  sourceField: string;
  sourceTable?: string;
}

interface DropdownApiResponse {
  data: Field[];
  totalRows?: number;
}

interface Table {
  name: string;
  caption: string;
}

type TablesFieldsEndpoints = 'getFieldsForTable' | 'getTables';

export declare const tablesFieldsApi: Api<import('@reduxjs/toolkit/query').BaseQueryFn, Record<string, unknown>, TablesFieldsEndpoints, string>;

export declare const useGetFieldsForTableQuery: <T = Field[]>(
  arg: FieldsForTableModel,
  options?: { skip?: boolean }
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

export declare const useGetTablesQuery: <T = Table[]>(
  arg: TablesModel
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};
