import React from 'react';
import StyleSelector, { StyleOption } from './StyleSelector';

interface BorderStyleSelectorProps {
  id: string;
  customOptions?: StyleOption[];
  onChange: (value: string) => void;
  value?: string;
  width?: number | string;
}

const defaultOptions: StyleOption[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
];

const BorderStyleSelector: React.FC<BorderStyleSelectorProps> = ({ id, customOptions, onChange, value = 'solid', width }) => (
  <StyleSelector
    id={`${id}-border-style-selector`}
    customOptions={customOptions}
    defaultOptions={defaultOptions}
    defaultValue='solid'
    onChange={onChange}
    value={value}
    ariaLabel='Border style selector'
    width={width}
  />
);

export default BorderStyleSelector;
