import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatter } from '@m-next/utilities';
import { Field } from '@m-next/types';
import { DropdownAsync } from '@m-next/dropdown';

import * as s from '../fieldBlock.styles';

const propTypes = {
  id: PropTypes.string,
  field: Field,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  displayPreferences: PropTypes.instanceOf(Object),
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  mode: PropTypes.number,
  onChange: PropTypes.func,
  validationError: PropTypes.string,
  onLoadDropdownData: PropTypes.func,
};

function DropdownField({
  id,
  field,
  value,
  displayPreferences,
  onSelect,
  selected,
  mode,
  onChange,
  validationError,
  onLoadDropdownData,
}) {
  const [clicked, setClicked] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(clickTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetClick = useCallback(() => {
    clearTimeout(clickTimer);
    setClickTimer(
      setTimeout(() => {
        if (isMounted.current) {
          setClicked(false);
        }
      }, 100),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setClicked, isMounted]);

  const ddValue = useMemo(() => {
    if (value && value.value) {
      return {
        value: value.value,
        label: formatter.formatFieldValue(field.type, field.displayOptions, value.label, displayPreferences),
      };
    }
    return null;
  }, [displayPreferences, field.displayOptions, field.type, value]);

  const ddLabel = useMemo(() => {
    if (value && value.value) {
      return formatter.formatFieldValue(field.type, field.displayOptions, value.label, displayPreferences);
    }
    return formatter.formatFieldValue(field.type, field.displayOptions, value, displayPreferences);
  }, [displayPreferences, field.displayOptions, field.type, value]);

  const handleClick = (e) => {
    if (onSelect) {
      setClicked(true);
      resetClick();
      onSelect(e, id, field.name);
    }
  };

  useEffect(() => {
    setClicked(true);
    resetClick();
  }, [selected, resetClick]);

  const handleChange = (val) => {
    onChange(field.name, val);
  };

  const handleLoadDropdown = (query) => {
    if (onLoadDropdownData) {
      return onLoadDropdownData(query, field);
    }
  };

  return (
    <s.ReadOnlyLine
      data-testid={`${id}-data-block-line-${field.name}`}
      selected={field.name === selected}
      initial={clicked}
      onClick={handleClick}
    >
      {mode === 1 && (
        <DropdownAsync
          id={`${id}-data-block-line-${field.name}`}
          isV4Design
          value={ddValue}
          caption={field.caption}
          required={field.isRequired}
          width='100%'
          onChange={handleChange}
          validationMessage={validationError}
          onLoadData={handleLoadDropdown}
          isClearable
        />
      )}
      {mode === 0 && (
        <s.ReadonlyLabel id={`${id}-data-block-line-${field.name}-caption`}>{field.caption}</s.ReadonlyLabel>
      )}
      {mode === 0 && <s.ReadonlyValue id={`${id}-data-block-line-${field.name}-value`}>{ddLabel}</s.ReadonlyValue>}
    </s.ReadOnlyLine>
  );
}

DropdownField.propTypes = propTypes;
export default DropdownField;
