/**
 * Hook that encapsulates keyboard shortcut handling for the layout designer.
 *
 * Manages Delete/Backspace, Ctrl+C (copy), Ctrl+V (paste), Ctrl+D (duplicate)
 * keyboard shortcuts and associated delete confirmation dialog state.
 *
 * Extracted from layoutDesigner.jsx to reduce file size.
 */
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { canDuplicateControl } from '../editors/common/utils/duplicateControlHelper';
import { getDeleteAction } from '../editors/common/utils/deleteControlHelper';
import {
  controlSelected,
  setClipboard,
} from '../../../common/services/screenLayoutSlice';

interface Control {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface LayoutCanvas {
  content: unknown[];
  [key: string]: unknown;
}

interface DeleteDialogInfo {
  isContainer: boolean;
  referencedChildren: { controlId: string; name: string }[];
}

interface ClipboardData {
  controlId: string;
  controlSnapshot: Control;
}

interface ReduxState {
  screenLayout?: {
    clipboard?: ClipboardData | null;
  };
}

interface UseKeyboardShortcutsParams {
  isV4Screen: boolean;
  selectedControlId: string | null;
  controls: Record<string, Control>;
  layoutV4: LayoutCanvas | null;
  screenData: Record<string, unknown>;
  screenProperties: Record<string, unknown>;
  actionUpserts: Record<string, unknown>;
  handleControlDelete: (controlId: string) => void;
  handleControlDuplicate: (controlIdOrClipboard: string | ClipboardData) => void;
}

interface UseKeyboardShortcutsReturn {
  canvasClickedRef: MutableRefObject<boolean>;
  deleteDialogOpen: boolean;
  containerBlockedDialogOpen: boolean;
  deleteDialogInfo: DeleteDialogInfo;
  handleDeleteDialogClose: () => void;
  handleDeleteDialogConfirm: () => void;
  handleBlockedDialogClose: () => void;
  handleBlockedDialogComponentClick: (controlId: string) => void;
}

export const useKeyboardShortcuts = ({
  isV4Screen,
  selectedControlId,
  controls,
  layoutV4,
  screenData,
  screenProperties,
  actionUpserts,
  handleControlDelete,
  handleControlDuplicate,
}: UseKeyboardShortcutsParams): UseKeyboardShortcutsReturn => {
  const dispatch = useDispatch();

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [containerBlockedDialogOpen, setContainerBlockedDialogOpen] = useState(false);
  const [pendingDeleteControlId, setPendingDeleteControlId] = useState<string | null>(null);
  const [deleteDialogInfo, setDeleteDialogInfo] = useState<DeleteDialogInfo>({
    isContainer: false,
    referencedChildren: [],
  });

  // Track if canvas was last clicked (for keyboard shortcuts)
  const canvasClickedRef = useRef(false);

  // Get clipboard from Redux
  const clipboard = useSelector((state: ReduxState) => state.screenLayout?.clipboard);

  // Refs to hold latest callback versions for keyboard shortcuts
  // This prevents the useEffect from re-subscribing on every render
  const handleControlDeleteRef = useRef(handleControlDelete);
  const handleControlDuplicateRef = useRef(handleControlDuplicate);
  handleControlDeleteRef.current = handleControlDelete;
  handleControlDuplicateRef.current = handleControlDuplicate;

  // Track mousedown to know if canvas was clicked (for delete shortcut)
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const isInCanvas = (e.target as HTMLElement).closest('#designer-canvas');
      canvasClickedRef.current = !!isInCanvas;
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Main keyboard shortcuts
  useEffect(() => {
    if (!isV4Screen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!layoutV4 || !layoutV4?.content || !canvasClickedRef.current) {
        return;
      }
      // Handle Delete/Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedControlId) {
        // Don't delete if user is typing in an input field
        const activeElement = document.activeElement as HTMLElement;
        const isTyping = 
          activeElement &&
          (activeElement.tagName === 'INPUT' ||
           activeElement.tagName === 'TEXTAREA' ||
           activeElement.isContentEditable);
        
        if (isTyping) {
          return;
        }

        const controlToDelete = controls?.[selectedControlId];
        if (!controlToDelete) return;

        const deleteAction = getDeleteAction({
          control: controlToDelete,
          controlList: controls,
          screenData: screenData || {},
          screenProperties: screenProperties || {},
          layoutV4,
          actionUpserts,
        });

        switch (deleteAction.action) {
          case 'blocked':
            toast.error(deleteAction.blockReason);
            break;
          case 'showBlockedDialog':
            setPendingDeleteControlId(selectedControlId);
            setDeleteDialogInfo({ isContainer: true, referencedChildren: deleteAction.referencedChildren });
            setContainerBlockedDialogOpen(true);
            break;
          case 'showConfirmDialog':
            setPendingDeleteControlId(selectedControlId);
            setDeleteDialogInfo({ isContainer: deleteAction.isContainer, referencedChildren: [] });
            setDeleteDialogOpen(true);
            break;
          case 'delete':
            handleControlDeleteRef.current(selectedControlId);
            break;
        }
        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      // Handle Ctrl/Cmd shortcuts (Copy, Paste, Duplicate)
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (!isCmdOrCtrl) return;

      const hasTextSelection = (window.getSelection()?.toString().length ?? 0) > 0;
      if (hasTextSelection) {
        return;
      }

      if ((e.key === 'c' || e.key === 'C') && selectedControlId) {
        if (controls && controls[selectedControlId]) {
          const controlToCopy = controls[selectedControlId];
          const { canDuplicate, tooltipMessage } = canDuplicateControl({
            control: controlToCopy,
            controlList: controls,
            layoutV4,
            screenData,
          });

          if (!canDuplicate) {
            toast.error(tooltipMessage || 'Component cannot be copied');
            e.preventDefault();
            return;
          }

          dispatch(
            setClipboard({
              controlId: selectedControlId,
              controlSnapshot: JSON.parse(JSON.stringify(controlToCopy)),
            }),
          );
          toast.success('Component copied to clipboard');
          e.preventDefault();
        }
      }

      if ((e.key === 'v' || e.key === 'V') && clipboard) {
        handleControlDuplicateRef.current(clipboard);
        e.preventDefault();
      }

      if ((e.key === 'd' || e.key === 'D') && selectedControlId) {
        handleControlDuplicateRef.current(selectedControlId);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isV4Screen, selectedControlId, controls, dispatch, clipboard, layoutV4, screenData, screenProperties, actionUpserts]);

  // Handle Escape/Enter keys for delete dialogs (capture phase)
  useEffect(() => {
    if (!deleteDialogOpen && !containerBlockedDialogOpen) return;

    const handleDialogKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteDialogOpen) {
          setDeleteDialogOpen(false);
          setPendingDeleteControlId(null);
          e.preventDefault();
          e.stopPropagation();
        }
        if (containerBlockedDialogOpen) {
          setContainerBlockedDialogOpen(false);
          setPendingDeleteControlId(null);
          e.preventDefault();
          e.stopPropagation();
        }
        if (document.activeElement) {
          (document.activeElement as HTMLElement).blur();
        }
      }
    };

    document.addEventListener('keydown', handleDialogKeys, true);
    return () => document.removeEventListener('keydown', handleDialogKeys, true);
  }, [deleteDialogOpen, containerBlockedDialogOpen]);

  // Dialog handlers
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setPendingDeleteControlId(null);
  };

  const handleDeleteDialogConfirm = () => {
    if (pendingDeleteControlId) {
      handleControlDelete(pendingDeleteControlId);
    }
    setDeleteDialogOpen(false);
    setPendingDeleteControlId(null);
  };

  const handleBlockedDialogClose = () => {
    setContainerBlockedDialogOpen(false);
    setPendingDeleteControlId(null);
  };

  const handleBlockedDialogComponentClick = (controlId: string) => {
    dispatch(controlSelected({ controlId, property: null }));
  };

  return {
    canvasClickedRef,
    deleteDialogOpen,
    containerBlockedDialogOpen,
    deleteDialogInfo,
    handleDeleteDialogClose,
    handleDeleteDialogConfirm,
    handleBlockedDialogClose,
    handleBlockedDialogComponentClick,
  };
};
