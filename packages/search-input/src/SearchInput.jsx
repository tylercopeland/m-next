// vendors
import React, { useState, useEffect, useRef, forwardRef } from 'react';

import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import { useDebounce } from '@m-next/utilities/src/hooks';
// components
import * as s from './SearchInput.styles';

/* --------------------------------------------------*/

// One-time deprecation warner — fires once per key, mirrors @m-next/input / @m-next/button.
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

const SearchInput = forwardRef(function SearchInput(props, ref) {
  const {
    id: idProp,
    name = null,
    placeholder = null,
    disabled = false,
    tabIndex = 0,
    value = '',
    style = null,
    wrapperStyle = null,

    // Clean API
    label: labelProp,
    leftIcon: leftIconProp,
    readOnly: readOnlyProp,
    showClearButton = false,

    selectOnFocus = false,
    suppressAutoFocus = false,

    onBlur = null,
    onChange = null,
    onRawChange,
    onClear = null,
    onFocus = null,
    onKeyDown = null,
    onKeyUp = null,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    readonly: legacyReadonly,
    caption: legacyCaption,
    prefixIcon: legacyPrefixIcon,
    ariaDescribedby: legacyAriaDescribedby,

    // Standard ARIA pass-through
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile,
    hidden: _hidden,
    displayAuto: _displayAuto,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-search-input-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyCaption !== undefined && label === undefined) {
    warnOnce('search-input-caption', '@m-next/search-input: `caption` is deprecated. Use `label`.');
    label = legacyCaption;
  }

  let leftIcon = leftIconProp;
  if (legacyPrefixIcon && !leftIcon) {
    warnOnce(
      'search-input-prefixIcon',
      '@m-next/search-input: `prefixIcon` (string icon name) is deprecated. Use `leftIcon` ReactNode.',
    );
    leftIcon = <SvgIcon name={legacyPrefixIcon} size={16} color={colors.grey.base} />;
  }
  // Default leading icon: a search glyph. Consumers can pass `leftIcon={null}` to suppress.
  if (leftIcon === undefined) {
    leftIcon = <SvgIcon name='search' size={16} color={colors.grey.base} />;
  }

  let resolvedAriaDescribedby = ariaDescribedby;
  if (legacyAriaDescribedby && !resolvedAriaDescribedby) {
    warnOnce(
      'search-input-ariaDescribedby',
      '@m-next/search-input: `ariaDescribedby` is deprecated. Use `aria-describedby` (standard React attr).',
    );
    resolvedAriaDescribedby = legacyAriaDescribedby;
  }

  let readOnly = readOnlyProp ?? false;
  if (legacyReadonly !== undefined && readOnly === false) {
    warnOnce(
      'search-input-readonly',
      '@m-next/search-input: `readonly` is deprecated. Use `readOnly` (React casing).',
    );
    readOnly = legacyReadonly;
  }

  if (legacyForwardRef) {
    warnOnce(
      'search-input-forwardRef-prop',
      '@m-next/search-input: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ State ============

  const [focused, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [rawInput, setRawInput] = useState(value === undefined || value === null ? '' : value);
  const inputRef = useRef(null);

  const debouncedInput = useDebounce(rawInput, 200);
  const [focusTimer, setFocusTimer] = useState(null); // used as a fallback only when needed

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return undefined;
    if (typeof targetRef === 'function') {
      targetRef(inputRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = inputRef.current;
    }
    return undefined;
  }, [ref, legacyForwardRef]);

  useEffect(() => {
    if (!suppressAutoFocus && inputRef.current) {
      inputRef.current.focus(); // This works in most cases (but for some reason not right after clicking 'add filter')
      if (document.activeElement !== inputRef.current) {
        // if attempt to focus failed,
        setFocusTimer(
          setTimeout(() => {
            // Try again after 100ms
            if (inputRef.current) inputRef.current.focus(); // This seems to always work (when needed)
          }, 100),
        );
      }
      return () => {
        // Clean up after ourselves
        clearTimeout(focusTimer);
        setFocusTimer(null);
      };
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppressAutoFocus, inputRef]);

  useEffect(
    () => {
      const cleanValue = value === undefined || value === null ? '' : value;
      // Call onChange if:
      // 1. Value differs from prop (normal case), OR
      // 2. Value is empty AND user has interacted (clearing search after typing)
      // This ensures clearing the input triggers onChange even when value prop is undefined
      if (debouncedInput != null && (debouncedInput !== cleanValue || (debouncedInput === '' && touched))) {
        if (onChange) onChange(debouncedInput);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedInput], // Only call effect if debounced search term changes
  );
  // TODO: Once React fixes bug with onBlur not always being triggered on unmount (https://github.com/facebook/react/issues/25194), see if we can revert this side-step
  // Instead of running onFocus and onBlur handlers directly on event, use effects that run on mount, change, and unmount, based on focused var set by event handlers
  // This allows iPad to run onBlur handler even when unmounting doesn't trigger onBlur event (see ticket: https://method.atlassian.net/browse/PL-38084)
  const unmountingForRealRef = useRef(false);
  const previouslyFocusedRef = useRef(false);
  useEffect(
    () => () => {
      unmountingForRealRef.current = true;
    },
    [],
  );

  useEffect(() => {
    if (value !== rawInput) {
      setRawInput(value === undefined || value === null ? '' : value);
      if (onRawChange) {
        onRawChange(value === undefined || value === null ? '' : value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const processFocusChange = () => {
      if (focused && !previouslyFocusedRef.current && onFocus) onFocus(rawInput);
      if (
        ((!focused && previouslyFocusedRef.current && !unmountingForRealRef.current) ||
          (focused && unmountingForRealRef.current)) &&
        onBlur
      )
        onBlur(rawInput);
    };
    processFocusChange();
    previouslyFocusedRef.current = focused;
    return processFocusChange;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, onFocus, onBlur]);

  const handleChange = (e) => {
    setRawInput(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleFocus = (e) => {
    if (selectOnFocus) e.target.select();
    setFocus(true);
  };

  const handleBlur = (/* e */) => {
    setFocus(false);
  };

  const handleClear = () => {
    setRawInput('');
    if (onChange) onChange('');
    if (onClear) onClear();
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <s.InnerWrapper
      id={`${id}-search`}
      focused={focused}
      isMobile={isMobile}
      prefix={leftIcon}
      readOnly={readOnly}
      disabled={disabled}
      showClearButton={showClearButton}
      style={wrapperStyle}
    >
      {leftIcon ? <div className='mi-textinput-prefix'>{leftIcon}</div> : null}
      <input
        id={`${id}-search-input`}
        ref={inputRef}
        type='search'
        tabIndex={tabIndex}
        name={name}
        value={rawInput}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete='off'
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        aria-label={ariaLabel ?? label ?? name ?? 'Search'}
        aria-describedby={resolvedAriaDescribedby}
        aria-disabled={disabled || undefined}
        data-testid={`${id}-search-input`}
        style={style}
        {...rest}
      />
      {showClearButton && rawInput && (
        <s.ClearIconWrapper>
          <button
            type='button'
            onClick={handleClear}
            aria-label='Clear search'
            data-testid={`${id}-search-clear-button`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              opacity: 0.6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.6';
            }}
          >
            <SvgIcon name='close-V4' size={10} color={colors.grey.dark} />
          </button>
        </s.ClearIconWrapper>
      )}
    </s.InnerWrapper>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
