import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import xss from 'xss';
import SvgIcon from '@m-next/svg-icon';
import * as s from './Search.styles';

function Search({ id = null, focusOnLoad = false, onSubmit = null, initialSearch = '', onChangeValue = null }) {
  const [searchValue, setSearchValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState(initialSearch);

  const inputRef = useRef();

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
    <s.SearchContainer onSubmit={handleSubmit}>
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
        <SvgIcon name='mi-icon-search' size={16} />
      </s.SearchIconWrapper>
    </s.SearchContainer>
  );
}

export default Search;

Search.propTypes = {
  id: PropTypes.string,
  focusOnLoad: PropTypes.bool,
  onSubmit: PropTypes.func,
  initialSearch: PropTypes.string,
  onChangeValue: PropTypes.func,
};
