/**
 * Higher-Order Component to connect pure wrappers to Redux
 *
 * This HOC allows pure wrapper components to be used in Redux contexts
 * without importing Redux directly. The caller provides the selector.
 *
 * @packageDocumentation
 */

import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Props for Redux-connected wrapper components
 * These wrappers receive an ID and fetch control data from Redux
 */
export interface ReduxWrapperProps {
  /** Control ID to fetch from Redux store */
  id: string;
  /** Optional click handler for designer mode */
  onControlClick?: (id: string) => void;
  /** Optional selection state for designer mode */
  isSelected?: boolean;
}

/**
 * Props for pure wrapper components
 * These wrappers receive the full control object as a prop
 */
export interface PureWrapperProps<TControl> {
  /** Full control configuration object */
  control: TControl;
  /** Optional click handler for designer mode */
  onControlClick?: (id: string) => void;
  /** Optional selection state for designer mode */
  isSelected?: boolean;
}

/**
 * Creates a Redux-connected wrapper from a pure wrapper component
 *
 * This HOC bridges the gap between Redux-based architecture (where wrappers
 * receive an ID) and pure component architecture (where wrappers receive
 * the full control object).
 *
 * @template TControl - The control type (e.g., ButtonControl, InputControl)
 * @template TState - The Redux state shape
 *
 * @param PureComponent - Pure wrapper component that receives control as prop
 * @param selectControls - Redux selector function to get controls map from state
 * @returns Redux-connected component that receives id and fetches control
 *
 * @example
 * ```typescript
 * // In app-builder:
 * import { ButtonWrapper } from '@m-next/layout-canvas';
 * import { selectControls } from '../services/screenLayoutSlice';
 *
 * const ButtonWrapperRedux = createReduxWrapper(ButtonWrapper, selectControls);
 *
 * // Usage:
 * <ButtonWrapperRedux id="btn-123" onControlClick={handleClick} isSelected={true} />
 * ```
 *
 * @example
 * ```typescript
 * // In MethodUI:
 * import { ButtonWrapper } from '@m-next/layout-canvas';
 * import { selectMethodUIControls } from '../state/controls';
 *
 * const ButtonWrapperRedux = createReduxWrapper(ButtonWrapper, selectMethodUIControls);
 * ```
 */
export function createReduxWrapper<TControl, TState = unknown>(
  PureComponent: React.ComponentType<PureWrapperProps<TControl>>,
  selectControls: (state: TState) => Record<string, TControl> | null | undefined,
): React.FC<ReduxWrapperProps> {
  const ReduxWrapper: React.FC<ReduxWrapperProps> = ({ id, onControlClick, isSelected }) => {
    // Per-ID selector: only re-renders when this specific control changes
    const control = useSelector((state: TState) => selectControls(state)?.[id]);

    // Loading state if control not found
    if (!control) {
      return (
        <div
          style={{
            padding: '8px 16px',
            border: '1px dashed #ccc',
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '12px',
          }}
        >
          Loading control {id}...
        </div>
      );
    }

    // Render pure component with control data
    return <PureComponent control={control as TControl} onControlClick={onControlClick} isSelected={isSelected} />;
  };

  // Wrap with React.memo so the component only re-renders when its own control changes
  const MemoizedReduxWrapper = React.memo(ReduxWrapper);
  MemoizedReduxWrapper.displayName = `ReduxWrapper(${PureComponent.displayName || PureComponent.name})`;

  return MemoizedReduxWrapper as React.FC<ReduxWrapperProps>;
}

/**
 * Type guard to check if a component is Redux-connected
 * Useful for conditional rendering or prop validation
 */
export function isReduxWrapper(component: React.ComponentType<any>): component is React.FC<ReduxWrapperProps> {
  return component.displayName?.startsWith('ReduxWrapper(') ?? false;
}

export default createReduxWrapper;
