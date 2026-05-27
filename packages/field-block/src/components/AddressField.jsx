import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field } from '@m-next/types';
import Address from '@m-next/address';

import * as s from '../fieldBlock.styles';

const propTypes = {
  id: PropTypes.string,
  field: Field,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  mode: PropTypes.number,
  onChange: PropTypes.func,
};

function AddressField({ id, field, value, onSelect, selected, mode, onChange }) {
  const [clicked, setClicked] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [queuedChange, setQueuedChange] = useState(null);
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

  const handleChange = (val) => {
    onChange(field.name, val);
  };

  const handleQueuedChange = (val) => {
    if (hasFocus) {
      setQueuedChange(val);
    } else {
      handleChange(val);
    }
  };

  const handleOnFocus = () => {
    setHasFocus(true);
  };
  const handleBlur = () => {
    setHasFocus(false);
    if (queuedChange) {
      handleChange(queuedChange);
      setQueuedChange(null);
    }
  };

  return (
    <s.ReadOnlyLine
      data-testid={`${id}-data-block-line-${field.name}`}
      selected={field.name === selected}
      initial={clicked}
      onClick={handleClick}
    >
      <s.ReadonlyLabel id={`${id}-data-block-line-${field.name}-caption`}>{field.caption}</s.ReadonlyLabel>
      <Address
        id={`${id}-data-block-line-${field.name}-value`}
        Line1={value?.Line1}
        Line2={value?.Line2}
        Line3={value?.Line3}
        Line4={value?.Line4}
        Line5={value?.Line5}
        City={value?.City}
        Country={value?.Country}
        PostalCode={value?.PostalCode}
        State={value?.State}
        isEditable={mode === 1}
        onChange={handleQueuedChange}
        onFocus={handleOnFocus}
        onBlur={handleBlur}
      />
    </s.ReadOnlyLine>
  );
}

AddressField.propTypes = propTypes;
export default AddressField;
