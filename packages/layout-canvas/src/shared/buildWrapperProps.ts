/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponsiveComponent } from '../rgl-integration/types';

/**
 * Runtime-specific props context. Null in designer mode.
 */
export interface RuntimePropsContext {
  runtimeActionHandler: any | null;
  runtimeScreenId: string | null | undefined;
  runtimeRecordId: string | null | undefined;
  runtimeScreenState: Record<string, unknown> | null | undefined;
  runtimeUpdateControlValue: ((componentId: string, value: unknown) => void) | null | undefined;
  runtimeUpdateControlProperty: ((componentId: string, property: string, value: unknown) => void) | null | undefined;
  runtimeProcessAnalytics: ((eventName: string, attributes: Record<string, any>) => void) | null | undefined;
  isStockScreen: boolean | null | undefined;
}

/**
 * Builds the base wrapper props object for rendering a component through
 * the control registry. Handles the designer vs runtime mode prop differences.
 *
 * In designer mode (isDraggable=true), components fetch their own data from Redux.
 * In runtime mode (isDraggable=false), the full component data is passed as `control`.
 */
export function buildWrapperProps(
  component: ResponsiveComponent,
  isSelected: boolean,
  mode: string,
  isDraggable: boolean,
  containerProps: Record<string, unknown>,
  handleControlClick: (controlId: string) => void,
  runtimeContext: RuntimePropsContext | null,
): Record<string, unknown> {
  const wrapperProps: Record<string, unknown> = {
    id: component.id,
    onControlClick: handleControlClick,
    isSelected,
    mode,
    ...containerProps,
  };

  // Only pass control prop in runtime mode — designer mode should fetch from Redux
  if (!isDraggable && runtimeContext) {
    wrapperProps.control = component;
    wrapperProps.mode = 'runtime';

    if (runtimeContext.runtimeActionHandler) {
      wrapperProps.actionHandler = runtimeContext.runtimeActionHandler;
    }

    wrapperProps.screenId = runtimeContext.runtimeScreenId ?? undefined;
    wrapperProps.recordId = runtimeContext.runtimeRecordId ?? undefined;
    wrapperProps.screenState = runtimeContext.runtimeScreenState ?? undefined;

    if (runtimeContext.runtimeUpdateControlValue) {
      wrapperProps.runtimeUpdateControlValue = runtimeContext.runtimeUpdateControlValue;
    }
    if (runtimeContext.runtimeUpdateControlProperty) {
      wrapperProps.runtimeUpdateControlProperty = runtimeContext.runtimeUpdateControlProperty;
    }
    if (runtimeContext.runtimeProcessAnalytics) {
      wrapperProps.processAnalytics = runtimeContext.runtimeProcessAnalytics;
    }
    if (runtimeContext.isStockScreen !== null && runtimeContext.isStockScreen !== undefined) {
      wrapperProps.isStockScreen = runtimeContext.isStockScreen;
    }
  }

  return wrapperProps;
}
