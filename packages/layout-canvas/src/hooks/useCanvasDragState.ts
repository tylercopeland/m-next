import { useState, useCallback, useRef } from 'react';
import { ResponsiveComponent } from '../rgl-integration/types';

export interface DragPreview {
  visible: boolean;
  componentType?: string;
  position?: { x: number; y: number; w: number; h: number };
  anchorOffsetCols?: number;
  clientX?: number;
  clientY?: number;
  targetType?: 'canvas' | 'container';
  containerId?: string;
  sourceContainerId?: string;
}

export interface InsertModeState {
  isActive: boolean;
  indicatorX: number;
  indicatorY: number;
  indicatorWidth: number;
  targetRow: number;
  targetCol: number;
}

const initialInsertModeState: InsertModeState = {
  isActive: false,
  indicatorX: 0,
  indicatorY: 0,
  indicatorWidth: 0,
  targetRow: 0,
  targetCol: 0,
};

export interface CanvasDragState {
  // --- State values ---
  dragPreview: DragPreview;
  isDragOver: boolean;
  currentDraggedComponent: ResponsiveComponent | null;
  activeDragComponentId: string | null;
  draggedComponentType: string | null;
  dragOverContainerId: string | null;
  draggedComponentId: string | null;
  invalidDropTargetId: string | null;
  currentlyResizingComponentId: string | null;
  dragOverCanvas: string | null;
  insertModeState: InsertModeState;

  // --- Derived values ---
  isDragInProgress: boolean;
  isResizeInProgress: boolean;

  // --- Refs ---
  dragPreviewRef: React.MutableRefObject<DragPreview>;
  isFirstDragOverRef: React.MutableRefObject<boolean>;
  isResizingContainerRef: React.MutableRefObject<boolean>;
  insertModeStateRef: React.MutableRefObject<InsertModeState>;

  // --- State setters ---
  setDragPreview: React.Dispatch<React.SetStateAction<DragPreview>>;
  setIsDragOver: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDraggedComponent: React.Dispatch<React.SetStateAction<ResponsiveComponent | null>>;
  setActiveDragComponentId: React.Dispatch<React.SetStateAction<string | null>>;
  setDraggedComponentType: React.Dispatch<React.SetStateAction<string | null>>;
  setDragOverContainerId: React.Dispatch<React.SetStateAction<string | null>>;
  setDraggedComponentId: React.Dispatch<React.SetStateAction<string | null>>;
  setInvalidDropTargetId: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentlyResizingComponentId: React.Dispatch<React.SetStateAction<string | null>>;
  setDragOverCanvas: React.Dispatch<React.SetStateAction<string | null>>;

  // --- Actions ---
  clearAllDragStates: () => void;
  setInsertMode: (state: InsertModeState) => void;
  clearInsertMode: () => void;
}

/**
 * Centralises all drag/drop/resize interaction state for LayoutCanvas.
 *
 * This hook bundles 12 related state variables that change together during
 * drag operations, plus two refs for synchronous checks. Keeping them in a
 * single hook provides:
 *
 * 1. A single `clearAllDragStates` function that resets everything,
 *    eliminating the 8+ duplicated reset blocks scattered throughout
 *    LayoutCanvas handlers.
 * 2. Derived booleans (`isDragInProgress`, `isResizeInProgress`) computed
 *    in one place instead of ad-hoc in the render body.
 * 3. A clear boundary for what constitutes "interaction state" vs.
 *    "layout state" vs. "component data".
 */
export function useCanvasDragState(): CanvasDragState {
  const [dragPreviewState, setDragPreviewState] = useState<DragPreview>({ visible: false });
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentDraggedComponent, setCurrentDraggedComponent] = useState<ResponsiveComponent | null>(null);
  const [activeDragComponentId, setActiveDragComponentId] = useState<string | null>(null);
  const [draggedComponentType, setDraggedComponentType] = useState<string | null>(null);
  const [dragOverContainerId, setDragOverContainerId] = useState<string | null>(null);
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null);
  const [invalidDropTargetId, setInvalidDropTargetId] = useState<string | null>(null);
  const [currentlyResizingComponentId, setCurrentlyResizingComponentId] = useState<string | null>(null);
  const [dragOverCanvas, setDragOverCanvas] = useState<string | null>(null);
  const [insertModeState, setInsertModeStateInternal] = useState<InsertModeState>(initialInsertModeState);

  const dragPreviewRef = useRef<DragPreview>({ visible: false });
  const isFirstDragOverRef = useRef<boolean>(true);
  const isResizingContainerRef = useRef<boolean>(false);
  // Ref for synchronous access to insert mode state (avoids stale closure in callbacks)
  // NOTE: Do NOT sync ref with state on every render - that causes race conditions!
  // The ref is updated explicitly only when setting/clearing insert mode.
  const insertModeStateRef = useRef<InsertModeState>(initialInsertModeState);

  const isDragInProgress = draggedComponentId !== null || activeDragComponentId !== null;
  const isResizeInProgress = currentlyResizingComponentId !== null;

  const setDragPreview = useCallback((value: React.SetStateAction<DragPreview>) => {
    const nextPreview =
      typeof value === 'function' ? (value as (prevState: DragPreview) => DragPreview)(dragPreviewRef.current) : value;
    dragPreviewRef.current = nextPreview;
    setDragPreviewState(nextPreview);
  }, []);

  // Set insert mode - updates both state and ref synchronously
  const setInsertMode = useCallback((state: InsertModeState) => {
    insertModeStateRef.current = state;
    setInsertModeStateInternal(state);
  }, []);

  // Clear insert mode - resets both state and ref
  const clearInsertMode = useCallback(() => {
    insertModeStateRef.current = initialInsertModeState;
    setInsertModeStateInternal(initialInsertModeState);
  }, []);

  const clearAllDragStates = useCallback(() => {
    setIsDragOver(false);
    dragPreviewRef.current = { visible: false };
    setDragPreviewState({ visible: false });
    setDraggedComponentType(null);
    setCurrentDraggedComponent(null);
    setDraggedComponentId(null);
    setInvalidDropTargetId(null);
    setActiveDragComponentId(null);
    setDragOverContainerId(null);
    // Clear insert mode as well
    insertModeStateRef.current = initialInsertModeState;
    setInsertModeStateInternal(initialInsertModeState);

    delete (window as unknown as Record<string, unknown>).__draggedComponentType;
    delete (window as unknown as Record<string, unknown>).__draggedComponentConfig;
    delete (window as unknown as Record<string, unknown>).__rglCrossGridDragSize;
    delete (window as unknown as Record<string, unknown>).__rglCrossGridTargetType;
    delete (window as unknown as Record<string, unknown>).__rglCrossGridTargetContainerId;
  }, []);

  return {
    // State values
    dragPreview: dragPreviewState,
    isDragOver,
    currentDraggedComponent,
    activeDragComponentId,
    draggedComponentType,
    dragOverContainerId,
    draggedComponentId,
    invalidDropTargetId,
    currentlyResizingComponentId,
    dragOverCanvas,
    insertModeState,

    // Derived values
    isDragInProgress,
    isResizeInProgress,

    // Refs
    dragPreviewRef,
    isFirstDragOverRef,
    isResizingContainerRef,
    insertModeStateRef,

    // State setters
    setDragPreview,
    setIsDragOver,
    setCurrentDraggedComponent,
    setActiveDragComponentId,
    setDraggedComponentType,
    setDragOverContainerId,
    setDraggedComponentId,
    setInvalidDropTargetId,
    setCurrentlyResizingComponentId,
    setDragOverCanvas,

    // Actions
    clearAllDragStates,
    setInsertMode,
    clearInsertMode,
  };
}
