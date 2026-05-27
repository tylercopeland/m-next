import React from 'react';
import { useSizeObserver } from '../runtime/useSizeObserver';
import * as s from './LayoutContainer.styles';

interface NestedRuntimeItemProps {
  componentId: string;
  isRuntimeMode: boolean;
  enablePointerEvents: boolean;
  allowDesignerDropdownInteractions?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps one container child's content in RenderContentWrapper and attaches
 * a useSizeObserver ref so heights are reported to the nearest
 * SizeObserverContext (provided by RuntimeLayoutProvider in runtime mode).
 *
 * Must be a separate component — hooks cannot be called inside .map().
 * In designer mode (isRuntimeMode=false) the hook is disabled; the default
 * no-op SizeObserverContext is safe to consume without a provider.
 */
export const NestedRuntimeItem: React.FC<NestedRuntimeItemProps> = ({
  componentId,
  isRuntimeMode,
  enablePointerEvents,
  allowDesignerDropdownInteractions,
  children,
}) => {
  const sizeObserverRef = useSizeObserver({ componentId, enabled: isRuntimeMode });
  return (
    <div ref={sizeObserverRef} data-size-observer='true' style={{ width: '100%', height: '100%' }}>
      <s.RenderContentWrapper
        enablePointerEvents={enablePointerEvents}
        allowDesignerDropdownInteractions={allowDesignerDropdownInteractions}
      >
        {children}
      </s.RenderContentWrapper>
    </div>
  );
};
