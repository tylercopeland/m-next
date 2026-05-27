/**
 * Type definitions for duplicate control helper utilities
 */

import type { BaseControl } from '@m-next/runtime-interface';

/**
 * V4 Layout API structure - responsive breakpoint configuration
 */
export interface ResponsiveBreakpoint {
    x: number;
    y: number;
    width: number;
    height: number;
    currentState: number; // ComponentState enum: 0=Regular, 1=Hidden, 2=Disabled, 3=ReadOnly
    isHidden?: boolean; // Legacy support
}

/**
 * V4 Layout API structure - layout item with nested children
 */
export interface LayoutItemV4 {
    id: string;
    containerId: string | null;
    desktop: ResponsiveBreakpoint;
    tabletOverride?: ResponsiveBreakpoint;
    mobileOverride?: ResponsiveBreakpoint;
    content: LayoutItemV4[];
    // Legacy support for old format
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

/**
 * V4 Layout Canvas structure
 */
export interface LayoutV4 {
    canvasId?: string;
    type?: string;
    size?: number;
    content: LayoutItemV4[];
}

/**
 * Options for duplicate control operation
 */
export interface DuplicateControlOptions {
    control: BaseControl;
    controlList: Record<string, BaseControl>;
    layoutV4?: LayoutV4;
    screenData: unknown;
    actionUpserts?: Record<string, unknown>; // Action sets by actionSetId
}

/**
 * Result indicating if control can be duplicated
 */
export interface CanDuplicateResult {
    canDuplicate: boolean;
    reason?: string;
    tooltipMessage?: string;
}

/**
 * Result of createDuplicateControl operation
 */
export interface DuplicateControlResult {
    control: BaseControl;
    layoutItem: LayoutItemV4;
    copiedActionSets?: Array<{ id: string; actionSet: unknown }>; // Action sets to be dispatched
    copiedEvents?: Array<{ eventId: string; actionSetIds: string[] }>; // Event mappings to be created
}

/**
 * Grid position coordinates
 */
export interface GridPosition {
    x: number;
    y: number;
}

/**
 * Pending layout item for tracking duplicates not yet in layoutV4
 * Used to prevent overlap when duplicating multiple items rapidly
 */
export interface PendingLayoutItem {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    containerId: string | null;
}
