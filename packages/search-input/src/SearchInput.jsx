// vendors
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { useDebounce } from '@m-next/utilities/src/hooks';
// components
import * as s from './SearchInput.styles';

/* --------------------------------------------------*/

const propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  caption: PropTypes.string,
  name: PropTypes.string,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  wrapperStyle: PropTypes.instanceOf(Object),
  tabIndex: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onRawChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  isMobile: PropTypes.bool,
  ariaDescribedby: PropTypes.string,
  prefixIcon: PropTypes.string,
  selectOnFocus: PropTypes.bool,
  suppressAutoFocus: PropTypes.bool,
  showClearButton: PropTypes.bool,
  onClear: PropTypes.func,
};

function SearchInput({
  id,
  disabled = false,
  caption = null,
  name = null,
  readonly = false,
  placeholder = null,
  style = null,
  wrapperStyle = null,
  tabIndex = 0,
  value = '',
  onBlur = null,
  onChange = null,
  onRawChange,
  onFocus = null,
  onKeyDown = null,
  onKeyUp = null,
  isMobile = false,
  ariaDescribedby = null,
  prefixIcon = '',
  selectOnFocus = false,
  suppressAutoFocus = false,
  showClearButton = false,
  onClear = null,
}) {
  const [focused, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [rawInput, setRawInput] = useState(value === undefined || value === null ? '' : value);
  const inputRef = useRef(null);

  const debouncedInput = useDebounce(rawInput, 200);
  const [focusTimer, setFocusTimer] = useState(null); // used as a fallback only when needed

  useEffect(() => {
    if (!suppressAutoFocus && inputRef.current) {
      inputRef.current.focus(); // This works in most cases (but for some reason not right after clicking 'add filter')
      if (document.activeElement !== inputRef.current) {
        // if attempt to focus failed,
        setFocusTimer(
          setTimeout(() => {
            // Try again after 100ms
            inputRef.current.focus(); // This seems to always work (when needed)
          }, 100),
        );
      }
      return () => {
        // Clean up after ourselves
        clearTimeout(focusTimer);
        setFocusTimer(null);
      };
    }
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
    // TODO: See above // if (onFocus) onFocus(e);
    setFocus(true);
  };

  const handleBlur = (/* e */) => {
    // TODO: See above // if (onBlur) onBlur(e);
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
      prefix={prefixIcon}
      readOnly={readonly}
      disabled={disabled}
      showClearButton={showClearButton}
      style={wrapperStyle}
    >
      <div className='mi-textinput-prefix'>
        <SvgIcon name='search' size={16} color={colors['grey']} />
      </div>
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
        readOnly={readonly}
        autoComplete='off'
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        aria-label={caption || name}
        aria-describedby={ariaDescribedby}
        aria-disabled={disabled}
        data-testid={`${id}-search-input`}
        style={style}
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
            <SvgIcon name='close-V4' size={10} color={colors['grey-dark']} />
          </button>
        </s.ClearIconWrapper>
      )}
    </s.InnerWrapper>
  );
}

SearchInput.propTypes = propTypes;

export default SearchInput;
