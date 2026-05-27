/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@m-next/toggle' {
  const Toggle: React.FC<{
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    width: string;
    style?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
  }>;
  export default Toggle;
}

declare module '@m-next/styles' {
  export const colors: {
    grey: string;
    [key: string]: string;
  };
  export const customOffsetFocusOutline: string;
}

declare module '@m-next/loading-skeleton' {
  const LoadingSkeleton: React.FC<{
    count: number;
    height: number;
  }>;
  export default LoadingSkeleton;
}

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
  export const useGetFieldsForTableQuery: (params: { accountName: string; tableName: string; complexFields: boolean }) => {
    data: Array<{ type: string; name: string; caption: string }>;
    isFetching: boolean;
  };
  export const useGetTablesQuery: (params: { accountName: string }) => {
    data: Array<{ caption: string }>;
  };
}

declare module '../../../../common/services/sessionSlice' {
  export const selectAccountName: (state: any) => string;
}

declare module '../../../../common/services/screenLayoutSlice' {
  export const selectBaseModel: (state: any) => string;
  export const selectControls: (state: any) => Record<string, { id: string; name: string }>;
}

declare module '../common/components/caption-input/CaptionInput' {
  const CaptionInput: React.FC<{
    id: string;
    value: string;
    label: string;
    onChange: (newCaption: string, newName: string) => void;
    controlId: string;
  }>;
  export default CaptionInput;
}

declare module './type' {
  interface DateTimePickerModel {
    id: string;
    name: string;
    caption: string;
    isBound: boolean;
    hideCaption: boolean;
    formatType: string;
    fieldType: string;
    onChange?: string;
  }
  export default DateTimePickerModel;
}
