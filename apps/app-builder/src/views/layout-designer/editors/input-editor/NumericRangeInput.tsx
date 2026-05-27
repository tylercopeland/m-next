import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Text } from '@m-next/typeography';
import * as s from './NumericRangeInput.styles';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { OutroAnimation } from '@m-next/input';

type NumericType = 'number' | 'integer';

type AlignType = 'baseline' | 'center' | 'flex-start' | 'flex-end' | 'stretch';

interface LineWrapperProps {
  align?: AlignType;
  gap?: number;
}

const LineWrapper = styled.div<LineWrapperProps>(({ align, gap = 16 }) => [
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: align || 'baseline',
    gap,
  },
]);

interface NumericRangeInputProps {
  id: string;
  value: number;
  initialValue: number;
  onChange: (value: number) => void;
  type: NumericType;
  minValue?: number;
  maxValue?: number;
  label?: string;
  width?: string;
  align?: AlignType;
  gap?: number;
  prefixIcon?: string;
  suffixText?: string;
  ariaLabel?: string;
  disabled?: boolean;
  selectOnFocus?: boolean;
}

const NumericRangeInput: React.FC<NumericRangeInputProps> = ({
  id,
  value,
  label,
  initialValue,
  onChange,
  type = 'number',
  minValue,
  maxValue,
  width = '184px',
  align = 'baseline',
  gap = 16,
  prefixIcon = '',
  suffixText,
  ariaLabel,
  disabled = false,
  selectOnFocus = false,
}) => {
  const [focused, setFocus] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [rawInput, setRawInput] = useState(initialValue.toString());
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<number>(value); // always valid
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onChangeRef = useRef(onChange);
  const valuePropRef = useRef(value);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { valuePropRef.current = value; }, [value]);

  useEffect(() => {
    setRawInput(value.toString());
    if (isNaN(value)) {
      setIsValid(false);
      return;
    }

    if (minValue !== undefined && value < minValue) {
      setIsValid(false);
      setInfoMessage(`Min value ${minValue}${suffixText ?? ''}`);
    } else if (maxValue !== undefined && value > maxValue) {
      setIsValid(false);
      setInfoMessage(`Max value ${maxValue}${suffixText ?? ''}`);
    } else {
      setIsValid(true);
      setInfoMessage('');
      setDebouncedValue(value);
    }
  }, [value, minValue, maxValue, suffixText]);

  useEffect(() => {
    if (disabled) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (debouncedValue !== valuePropRef.current) {
        onChangeRef.current(debouncedValue);
      }
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedValue, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(e.target.value);

    const numeric = type === 'integer' ? parseInt(e.target.value, 10) : parseFloat(e.target.value);
    if (isNaN(numeric)) {
      setIsValid(false);
      return;
    }

    if (minValue !== undefined && numeric < minValue) {
      setIsValid(false);
      setInfoMessage(`Min value ${minValue}${suffixText ?? ''}`);
    } else if (maxValue !== undefined && numeric > maxValue) {
      setIsValid(false);
      setInfoMessage(`Max value ${maxValue}${suffixText ?? ''}`);
    } else {
      setIsValid(true);
      setInfoMessage('');
      setDebouncedValue(numeric);
    }
  };

  const handleBlur = () => {
    setFocus(false);
    
    // Clear any pending debounced onChange
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    const numeric = type === 'integer' ? parseInt(rawInput, 10) : parseFloat(rawInput);
    let finalValue = debouncedValue;

    if (!isNaN(numeric)) {
      // Valid number - enforce constraints
      if (minValue !== undefined && numeric < minValue) {
        finalValue = minValue;
      } else if (maxValue !== undefined && numeric > maxValue) {
        finalValue = maxValue;
      } else {
        finalValue = numeric;
      }
    }
    // If invalid (NaN), keep last valid debouncedValue

    setRawInput(finalValue.toString());
    setDebouncedValue(finalValue);
    setInfoMessage('');
    setIsValid(true);
    
    // Call onChange immediately on blur with the final constrained value
    if (!disabled) {
      onChange(finalValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectOnFocus) {
      e.target.select();
    }
    setFocus(true);
  };

  return (
    <LineWrapper align={align} gap={gap}>
      <Text id={id} style={{ flexGrow: 1 }}>
        {label}
      </Text>
      <s.Container
        id={`${id}-TextInput`}
        role='none'
        width={width}
        isValid={isValid} // no caption validation for old designs
      >
        <s.InnerWrapper
          isValid={isValid}
          focused={focused}
          prefix={prefixIcon}
          disabled={disabled}
        >
          <input
            id={id}
            type='number'
            step={type === 'integer' ? '1' : 'any'}
            value={rawInput}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-label={ariaLabel}
            data-testid={`${id}-Input`}
          />
          {suffixText && <s.SuffixWrapper>{suffixText}</s.SuffixWrapper>}
        </s.InnerWrapper>
        <OutroAnimation show={Boolean(infoMessage)}>
          <s.InfoMessageWrapper>
            <SvgIcon
              id={`${id}-info-icon`}
              name='warning-sign'
              size={14}
              color={colors.grey}
              style={{ paddingRight: '4px' }}
            />
            <s.InfoMessage id={`${id}-info`}>
              {infoMessage}
            </s.InfoMessage>
          </s.InfoMessageWrapper>
        </OutroAnimation>
      </s.Container>
    </LineWrapper>
  );
}

export default NumericRangeInput;
