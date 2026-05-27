/**
 * Hook for resolving chart control from different sources (runtime/designer/props)
 * Follows Single Responsibility Principle - only handles control resolution
 */

import { useMemo, useRef } from 'react';
import { useRuntimeContext } from '../../../contexts/RuntimeContext';
import { useDesignerContext } from '../../../contexts/DesignerContext';
import type { ChartControl, ChartWrapperReduxProps } from '../types';

/**
 * Hook to resolve chart control from runtime context, designer context, or props
 * @param props - Chart wrapper props
 * @returns Control and runtime mode flag
 */
export function useChartControl(props: ChartWrapperReduxProps) {
  const { id, control: controlProp, mode } = props;
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();

  const isRuntimeMode = runtimeContext?.mode === 'runtime' || mode === 'runtime';
  const selectControlById = designerContext?.selectControlById;
  const getControlFn = runtimeContext?.getControl;

  // Use refs to track previous values and prevent unnecessary re-renders
  const prevControlRef = useRef<ChartControl | null>(null);
  const prevControlIdRef = useRef<string | null | undefined>(null);

  const control = useMemo(() => {
    let newControl: ChartControl | null = null;
    if (getControlFn && isRuntimeMode) {
      // Runtime mode: get control from runtime context
      newControl = getControlFn(id);
    } else if (controlProp) {
      // Control passed as prop (legacy support)
      newControl = controlProp;
    } else if (selectControlById) {
      // Designer mode: get from designer context
      newControl = selectControlById(id);
    }

    // Only update if control ID actually changed or if it's a truly new reference with different data
    const newControlId = newControl?.id;
    const prevControlId = prevControlIdRef.current;

    // If control ID changed, definitely update
    if (newControlId !== prevControlId) {
      prevControlIdRef.current = newControlId;
      prevControlRef.current = newControl;
      return newControl;
    }

    // If same ID but different reference, check if important properties changed
    if (prevControlRef.current !== newControl && newControlId === prevControlId) {
      const prevControl = prevControlRef.current;
      if (!prevControl || !newControl) {
        prevControlRef.current = newControl;
        return newControl;
      }

      // Check if model changed
      const prevModel = prevControl.model;
      const newModel = newControl.model;
      const modelChanged = prevModel !== newModel;

      // Check if other important control properties changed
      const propertiesChanged =
        prevControl.visible !== newControl.visible ||
        prevControl.disabled !== newControl.disabled ||
        prevControl.hideCaption !== newControl.hideCaption ||
        prevControl.caption !== newControl.caption ||
        prevControl.isEditing !== newControl.isEditing;

      // Update if model or properties changed
      if (modelChanged || propertiesChanged) {
        prevControlRef.current = newControl;
        return newControl;
      }

      // Same ID, same model, same properties - keep previous reference to prevent re-renders
      return prevControlRef.current;
    }

    return newControl || prevControlRef.current;
  }, [getControlFn, isRuntimeMode, id, controlProp, selectControlById]);

  return {
    control,
    isRuntimeMode,
  };
}
