import React, { useMemo, useState, useEffect } from 'react';
import Dropdown, { DropdownOption } from '@m-next/dropdown';

export interface StyleOption {
  value: string;
  label: string;
  icon?: string;
  secondary?: string;
}

interface StyleSelectorProps {
  id: string;
  ariaLabel?: string;
  customOptions?: StyleOption[];
  onChange: (value: string) => void;
  value?: string;
  width?: number | string;
  defaultValue?: string;
  defaultOptions?: StyleOption[];
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ id, customOptions, onChange, value, width, defaultOptions = [], defaultValue = '', ariaLabel }) => {
  const [internalValue, setInternalValue] = useState<string>(value || defaultValue);
  
  useEffect(() => {
    setInternalValue(value || defaultValue);
  }, [value, defaultValue]);
  
  const selectedOption = (): DropdownOption => {
    const optionsToUse = customOptions || defaultOptions;
    const found = optionsToUse.find((option) => option.value === internalValue);
    return {
      icon: found?.icon,
      value: internalValue,
      size: 16,
      label: found?.label || 'Custom',
    };
  };

  const options = useMemo(
    (): DropdownOption[] =>
      (customOptions || defaultOptions).map((item) => ({
        icon: item.icon,
        value: item.value,
        label: item.label,
        size: 16,
      })),
    [customOptions, defaultOptions],
  );

  const handleOnChange = (option: DropdownOption) => {
    setInternalValue(String(option.value));
    onChange(String(option.value));
  };

  return (
    <Dropdown
      id={id}
      options={options}
      onChange={handleOnChange}
      value={selectedOption()}
      isV4Design
      dropdownStyle='icon'
      isSearchable={false}
      ariaLabel={ariaLabel}
      width={width}
    />
  );
};

export default StyleSelector;
