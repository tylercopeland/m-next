import React from 'react';
import StyleSelector, { StyleOption } from './StyleSelector';

interface BorderSizeSelectorProps {
  id: string;
  customOptions?: StyleOption[];
  onChange: (value: string) => void;
  value?: string;
  width?: number | string;
}

const defaultOptions: StyleOption[] = [
  { value: '1px', label: '1px' },
  { value: '2px', label: '2px' },
  { value: '4px', label: '4px' },
  { value: '6px', label: '6px' },
  { value: '8px', label: '8px' },
  { value: '10px', label: '10px' },
];

const BorderSizeSelector: React.FC<BorderSizeSelectorProps> = ({ id, customOptions, onChange, value = '1px', width }) => (
  <StyleSelector
    id={`${id}-border-size-selector`}
    customOptions={customOptions}
    defaultOptions={defaultOptions}
    defaultValue='1px'
    onChange={onChange}
    value={value}
    ariaLabel='Border size selector'
    width={width}
  />
);

export default BorderSizeSelector;
