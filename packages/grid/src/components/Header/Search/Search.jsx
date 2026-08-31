import React, { forwardRef, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import xss from 'xss';
import SvgIcon from '@m-next/svg-icon';
import * as s from './Search.styles';
import { iconSize } from '@m-next/tokens';

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

const propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  focusOnLoad: PropTypes.bool,
  onSubmit: PropTypes.func,
  initialSearch: PropTypes.string,
  onChangeValue: PropTypes.func,
};

/**
 * Search — simple search bar with submit + clear + xss-sanitized callback.
 * Used in @m-next/grid headers but exported publicly so callers can drop the
 * same bar elsewhere.
 *
 * Note: this is a leaf form primitive — the legacy-looking Grid props
 * (isV4Design, isMobile, legacyClass, compactStyle) are NOT load-bearing
 * here, so they're silently ignored. On the parent Grid they ARE real.
 */
const Search = forwardRef(function Search(props, ref) {
  const {
    id: idProp = null,
    focusOnLoad = false,
    onSubmit = null,
    initialSearch = '',
    onChangeValue = null,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-grid-search-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'grid-search-forwardRef-prop',
      '@m-next/grid: `forwardRef` prop is deprecated on <Search>. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const [searchValue, setSearchValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState(initialSearch);

  const inputRef = useRef();
  const containerRef = useRef(null);

  // Chain modern ref + legacy forwardRef prop onto the rendered s.SearchContainer
  // (the <form> root). The internal inputRef is unchanged and still drives
  // focusOnLoad behavior below.
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(containerRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = containerRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  // Focus
  useEffect(() => {
    if (focusOnLoad) inputRef?.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusOnLoad, inputRef.current]);

  // Set initial search value
  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    if (onChangeValue) {
      const safeValue = xss(e.target.value);
      onChangeValue(safeValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!searchValue && !submittedValue) return;

    const trimmedValue = searchValue.trim();
    setSearchValue(trimmedValue);

    if (trimmedValue !== submittedValue) {
      // prevent searching for same value twice
      const sanitizedValue = xss(trimmedValue); // use xss library to prevent script injections
      if (onSubmit) {
        onSubmit(sanitizedValue);
      }
      setSubmittedValue(trimmedValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setSubmittedValue('');
    if (onSubmit) {
      onSubmit('');
    }
    if (onChangeValue) {
      onChangeValue('');
    }
  };

  return (
    <s.SearchContainer onSubmit={handleSubmit} ref={containerRef}>
      <s.Input
        ref={inputRef}
        id={`${id}-SIMPLE-SEARCH-INPUT`}
        placeholder='Search'
        name='eg-simple-search'
        type='text'
        value={searchValue ?? ''}
        onChange={handleChange}
      />

      {searchValue && (
        <s.ClearIconContainer onClick={handleClear} type='reset' id={`${id}-SIMPLE-SEARCH-CLEAR_ICON`}>
          <s.ClearIconWrapper>
            <s.ClearIcon />
          </s.ClearIconWrapper>
        </s.ClearIconContainer>
      )}

      <s.SearchIconWrapper onClick={handleSubmit} id='Simple-Search-Icon'>
        <SvgIcon name='mi-icon-search' size={iconSize.sm} />
      </s.SearchIconWrapper>
    </s.SearchContainer>
  );
});

Search.displayName = 'Search';
Search.propTypes = propTypes;

export default Search;
