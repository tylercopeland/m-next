import { useMemo, useCallback } from 'react';
import { Layout, ItemCallback } from 'react-grid-layout';
import { RGLBehaviorConfig, RGLBaseConfig } from './RGLBehaviorConfig';
import { ResponsiveComponent } from '../types';

export interface RGLBehaviorResult {
  /** Props to spread onto <ReactGridLayout>. */
  rglProps: RGLBaseConfig;

  /**
   * Wrapped handlers that apply strategy methods around the native callbacks.
   * Pass these as onLayoutChange, onDragStart, etc. to <ReactGridLayout>.
   */
  wrappedHandlers: {
    wrapOnLayoutChange: (nativeHandler: (layout: Layout[]) => void) => (layout: Layout[]) => void;

    wrapOnDragStart: (nativeHandler: ItemCallback) => ItemCallback;

    wrapOnDragStop: (nativeHandler: ItemCallback) => ItemCallback;

    wrapOnResizeStop: (nativeHandler: ItemCallback) => ItemCallback;
  };
}

/**
 * Applies RGLBehaviorConfig strategies as wrappers around native RGL handlers.
 *
 * Design: This hook doesn't replace native handlers — it wraps them.
 * Each wrapper checks if the relevant strategy method exists, applies it
 * if present, and falls through to the native handler when absent.
 * This is DIP: the hook depends on abstract strategy interfaces,
 * not on concrete compaction/drag/resize implementations.
 *
 * Usage:
 * ```tsx
 * const config = createDesignerCanvasConfig();
 * const { rglProps, wrappedHandlers } = useRGLBehavior(config, components);
 * const wrappedLayoutChange = wrappedHandlers.wrapOnLayoutChange(handleLayoutChange);
 * <ReactGridLayout {...rglProps} onLayoutChange={wrappedLayoutChange} />
 * ```
 */
export function useRGLBehavior(config: RGLBehaviorConfig, components: ResponsiveComponent[]): RGLBehaviorResult {
  const rglProps = useMemo(() => config.base, [config.base]);

  const wrapOnLayoutChange = useCallback(
    (nativeHandler: (layout: Layout[]) => void) => {
      return (layout: Layout[]) => {
        let processedLayout = layout;

        // Pre-processing middleware
        if (config.middleware?.beforeLayoutChange) {
          processedLayout = config.middleware.beforeLayoutChange(processedLayout);
        }

        // Check if compaction should be skipped
        if (config.compaction.shouldSkipCompaction) {
          // If skipping, still call native handler with original layout
          // (the native handler has its own skip logic too)
        }

        // Post-compaction processing
        if (config.compaction.postCompact) {
          processedLayout = config.compaction.postCompact(processedLayout, components);
        }

        // Call native handler
        nativeHandler(processedLayout);

        // Post-processing middleware
        if (config.middleware?.afterLayoutChange) {
          config.middleware.afterLayoutChange(processedLayout);
        }
      };
    },
    [config.compaction, config.middleware, components],
  );

  const wrapOnDragStart = useCallback(
    (nativeHandler: ItemCallback): ItemCallback => {
      return (layout, oldItem, newItem, placeholder, e, element) => {
        // Pre-processing middleware
        if (config.middleware?.beforeDragStart) {
          config.middleware.beforeDragStart(layout, oldItem, newItem, placeholder, e, element);
        }

        // Apply drag axis constraint if provided
        // (This is informational — the actual axis locking happens at the RGL level
        //  or via CSS. The strategy returns the desired axis for the consumer to use.)

        nativeHandler(layout, oldItem, newItem, placeholder, e, element);
      };
    },
    [config.middleware],
  );

  const wrapOnDragStop = useCallback(
    (nativeHandler: ItemCallback): ItemCallback => {
      return (layout, oldItem, newItem, placeholder, e, element) => {
        let processedItem = { ...newItem };

        // Apply position constraint
        if (config.drag.isPositionAllowed) {
          const component = components.find((c) => c.id === newItem.i);
          if (component) {
            const allowed = config.drag.isPositionAllowed(component, {
              x: processedItem.x,
              y: processedItem.y,
            });
            if (!allowed) {
              // Revert to old position
              processedItem = { ...processedItem, x: oldItem.x, y: oldItem.y };
            }
          }
        }

        // Apply snap-to-position
        if (config.drag.snapToPosition) {
          const component = components.find((c) => c.id === newItem.i);
          if (component) {
            const snapped = config.drag.snapToPosition(component, {
              x: processedItem.x,
              y: processedItem.y,
            });
            processedItem = { ...processedItem, x: snapped.x, y: snapped.y };
          }
        }

        // Call native handler with potentially modified item
        nativeHandler(layout, oldItem, processedItem as Layout, placeholder, e, element);

        // Post-processing middleware
        if (config.middleware?.afterDragStop) {
          config.middleware.afterDragStop(layout, oldItem, processedItem, placeholder, e, element);
        }
      };
    },
    [config.drag, config.middleware, components],
  );

  const wrapOnResizeStop = useCallback(
    (nativeHandler: ItemCallback): ItemCallback => {
      return (layout, oldItem, newItem, placeholder, e, element) => {
        let processedItem = { ...newItem };

        // Apply proportional resize
        if (config.resize.getProportionalResize) {
          const component = components.find((c) => c.id === newItem.i);
          if (component) {
            const proportional = config.resize.getProportionalResize(
              component,
              { w: oldItem.w, h: oldItem.h },
              { w: processedItem.w, h: processedItem.h },
            );
            processedItem = { ...processedItem, w: proportional.w, h: proportional.h };
          }
        }

        // Apply linked resize updates
        if (config.resize.getLinkedResizeUpdates) {
          const component = components.find((c) => c.id === newItem.i);
          if (component) {
            const linkedUpdates = config.resize.getLinkedResizeUpdates(
              component,
              { w: processedItem.w, h: processedItem.h },
              components,
            );

            // Apply linked updates to the layout
            if (linkedUpdates.size > 0) {
              layout.forEach((item) => {
                const update = linkedUpdates.get(item.i);
                if (update) {
                  if (update.w !== undefined) item.w = update.w;
                  if (update.h !== undefined) item.h = update.h;
                  if (update.x !== undefined) item.x = update.x;
                  if (update.y !== undefined) item.y = update.y;
                }
              });
            }
          }
        }

        // Call native handler
        nativeHandler(layout, oldItem, processedItem as Layout, placeholder, e, element);

        // Post-processing middleware
        if (config.middleware?.afterResizeStop) {
          config.middleware.afterResizeStop(layout, oldItem, processedItem, placeholder, e, element);
        }
      };
    },
    [config.resize, config.middleware, components],
  );

  return {
    rglProps,
    wrappedHandlers: {
      wrapOnLayoutChange,
      wrapOnDragStart,
      wrapOnDragStop,
      wrapOnResizeStop,
    },
  };
}
