import React from 'react';
import StyleSelector, { StyleOption } from './StyleSelector';

interface FontSizeSelectorProps {
  id: string;
  customOptions?: StyleOption[];
  onChange: (value: string) => void;
  value?: string;
  width?: number | string;
}

const defaultOptions: StyleOption[] = [
  { value: 'xsmall', label: 'X-Small', secondary: '10px' },
  { value: 'small', label: 'Small', secondary: '12px' },
  { value: 'regular', label: 'Regular', secondary: '14px' },
  { value: 'large', label: 'Large', secondary: '16px' },
  { value: 'xlarge', label: 'X-Large', secondary: '18px' },
  { value: 'xxlarge', label: 'XX-Large', secondary: '22px' },
  { value: 'xxxlarge', label: 'XXX-Large', secondary: '30px' },
];

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ id, customOptions, onChange, value = 'regular', width }) => (
  <StyleSelector
    id={`${id}-font-size-selector`}
    customOptions={customOptions}
    defaultOptions={defaultOptions}
    defaultValue='regular'
    onChange={onChange}
    value={value}
    ariaLabel='Font size selector'
    width={width}
  />
);

export default FontSizeSelector;
