import * as React from 'react';
import { Suspense, useMemo, useCallback, useRef } from 'react';
import SvgIcon, { type SvgIconName } from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Text from '@m-next/text';

import type { BaseWrapperProps } from './shared/types';
import { useDesignerContext } from '../contexts/DesignerContext';

// Import refactored modules
import { formatLink } from './text/linkFormatter';
import { useLineClamp } from './text/hooks/useLineClamp';
import { useTextStyles } from './text/hooks/useTextStyles';
import { useDisplayContent } from './text/hooks/useDisplayContent';

/**
 * TextDesignerWrapper
 * Wrapper component for Text control in AppBuilder.
 * Provides a design-time representation of the Text component.
 *
 * @component
 * @param {object} props
 * @param {string} props.id - The control ID.
 * @returns {JSX.Element}
 */
interface TextWrapperProps extends BaseWrapperProps {
  control?: Record<string, unknown>; // Allow control to be passed directly (for runtime mode)
}

function TextDesignerWrapper({
  id,
  control: controlProp,
  mode = 'designer',
  onControlClick,
  actionHandler,
  screenId,
  recordId,
  screenState,
}: TextWrapperProps) {
  const designerContext = useDesignerContext();
  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control = isRuntimeMode ? controlProp : designerContext?.selectControlById(id);

  // Early return if control doesn't exist - after all hooks
  if (!control) {
    return (
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px',
          border: '1px dashed #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          color: '#666',
          textAlign: 'center',
          fontSize: '12px',
        }}
      >
        Text Control (ID: {id}) - Control not found
      </div>
    );
  }

  // Custom hooks for separated concerns — ALL hooks must be called before any conditional return
  const isDisabled = useMemo(() => {
    return control?.defaultState === 'Disabled';
  }, [control?.defaultState]);

  const displayContent = useDisplayContent(control, isRuntimeMode);
  const { combinedClasses, effectiveStyles, calculatedLineHeight } = useTextStyles(control);

  // Refs for measuring container and text height
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Calculate line-clamp based on container height
  const lineClamp = useLineClamp({
    containerRef,
    textRef,
    calculatedLineHeight,
    effectiveStyles,
  });

  // Determine if onClick should be enabled
  const hasOnClick = control?.onClick && !isDisabled;
  const hasClickableContent = hasOnClick || control?.hrefFormat;

  // Handle onClick action execution
  const handleOnClick = useCallback(async () => {
    if (!isRuntimeMode) {
      // Designer mode: just notify parent of click
      if (onControlClick) {
        onControlClick(id);
      }
    } else if (isRuntimeMode) {
      // Runtime mode: execute action if handler and screenId are provided
      if (actionHandler && screenId && control?.onClick) {
        try {
          const result = await actionHandler.executeAction({
            componentId: id,
            actionName: 'onClick',
            screenId,
            recordId,
            actionData: {
              event: {
                type: 'click',
              },
            },
            screenState: screenState as Record<string, unknown> | undefined,
            metadata: {
              timestamp: Date.now(),
              componentType: control?.type || 'text',
            },
          });

          if (!result.success && result.error) {
            console.error('[TextWrapper] Action execution failed:', result.error);
          }
        } catch (error) {
          console.error('[TextWrapper] Error executing action:', error);
        }
      }
    }
  }, [
    isRuntimeMode,
    onControlClick,
    id,
    actionHandler,
    screenId,
    recordId,
    screenState,
    control?.onClick,
    control?.type,
  ]);

  // Handle click on the container for hrefFormat links (when no onClick action)
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasOnClick) {
        handleOnClick();
        return;
      }
      // For hrefFormat links, find and click the anchor element if the click
      // didn't already land on it (e.g. clicked icon or ellipsis area)
      if (control?.hrefFormat) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A') return; // already clicking the link
        const anchor = containerRef.current?.querySelector('a');
        if (anchor) {
          anchor.click();
        }
      }
    },
    [hasOnClick, handleOnClick, control?.hrefFormat],
  );

  // Handle keyboard interaction (Enter key)
  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (hasOnClick) {
          handleOnClick();
        } else if (control?.hrefFormat) {
          const anchor = containerRef.current?.querySelector('a');
          if (anchor) {
            anchor.click();
          }
        }
      }
    },
    [hasOnClick, handleOnClick, control?.hrefFormat],
  );

  // Get icon color
  const iconColor = useMemo(() => {
    if (control.styles?.fontColor) {
      return undefined;
    }
    if (control.color) {
      return colors[control.color] || control.color;
    }
    return colors.darkGrey;
  }, [control.styles?.fontColor, control.color]);

  // In runtime mode, hide mapped (bound) labels when there is no active record.
  // All hooks above run unconditionally so React's hook call count stays stable across
  // renders. Without this guard, legacy controls (value not yet cleared by the save-layer
  // fix) would also be protected, and the toggle null→visible as a record loads works
  // correctly without a hooks-ordering crash.
  if (isRuntimeMode && control?.isBound && displayContent === '') {
    return null;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Suspense fallback={<div style={{ height: 40, background: '#eee' }}>Loading Text Panel...</div>}>
        <div
          ref={containerRef}
          role={hasClickableContent ? 'link' : undefined}
          aria-label={hasClickableContent ? String(displayContent ?? '') : undefined}
          onClick={hasClickableContent ? handleContainerClick : undefined}
          onKeyDown={hasClickableContent ? handleOnKeyDown : undefined}
          tabIndex={hasClickableContent ? 0 : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            opacity: isDisabled ? 0.5 : 1,
            pointerEvents: isDisabled ? 'none' : 'auto',
            cursor: hasClickableContent ? 'pointer' : 'default',
            width: '100%',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div
            ref={textRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: 0,
              flex: '1 1 auto',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            <Text
              id={id}
              as={control.displayTag || 'div'}
              fontColor={effectiveStyles.fontColor}
              fontWeight={effectiveStyles.fontWeight}
              fontSize={effectiveStyles.fontSize}
              lineHeight={calculatedLineHeight}
              iconAlign={control.icon ? control.iconAlign : undefined}
              inlineStyling={{
                float: 'none',
                width: '100%',
                cursor: hasClickableContent ? 'pointer' : 'default',
              }}
              style={{
                ...control.style,
                pointerEvents: isDisabled ? 'none' : 'auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lineClamp,
                wordBreak: 'break-word',
                minHeight: 0,
                maxHeight: '100%',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                lineHeight: calculatedLineHeight,
                paddingBottom: '0.1em',
                textAlign: effectiveStyles.textAlignment,
                direction: 'ltr',
                // Add extra padding-right for right-aligned text to ensure ellipsis is visible
                ...(effectiveStyles.textAlignment === 'right' && {
                  paddingRight: '0.5em',
                  boxSizing: 'border-box',
                }),
              }}
              className={`mi-label ${combinedClasses}
                          ${
                            (control.onClick || control.hrefFormat) && isDisabled ? 'mi-label-inProgress' : ''
                          } ${control.widthType === 'full' ? 'mi-control-width-full' : ''}`}
            >
              {control.icon && control.iconAlign !== 'Right' && (
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}>
                  <SvgIcon name={(control.icon ?? 'setup') as SvgIconName} size={16} color={iconColor} />
                </span>
              )}
              {control.hrefFormat ? (
                formatLink({
                  linkVal: String(displayContent ?? ''),
                  hrefFormat: control.hrefFormat,
                  mappedId: id,
                  isDisabled: control.disabled,
                })
              ) : (
                // eslint-disable-next-line react/no-danger
                <span dangerouslySetInnerHTML={{ __html: String(displayContent ?? '') }} />
              )}
              {control.icon && control.iconAlign === 'Right' && (
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                  <SvgIcon name={(control.icon ?? 'setup') as SvgIconName} size={16} color={iconColor} />
                </span>
              )}
            </Text>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default TextDesignerWrapper;
