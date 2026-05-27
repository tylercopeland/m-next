import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatter } from '@m-next/utilities';
import { Field } from '@m-next/types';
import { DebouncedInput } from '@m-next/input';

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
};

function TextField({ id, field, value, displayPreferences, onSelect, selected, mode, onChange, validationError }) {
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

  const formattedValue = useMemo(
    () => formatter.formatFieldValue(field.type, field.displayOptions, value, displayPreferences),
    [field.type, field.displayOptions, value, displayPreferences],
  );

  const handleChange = (val) => {
    onChange(field.name, val);
  };

  return (
    <s.ReadOnlyLine
      data-testid={`${id}-data-block-line-${field.name}`}
      selected={field.name === selected}
      initial={clicked}
      onClick={handleClick}
    >
      {mode === 1 && (
        <DebouncedInput
          id={`${id}-data-block-line-${field.name}`}
          isV4Design
          value={formattedValue}
          caption={field.caption}
          hideCaption={false}
          compactStyle
          required={field.isRequired}
          onChange={handleChange}
          validationMessage={validationError}
          useValidation
        />
      )}
      {mode === 0 && (
        <s.ReadonlyLabel id={`${id}-data-block-line-${field.name}-caption`}>{field.caption}</s.ReadonlyLabel>
      )}
      {mode === 0 && (
        <s.ReadonlyValue id={`${id}-data-block-line-${field.name}-value`}>{formattedValue}</s.ReadonlyValue>
      )}
    </s.ReadOnlyLine>
  );
}

TextField.propTypes = propTypes;
export default TextField;
