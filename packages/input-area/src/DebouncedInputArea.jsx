import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '@m-next/utilities/src/hooks';
import InputArea from './InputArea';

const propTypes = {
  ariaLabel: PropTypes.string,
  autoGrow: PropTypes.bool,
  disabled: PropTypes.bool,
  disableResize: PropTypes.bool,
  forwardRef: PropTypes.instanceOf(Object),
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  maxHeight: PropTypes.number,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  style: PropTypes.instanceOf(Object),
  tabIndex: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  validationMessage: PropTypes.string,
  displayAuto: PropTypes.bool,
  legacyClass: PropTypes.string,
  isV4Design: PropTypes.bool,
  initialHeight: PropTypes.number,
  selectOnFocus: PropTypes.bool,
  navigateGrid: PropTypes.func,
  isBlurOnSubmit: PropTypes.bool,
  compactStyle: PropTypes.bool,
};

const DebouncedInputArea = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [rawInput, setRawInput] = useState(props.value === undefined || props.value === null ? '' : props.value);

  const debouncedInput = useDebounce(rawInput, 1000);

  useEffect(
    () => {
      const { onChange, value } = props;
      const cleanValue = value === undefined || value === null ? '' : value;
      if (debouncedInput !== cleanValue && debouncedInput != null) {
        if (onChange) onChange(debouncedInput);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedInput], // Only call effect if debounced search term changes
  );

  useEffect(() => {
    const { value } = props;
    if (value !== rawInput) {
      setRawInput(value === undefined || value === null ? '' : value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps, react/destructuring-assignment
  }, [props.value]);

  return <InputArea {...props} value={rawInput} onChange={setRawInput} isV4Design />;
};

DebouncedInputArea.propTypes = propTypes;
export default DebouncedInputArea;
