/**
 * Hook that encapsulates the control duplication logic.
 *
 * Extracted from layoutDesigner.jsx to reduce file size and isolate
 * the complex container-child duplication orchestration.
 */
import { useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { WIDGETS } from '@m-next/runtime-interface';

import {
  controlDuplicated,
  actionUpdated,
  layoutV4Updated,
  saveScreen,
} from '../../../common/services/screenLayoutSlice';

interface LayoutItem {
  id: string;
  content?: LayoutItem[];
  desktop?: { x: number; y: number; width?: number; height?: number };
  x?: number;
  y?: number;
  containerId?: string | null;
  [key: string]: unknown;
}

interface LayoutCanvas {
  content: LayoutItem[];
  [key: string]: unknown;
}

interface Control {
  id: string;
  type: string;
  containerId?: string | null;
  isBound?: boolean;
  boundField?: string;
  onClick?: string | null;
  onChange?: string | null;
  onBlur?: string | null;
  onFocus?: string | null;
  [key: string]: unknown;
}

interface ClipboardData {
  controlId: string;
  controlSnapshot: Control;
}

interface CopiedActionSet {
  id: string;
  actionSet: unknown;
}

interface DuplicateResult {
  control: Control;
  layoutItem: LayoutItem;
  copiedActionSets: CopiedActionSet[];
}

interface PendingDuplicate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  containerId: string | null;
}

interface UseControlDuplicateParams {
  controls: Record<string, Control>;
  layoutV4: LayoutCanvas | null;
  screenData: { Data?: { screen?: { actionSets?: Record<string, unknown>; events?: Record<string, unknown> } } } | null;
  gridColumns: number;
  actionUpserts: Record<string, Record<string, unknown>>;
  versionId: string;
  publishStatus: string;
  refetchScreenData: () => void;
}

interface UseControlDuplicateReturn {
  handleControlDuplicate: (controlIdOrClipboard: string | ClipboardData) => Promise<void>;
}

export const useControlDuplicate = ({
  controls,
  layoutV4,
  screenData,
  gridColumns,
  actionUpserts,
  versionId,
  publishStatus,
  refetchScreenData,
}: UseControlDuplicateParams): UseControlDuplicateReturn => {
  const dispatch = useDispatch();

  // Track pending duplicate positions to prevent stacking when spamming
  const pendingDuplicatesRef = useRef<PendingDuplicate[]>([]);

  // Clear pending duplicates when they appear in layoutV4
  useEffect(() => {
    if (pendingDuplicatesRef.current.length === 0) return;

    const findInLayout = (items: LayoutItem[], id: string): boolean => {
      for (const item of items) {
        if (item.id === id) return true;
        if (item.content?.length && findInLayout(item.content, id)) return true;
      }
      return false;
    };

    pendingDuplicatesRef.current = pendingDuplicatesRef.current.filter(
      (pending) => !layoutV4?.content || !findInLayout(layoutV4.content, pending.id),
    );
  }, [layoutV4]);

  const handleControlDuplicate = useCallback(
    async (controlIdOrClipboard: string | ClipboardData) => {
      if (!controlIdOrClipboard || !layoutV4 || !controls) return;

      // Import duplicate helper utilities
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createDuplicateControl, canDuplicateControl, isEventPropertyWithGuid } = require('../editors/common/utils/duplicateControlHelper');

      // Handle both formats:
      // - String controlId (for CTRL+D duplicate - uses current state)
      // - Clipboard object { controlId, controlSnapshot } (for CTRL+V paste - uses snapshot from copy time)
      const isClipboardPaste =
        typeof controlIdOrClipboard === 'object' && (controlIdOrClipboard as ClipboardData).controlSnapshot;
      const controlId = isClipboardPaste
        ? (controlIdOrClipboard as ClipboardData).controlId
        : (controlIdOrClipboard as string);

      // For paste operations, use the snapshot from when CTRL+C was pressed
      // For duplicate operations, use the current control state
      const controlToDuplicate = isClipboardPaste
        ? (controlIdOrClipboard as ClipboardData).controlSnapshot
        : controls[controlId];
      if (!controlToDuplicate) return;

      // Check if control can be duplicated
      const { canDuplicate, reason, tooltipMessage } = canDuplicateControl({
        control: controlToDuplicate,
        controlList: controls,
        layoutV4,
        screenData,
      });

      if (!canDuplicate && reason !== 'Container with single-instance children') {
        toast.error(tooltipMessage || 'This component cannot be duplicated');
        return;
      }

      const isContainer =
        controlToDuplicate.type === WIDGETS.LAYOUT_CONTAINER || controlToDuplicate.type === WIDGETS.SECTION;

      let hasMappedComponents = false;
      const singleInstanceWidgets = [
        WIDGETS.SIGNATURE,
        WIDGETS.TAGLIST,
        WIDGETS.SYNCWIDGET,
        WIDGETS.DOCUMENTSWIDGET,
        WIDGETS.RECURRENCE,
      ];

      // Merge actionSets from screenData (saved) and actionUpserts (unsaved changes)
      const allActionSets = {
        ...(screenData?.Data?.screen?.actionSets || {}),
        ...(actionUpserts?.[versionId] || {}),
      };

      const allEvents = screenData?.Data?.screen?.events || {};

      const {
        control: duplicatedControl,
        layoutItem: duplicatedLayoutItem,
        copiedActionSets,
      }: DuplicateResult = createDuplicateControl(
        controlToDuplicate,
        controls,
        layoutV4,
        gridColumns,
        allActionSets,
        allEvents,
        pendingDuplicatesRef.current,
      );

      // Track this duplicate's position for subsequent rapid duplications
      pendingDuplicatesRef.current.push({
        id: duplicatedControl.id,
        x: duplicatedLayoutItem.desktop!.x,
        y: duplicatedLayoutItem.desktop!.y,
        width: duplicatedLayoutItem.desktop!.width || 4,
        height: duplicatedLayoutItem.desktop!.height || 2,
        containerId: controlToDuplicate.containerId || null,
      });

      if (controlToDuplicate.isBound && controlToDuplicate.boundField) {
        hasMappedComponents = true;
      }

      // Handle container duplication
      if (isContainer) {
        const findInNested = (items: LayoutItem[], targetId: string): LayoutItem | null => {
          for (const item of items) {
            if (item.id === targetId) return item;
            if (item.content && item.content.length > 0) {
              const found = findInNested(item.content, targetId);
              if (found) return found;
            }
          }
          return null;
        };

        const containerLayoutItem = findInNested(layoutV4.content, controlId);
        const childIds = containerLayoutItem?.content?.map((child) => child.id) || [];

        const duplicatedChildren: Control[] = [];
        const duplicatedChildLayoutItems: LayoutItem[] = [];
        const allChildActionSets: CopiedActionSet[] = [];

        const controlListWithDuplicates = { ...controls, [duplicatedControl.id]: duplicatedControl };

        for (const childId of childIds) {
          const childControl = controls[childId];

          if (singleInstanceWidgets.includes(childControl.type)) {
            continue;
          }

          if (childControl.isBound && childControl.boundField) {
            hasMappedComponents = true;
          }

          const {
            control: dupChild,
            layoutItem: dupChildLayout,
            copiedActionSets: childCopiedActionSets,
          }: DuplicateResult = createDuplicateControl(
            childControl,
            controlListWithDuplicates,
            layoutV4,
            gridColumns,
            allActionSets,
            allEvents,
            [],
          );

          dupChild.containerId = duplicatedControl.id;
          dupChildLayout.containerId = duplicatedControl.id;

          if (childCopiedActionSets && childCopiedActionSets.length > 0) {
            allChildActionSets.push(...childCopiedActionSets);
          }

          const originalChildLayout = findInNested(layoutV4.content, childControl.id);
          if (originalChildLayout) {
            dupChildLayout.desktop!.x = originalChildLayout.desktop?.x ?? originalChildLayout.x ?? 0;
            dupChildLayout.desktop!.y = originalChildLayout.desktop?.y ?? originalChildLayout.y ?? 0;
          }

          duplicatedChildren.push(dupChild);
          duplicatedChildLayoutItems.push(dupChildLayout);
          controlListWithDuplicates[dupChild.id] = dupChild;
        }

        dispatch(controlDuplicated({ control: duplicatedControl, layoutItem: duplicatedLayoutItem }));

        if (copiedActionSets && copiedActionSets.length > 0) {
          copiedActionSets.forEach(({ id, actionSet }) => {
            dispatch(actionUpdated({ id, actionSet, controlId: duplicatedControl.id }));
          });
        }

        duplicatedChildren.forEach((child) => {
          dispatch(controlDuplicated({ control: child, layoutItem: null }));
        });

        if (allChildActionSets.length > 0) {
          allChildActionSets.forEach(({ id, actionSet }) => {
            // Match action set to its child control by checking root-level on* properties
            const childControl = duplicatedChildren.find((child) =>
              Object.entries(child).some(([key, value]) => isEventPropertyWithGuid(key, value) && value === id),
            );

            if (childControl) {
              dispatch(actionUpdated({ id, actionSet, controlId: childControl.id }));
            } else {
              // Action set belongs to a nested structure (e.g., ButtonGroup buttons[], grid columns[],
              // or column nested controls). Find the parent child by checking nested arrays.
              const nestedParent = duplicatedChildren.find((child) => {
                // Check buttons[] array (ButtonGroup, Calendar)
                if (Array.isArray(child.buttons)) {
                  if ((child.buttons as Array<Record<string, unknown>>).some((btn) =>
                    Object.entries(btn).some(([key, value]) => isEventPropertyWithGuid(key, value) && value === id),
                  )) return true;
                }
                // Check columns[] array (Grid/EDT) and column.control
                if (Array.isArray(child.columns)) {
                  if ((child.columns as Array<Record<string, unknown>>).some((col) => {
                    if (Object.entries(col).some(([key, value]) => isEventPropertyWithGuid(key, value) && value === id)) return true;
                    const nested = col.control as Record<string, unknown> | undefined;
                    if (nested && typeof nested === 'object') {
                      return Object.entries(nested).some(([key, value]) => isEventPropertyWithGuid(key, value) && value === id);
                    }
                    return false;
                  })) return true;
                }
                return false;
              });
              dispatch(actionUpdated({ id, actionSet, controlId: nestedParent?.id || duplicatedControl.id }));
            }
          });
        }

        duplicatedLayoutItem.content = duplicatedChildLayoutItems;

        const updatedLayoutV4 = {
          ...layoutV4,
          content: [...layoutV4.content, duplicatedLayoutItem],
        };

        dispatch(layoutV4Updated({ versionId, layoutCanvas: updatedLayoutV4 }));
      } else {
        dispatch(controlDuplicated({ control: duplicatedControl, layoutItem: duplicatedLayoutItem }));

        if (copiedActionSets && copiedActionSets.length > 0) {
          copiedActionSets.forEach(({ id, actionSet }) => {
            dispatch(actionUpdated({ id, actionSet, controlId: duplicatedControl.id }));
          });
        }

        let updatedLayoutV4: LayoutCanvas;
        if (duplicatedControl.containerId) {
          const addToParentContent = (items: LayoutItem[]): LayoutItem[] => {
            return items.map((item) => {
              if (item.id === duplicatedControl.containerId) {
                return {
                  ...item,
                  content: [...(item.content || []), duplicatedLayoutItem],
                };
              } else if (item.content && item.content.length > 0) {
                return {
                  ...item,
                  content: addToParentContent(item.content),
                };
              }
              return item;
            });
          };

          updatedLayoutV4 = {
            ...layoutV4,
            content: addToParentContent(layoutV4.content),
          };
        } else {
          updatedLayoutV4 = {
            ...layoutV4,
            content: [...layoutV4.content, duplicatedLayoutItem],
          };
        }

        dispatch(layoutV4Updated({ versionId, layoutCanvas: updatedLayoutV4 }));
      }

      if (publishStatus === 'Draft') {
        dispatch(saveScreen());
      }

      if (hasMappedComponents) {
        toast.info('Duplicated component(s) were unmapped. Original field mappings were not copied.');
      }

      if (copiedActionSets && copiedActionSets.length > 0) {
        refetchScreenData();
      }
    },
    [dispatch, versionId, layoutV4, controls, screenData, gridColumns, actionUpserts, refetchScreenData, publishStatus],
  );

  return { handleControlDuplicate };
};
