import React, { Suspense, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import HtmlEditor from '@m-next/html-editor';
import { AuthContext } from '@m-next/html-editor/src/HtmlEditor';
import { createHtmlEditorControl } from '@m-next/runtime-interface';
import type { HtmlEditorControl } from '@m-next/runtime-interface';
import type { ActionHandler } from '../actions/types';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import { useDesignerContext } from '../contexts/DesignerContext';

interface HtmlEditorWrapperProps {
  id: string;
  control?: HtmlEditorControl;
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  // Runtime action props
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: Record<string, unknown>;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
}

const HtmlEditorWrapper: React.FC<HtmlEditorWrapperProps> = ({
  id,
  control: controlProp,
  mode = 'designer',
  // Runtime props
  actionHandler,
  screenId,
  recordId,
  screenState,
  runtimeUpdateControlValue,
  runtimeUpdateControlProperty,
}) => {
  // Check if Redux context exists
  const isRuntimeMode = !!controlProp || mode === 'runtime';

  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();

  const controlBase = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;

  if (!controlBase) {
    return null;
  }

  const control = useMemo(() => {
    return createHtmlEditorControl(controlBase);
  }, [controlBase]);

  // Get authentication context based on mode
  const authContext = ((isRuntimeMode && runtimeContext?.selectAuthContext
    ? runtimeContext.selectAuthContext()
    : designerContext?.authContext) ?? {
    account: '',
    identity: '',
    authToken: '',
    runtimeCoreUrl: '',
    secureToken: '',
  }) as AuthContext;

  // Focus state for setFocusToControl action
  const [editorFocused, setEditorFocused] = useState(false);

  // Track wrapper height for dynamic resizing
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorHeightPx, setEditorHeightPx] = useState<number>(300);
  const [editorWidthPx, setEditorWidthPx] = useState<number | null>(null);
  // Froala toolbar cannot dynamically change toolbar based on width
  // so we force remount by changing key when width breakpoint changes
  const [widthKey, setWidthKey] = useState<string>('LG');

  // Determine if we should use dynamic height based on componentVersion
  // For now, enable dynamic height for ALL controls to ensure resize works
  // TODO: Once all controls are migrated to componentVersion 1.0.0, we can use version check
  const componentVersion = (control as unknown as { componentVersion?: string }).componentVersion || '0.0.0';

  // -- Responsive Size Observers & HTML Manipulation -- //

  // Allows component to be dragged in designer mode by toolbar.
  // Froala toolbar has onMouseDown event listeners that interfere with our
  // drag event handlers. Event listeners can only be removed with a
  // reference to the function which we do not have. The solution is to clone
  // the node so it will no longer have any event listeners attached.
  useEffect(() => {
    if (mode === 'runtime') return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    setTimeout(() => {
      const toolbar = wrapper.getElementsByClassName('fr-toolbar')[0];
      if (!toolbar) return;
      const clone = toolbar.cloneNode(true);
      if (toolbar.parentNode) {
        toolbar.parentNode.replaceChild(clone, toolbar);
      }
    }, 1000);
  }, [mode]);
  // whenever the widthKey changes and the Froala editor is remounted,
  // we need to remove the toolbar event listeners again
  useEffect(() => {
    if (mode === 'runtime') return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    setTimeout(() => {
      const toolbar = wrapper.getElementsByClassName('fr-toolbar')[0];
      if (!toolbar) return;
      const clone = toolbar.cloneNode(true);
      if (toolbar.parentNode) {
        toolbar.parentNode.replaceChild(clone, toolbar);
      }
    }, 1000);
  }, [mode, widthKey]);

  // Function and listener to responsively update editor size
  const updateEditorSize = useCallback(() => {
    const currentWrapper = document.getElementById(`HTML-editor-${id}`)?.closest('.react-grid-item');
    if (!currentWrapper) {
      return;
    }
    const container = currentWrapper;

    // WIDTH
    const containerWidth = container.clientWidth - 16; // remove padding
    setEditorWidthPx((prev) => {
      if (Math.abs(containerWidth - (prev ?? 0)) > 5) {
        // 5px threshold
        return containerWidth;
      }
      return prev;
    });

    // updating width key in runtime breaks fullscreen mode
    if (mode === 'designer') {
      let newKey: 'LG' | 'MD' | 'SM' | 'XS';
      if (containerWidth >= 1152) {
        newKey = 'LG';
      } else if (containerWidth >= 992) {
        newKey = 'MD';
      } else if (containerWidth >= 768) {
        newKey = 'SM';
      } else {
        newKey = 'XS';
      }
      setWidthKey(newKey);
    }

    // HEIGHT
    const containerHeight = container.clientHeight;
    let reserved = 16; // padding top + bottom

    const toolbar = currentWrapper.getElementsByClassName('fr-toolbar')[0];
    if (toolbar) {
      reserved += toolbar.clientHeight;
    }

    const caption = document.getElementById(`${id}-HTML-editor-caption-Caption`);
    if (caption) {
      reserved += caption.clientHeight;
      reserved += 10; // margin bottom
    }

    const secondToolbar = currentWrapper.getElementsByClassName('fr-second-toolbar')[0];
    if (secondToolbar) {
      reserved += secondToolbar.clientHeight;
    }

    const errorMessage = document.getElementById(`${id}-HTML-editor-validation-validation2`);
    if (errorMessage) {
      reserved += errorMessage.clientHeight + 6 + 10;
    }

    const heightResult = Math.max(50, containerHeight - reserved);
    setEditorHeightPx((prev) => {
      if (Math.abs(prev - heightResult) > 5) {
        // 5px threshold
        return heightResult;
      }
      return prev;
    });
  }, [id, mode]);

  useEffect(() => {
    const toObserve = document.getElementById(`HTML-editor-${id}`)?.parentElement?.parentElement;
    if (!toObserve) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (mode === 'runtime') {
        // duration of toolbar height transition + 1ms
        setTimeout(updateEditorSize, 501);
      } else {
        updateEditorSize();
      }
    });

    resizeObserver.observe(toObserve);

    return () => {
      resizeObserver.disconnect();
    };
  }, [id, mode]);

  useEffect(() => {
    const currentWrapper = document.getElementById(`HTML-editor-${id}`)?.parentElement?.parentElement;
    if (!currentWrapper) {
      return;
    }

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const toolbar = currentWrapper.getElementsByClassName('fr-toolbar')[0];
          if (toolbar) {
            if (mode === 'runtime') {
              // duration of toolbar height transition + 1ms
              setTimeout(updateEditorSize, 501);
            } else {
              updateEditorSize();
            }
            break;
          }
        }
      }
    });

    updateEditorSize(); // update immediately in case toolbar exists

    mutationObserver.observe(currentWrapper, {
      childList: true,
      subtree: true,
    });
    return () => {
      mutationObserver.disconnect();
    };
  }, [id, mode]);

  // Extract value from complex object structures
  const extractValue = useCallback(
    (val: any): string => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'number') return String(val);

      if (typeof val === 'object') {
        const valueType = val.ValueType ?? val.valueType;
        const extractedValue = val.value ?? val.Value;

        // ValueType 5 = control reference - resolve from screenState
        if (valueType === 5 && typeof extractedValue === 'string' && screenState) {
          const referencedControl = (screenState[extractedValue] ??
            (screenState.controls as Record<string, unknown> | undefined)?.[extractedValue]) as
            | Record<string, unknown>
            | undefined;
          if (typeof referencedControl === 'string' || typeof referencedControl === 'number') {
            return String(referencedControl);
          }
          if (referencedControl) {
            const refValue = referencedControl.value ?? referencedControl.Value;
            if (refValue && typeof refValue === 'object') {
              const refValueObj = refValue as Record<string, unknown>;
              const resolvedValue = refValueObj.value ?? refValueObj.Value;
              if (typeof resolvedValue === 'string' || typeof resolvedValue === 'number') {
                return String(resolvedValue);
              }
            } else if (typeof refValue === 'string' || typeof refValue === 'number') {
              return String(refValue);
            }
          }

          // Control reference but couldn't resolve - return empty string, not the ID
          return '';
        }

        if (typeof extractedValue === 'string' || typeof extractedValue === 'number') {
          return String(extractedValue);
        }
      }
      return '';
    },
    [screenState],
  );

  // Derive initial value from control data, preferring actual value over default
  const data = useMemo((): string => {
    if (mode === 'designer') {
      return '';
    }

    const controlData = control as Record<string, any> | undefined;
    if (!controlData) {
      return '';
    }

    // Check actual value first
    if (controlData.value !== null && controlData.value !== undefined) {
      if (controlData.value !== '') {
        return String(controlData.value);
      }
      const extracted = extractValue(controlData.value);
      if (extracted !== '') return extracted;
    }

    // Fall back to defaultValue (check both lowercase and uppercase)
    const defaultVal = controlData.defaultValue ?? controlData.DefaultValue;
    if (defaultVal !== null && defaultVal !== undefined) {
      const extracted = extractValue(defaultVal);
      if (extracted !== '') return extracted;
    }

    return '';
  }, [control, mode, extractValue]);

  // Handle setFocusToControl action - focus editor when hasFocus becomes true
  useEffect(() => {
    const controlData = control as unknown as Record<string, unknown> | undefined;
    if (isRuntimeMode && controlData?.hasFocus) {
      // Set focused state to true - the HtmlEditor component will handle focusing
      setEditorFocused(true);
      // Reset the hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
      // Reset focused state after a short delay to allow re-triggering
      setTimeout(() => {
        setEditorFocused(false);
      }, 300);
    }
  }, [
    (control as unknown as Record<string, unknown> | undefined)?.hasFocus,
    id,
    isRuntimeMode,
    runtimeUpdateControlProperty,
  ]);

  const guardedTrigger = useCallback(
    (eventName: 'onChange' | 'onBlur' | 'onFocus', data: { value?: unknown }) => {
      if (!isRuntimeMode || !actionHandler || !screenId) {
        return;
      }

      const controlData = control as unknown as Record<string, unknown> | undefined;
      const actionEvent = controlData?.[eventName];

      if (!actionEvent) {
        return;
      }

      void actionHandler
        .executeAction({
          componentId: id,
          actionName: eventName,
          actionData: data,
          screenId: screenId,
          recordId: recordId ?? undefined,
          screenState: screenState,
          metadata: {
            componentType: 'htmleditor',
            timestamp: Date.now(),
          },
        })
        .catch((error) => {
          console.error(`[HtmlEditorWrapper:${id}] Failed to execute ${eventName}`, error);
        });
    },
    [isRuntimeMode, actionHandler, screenId, recordId, screenState, id, control],
  );

  const handleFocus = useCallback(() => {
    guardedTrigger('onFocus', {});
  }, [guardedTrigger]);

  const handleChange = useCallback(
    (content: string) => {
      // Update control value in real-time
      if (runtimeUpdateControlValue) {
        runtimeUpdateControlValue(id, content);
      }
    },
    [id, runtimeUpdateControlValue],
  );

  const handleBlur = useCallback(
    (content: string | null) => {
      // Clear hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }

      // Update control value if content provided
      if (content && runtimeUpdateControlValue) {
        runtimeUpdateControlValue(id, content);
      }

      guardedTrigger('onChange', { value: content });
      guardedTrigger('onBlur', { value: content });
    },
    [runtimeUpdateControlProperty, runtimeUpdateControlValue, guardedTrigger, id],
  );
  const isRequired = useMemo(() => {
    if (control.validationRules) {
      const match = control.validationRules.find(({ rule }: { rule: number }) => rule === 0);
      if (match) return true;
    }
    return false;
  }, [control]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Suspense fallback={<div style={{ height: 300, background: '#eee' }}>Loading HTML editor...</div>}>
        <HtmlEditor
          key={`${id}-width-${widthKey}`}
          authContext={authContext}
          id={id}
          caption={control.hideCaption ? undefined : control.caption}
          placeholder={control.placeholder || ''}
          disabled={control.disabled}
          isV4Design={true}
          data={data}
          height={`${editorHeightPx}px`}
          width={editorWidthPx ? `${editorWidthPx}px` : '100%'}
          componentVersion={componentVersion}
          focused={editorFocused}
          onFocus={isRuntimeMode ? handleFocus : undefined}
          onChange={isRuntimeMode ? handleChange : undefined}
          onBlur={isRuntimeMode ? handleBlur : undefined}
          required={isRequired}
          // @ts-ignore
          validationMessage={control.validationMessage}
        />
      </Suspense>
    </div>
  );
};

export default HtmlEditorWrapper;
