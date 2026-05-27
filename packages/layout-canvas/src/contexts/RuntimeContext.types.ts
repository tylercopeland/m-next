/**
 * Type definitions for RuntimeContext.
 *
 * Extracted to keep the main context file focused on the provider implementation.
 */

export interface CustomViewFilterData {
  Id?: string;
  Name: string;
  IsDefault: boolean;
  IsPublic: boolean;
  FilterDefinition: string;
}

export interface CustomViewsResult {
  myViews: any[];
  sharedViews: any[];
}

export interface OnChangePayload {
  componentId: string;
  actionName: string;
  screenId: string | null | undefined;
  recordId: string | null | undefined;
  actionData: {
    event: {
      type: string;
    };
  };
  screenState?: Record<string, unknown>;
  metadata: {
    timestamp: number;
    componentType: string;
  };
}

// Redux store type for direct subscriptions (bypasses React-Redux context issues between packages)
export interface ReduxStore {
  getState: () => any;
  subscribe: (listener: () => void) => () => void;
  dispatch: (action: any) => any;
}

export interface RuntimeContextData {
  // Core Runtime State
  screenKey: string | null | undefined;
  screenId: string | null | undefined;
  activeRecordId: string | null | undefined;
  viewFriendlyName?: string | null;
  panelName: string;
  mode: 'runtime';
  isMobile?: boolean;
  applicationType?: string;
  isAdminOrCustomizer?: boolean;
  store?: ReduxStore | null;

  // Control Access
  getControl: (id: string) => any;

  // Data Loading
  loadAttachmentsData?: (controlId: string) => void;
  loadChartData: (control: any) => void;
  loadChipsData?: (control: any, field: string, value: any) => void;
  loadDropdownData: (control: any, searchText?: string | null, page?: number, append?: boolean) => void;
  loadGalleryData: (control: any, paging: { pageSize: number; pageNumber: number }, searchString?: string) => void;
  loadGridData: (
    control: any,
    gridEvent?: number,
    totalRecordCount?: number,
    analyticsMetaData?: Record<string, any>,
  ) => void;

  // Attachment Operations
  deleteAttachment?: (controlId: string, documentId: string) => void;
  onAttachmentClick?: (documentId: string, url: string) => void;
  onToggleEmailAttachment?: (controlId: string, documentId: string, attachToEmail: boolean) => void;
  clearFailedAttachments?: (controlId: string) => void;
  uploadAttachmentState?: (
    controlId: string,
    fileId: string,
    fileName: string,
    fileSize: number,
    errorMessage?: string,
  ) => void;
  triggerUploadAttachment?: (controlId: string, fileWrappers: any[], file: File) => void;

  // Data Access (Getters)
  getChartData: (id: string) => any;
  getDropdownData: (id: string) => any;
  getGalleryData: (id: string) => any;
  getGridChipsData: (id: string) => any;
  getGridData: (id: string) => any;
  getGridTotalRecordCount: (control: any) => void;
  selectAuthContext?: () => {
    account: string;
    authToken: string;
    identity: string;
    runtimeCoreUrl: string;
    secureToken: string;
  };

  // Control Updates
  bulkUpdateControls: (updates: { controlId: string; property: string; value: any }[]) => void;
  updateControlProperty: (controlId: string, property: string, value: any) => void;

  // Chart Operations
  setChartSelectedPoint?: (controlId: string, series: number, point: string | null) => void;
  setChartSelectedRow?: (controlId: string, recordId: string) => void;

  // Grid Row Operations
  bulkAddGridRows: (controlId: string, rows: any[]) => void;
  clearChipData: (controlId: string) => void;
  deleteGridRow: (controlId: string, rowIdx: number, clearIt: boolean) => void;
  updateGridCell: (controlId: string, rowId: number, field: string, value: any, text?: any) => void;
  updateGridRowStatus: (controlId: string, rowId: number, status: string) => void;
  uploadGridImage?: (
    formData: FormData,
    field: string,
    rowIdx: number,
    recordId: string | number | null,
    onStartUpload: () => void,
    onProgress: (progressEvent: any, rowIdx: number, field: string) => void,
    onSuccess: (response: any, rowIdx: number, field: string, recordId: string | number | null) => void,
    onError: (error: any, rowIdx: number, field: string) => void,
    onCancel: () => void,
  ) => void;
  uploadSignature?: (documentId: string, documentData: FormData) => Promise<any>;

  // Custom Views
  deleteCustomView?: (filterData: CustomViewFilterData, onSuccess?: () => void) => void;
  loadCustomViewsData?: (controlId: string, viewFriendlyName: string) => Promise<CustomViewsResult>;
  saveCustomView?: (
    filterData: CustomViewFilterData,
    onSuccess?: () => void,
    onError?: (errorMessage: string) => void,
  ) => void;
  showGridFilterDialog?: (
    onClose: (isRealClose: boolean, onDialogClose?: () => void) => void,
    onSave: (isEditMode: boolean, onDialogClose?: () => void) => void,
    isEditMode: boolean,
    selectedView: any,
    onDialogClose?: () => void,
    onDelete?: (filterId: string) => void,
  ) => void;
  updateCustomView?: (
    filterData: CustomViewFilterData,
    onSuccess?: () => void,
    onError?: (errorMessage: string) => void,
  ) => void;
  updateCustomViewsOrder?: (viewOrder: string[], controlId: string, isShared: boolean) => void;

  // Dialogs & UI
  showMessageDialog: (dialog: any) => void;
  manageTags(controlId?: string): void;
  openRecurrencePanel: (controlId: string, pattern: string | undefined, template: any, seriesModel: any) => void;

  // Tag Operations
  validateAndUpdateTags?: (controlId: string, tags: string[], onChangePayload?: OnChangePayload) => void;

  // Image Operations
  uploadImage?: (
    controlId: string,
    file: File,
    onProgress?: (progressEvent: any) => void,
    onSuccess?: (response: { url: string; originalName: string }) => void,
    onError?: (error: any) => void,
  ) => void;
  uploadWebImage?: (
    controlId: string,
    url: string,
    onProgress?: (progressEvent: any) => void,
    onSuccess?: (response: { url: string; originalName: string }) => void,
    onError?: (error: any) => void,
  ) => void;
  deleteImage?: (controlId: string, originalName?: string) => void;

  // Utilities
  processAnalytics: (eventName: string, attributes: Record<string, any>) => void;
  queueDataTableExport: (control: any, analyticsMetaData?: Record<string, unknown>) => void;
  queueMailChimpExport?: (modelToPost: any) => void;

  /** Chart drilldown expand: DOM selector for modal anchor (e.g. '#content-inner' to avoid covering nav) */
  chartExpandAnchorEl?: string;
  /** Chart drilldown expand: margin for overlay (e.g. '0' or '16px') */
  chartExpandMargin?: string;
  /** Chart drilldown expand: when true, overlay constrained to anchor (next-gen). When false, uses fixed+margin (legacy). */
  chartConstrainOverlayToAnchor?: boolean;
}

export interface RuntimeContextProviderProps {
  children: React.ReactNode;

  // Core Runtime State (passed from Runtime.js)
  screenKey?: string | null;
  screenId?: string | null;
  activeRecordId?: string | null;
  viewFriendlyName?: string | null;
  panelName?: string;
  controls?: Record<string, any>;
  dataReducer?: Record<string, any>;
  store?: ReduxStore | null;
  isMobile?: boolean;
  applicationType?: string;
  isAdminOrCustomizer?: boolean;

  // Data Loading Callbacks
  onLoadAttachments?: (
    screenKey: string,
    view: string | null,
    screenId: string,
    activeRecordId: string | null | undefined,
    id: string,
  ) => void;
  onLoadChartData?: (
    screenKey: string,
    screenId: string,
    control: any,
    activeRecordId: string | null | undefined,
  ) => void;
  onSetChartSelectedPoint?: (screenKey: string, controlId: string, series: number, point: string | null) => void;
  onSetChartSelectedRow?: (screenKey: string, controlId: string, recordId: string) => void;
  onLoadChipsData?: (screenKey: string, control: any, field: string, value: any) => void;
  onLoadDropdownData?: (
    screenKey: string,
    screenId: string,
    id: string,
    body: any,
    activeRecordId: string | null | undefined,
    append?: boolean,
  ) => void;
  onLoadGalleryData?: (
    screenKey: string,
    screenId: string,
    control: any,
    activeRecordId: string | null | undefined,
    paging: { pageSize: number; pageNumber: number },
    searchString?: string,
  ) => void;
  onLoadGridData?: (
    screenKey: string,
    screenId: string,
    id: string,
    control: any,
    activeRecordId: string | null | undefined,
    panelName: string,
    gridEvent?: number,
    totalRecordCount?: number,
    analyticsMetaData?: Record<string, any>,
  ) => void;

  // Data Access Callbacks
  onGetGridTotalRecordCount?: (screenKey: string, control: any) => void;

  // Control Update Callbacks
  onBulkUpdateControls?: (screenKey: string, updates: any[]) => void;
  onUpdateControlProperty?: (screenKey: string, controlId: string, property: string, value: any) => void;

  // Grid Row Operation Callbacks
  onBulkAddGridRows?: (screenKey: string, controlId: string, rows: any[]) => void;
  onClearChipData?: (screenKey: string, controlId: string) => void;
  onDeleteGridRow?: (screenKey: string, controlId: string, rowIdx: number, clearIt: boolean) => void;
  onUpdateGridCell?: (
    screenKey: string,
    controlId: string,
    rowId: number,
    field: string,
    value: any,
    text?: any,
  ) => void;
  onUpdateGridRowStatus?: (screenKey: string, controlId: string, rowId: number, status: string) => void;
  onUploadGridImage?: (
    formData: FormData,
    field: string,
    rowIdx: number,
    recordId: string | number | null,
    onStartUpload: () => void,
    onProgress: (progressEvent: any, rowIdx: number, field: string) => void,
    onSuccess: (response: any, rowIdx: number, field: string, recordId: string | number | null) => void,
    onError: (error: any, rowIdx: number, field: string) => void,
    onCancel: () => void,
  ) => void;
  onUploadSignature?: (documentId: string, documentData: FormData) => Promise<any>;

  // Custom View Callbacks
  onDeleteCustomView?: (screenKey: string, filterData: CustomViewFilterData, onSuccess?: () => void) => void;
  onLoadCustomViewsData?: (
    screenKey: string,
    controlId: string,
    viewFriendlyName: string,
  ) => Promise<CustomViewsResult>;
  onSaveCustomView?: (
    screenKey: string,
    filterData: CustomViewFilterData,
    onSuccess?: () => void,
    onError?: (errorMessage: string) => void,
  ) => void;
  onShowGridFilterDialog?: (
    onClose: (isRealClose: boolean, onDialogClose?: () => void) => void,
    onSave: (isEditMode: boolean, onDialogClose?: () => void) => void,
    isEditMode: boolean,
    selectedView: any,
    onDialogClose?: () => void,
    onDelete?: (filterId: string) => void,
  ) => void;
  onUpdateCustomView?: (
    screenKey: string,
    filterData: CustomViewFilterData,
    onSuccess?: () => void,
    onError?: (errorMessage: string) => void,
  ) => void;
  onUpdateCustomViewsOrder?: (screenKey: string, viewOrder: string[], controlId: string, isShared: boolean) => void;

  // Dialog & UI Callbacks
  onShowMessageDialog?: (dialog: any) => void;
  onManageTags?: (controlId?: string) => void;
  onOpenRecurrencePanel?: (controlId: string, pattern: string | undefined, template: any, seriesModel: any) => void;

  // Tag Operation Callbacks
  onValidateAndUpdateTags?: (
    screenKey: string,
    controlId: string,
    tags: string[],
    onChangePayload?: OnChangePayload,
  ) => void;

  // Image Operation Callbacks
  onUploadImage?: (
    screenKey: string,
    controlId: string,
    file: File,
    onProgress?: (progressEvent: any) => void,
    onSuccess?: (response: { url: string; originalName: string }) => void,
    onError?: (error: any) => void,
  ) => void;
  onUploadWebImage?: (
    screenKey: string,
    controlId: string,
    url: string,
    onProgress?: (progressEvent: any) => void,
    onSuccess?: (response: { url: string; originalName: string }) => void,
    onError?: (error: any) => void,
  ) => void;
  onDeleteImage?: (screenKey: string, controlId: string, originalName?: string) => void;

  // Utility Callbacks
  onProcessAnalytics?: (eventName: string, attributes: Record<string, any>) => void;
  onQueueDataTableExport?: (control: any, screenKey: string, analyticsMetaData?: Record<string, unknown>) => void;
  onQueueMailChimpExport?: (modelToPost: any, screenKey: string) => void;

  // Attachment Callbacks
  onAttachmentDelete?: (
    screenKey: string,
    controlId: string,
    documentId: string,
    activeRecordId: string | null | undefined,
  ) => void;
  onAttachmentClick?: (documentId: string, url: string, activeRecordId: string | null | undefined) => void;
  onToggleEmailAttachment?: (
    screenKey: string,
    controlId: string,
    documentId: string,
    attachToEmail: boolean,
    viewFriendlyName: string | null,
  ) => void;
  onClearFailedAttachments?: (screenKey: string, controlId: string) => void;
  onUploadAttachmentState?: (
    screenKey: string,
    controlId: string,
    fileId: string,
    fileName: string,
    fileSize: number,
    errorMessage?: string,
  ) => void;
  onTriggerUploadAttachment?: (
    screenKey: string,
    controlId: string,
    fileWrappers: any[],
    file: File,
    screenId: string,
    activeRecordId: string | null | undefined,
  ) => void;

  /** Chart drilldown expand: DOM selector for modal anchor (e.g. '#content-inner' to constrain to content area) */
  chartExpandAnchorEl?: string;
  /** Chart drilldown expand: margin for overlay (e.g. '0' or '16px') */
  chartExpandMargin?: string;
  /** Chart drilldown expand: when true, overlay constrained to anchor (next-gen). Legacy uses false. */
  chartConstrainOverlayToAnchor?: boolean;
}
