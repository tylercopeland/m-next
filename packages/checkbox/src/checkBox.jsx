import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as s from './checkBox.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const Checkbox = forwardRef(function Checkbox(props, ref) {
  const {
    id: idProp,
    name = null,
    label = null,
    checked = false,
    halfChecked = false,
    disabled = false,
    autoFocus = false,
    tabIndex = 0,

    // Clean API
    align = 'left',
    rounded = false,
    narrow = false,
    fullWidth = false,
    bold = false,
    hideLabel: hideLabelProp,
    disableLabel = true,
    width = '100%',
    className,
    style,
    testId = null,

    onChange,
    onBlur,
    onFocus,
    onKeyDown,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    hideCaption,
    controlId,

    // Silently ignored legacy ghosts
    isMobile: _isMobile,
    hidden: _hidden,
    legacyClasses: _legacyClasses,
    isV4Design: _isV4Design,
    displayAuto: _displayAuto,
    legacyClass: _legacyClass,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-checkbox-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let hideLabel = hideLabelProp;
  if (hideCaption !== undefined && hideLabel === undefined) {
    warnOnce(
      'checkbox-hideCaption',
      '@m-next/checkbox: `hideCaption` is deprecated. Use `hideLabel`.',
    );
    hideLabel = hideCaption;
  }

  if (legacyForwardRef) {
    warnOnce(
      'checkbox-forwardRef-prop',
      '@m-next/checkbox: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Refs ============

  const checkboxRef = useRef(null);

  // Bridge the legacy `forwardRef` prop (imperative handle with blur/focus/select).
  useImperativeHandle(legacyForwardRef, () => ({
    blur: () => checkboxRef.current?.blur(),
    focus: () => checkboxRef.current?.focus(),
    select: () => checkboxRef.current?.select?.(),
  }));

  // Bridge the React forwardRef API ref to the underlying <input>.
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(checkboxRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      ref.current = checkboxRef.current;
    }
  }, [ref]);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = halfChecked;
    }
  }, [halfChecked]);

  useEffect(() => {
    if (autoFocus && checkboxRef.current) {
      checkboxRef.current.focus();
    }
  }, [autoFocus]);

  // ============ Handlers ============

  const handleOnChange = (e) => {
    if (onChange) onChange(e.target.checked);
  };

  const handleKeyDown = (e) => {
    if (onKeyDown) onKeyDown(e);
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (onChange) onChange(!checked);
    }
  };

  // ============ Render ============

  const labelId = controlId || `${id}Lbl`;
  const hideLabelEffective = hideLabel || !label;

  return (
    <s.ControlContainer id={`${controlId || id}-wrapper`} className={className} fullWidth={fullWidth}>
      <s.Wrapper
        htmlFor={id}
        align={align}
        rounded={rounded}
        style={style}
        width={width}
        aria-labelledby={hideLabelEffective ? null : labelId}
        narrow={narrow}
      >
        {label && (
          <s.Label
            id={labelId}
            align={align}
            disabled={disabled ? true : null}
            aria-checked={hideLabelEffective ? null : checked}
            tabIndex={-1}
            className={hideLabelEffective ? 'aoda-visually-hidden' : ''}
            disableLabel={disableLabel}
            hideLabel={hideLabelEffective}
            fullWidth={fullWidth}
            bold={bold}
          >
            {label}
          </s.Label>
        )}
        <s.Input
          ref={checkboxRef}
          autoFocus={autoFocus}
          id={id}
          name={name}
          type="checkbox"
          disabled={disabled ? true : null}
          checked={checked}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
          data-testid={testId}
          aria-disabled={disabled || undefined}
          {...rest}
        />
        <s.Checkbox
          align={align}
          rounded={rounded}
          disabled={disabled ? true : null}
          aria-checked={hideLabelEffective ? checked : null}
          aria-labelledby={hideLabelEffective ? labelId : null}
          tabIndex={-1}
        />
      </s.Wrapper>
    </s.ControlContainer>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
