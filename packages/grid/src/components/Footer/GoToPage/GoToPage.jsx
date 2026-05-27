import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '@m-next/input';

import * as s from './GoToPage.styles';

function GoToPage({ id, totalRows, totalRecords, pageNumber, perPage, onPageSelect, disabled = true }) {
  const [value, setValue] = useState('');
  const [recordCount, setRecordCount] = useState(totalRecords || null);
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(pageNumber);

  useEffect(() => {
    let currentRecordCount = recordCount;
    if (totalRecords === null) {
      const prevCount = pageNumber * perPage - perPage;
      if (pageNumber > 1) {
        currentRecordCount = totalRows + prevCount;
      } else {
        currentRecordCount = totalRows;
      }
    }
    setRecordCount(currentRecordCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRows]);

  useEffect(() => {
    if (totalRecords !== null) {
      setRecordCount(totalRecords);
    }
  }, [totalRecords]);

  useEffect(() => {
    if (isFocused) {
      setDisplayValue(value);
    } else {
      // Show the user's input value if it exists (waiting for pageNumber to update)
      // Otherwise show the current pageNumber
      setDisplayValue(value || pageNumber);
    }
  }, [isFocused, value, pageNumber]);

  // Clear value when pageNumber updates (API call completes)
  useEffect(() => {
    if (!isFocused && value) {
      setValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const handleOnFocus = () => {
    setIsFocused(true);
    setValue('');
  };

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleOnKeyUp = (e) => {
    if (e && e.keyCode === 13) {
      if (!value || value === '' || value === undefined || value === null || value <= 0) {
        setValue('');
        setIsFocused(false);
        e.target.blur();
        return;
      }
      onPageSelect(value);
      // Keep the value until pageNumber updates
      setIsFocused(false);
      e.target.blur();
    }
  };

  const handleOnBlur = () => {
    setIsFocused(false);
    if (!value || value === '' || value === undefined || value === null || value <= 0) {
      // Don't clear value, let it show pageNumber via displayValue logic
      return;
    }
    onPageSelect(value);
    // Keep the value until pageNumber updates - don't clear it here
  };

  return (
    <s.Wrapper>
      <Input
        id={id}
        type='number'
        placeholder='Page'
        value={displayValue}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onKeyUp={handleOnKeyUp}
        onBlur={handleOnBlur}
        disabled={disabled}
        style={{ marginBottom: 0 }}
        innerStyle={{ borderRadius: 0, height: '32px', borderColor: '#545F67' }}
        inputStyle={{ textAlign: 'center', opacity: 1 }}
      />
    </s.Wrapper>
  );
}

GoToPage.defaultProps = {
  totalRows: null,
  totalRecords: null,
  pageNumber: 1,
  perPage: 5,
  onPageSelect: null,
};

GoToPage.propTypes = {
  id: PropTypes.string.isRequired,
  totalRows: PropTypes.number,
  totalRecords: PropTypes.number,
  pageNumber: PropTypes.number,
  perPage: PropTypes.number,
  onPageSelect: PropTypes.func,
  disabled: PropTypes.bool,
};

export default GoToPage;
