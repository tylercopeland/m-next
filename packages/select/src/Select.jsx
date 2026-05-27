import React, { useState, useEffect, useRef, forwardRef } from 'react';
import SelectOption from './SelectOption';
import * as s from './Select.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/button and @m-next/input.
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

// Normalize the legacy `small`/`large` size scale to the standard `sm`/`md`/`lg` scale.
const normalizeSize = (size) => {
  if (size === 'small') {
    warnOnce(
      'select-size-small',
      '@m-next/select: size="small" is deprecated. Use size="sm".',
    );
    return 'sm';
  }
  if (size === 'large') {
    warnOnce(
      'select-size-large',
      '@m-next/select: size="large" is deprecated. Use size="lg".',
    );
    return 'lg';
  }
  return size;
};

const Select = forwardRef(function Select(props, ref) {
  const {
    id: idProp,
    className,
    options = [],
    onChange,
    selectedValue,
    value, // alias of selectedValue (forward-compat, non-deprecated)

    // Clean API
    label: labelProp,
    size: sizeProp = 'lg',

    // Soft-shimmed legacy props
    caption,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,

    ...rest
  } = props;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (caption !== undefined && label === undefined) {
    warnOnce('select-caption', '@m-next/select: `caption` is deprecated. Use `label`.');
    label = caption;
  }

  const size = normalizeSize(sizeProp);

  if (legacyForwardRef) {
    warnOnce(
      'select-forwardRef-prop',
      '@m-next/select: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-select-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ State ============

  const initialSelection = selectedValue ?? value;
  const [selection, setSelection] = useState(initialSelection);
  const wrapperRef = useRef(null);

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(wrapperRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = wrapperRef.current;
    }
  }, [ref, legacyForwardRef]);

  useEffect(() => {
    const next = selectedValue ?? value;
    if (selection !== next) setSelection(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, value]);

  const handleOnChange = (option) => {
    setSelection(option.title);
    if (onChange) onChange(option);
  };

  return (
    <s.SelectWrapper
      ref={wrapperRef}
      id={`${id}-wrapper`}
      className={className}
      role="radiogroup"
      aria-label={label || undefined}
      {...rest}
    >
      {options?.map((option, idx) => {
        const key = `${id}-option-${idx}`;
        return (
          <SelectOption
            key={key}
            id={`${id}`}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={selection === option.title}
            onSelection={handleOnChange}
            disabled={option.disabled}
            size={size}
          />
        );
      })}
    </s.SelectWrapper>
  );
});

Select.displayName = 'Select';

export default Select;
