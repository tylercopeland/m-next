 
import React, { useEffect, useMemo, useState } from 'react';
import Dropdown, { DropdownOption } from '@m-next/dropdown';
import { colors } from '@m-next/styles';

interface ColorOption {
  value: string;
  label: string;
}

interface ColorSelectorProps {
  id: string;
  customOptions?: ColorOption[];
  onChange: (colorKey: string, option: DropdownOption) => void;
  value?: string;
  width?: number | string;
  type?: 'color' | 'font-color' | 'fill-color';
  showLabel?: boolean;
}

const translateColor = (color: string): string => {
  switch (color) {
    case colors['grey-darker']:
      return 'grey-darker';
    case colors['grey-light']:
      return 'grey-light';
    case colors.red:
      return 'red';
    case colors.fuchsia:
      return 'fuchsia';
    case colors.purple:
      return 'purple';
    case colors.blue:
      return 'blue';
    case colors.teal:
      return 'teal';
    case colors.green:
      return 'green';
    case colors.yellow:
      return 'yellow';
    case colors.orange:
      return 'orange';
    case colors.black:
      return 'black';
    case colors.white:
      return 'white';
    case colors['grey-lighter']:
      return 'grey-lighter';
    case colors['blue-darker']:
      return 'blue-darker';
    default:
      return 'grey-darker';
  }
};
 
const defaultOptions: ColorOption[] = [
  { value: colors['grey-darker']!, label: 'Dark Grey' },
  { value: colors['grey-light']!, label: 'Grey' },
  { value: colors.red!, label: 'Red' },
  { value: colors.fuchsia!, label: 'Pink' },
  { value: colors.purple!, label: 'Purple' },
  { value: colors.blue!, label: 'Blue' },
  { value: colors.teal!, label: 'Aqua' },
  { value: colors.green!, label: 'Green' },
  { value: colors.yellow!, label: 'Yellow' },
  { value: colors.orange!, label: 'Orange' },
  { value: colors.black!, label: 'Black' },
  { value: colors.white!, label: 'White' },
  { value: colors['grey-lighter']!, label: 'Silver' },
  { value: colors['blue-darker']!, label: 'Dark Blue' },
];

const ColorSelector: React.FC<ColorSelectorProps> = ({
  id,
  customOptions,
  onChange,
  value = colors['grey-darker'],
  width,
  type = 'color',
  showLabel = false,
}) => {
  const [internalValue, setInternalValue] = useState<string>((colors as Record<string, string>)[value] || colors['grey-darker']);

  useEffect(() => {
    const bestMatch = (colors as Record<string, string>)[value] || colors['grey-darker'];
    setInternalValue(bestMatch);
  }, [value]);

  const options = useMemo(
    (): DropdownOption[] =>
      (customOptions || defaultOptions).map((item) => ({
        icon: 'square',
        value: item.value,
        color: item.value,
        label: item.label,
        size: 16,
        secondary: item.value,
      })),
    [customOptions],
  );

  const selectedOption = (): DropdownOption => {
    const match = options.find((option) => option.value === internalValue);
    return {
      icon: type === 'font-color' || type === 'fill-color' ? type : 'square',
      color: internalValue,
      value: internalValue,
      label: showLabel && match ? match.label : '',
      size: 16,
    };
  };

  const handleOnChange = (option: DropdownOption) => {
    setInternalValue(String(option.value));
    onChange(translateColor(String(option.value)), option);
  };

  return (
    <Dropdown
      id={`${id}-color-selector`}
      options={options}
      onChange={handleOnChange}
      value={selectedOption()}
      isV4Design
      dropdownStyle='icon'
      isSearchable={false}
      breakout
      ariaLabel='Color selector'
      width={width}
    />
  );
};

export default ColorSelector;
