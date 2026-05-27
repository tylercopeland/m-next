/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '../common/components/action-list-section/ActionListSection' {
  const ActionListSection: React.FC<{
    caption: string;
    values: Array<{ id: string; value: string; label: string }>;
    emptyMessage: string;
    canAdd: boolean;
    actions: Array<{ value: string; label: string; source: string }>;
    addLabel: string;
    onAddAction: (property: string, eventName: string) => void;
    control: any;
  }>;
  export default ActionListSection;
}

declare module '../../../../common/services/tablesFieldsApi' {
  export function useGetFieldsForTableQuery(
    params: { accountName: string; tableName: string; complexFields: boolean },
    options: { skip: boolean },
  ): {
    data: Array<{ type: string; name: string; caption: string }>;
    isFetching: boolean;
  };

  export function useGetTablesQuery(
    params: { accountName: string },
    options: { skip: boolean },
  ): {
    data: Array<{ caption: string }>;
  };
}

declare module '../../../../common/services/sessionSlice' {
  export function selectAccountName(state: any): string;
}

declare module '../../../../common/services/screenLayoutSlice' {
  export function selectBaseModel(state: any): string;
  export function selectControls(state: any): Record<string, any>;
}

declare module '../../../../components/complex-value/ComplexValue' {
  const ComplexValue: React.FC<{
    id: string;
    complexValue: any;
    fieldListOptions: any[];
    fieldType: string;
    includeControls: boolean;
    includeNone: boolean;
    includeCurrentDate: boolean;
    controlList: Record<string, any>;
    width: number;
    onChange: (value: any) => void;
    controlId: string;
  }>;
  export default ComplexValue;
}

declare module '../common/components/default-state-selector/DefaultStateSelector' {
  const DefaultStateSelector: React.FC<{
    control: any;
    onChange: (control: any) => void;
  }>;
  export default DefaultStateSelector;
}

declare module '../../../../common/rum/RumComponentContext' {
  export const RumComponentContextProvider: React.FC<{
    componentName: string;
    children: React.ReactNode;
  }>;
}

declare module '../../control-classes' {
  export function createDatetimePickerControl(): any;
  export function migrateDatetimePickerControl(control: any): any;
}

declare module './type' {
  export interface DateTimePickerModel {
    id: string;
    name: string;
    caption: string;
    hideCaption: boolean;
    formatType: string;
    format: string;
    isBound: boolean;
    fieldType: string;
    defaultValue: any;
    onChange?: string;
  }

  export default DateTimePickerModel;
}

declare module '@m-next/datepicker/src/util' {
  export const dateFormatList: Array<{ value: string; label: string }>;
}

declare module '@m-next/loading-skeleton' {
  const LoadingSkeleton: React.FC<{
    id?: string;
    count: number;
    height?: number | string;
    width?: number | string;
  }>;
  export default LoadingSkeleton;
}

declare module '@m-next/toggle' {
  const Toggle: React.FC<{
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    width?: string;
    style?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    tooltipId?: string;
    tooltip?: string;
    isV4Design?: boolean;
  }>;
  export default Toggle;
}

declare module '@m-next/styles' {
  export const colors: {
    grey: string;
    [key: string]: string;
  };
}
