import React from 'react';
import StyleSelector, { StyleOption } from './StyleSelector';

interface AlignmentSelectorProps {
  id: string;
  customOptions?: StyleOption[];
  onChange: (value: string) => void;
  value?: string;
  width?: number | string;
}

const defaultOptions: StyleOption[] = [
  { value: 'left', label: 'Left', icon: 'align-left' },
  { value: 'center', label: 'Center', icon: 'align-center' },
  { value: 'right', label: 'Right', icon: 'align-right' },
];

const AlignmentSelector: React.FC<AlignmentSelectorProps> = ({ id, customOptions, onChange, value = 'left', width }) => (
  <StyleSelector
    id={`${id}-alignment-selector`}
    customOptions={customOptions}
    defaultOptions={defaultOptions}
    defaultValue='left'
    onChange={onChange}
    value={value}
    ariaLabel='Alignment selector'
    width={width}
  />
);

export default AlignmentSelector;
