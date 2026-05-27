import React, { Suspense, useEffect } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { TagListControl } from '@m-next/runtime-interface';
import { OnChangePayload, useRuntimeContext } from '../contexts/RuntimeContext';
import { useScreenDataContext } from '../contexts/ScreenDataContext';
import { useDesignerContext } from '../contexts/DesignerContext';

const TagWidget = React.lazy(() => import('@m-next/tag-widget'));
function TagWidgetDesignerWrapper({
  id,
  control: controlProp,
  mode,
  runtimeUpdateControlValue,
  runtimeUpdateControlProperty,
  screenState,
}: {
  id: string;
  control?: TagListControl;
  mode?: string;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
  screenState?: unknown;
}) {
  // ===========================================================================
  // CONTEXT HOOKS
  // ===========================================================================

  const runtimeContext = useRuntimeContext();
  const screenDataContext = useScreenDataContext();
  const designerContext = useDesignerContext();
  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;
  const getInitialValue = (): string[] => {
    const controlValue = (control as Record<string, unknown> | undefined)?.value;
    if (Array.isArray(controlValue)) {
      return controlValue;
    }
    if (typeof controlValue === 'string' && controlValue) {
      return controlValue.split(',');
    }
    return [];
  };
  const [value, setValue] = React.useState<string[]>(getInitialValue());

  // Handle setFocusToControl action - focus tag widget when hasFocus becomes true
  // Uses retry logic to handle timing issues when focus is triggered on page load
  // before the component's DOM element is fully mounted
  useEffect(() => {
    const controlData = control as Record<string, unknown> | undefined;
    if (!isRuntimeMode) {
      return;
    }

    let controlValue = (control as Record<string, unknown> | undefined)?.value;
    if (typeof controlValue === 'string' && controlValue) {
      controlValue = controlValue.split(',');
    }

    const normalizedValue = Array.isArray(controlValue) ? controlValue : [];
    if (normalizedValue !== value) {
      setValue(normalizedValue);
    }

    if (controlData?.hasFocus) {
      const inputId = `${id}-tags-value-dropdown-list-input`;

      let attempts = 0;
      const maxAttempts = 10;

      const tryFocus = () => {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
          inputElement.focus();
          // Only reset hasFocus after successful focus
          if (runtimeUpdateControlProperty) {
            runtimeUpdateControlProperty(id, 'hasFocus', false);
          }
          return;
        }

        // Retry if element not found and we haven't exceeded max attempts
        attempts += 1;
        if (attempts < maxAttempts) {
          requestAnimationFrame(tryFocus);
        } else if (runtimeUpdateControlProperty) {
          // Give up after max attempts - reset flag to prevent re-triggering
          runtimeUpdateControlProperty(id, 'hasFocus', false);
        }
      };

      // Start the focus attempt (defer to next frame to allow rendering)
      requestAnimationFrame(tryFocus);
    }
  }, [control?.hasFocus, control?.value, id, isRuntimeMode, runtimeUpdateControlProperty]);

  const handleChange = (newValue: string | string[]) => {
    const newValueArray = Array.isArray(newValue)
      ? newValue
      : typeof newValue === 'string' && newValue
        ? newValue.split(',')
        : [];
    setValue(newValueArray);
    if (isRuntimeMode && runtimeUpdateControlValue) {
      runtimeUpdateControlValue(id, newValue);

      // Validate and update tags through runtime context
      if (isRuntimeMode && runtimeContext?.validateAndUpdateTags) {
        const onChangePayload: OnChangePayload = {
          componentId: id,
          actionName: 'onChange',
          screenId: runtimeContext.screenId,
          recordId: runtimeContext.activeRecordId,
          screenState: screenState as Record<string, unknown> | undefined,
          actionData: {
            event: {
              type: 'change',
            },
          },
          metadata: {
            timestamp: Date.now(),
            componentType: control?.type || 'taglist',
          },
        };
        runtimeContext.validateAndUpdateTags(id, newValueArray, onChangePayload);
      }
    }
  };

  return (
    <div style={{ padding: 8 }} className='dd-wrapper'>
      <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
        <TagWidget
          id={id}
          caption={control?.hideCaption ? '' : control?.caption}
          disabled={control?.disabled}
          isEditable
          showManageTags={!!runtimeContext?.manageTags}
          width='100%'
          onChange={handleChange}
          onCreate={handleChange}
          tagsList={screenDataContext?.tagsList?.others || []}
          suggestions={screenDataContext?.tagsList?.suggestions || []}
          onActionButtonClick={runtimeContext?.manageTags ? () => runtimeContext.manageTags(id) : undefined}
          value={value}
          isPortal
        />
      </Suspense>
    </div>
  );
}

export default TagWidgetDesignerWrapper;
