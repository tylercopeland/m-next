import React, { useState, useRef, useEffect, useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Gallery package doesn't have type declarations
import Gallery from '@m-next/gallery';
import * as s from './GalleryWrapperRedux.styles';
import Pagination from './Pagination';
import { useRuntimeContext } from '../../contexts/RuntimeContext';
import { useDesignerContext } from '../../contexts/DesignerContext';
import type { ActionHandler } from '../../actions/types';

// Gallery model configuration
interface GalleryModel {
  viewName?: string;
  imageField?: string;
  viewFilter?: {
    searchString?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Gallery control interface extending runtime needs
interface GalleryControlType {
  id: string;
  type?: string;
  caption?: string;
  hideCaption?: boolean;
  disabled?: boolean;
  visible?: boolean;
  onClick?: string;
  model?: GalleryModel;
  paging?: {
    pageNumber: number;
    pageSize: number;
  };
  [key: string]: unknown;
}

// Gallery item from API
interface GalleryItemType {
  id: string | number;
  caption?: string;
  action?: () => void;
  [key: string]: unknown;
}

// Gallery data response
interface GalleryDataResponse {
  pageItems?: GalleryItemType[];
  totalItems?: number;
}

export interface GalleryWrapperProps {
  /** Control ID */
  id: string;
  /** Callback when control is clicked (designer mode) */
  onControlClick?: (id: string) => void;
  /** Mode: 'designer' or 'runtime' */
  mode?: 'designer' | 'runtime';
  /** Control data (passed directly in runtime mode) */
  control?: GalleryControlType;
  /** Action handler for runtime mode */
  actionHandler?: ActionHandler;
  /** Screen ID for runtime mode */
  screenId?: string;
  /** Active record ID for runtime mode */
  recordId?: string;
  /** Screen state for runtime mode */
  screenState?: Record<string, unknown>;
}

/**
 * Gallery wrapper component that supports both designer and runtime modes.
 *
 * Designer mode: Uses RTK Query to fetch gallery data via DesignerContext
 * Runtime mode: Uses RuntimeContext to load/fetch gallery data and execute actions
 */
const GalleryWrapperRedux: React.FC<GalleryWrapperProps> = ({
  id,
  onControlClick,
  mode = 'designer',
  control: controlProp,
  actionHandler,
  screenId: screenIdProp,
  recordId,
  screenState,
}) => {
  // Get both contexts
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();

  // Determine mode based on props - control prop presence or explicit mode flag
  const isRuntimeMode = !!controlProp || mode === 'runtime';

  // Get control from appropriate source
  const control: GalleryControlType | undefined = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;

  // Get screen info from appropriate source
  const activeRecordId = isRuntimeMode ? recordId : designerContext?.activeRecordId;
  const screenId = isRuntimeMode ? screenIdProp || runtimeContext?.screenId : designerContext?.screenId;

  // Local state
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const initialLoadDoneRef = useRef(false);

  // Designer mode: RTK Query for data fetching via DesignerContext
  const skipQuery = isRuntimeMode || !control || !control.model || !control.model.viewName || isMeasuring;

  // Only use RTK Query in designer mode
  let designerData: GalleryDataResponse | null = null;
  let designerIsFetching = false;

  if (!isRuntimeMode && designerContext?.onLoadGalleryData) {
    // Designer mode - use RTK Query via context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queryResult = designerContext.onLoadGalleryData(
      {
        id: control?.id,
        screenId,
        activeRecordId,
        body: {
          screenState: null,
          model: {
            ...control?.model,
            viewFilter: { ...control?.model?.viewFilter, searchString },
            paging: { pageSize, pageNumber },
          },
        },
      },
      { skip: skipQuery },
    );
    designerData = queryResult?.data || null;
    designerIsFetching = queryResult?.isFetching || false;
  }

  // Runtime mode: Load data via RuntimeContext
  const loadData = useCallback(() => {
    if (!isRuntimeMode || !runtimeContext?.loadGalleryData || !control || isMeasuring) {
      return;
    }

    // Check if gallery is configured (has viewName and imageField)
    if (!control?.model?.viewName || !control?.model?.imageField) {
      return;
    }

    // Check if control is visible (from control props)
    const isVisible = control.visible !== false;
    if (!isVisible) {
      return;
    }

    setIsLoading(true);
    runtimeContext.loadGalleryData(control, { pageSize, pageNumber }, searchString);
  }, [isRuntimeMode, runtimeContext, control, pageSize, pageNumber, searchString, isMeasuring]);

  // Runtime mode: Get data from RuntimeContext
  const runtimeData: GalleryDataResponse | null =
    isRuntimeMode && runtimeContext?.getGalleryData ? runtimeContext.getGalleryData(id) : null;

  // Initial measurement and load - only run once on mount
  useEffect(() => {
    if (!galleryRef.current || initialLoadDoneRef.current) {
      return;
    }

    const { width } = galleryRef.current.getBoundingClientRect();
    let itemsPerRow = Math.floor(width / 200);
    if (itemsPerRow === 0) {
      itemsPerRow = 1;
    }

    const newPageSize = itemsPerRow * 3;
    setPageSize(newPageSize);
    setPageNumber(1);
    setIsMeasuring(false);
    initialLoadDoneRef.current = true;

    // In runtime mode, trigger initial load after measurement (only if configured)
    const hasViewName = control?.model?.viewName;
    const hasImageField = control?.model?.imageField;
    if (isRuntimeMode && runtimeContext?.loadGalleryData && control && hasViewName && hasImageField) {
      setIsLoading(true);
      runtimeContext.loadGalleryData(control, { pageSize: newPageSize, pageNumber: 1 }, '');
    } else if (isRuntimeMode && (!hasViewName || !hasImageField)) {
      // Gallery not configured, stop loading state
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Designer mode: Reset to page 1 when viewName, viewFilter, or searchString changes (matches legacy)
  useEffect(() => {
    if (isRuntimeMode || !control) {
      return;
    }
    setPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control?.model?.viewName, control?.model?.viewFilter, searchString]);

  // Runtime mode: Load data when search changes
  useEffect(() => {
    if (!initialLoadComplete || !isRuntimeMode || !control) {
      return;
    }
    // Reset to page 1 on search change
    if (pageNumber > 1) {
      setPageNumber(1);
    } else {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  // Runtime mode: Load data when page changes
  useEffect(() => {
    if (!initialLoadComplete || !isRuntimeMode) {
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  // Handle click action for gallery items (runtime mode)
  const handleItemClick = useCallback(
    async (item: GalleryItemType) => {
      if (!isRuntimeMode || !actionHandler || !screenId || !control?.onClick) {
        return;
      }

      try {
        const result = await actionHandler.executeAction({
          componentId: id,
          actionName: 'onClick',
          screenId,
          recordId: activeRecordId ?? undefined,
          actionData: {
            RecordID: item.id,
            Caption: item.caption,
            event: { type: 'click' },
          },
          screenState: screenState,
          metadata: {
            // Gallery item properties - duplicated in metadata for MethodUIActionHandler compatibility
            // (MethodUIActionHandler only passes metadata to executeAction, not actionData)
            RecordID: item.id,
            Caption: item.caption,
            timestamp: Date.now(),
            componentType: control?.type || 'gallery',
          },
        });

        if (!result.success && result.error) {
          console.error('[GalleryWrapper] onClick action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[GalleryWrapper] Error executing onClick action:', error);
      }
    },
    [isRuntimeMode, actionHandler, screenId, id, activeRecordId, control, screenState],
  );

  // Process data for display
  useEffect(() => {
    const sourceData = isRuntimeMode ? runtimeData : designerData;

    if (sourceData?.pageItems) {
      // Defensive slicing to ensure we don't exceed pageSize (matches legacy behavior)
      const slicedItems = sourceData.pageItems.slice(0, pageSize);

      // In runtime mode with onClick handler, wrap items with action
      if (isRuntimeMode && control?.onClick) {
        setItems(
          slicedItems.map((item) => ({
            ...item,
            action: () => handleItemClick(item),
          })),
        );
      } else {
        setItems(slicedItems);
      }
      setTotalItems(sourceData.totalItems || 0);
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeData, designerData]);

  // Designer mode: sync loading state
  useEffect(() => {
    if (!isRuntimeMode) {
      setIsLoading(designerIsFetching);
    }
  }, [designerIsFetching, isRuntimeMode]);

  const handleKeyDown = ({ key, target }: React.KeyboardEvent<HTMLInputElement>) => {
    const inputTarget = target as HTMLInputElement;
    if (key === 'Enter') {
      setSearchString(inputTarget.value);
      // In runtime mode, reset to page 1 on new search
      if (isRuntimeMode && pageNumber > 1) {
        setPageNumber(1);
      }
    } else if (key === 'Escape') {
      setSearchString('');
    }
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    // In runtime mode, update control property for paging state (matches legacy behavior)
    if (isRuntimeMode && runtimeContext?.updateControlProperty && control?.id) {
      runtimeContext.updateControlProperty(control.id, 'paging', {
        pageNumber: page,
        pageSize: pageSize,
      });
    }
  };

  // Handle control click for designer mode
  const handleSearchFocus = () => {
    if (!isRuntimeMode && onControlClick && control?.id) {
      onControlClick(control.id);
    }
  };

  // Check if control is not visible (runtime mode)
  if (isRuntimeMode && control?.visible === false) {
    return null;
  }

  // Check if gallery is not configured (no table or no image field on the table)
  const isNotConfigured = !control?.model?.viewName || !control?.model?.imageField;

  // If not configured, show appropriate message based on mode
  if (isNotConfigured) {
    return (
      <s.EmptyWrapper ref={galleryRef}>
        <strong>Gallery not configured</strong>
        <span>Select a table with an image field in the right panel to configure</span>
      </s.EmptyWrapper>
    );
  }

  // Loading state check (control not yet available)
  if (!control) {
    return (
      <s.EmptyWrapper ref={galleryRef}>
        <span>Loading gallery...</span>
      </s.EmptyWrapper>
    );
  }

  const isMobile = isRuntimeMode ? runtimeContext?.isMobile : false;

  return (
    <s.GalleryWrapper ref={galleryRef}>
      <s.Header hasCaption={!control.hideCaption && !!control.caption}>
        {!control.hideCaption && control.caption && (
          <s.Caption id={`${id}-GALLERY-CAPTION`}>{control.caption}</s.Caption>
        )}
        <s.SearchBox
          id={`${id}-GALLERY-SEARCH-INPUT`}
          type='search'
          placeholder='Search'
          isMobile={isMobile}
          onKeyDown={handleKeyDown}
          onFocus={handleSearchFocus}
        />
      </s.Header>
      <s.GalleryContent>
        <Gallery
          id={`${id}-GALLERY`}
          disabled={control.disabled}
          isLoading={isLoading}
          loadingItemCount={pageSize}
          items={items}
        />
        {!isLoading && items.length === 0 && <s.Empty id={`${id}-GALLERY-NO-RESULTS`}>No Results Found</s.Empty>}
      </s.GalleryContent>
      {totalItems > pageSize && (
        <s.PaginationWrapper>
          <Pagination
            id={`${id}-GALLERY`}
            pageNumber={pageNumber}
            perPage={pageSize}
            totalRecords={totalItems}
            onClickNext={() => {
              handlePageChange(pageNumber + 1);
            }}
            onClickPrevious={() => {
              handlePageChange(pageNumber - 1);
            }}
          />
        </s.PaginationWrapper>
      )}
    </s.GalleryWrapper>
  );
};

export default GalleryWrapperRedux;
