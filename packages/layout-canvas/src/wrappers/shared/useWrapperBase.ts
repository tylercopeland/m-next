/**
 * Shared Wrapper Base Hook
 *
 * Provides common functionality for all component wrappers:
 * - Redux state access (get control from store)
 * - Action execution (handle onClick, onChange, etc.)
 * - Mode handling (designer vs runtime)
 * - Selection styling (designer mode)
 *
 * @module wrappers/shared/useWrapperBase
 */

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectControls, type RootState } from '../../redux';
import type { ActionEventType } from '../../actions/types';
import type { BaseWrapperProps, SelectionStyle } from './types';

/**
 * Return type from useWrapperBase hook
 */
export interface WrapperBaseResult<TControl = unknown> {
  /**
   * Control data from Redux (null if not found)
   */
  control: TControl | null;

  /**
   * Execute an action (click, change, blur, etc.)
   * Handles both designer mode (selection) and runtime mode (action execution)
   *
   * @param actionName - Type of action (onClick, onChange, etc.)
   * @param actionData - Event-specific data
   */
  handleAction: (actionName: ActionEventType, actionData?: Record<string, unknown>) => Promise<void>;

  /**
   * Style object for container (selection outline in designer mode)
   */
  containerStyle: SelectionStyle;

  /**
   * Whether this is designer mode
   */
  isDesignerMode: boolean;

  /**
   * Whether this is runtime mode
   */
  isRuntimeMode: boolean;
}

/**
 * Shared base hook for all wrappers
 *
 * Extracts common logic:
 * - Getting control from Redux
 * - Handling action execution
 * - Determining mode (designer vs runtime)
 * - Creating selection styling
 *
 * @param props - Base wrapper props
 * @returns Object with control, handleAction, styling
 *
 * @example
 * ```typescript
 * const ButtonWrapper = (props: BaseWrapperProps) => {
 *   const { control, handleAction, containerStyle } = useWrapperBase<ButtonControl>(props);
 *
 *   const { widgetProps } = useButtonTranslation(control, () => handleAction('onClick'));
 *
 *   return (
 *     <div style={containerStyle}>
 *       <Button {...widgetProps} onClick={() => handleAction('onClick')} />
 *     </div>
 *   );
 * };
 * ```
 */
export function useWrapperBase<TControl = unknown>(props: BaseWrapperProps): WrapperBaseResult<TControl> {
  const { id, mode = 'designer', onControlClick, isSelected, actionHandler, screenId, recordId, screenState } = props;

  // Get control from Redux store
  const controlList = useSelector((state: RootState) => selectControls(state));
  const control = (controlList?.[id] as TControl) || null;

  // Determine mode
  const isDesignerMode = mode === 'designer';
  const isRuntimeMode = mode === 'runtime';

  /**
   * Handle action execution
   * - Designer mode: Notify parent of click (for selection)
   * - Runtime mode: Execute actionset via ActionHandler
   */
  const handleAction = useCallback(
    async (actionName: ActionEventType, actionData: Record<string, unknown> = {}) => {
      if (isDesignerMode) {
        // Designer mode: Just notify parent for selection
        onControlClick?.(id);
      } else if (isRuntimeMode) {
        // Runtime mode: Execute action if handler is available
        if (actionHandler && screenId) {
          try {
            const result = await actionHandler.executeAction({
              componentId: id,
              actionName,
              actionData,
              screenId,
              recordId,
              screenState,
              metadata: {
                timestamp: Date.now(),
              },
            });

            // Handle action result
            if (!result.success && result.error) {
              console.error(`[Wrapper:${id}] Action execution failed:`, result.error);
              // In production, you might show this to the user via toast/modal
            }

            // Handle navigation
            if (result.navigation) {
              console.log(`[Wrapper:${id}] Navigation requested:`, result.navigation);
              // In production, trigger route change here
            }

            // Handle messages
            if (result.messages && result.messages.length > 0) {
              result.messages.forEach((msg) => {
                console.log(`[Wrapper:${id}] Message (${msg.type}):`, msg.message);
                // In production, show toast/notification here
              });
            }

            // Handle control updates
            if (result.controlUpdates) {
              console.log(`[Wrapper:${id}] Control updates:`, result.controlUpdates);
              // In production, dispatch Redux action to update controls
            }
          } catch (error) {
            console.error(`[Wrapper:${id}] Error executing action:`, error);
            // In production, show error to user
          }
        } else {
          // Runtime mode but missing actionHandler or screenId
          if (!actionHandler) {
            console.warn(`[Wrapper:${id}] Runtime mode but no actionHandler provided`);
          }
          if (!screenId) {
            console.warn(`[Wrapper:${id}] Runtime mode but no screenId provided`);
          }
        }
      }
    },
    [isDesignerMode, isRuntimeMode, id, onControlClick, actionHandler, screenId, recordId, screenState],
  );

  /**
   * Container style - shows selection outline in designer mode
   */
  const containerStyle = useMemo<SelectionStyle>(() => {
    if (isDesignerMode && isSelected) {
      return {
        outline: '2px solid #0066cc',
        outlineOffset: '2px',
        backgroundColor: 'rgba(0, 102, 204, 0.05)',
      };
    }
    return {};
  }, [isDesignerMode, isSelected]);

  return {
    control,
    handleAction,
    containerStyle,
    isDesignerMode,
    isRuntimeMode,
  };
}
