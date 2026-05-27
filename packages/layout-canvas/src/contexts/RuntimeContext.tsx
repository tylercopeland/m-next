import React, { createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import type {
  RuntimeContextData,
  RuntimeContextProviderProps,
  CustomViewFilterData,
  OnChangePayload,
} from './RuntimeContext.types';

export type { OnChangePayload } from './RuntimeContext.types';

const RuntimeContext = createContext<RuntimeContextData | null>(null);

export const useRuntimeContext = () => {
  return useContext(RuntimeContext); // null in designer, RuntimeContextData in runtime
};

export const RuntimeContextProvider: React.FC<RuntimeContextProviderProps> = ({
  children,

  // Core Runtime State
  screenKey,
  screenId,
  activeRecordId,
  viewFriendlyName,
  panelName = 'main',
  controls = {},
  dataReducer = {},
  store = null,

  isMobile = false,
  applicationType = 'MethodUI',
  isAdminOrCustomizer = false,

  // Data Loading Callbacks
  onLoadAttachments,
  onLoadChartData,
  onSetChartSelectedPoint,
  onSetChartSelectedRow,
  onLoadChipsData,
  onLoadDropdownData,
  onLoadGalleryData,
  onLoadGridData,

  // Data Access Callbacks
  onGetGridTotalRecordCount,

  // Control Update Callbacks
  onBulkUpdateControls,
  onUpdateControlProperty,

  // Grid Row Operation Callbacks
  onBulkAddGridRows,
  onClearChipData,
  onDeleteGridRow,
  onUpdateGridCell,
  onUpdateGridRowStatus,
  onUploadGridImage,
  onUploadSignature,

  // Custom View Callbacks
  onDeleteCustomView,
  onLoadCustomViewsData,
  onSaveCustomView,
  onShowGridFilterDialog,
  onUpdateCustomView,
  onUpdateCustomViewsOrder,

  // Dialog & UI Callbacks
  onShowMessageDialog,
  onManageTags,
  onOpenRecurrencePanel,

  // Tag Operation Callbacks
  onValidateAndUpdateTags,
  // Image Operation Callbacks
  onUploadImage,
  onUploadWebImage,
  onDeleteImage,

  // Utility Callbacks
  onProcessAnalytics,
  onQueueDataTableExport,
  onQueueMailChimpExport,

  // Attachment Callbacks
  onAttachmentDelete,
  onAttachmentClick,
  onToggleEmailAttachment,
  onClearFailedAttachments,
  onUploadAttachmentState,
  onTriggerUploadAttachment,

  chartExpandAnchorEl,
  chartExpandMargin,
  chartConstrainOverlayToAnchor,
}) => {
  // ---------------------------------------------------------------------------
  // Control Access
  // ---------------------------------------------------------------------------
  const getControl = useCallback((id: string) => controls[id] || null, [controls]);

  // ---------------------------------------------------------------------------
  // Data Loading
  // ---------------------------------------------------------------------------
  const loadAttachmentsData = useCallback(
    (controlId: string) => {
      if (onLoadAttachments && screenKey && screenId) {
        onLoadAttachments(screenKey, viewFriendlyName || null, screenId, activeRecordId, controlId);
      }
    },
    [onLoadAttachments, screenKey, viewFriendlyName, screenId, activeRecordId],
  );

  const loadChartData = useCallback(
    (control: any) => {
      if (onLoadChartData && screenKey && screenId && control) {
        onLoadChartData(screenKey, screenId, control, activeRecordId);
      }
    },
    [onLoadChartData, screenKey, screenId, activeRecordId],
  );

  const setChartSelectedPoint = useCallback(
    (controlId: string, series: number, point: string | null) => {
      if (onSetChartSelectedPoint && screenKey && controlId) {
        onSetChartSelectedPoint(screenKey, controlId, series, point);
      }
    },
    [onSetChartSelectedPoint, screenKey],
  );

  const setChartSelectedRow = useCallback(
    (controlId: string, recordId: string) => {
      if (onSetChartSelectedRow && screenKey && controlId && recordId != null) {
        onSetChartSelectedRow(screenKey, controlId, recordId);
      }
    },
    [onSetChartSelectedRow, screenKey],
  );

  const loadChipsData = useCallback(
    (control: any, field: string, value: any) => {
      if (onLoadChipsData && screenKey && control) {
        onLoadChipsData(screenKey, control, field, value);
      }
    },
    [onLoadChipsData, screenKey],
  );

  const loadDropdownData = useCallback(
    (control: any, searchText?: string | null, page?: number, append?: boolean) => {
      // Validate that model has required columns before making API call
      // Backend requires at least 2 columns (RecordID + display column)
      const hasValidColumns =
        control?.model?.columns && Array.isArray(control.model.columns) && control.model.columns.length >= 2;

      if (onLoadDropdownData && screenKey && screenId && control?.model && hasValidColumns) {
        const body: Record<string, any> = {
          screenState: null,
          model: { ...control.model },
        };
        if (searchText) {
          body.SearchText = searchText;
        }
        if (page && page > 1) {
          body.Page = page;
        }
        onLoadDropdownData(screenKey, screenId, control.id, body, activeRecordId, append);
      }
    },
    [onLoadDropdownData, screenKey, screenId, activeRecordId],
  );

  const loadGalleryData = useCallback(
    (control: any, paging: { pageSize: number; pageNumber: number }, searchString?: string) => {
      if (onLoadGalleryData && screenKey && screenId && control) {
        onLoadGalleryData(screenKey, screenId, control, activeRecordId, paging, searchString);
      }
    },
    [onLoadGalleryData, screenKey, screenId, activeRecordId],
  );

  const loadGridData = useCallback(
    (control: any, gridEvent?: number, totalRecordCount?: number, analyticsMetaData?: Record<string, any>) => {
      // Pass the full control object like legacy GridWrapperV4 does
      // Legacy signature: loadGridDataV4(screenKey, panel.screenId, control, panel.activeRecordId, evt, totalRecordCount, analyticsMetaData)
      // The control should have all properties needed for the API call (id, viewFilter, paging, sorting, etc.)
      if (onLoadGridData && screenKey && screenId && control) {
        onLoadGridData(
          screenKey,
          screenId,
          control.id || control.Id,
          control,
          activeRecordId,
          panelName,
          gridEvent,
          totalRecordCount,
          analyticsMetaData,
        );
      }
    },
    [onLoadGridData, screenKey, screenId, activeRecordId, panelName],
  );

  // ---------------------------------------------------------------------------
  // Data Access (Getters)
  // ---------------------------------------------------------------------------
  const getChartData = useCallback((id: string) => dataReducer[id] || null, [dataReducer]);

  const getDropdownData = useCallback((id: string) => dataReducer[`${id}_list`] || null, [dataReducer]);

  const getGalleryData = useCallback((id: string) => dataReducer[id] || null, [dataReducer]);

  const getGridChipsData = useCallback((id: string) => dataReducer[`${id}-chips`] || null, [dataReducer]);

  const getGridData = useCallback((id: string) => dataReducer[id] || null, [dataReducer]);

  const getGridTotalRecordCount = useCallback(
    (control: any) => {
      if (onGetGridTotalRecordCount && screenKey) {
        onGetGridTotalRecordCount(screenKey, control);
      }
    },
    [onGetGridTotalRecordCount, screenKey],
  );

  // ---------------------------------------------------------------------------
  // Control Updates
  // ---------------------------------------------------------------------------
  const bulkUpdateControls = useCallback(
    (updates: any[]) => {
      if (onBulkUpdateControls && screenKey) {
        onBulkUpdateControls(screenKey, updates);
      }
    },
    [onBulkUpdateControls, screenKey],
  );

  const updateControlProperty = useCallback(
    (controlId: string, property: string, value: any) => {
      if (onUpdateControlProperty && screenKey) {
        onUpdateControlProperty(screenKey, controlId, property, value);
      }
    },
    [onUpdateControlProperty, screenKey],
  );

  // ---------------------------------------------------------------------------
  // Grid Row Operations
  // ---------------------------------------------------------------------------
  const bulkAddGridRows = useCallback(
    (controlId: string, rows: any[]) => {
      if (onBulkAddGridRows && screenKey) {
        onBulkAddGridRows(screenKey, controlId, rows);
      }
    },
    [onBulkAddGridRows, screenKey],
  );

  const clearChipData = useCallback(
    (controlId: string) => {
      if (onClearChipData && screenKey) {
        onClearChipData(screenKey, controlId);
      }
    },
    [onClearChipData, screenKey],
  );

  const deleteGridRow = useCallback(
    (controlId: string, rowIdx: number, clearIt: boolean) => {
      if (onDeleteGridRow && screenKey) {
        onDeleteGridRow(screenKey, controlId, rowIdx, clearIt);
      }
    },
    [onDeleteGridRow, screenKey],
  );

  const updateGridCell = useCallback(
    (controlId: string, rowId: number, field: string, value: any, text?: any) => {
      if (onUpdateGridCell && screenKey) {
        onUpdateGridCell(screenKey, controlId, rowId, field, value, text);
      }
    },
    [onUpdateGridCell, screenKey],
  );

  const updateGridRowStatus = useCallback(
    (controlId: string, rowId: number, status: string) => {
      if (onUpdateGridRowStatus && screenKey) {
        onUpdateGridRowStatus(screenKey, controlId, rowId, status);
      }
    },
    [onUpdateGridRowStatus, screenKey],
  );

  const uploadGridImage = useCallback(
    (
      formData: FormData,
      field: string,
      rowIdx: number,
      recordId: string | number | null,
      onStartUpload: () => void,
      onProgress: (progressEvent: any, rowIdx: number, field: string) => void,
      onSuccess: (response: any, rowIdx: number, field: string, recordId: string | number | null) => void,
      onError: (error: any, rowIdx: number, field: string) => void,
      onCancel: () => void,
    ) => {
      if (onUploadGridImage && screenKey) {
        onUploadGridImage(formData, field, rowIdx, recordId, onStartUpload, onProgress, onSuccess, onError, onCancel);
      }
    },
    [onUploadGridImage, screenKey],
  );

  const uploadSignature = useCallback(
    (documentId: string, documentData: FormData) => {
      if (onUploadSignature) {
        return onUploadSignature(documentId, documentData);
      }
      return Promise.resolve({ error: 'Upload signature not available' });
    },
    [onUploadSignature],
  );

  // ---------------------------------------------------------------------------
  // Custom Views
  // ---------------------------------------------------------------------------
  const deleteCustomView = useCallback(
    (filterData: CustomViewFilterData, onSuccess?: () => void) => {
      if (onDeleteCustomView && screenKey) {
        onDeleteCustomView(screenKey, filterData, onSuccess);
      }
    },
    [onDeleteCustomView, screenKey],
  );

  const loadCustomViewsData = useCallback(
    (controlId: string, viewFriendlyName: string) => {
      if (onLoadCustomViewsData && screenKey) {
        return onLoadCustomViewsData(screenKey, controlId, viewFriendlyName);
      }
      return Promise.resolve({ myViews: [], sharedViews: [] });
    },
    [onLoadCustomViewsData, screenKey],
  );

  const saveCustomView = useCallback(
    (filterData: CustomViewFilterData, onSuccess?: () => void, onError?: (errorMessage: string) => void) => {
      if (onSaveCustomView && screenKey) {
        onSaveCustomView(screenKey, filterData, onSuccess, onError);
      }
    },
    [onSaveCustomView, screenKey],
  );

  const showGridFilterDialog = useCallback(
    (
      onClose: (isRealClose: boolean, onDialogClose?: () => void) => void,
      onSave: (isEditMode: boolean, onDialogClose?: () => void) => void,
      isEditMode: boolean,
      selectedView: any,
      onDialogClose?: () => void,
      onDelete?: (filterId: string) => void,
    ) => {
      if (onShowGridFilterDialog && screenKey) {
        onShowGridFilterDialog(onClose, onSave, isEditMode, selectedView, onDialogClose, onDelete);
      }
    },
    [onShowGridFilterDialog, screenKey],
  );

  const updateCustomView = useCallback(
    (filterData: CustomViewFilterData, onSuccess?: () => void, onError?: (errorMessage: string) => void) => {
      if (onUpdateCustomView && screenKey) {
        onUpdateCustomView(screenKey, filterData, onSuccess, onError);
      }
    },
    [onUpdateCustomView, screenKey],
  );

  const updateCustomViewsOrder = useCallback(
    (viewOrder: string[], controlId: string, isShared: boolean) => {
      if (onUpdateCustomViewsOrder && screenKey) {
        onUpdateCustomViewsOrder(screenKey, viewOrder, controlId, isShared);
      }
    },
    [onUpdateCustomViewsOrder, screenKey],
  );

  // ---------------------------------------------------------------------------
  // Dialogs & UI
  // ---------------------------------------------------------------------------
  const showMessageDialog = useCallback(
    (dialog: any) => {
      if (onShowMessageDialog) {
        onShowMessageDialog(dialog);
      }
    },
    [onShowMessageDialog],
  );

  const manageTags = useCallback(
    (controlId?: string) => {
      if (onManageTags) {
        onManageTags(controlId);
      }
    },
    [onManageTags],
  );

  const openRecurrencePanel = useCallback(
    (controlId: string, pattern: string | undefined, template: any, seriesModel: any) => {
      if (onOpenRecurrencePanel) {
        onOpenRecurrencePanel(controlId, pattern, template, seriesModel);
      }
    },
    [onOpenRecurrencePanel],
  );

  // ---------------------------------------------------------------------------
  // Tag Operations
  // ---------------------------------------------------------------------------
  const validateAndUpdateTags = useCallback(
    (controlId: string, tags: string[], onChangePayload?: OnChangePayload) => {
      if (onValidateAndUpdateTags && screenKey) {
        onValidateAndUpdateTags(screenKey, controlId, tags, onChangePayload);
      }
    },
    [onValidateAndUpdateTags, screenKey],
  );
  // Image Operations
  // ---------------------------------------------------------------------------
  const uploadImage = useCallback(
    (
      controlId: string,
      file: File,
      onProgress?: (progressEvent: any) => void,
      onSuccess?: (response: { url: string; originalName: string }) => void,
      onError?: (error: any) => void,
    ) => {
      if (onUploadImage && screenKey) {
        onUploadImage(screenKey, controlId, file, onProgress, onSuccess, onError);
      }
    },
    [onUploadImage, screenKey],
  );

  const uploadWebImage = useCallback(
    (
      controlId: string,
      url: string,
      onProgress?: (progressEvent: any) => void,
      onSuccess?: (response: { url: string; originalName: string }) => void,
      onError?: (error: any) => void,
    ) => {
      if (onUploadWebImage && screenKey) {
        onUploadWebImage(screenKey, controlId, url, onProgress, onSuccess, onError);
      }
    },
    [onUploadWebImage, screenKey],
  );

  const deleteImage = useCallback(
    (controlId: string, originalName?: string) => {
      if (onDeleteImage && screenKey) {
        onDeleteImage(screenKey, controlId, originalName);
      }
    },
    [onDeleteImage, screenKey],
  );

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------
  const processAnalytics = useCallback(
    (eventName: string, attributes: Record<string, any>) => {
      if (onProcessAnalytics) {
        onProcessAnalytics(eventName, attributes);
      }
    },
    [onProcessAnalytics],
  );

  const queueDataTableExport = useCallback(
    (control: any, analyticsMetaData?: Record<string, unknown>) => {
      if (onQueueDataTableExport && screenKey) {
        onQueueDataTableExport(control, screenKey, analyticsMetaData);
      }
    },
    [onQueueDataTableExport, screenKey],
  );

  const queueMailChimpExport = useCallback(
    (modelToPost: any) => {
      if (onQueueMailChimpExport && screenKey) {
        onQueueMailChimpExport(modelToPost, screenKey);
      }
    },
    [onQueueMailChimpExport, screenKey],
  );

  // ---------------------------------------------------------------------------
  // Attachment Operations
  // ---------------------------------------------------------------------------
  const deleteAttachment = useCallback(
    (controlId: string, documentId: string) => {
      if (onAttachmentDelete && screenKey) {
        onAttachmentDelete(screenKey, controlId, documentId, activeRecordId);
      }
    },
    [onAttachmentDelete, screenKey, activeRecordId],
  );

  const handleAttachmentClick = useCallback(
    (documentId: string, url: string) => {
      if (onAttachmentClick) {
        onAttachmentClick(documentId, url, activeRecordId);
      }
    },
    [onAttachmentClick, activeRecordId],
  );

  const handleToggleEmailAttachment = useCallback(
    (controlId: string, documentId: string, attachToEmail: boolean) => {
      if (onToggleEmailAttachment && screenKey) {
        onToggleEmailAttachment(screenKey, controlId, documentId, attachToEmail, viewFriendlyName || null);
      }
    },
    [onToggleEmailAttachment, screenKey, viewFriendlyName],
  );

  const handleClearFailedAttachments = useCallback(
    (controlId: string) => {
      if (onClearFailedAttachments && screenKey) {
        onClearFailedAttachments(screenKey, controlId);
      }
    },
    [onClearFailedAttachments, screenKey],
  );

  const uploadAttachmentState = useCallback(
    (controlId: string, fileId: string, fileName: string, fileSize: number, errorMessage?: string) => {
      if (onUploadAttachmentState && screenKey) {
        onUploadAttachmentState(screenKey, controlId, fileId, fileName, fileSize, errorMessage);
      }
    },
    [onUploadAttachmentState, screenKey],
  );

  const triggerUploadAttachment = useCallback(
    (controlId: string, fileWrappers: any[], file: File) => {
      if (onTriggerUploadAttachment && screenKey && screenId) {
        onTriggerUploadAttachment(screenKey, controlId, fileWrappers, file, screenId, activeRecordId || null);
      }
    },
    [onTriggerUploadAttachment, screenKey, screenId, activeRecordId],
  );

  // ---------------------------------------------------------------------------
  // Debug: Track dependency changes
  // ---------------------------------------------------------------------------
  const prevDeps = useRef<any>();
  useEffect(() => {
    prevDeps.current = {
      // Control Access
      getControl,
      // Data Loading
      loadAttachmentsData,
      loadChartData,
      loadChipsData,
      loadDropdownData,
      loadGalleryData,
      loadGridData,
      // Data Access
      getChartData,
      getDropdownData,
      getGalleryData,
      getGridChipsData,
      getGridData,
      getGridTotalRecordCount,
      // Control Updates
      bulkUpdateControls,
      updateControlProperty,
      // Grid Row Operations
      bulkAddGridRows,
      clearChipData,
      deleteGridRow,
      updateGridCell,
      updateGridRowStatus,
      uploadGridImage,
      // Custom Views
      deleteCustomView,
      loadCustomViewsData,
      saveCustomView,
      showGridFilterDialog,
      updateCustomView,
      updateCustomViewsOrder,
      // Dialogs & UI
      showMessageDialog,
      manageTags,
      // Tag Operations
      validateAndUpdateTags,
      // Image Operations
      uploadImage,
      uploadWebImage,
      deleteImage,
      openRecurrencePanel,
      // Utilities
      processAnalytics,
      queueDataTableExport,
      queueMailChimpExport,
    };
  });

  // ---------------------------------------------------------------------------
  // Auth Context Selector
  // ---------------------------------------------------------------------------
  const selectAuthContext = useCallback(() => {
    if (!store) {
      return {
        account: '',
        authToken: '',
        identity: '',
        runtimeCoreUrl: '',
        secureToken: '',
      };
    }

    const state = store.getState();
    const contextReducer = state.contextReducer || {};

    // Read directly from contextReducer - these properties already exist
    const account = contextReducer.account || '';
    const authToken = contextReducer.authToken || '';
    const identity = contextReducer.identity || '';
    const runtimeCoreUrl = contextReducer.runtimeCoreUrl || '';
    const secureToken = contextReducer.secureToken || '';

    return {
      account,
      authToken,
      identity,
      runtimeCoreUrl,
      secureToken,
    };
  }, [store]);

  // ---------------------------------------------------------------------------
  // Context Value
  // ---------------------------------------------------------------------------
  const contextValue = useMemo(
    () => ({
      // Core Runtime State
      screenKey,
      screenId,
      activeRecordId,
      viewFriendlyName,
      panelName,
      mode: 'runtime' as const,
      store, // Redux store for direct subscriptions (synchronous updates)
      isMobile,
      applicationType,
      isAdminOrCustomizer,

      // Control Access
      getControl,

      // Data Loading
      loadAttachmentsData,
      loadChartData,
      setChartSelectedPoint,
      setChartSelectedRow,
      loadChipsData,
      loadDropdownData,
      loadGalleryData,
      loadGridData,

      // Data Access
      getChartData,
      getDropdownData,
      getGalleryData,
      getGridChipsData,
      getGridData,
      getGridTotalRecordCount,

      // Control Updates
      bulkUpdateControls,
      updateControlProperty,

      // Grid Row Operations
      bulkAddGridRows,
      clearChipData,
      deleteGridRow,
      updateGridCell,
      updateGridRowStatus,
      uploadGridImage,
      uploadSignature,

      // Custom Views
      deleteCustomView,
      loadCustomViewsData,
      saveCustomView,
      showGridFilterDialog,
      updateCustomView,
      updateCustomViewsOrder,

      // Dialogs & UI
      showMessageDialog,
      manageTags,
      openRecurrencePanel,

      // Tag Operations
      validateAndUpdateTags,
      // Image Operations
      uploadImage,
      uploadWebImage,
      deleteImage,

      // Utilities
      processAnalytics,
      queueDataTableExport,
      queueMailChimpExport,

      // Auth Context
      selectAuthContext,
      // Attachment Operations
      deleteAttachment,
      onAttachmentClick: handleAttachmentClick,
      onToggleEmailAttachment: handleToggleEmailAttachment,
      clearFailedAttachments: handleClearFailedAttachments,
      uploadAttachmentState,
      triggerUploadAttachment,

      chartExpandAnchorEl,
      chartExpandMargin,
      chartConstrainOverlayToAnchor,
    }),
    [
      // Core Runtime State
      screenKey,
      screenId,
      activeRecordId,
      viewFriendlyName,
      panelName,
      store,
      isMobile,
      applicationType,
      isAdminOrCustomizer,

      // Control Access
      getControl,

      // Data Loading
      loadAttachmentsData,
      loadChartData,
      loadChipsData,
      loadDropdownData,
      loadGalleryData,
      loadGridData,

      // Data Access
      getChartData,
      getDropdownData,
      getGalleryData,
      getGridChipsData,
      getGridData,
      getGridTotalRecordCount,

      // Control Updates
      bulkUpdateControls,
      updateControlProperty,

      // Chart Operations
      setChartSelectedPoint,
      setChartSelectedRow,

      // Grid Row Operations
      bulkAddGridRows,
      clearChipData,
      deleteGridRow,
      updateGridCell,
      updateGridRowStatus,
      uploadGridImage,
      uploadSignature,

      // Custom Views
      deleteCustomView,
      loadCustomViewsData,
      saveCustomView,
      showGridFilterDialog,
      updateCustomView,
      updateCustomViewsOrder,

      // Dialogs & UI
      showMessageDialog,
      manageTags,
      openRecurrencePanel,

      // Tag Operations
      validateAndUpdateTags,
      // Image Operations
      uploadImage,
      uploadWebImage,
      deleteImage,

      // Utilities
      processAnalytics,
      queueDataTableExport,
      queueMailChimpExport,

      // Auth Context
      selectAuthContext,

      // Attachment Operations
      deleteAttachment,
      handleAttachmentClick,
      handleToggleEmailAttachment,
      handleClearFailedAttachments,
      uploadAttachmentState,
      triggerUploadAttachment,

      chartExpandAnchorEl,
      chartExpandMargin,
      chartConstrainOverlayToAnchor,
    ],
  );

  return <RuntimeContext.Provider value={contextValue}>{children}</RuntimeContext.Provider>;
};
