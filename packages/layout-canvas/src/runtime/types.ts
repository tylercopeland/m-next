/**
 * Observed size data for a single component
 */
export interface ObservedComponentSize {
  /** Component ID */
  componentId: string;
  /** Observed content height in pixels */
  contentHeightPx: number;
  /** Timestamp of last observation */
  lastObserved: number;
}

/**
 * Map of component ID to observed size
 */
export type SizeObserverMap = Record<string, ObservedComponentSize>;

/**
 * Callback signature for reporting size changes
 */
export type ReportSizeFn = (componentId: string, contentHeightPx: number) => void;

/**
 * Context value for the size observer system
 */
export interface SizeObserverContextValue {
  /** Map of component ID to observed size */
  observedSizes: SizeObserverMap;
  /** Report a size change for a component */
  reportSize: ReportSizeFn;
}

/**
 * Computed effective layout data for a single component.
 * Tracks the delta between designed (base) and runtime (effective) positioning.
 */
export interface EffectiveLayoutItem {
  /** Original component ID */
  id: string;
  /** Original (base) height in grid units from the designer */
  baseHeight: number;
  /** Effective height in grid units (may differ from base if content expanded or shrank) */
  effectiveHeight: number;
  /** Original (base) Y position in grid units */
  baseY: number;
  /** Effective Y position (shifted if components above changed size) */
  effectiveY: number;
}
