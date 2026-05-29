import React, { useState, useEffect } from 'react';
import { useDebounce } from '@m-next/utilities/src/hooks';
import InputArea from './InputArea';

// DebouncedInputArea — buffers user input and emits `onChange` once typing stops.
// Inherits its prop surface from InputArea (same soft-shim, same clean API).
//
// Behavior note: the underlying InputArea's `onChange` now follows the standard
// React signature and receives the event object. DebouncedInputArea continues
// to invoke the consumer's `onChange` with the raw debounced *value* — same
// shape as the legacy API.

const DebouncedInputArea = (props) => {
  const { value: incomingValue, onChange, ...rest } = props;
  const cleanIncoming = incomingValue === undefined || incomingValue === null ? '' : incomingValue;

  const [rawInput, setRawInput] = useState(cleanIncoming);

  const debouncedInput = useDebounce(rawInput, 1000);

  useEffect(
    () => {
      const cleanValue = incomingValue === undefined || incomingValue === null ? '' : incomingValue;
      if (debouncedInput !== cleanValue && debouncedInput != null) {
        if (onChange) onChange(debouncedInput);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedInput],
  );

  useEffect(() => {
    if (incomingValue !== rawInput) {
      setRawInput(incomingValue === undefined || incomingValue === null ? '' : incomingValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingValue]);

  const handleChange = (e) => {
    // InputArea now forwards the native event; pull the value off it.
    setRawInput(e?.target?.value ?? '');
  };

  return <InputArea {...rest} value={rawInput} onChange={handleChange} />;
};

export default DebouncedInputArea;
