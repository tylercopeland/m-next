import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Text } from '@m-next/typeography';
import { DebouncedInput } from '@m-next/input';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';

type InputType = 'text' | 'integer' | 'number';
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

interface EditorInputProps {
  id: string;
  value: string | number;
  label?: string;
  onChange: (value: string | number) => void;
  controlId: string;
  maxLength?: number;
  align?: AlignType;
  gap?: number;
  suffixText?: string;
  type?: InputType;
  disabled?: boolean;
  width?: string;
  showChildIcon?: boolean;
  resetOnBlank?: boolean;
  placeholder?: string;
  forceReset?: boolean;
}

const EditorInput: React.FC<EditorInputProps> = ({
  id,
  value,
  label,
  onChange,
  controlId,
  maxLength = 30,
  align = 'baseline',
  gap = 16,
  suffixText,
  type = 'text',
  disabled = false,
  width = '184px',
  showChildIcon = false,
  resetOnBlank = true,
  placeholder,
  forceReset = false,
}) => {
  const [initialValue, setInitialValue] = useState<string | number | object>(value);
  const [infoMessage, setInfoMessage] = useState<string>('');
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInitialValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleLengthValid = (isValid: boolean) => {
    if (isValid) {
      setInfoMessage('');
    } else if (String(value)) { // invalid; has value
      if (type === 'integer' || type === 'number') {
        setInfoMessage(`Max length ${maxLength}${suffixText ?? ''}`);
      } else if (typeof value === 'string') {
        setInfoMessage(`Max length ${maxLength}`);
      }
    } else { // invalid but no value
      setInfoMessage('');
    }
  };

  const handleChange = (newValue: string | number | object): void => {
    // Clear any pending blur timeout when user resumes editing
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    if (typeof newValue === 'object') {
      // Handle object case if needed, or just return early
      return;
    }

    if (maxLength && typeof newValue === 'string' && newValue.length > maxLength) {
      const updatedValue = newValue.slice(0, maxLength);
      onChange(updatedValue);
    } else {
      onChange(newValue);
      setInitialValue(newValue);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBlur = (_: string | number | object) => {
    // Delay clearing the info message to allow click events on other elements to fire first
    // This prevents layout shift from causing buttons to move before click registers
    blurTimeoutRef.current = setTimeout(() => {
      setInfoMessage('');
      blurTimeoutRef.current = null;
    }, 100);
  };

  return (
    <LineWrapper align={align} gap={gap}>
      {showChildIcon && <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />}
      <Text id={id} style={{ flexGrow: 1 }}>
        {label}
      </Text>
      <DebouncedInput
        id={id}
        value={value}
        initialValue={initialValue}
        onChange={handleChange}
        onBlur={handleBlur}
        width={width}
        ariaLabel={label}
        maxLength={type !== 'integer' && type !== 'number' ? maxLength : undefined}
        maxValue={type === 'integer' || type === 'number' ? maxLength : undefined}
        resetOnBlank={resetOnBlank}
        truncate
        infoMessage={infoMessage}
        suffixText={suffixText}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        updateRawValue={forceReset}
        onLengthValid={handleLengthValid}
      />
    </LineWrapper>
  );
};

export default EditorInput;
