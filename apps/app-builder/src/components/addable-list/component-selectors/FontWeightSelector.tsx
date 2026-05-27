import React from 'react';
import StyleSelector, { StyleOption } from './StyleSelector';

interface FontWeightSelectorProps {
  id: string;
  customOptions?: StyleOption[];
  onChange: (value: string) => void;
  value?: string;
  width?: number | string;
}

const defaultOptions: StyleOption[] = [
  { value: 'regular', label: 'Regular', icon: 'font-weight-regular' },
  { value: 'bold', label: 'Bold', icon: 'font-weight-bold' },
  { value: 'xbold', label: 'Extra Bold', icon: 'font-weight-xbold' },
];

const FontWeightSelector: React.FC<FontWeightSelectorProps> = ({ id, customOptions, onChange, value = 'regular', width }) => (
  <StyleSelector
    id={`${id}-font-weight-selector`}
    customOptions={customOptions}
    defaultOptions={defaultOptions}
    defaultValue='regular'
    onChange={onChange}
    value={value}
    ariaLabel='Font weight selector'
    width={width}
  />
);

export default FontWeightSelector;
