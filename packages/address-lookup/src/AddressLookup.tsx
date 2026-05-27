import React, { useState, useEffect, useMemo, FC } from 'react';
import AsyncSelect from 'react-select/async';
// Create a wrapper component to fix TypeScript error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AsyncSelectWrapper = AsyncSelect as any;
import {
  components,
  ControlProps,
  StylesConfig,
  CSSObjectWithLabel,
  GroupBase,
  SingleValue,
  MultiValue,
  FormatOptionLabelMeta,
  MenuListProps,
} from 'react-select';
import SvgIcon from '@m-next/svg-icon';
import Caption from '@m-next/caption';
import { MapboxApi, GeocodingFeature } from '@m-next/map';
import * as s from './addressLookup.styles';

interface OptionType {
  key: number;
  label: string;
  value: number;
  streetAddress?: string;
  text: string;
  raw: unknown;
  city?: string;
  zipPostalCode?: string;
  stateProvince?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
}

// Custom Control to render icon inside the textbox, but outside ValueContainer/input
const Control = ({ isDisabled, ...props }: ControlProps<OptionType, boolean, GroupBase<OptionType>>) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <components.Control {...props} isDisabled={isDisabled} />
    <div
      style={{
        position: 'absolute',
        left: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 2,
        height: 34,
      }}
    >
      <SvgIcon name='address-lookup' size={16} color='#888' disabled={isDisabled} data-testid='svg-icon' />
    </div>
  </div>
);

const formatOptionLabel = (option: OptionType, meta: FormatOptionLabelMeta<OptionType>) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}
    id={meta.context === 'menu' ? `dropdown-AddressLookup-${option.key}` : undefined}
  >
    <span>{option.label}</span>
    {option.streetAddress && <span style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{option.streetAddress}</span>}
  </div>
);

interface AddressLookupCustomProps {
  id: string;
  onChange?: (option: OptionType | null) => void;
  caption?: string;
  width?: string | number;
  placeholder?: string;
  disabled?: boolean;
  legacyClass?: string;
  isV4Design?: boolean;
  displayAuto?: boolean;
  required?: boolean;
  validationMessage?: string;
  isValid?: boolean;
  gatewayUrl: string;
  menuPlacement?: 'auto' | 'top' | 'bottom';
}

const AddressLookupCustom: FC<AddressLookupCustomProps> = ({
  id,
  onChange,
  caption,
  width = 300,
  placeholder,
  disabled,
  legacyClass,
  isV4Design,
  displayAuto = false,
  required,
  validationMessage,
  isValid = true,
  gatewayUrl,
  menuPlacement = 'auto',
}) => {
  const [userGeolocation, setUserGeolocation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const mapboxapi = useMemo(() => {
    return MapboxApi();
  }, []);

  useEffect(() => {
    if (userGeolocation == null && gatewayUrl) {
      fetch(`${gatewayUrl}${gatewayUrl.endsWith('/') ? '' : '/'}geolocation/ipgeo`)
        .then((res) => res.json())
        .then((response) => {
          setUserGeolocation(`${response.data.longitude}, ${response.data.latitude}`);
        })
        .catch(() => {});
    }
  }, [userGeolocation]);

  // Helper function to extract street address from a geocoding feature
  const getStreetAddress = (feature: GeocodingFeature): string => {
    // Handle POI (Point of Interest) type
    if (feature.place_type.includes('poi') && feature.properties?.address) {
      return feature.properties.address;
    }

    // Handle address type
    if (feature.place_type.includes('address')) {
      const addressPart = feature.address || '';
      const textPart = feature.text || '';

      return addressPart ? `${addressPart} ${textPart}` : textPart;
    }

    return '';
  };

  // Convert a geocoding feature to an option for the dropdown
  const featureToOption = (feature: GeocodingFeature, index: number): OptionType => {
    // Extract place types
    const isCity = feature.place_type.includes('place') && feature.place_type.length === 1;
    const isRegion = feature.place_type.includes('region') && feature.place_type.length === 1;
    const isPostalCode = feature.place_type.includes('postcode') && feature.place_type.length === 1;
    const isCityAndRegion = feature.place_type.includes('region') && feature.place_type.includes('place');

    // Create base option
    const option: OptionType = {
      key: index,
      label: feature.place_name,
      value: index,
      streetAddress: getStreetAddress(feature),
      text: feature.place_name,
      raw: feature,
    };

    // Extract city, region, postal code based on place type
    const placeName = feature.place_name.split(', ');

    if (isCity) {
      const [city] = placeName;
      option.city = city;
    }

    if (isPostalCode) {
      option.zipPostalCode = feature.text;
    }

    if (isRegion) {
      const [region] = placeName;
      option.stateProvince = region;
    }

    if (isCityAndRegion) {
      const [city] = placeName;
      option.city = city;
    }

    // Extract context data (postal code, city, region, country)
    if (feature.context) {
      feature.context.forEach((context: { id?: string; text: string }) => {
        if (context.id?.includes('postcode')) {
          option.zipPostalCode = context.text;
        }

        if (context.id?.includes('place')) {
          option.city = context.text;
        }

        if (context.id?.includes('region')) {
          option.stateProvince = context.text;
        }

        if (context.id?.includes('country')) {
          option.country = context.text;
        }
      });
    }

    // Extract coordinates
    if (feature.geometry?.coordinates?.length > 1) {
      option.longitude = feature.geometry.coordinates[0];
      option.latitude = feature.geometry.coordinates[1];
    }

    return option;
  };

  const loadOptions = (inputValue: string, callback: (options: OptionType[]) => void) => {
    // Early return for short inputs
    if (!inputValue || inputValue.length <= 2) {
      callback([]);
      return;
    }

    mapboxapi
      .getAddressSuggestions(inputValue, userGeolocation)
      .then((data: { data: { features: GeocodingFeature[] } }) => {
        const features = data.data.features || [];
        const options = features.map(featureToOption);
        callback(options);
      })
      .catch(() => callback([]));
  };

  const handleChange = (newValue: MultiValue<OptionType> | SingleValue<OptionType>) => {
    const option = newValue as OptionType | null;
    if (onChange) onChange(option);
    // Clear the input field after selection
    setInputValue('');
  };

  // Styles to mimic dropdown.jsx
  const customSelectStyles: StylesConfig<OptionType, boolean, GroupBase<OptionType>> = {
    container: (base: CSSObjectWithLabel) => ({
      ...base,
      width: '100%',
      position: 'relative',
    }),
    control: (base: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
      ...base,
      minHeight: 34,
      height: 34,
      borderRadius: isV4Design ? 4 : 1,
      borderColor: (() => {
        if (!isValid) return '#e53935';
        if (state.isFocused) return '#1976d2';
        return '#ccc';
      })(),
      boxShadow: state.isFocused ? '0 0 0 2px #1976d220' : 'none',
      fontSize: 14,
      backgroundColor: disabled ? '#f5f5f5' : '#fff',
      cursor: disabled ? 'not-allowed' : 'text',
      paddingLeft: 24, // space for icon
      paddingRight: 0,
      borderWidth: 1,
      outline: 'none',
      width: '100%',
      transition: 'border-color 0.2s',
    }),
    valueContainer: (base: CSSObjectWithLabel) => ({
      ...base,
      padding: '0px 8px', // no left padding, so input/placeholder are flush left
      minHeight: 34,
      height: 34,
      display: 'flex',
      alignItems: 'center',
      position: 'relative', // Needed for absolute positioning of the input
    }),
    input: () => ({
      margin: 0,
      padding: 0,
      fontSize: 14,
      color: '#222',
      // Make the input position absolute so it can overlay the placeholder
      position: 'relative',
      width: '100%',
    }),
    placeholder: (base: CSSObjectWithLabel, state: { isFocused: boolean; hasValue: boolean }) => ({
      ...base,
      color: '#888',
      fontSize: 14,
      marginLeft: 0,
      paddingLeft: 0,
      // Make the placeholder not affect layout and allow cursor to appear over it
      pointerEvents: 'none',
      position: 'absolute',
      // Hide placeholder when focused or has input value
      opacity: state.isFocused || state.hasValue || inputValue ? 0 : 1,
      transition: 'opacity 0.2s',
      // Prevent placeholder text from wrapping
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
      ...base,
      fontSize: 14,
      marginLeft: 0,
      color: '#222',
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      zIndex: 1000,
      fontSize: 14,
      borderRadius: 4,
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px 0px',
      marginTop: 4,
    }),
    option: (base: CSSObjectWithLabel, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...base,
      fontSize: 14,
      backgroundColor: (() => {
        if (state.isSelected) return '#f0f4f8';
        if (state.isFocused) return '#f5faff';
        return '#fff';
      })(),
      color: state.isSelected ? '#1976d2' : '#222',
      cursor: 'pointer',
      padding: 8,
      borderRadius: 0,
      borderBottom: '1px solid #f0f0f0',
      ':last-child': {
        borderBottom: 'none',
      },
    }),
    dropdownIndicator: () => ({
      display: 'none',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menuList: (base: CSSObjectWithLabel) => ({
      ...base,
      padding: 0,
      borderRadius: 4,
    }),
    loadingIndicator: () => ({
      display: 'none',
    }),
    noOptionsMessage: (base: CSSObjectWithLabel) => ({
      ...base,
      color: '#888',
      fontSize: 14,
    }),
  };

  // Custom MenuList component to override the default listbox ID
  const CustomMenuList = (props: MenuListProps<OptionType, boolean, GroupBase<OptionType>>) => {
    // Override the id in the innerProps
    const customProps = {
      ...props.innerProps,
      id: `${id}-List`,
    };

    return <components.MenuList {...props} innerProps={customProps} />;
  };

  return (
    <s.ContainerWrapper
      width={width}
      isValid={isValid}
      displayAuto={displayAuto}
      isV4Design={isV4Design}
      disabled={disabled}
      className={legacyClass}
      data-testid={`${id}-address-lookup`}
    >
      {caption && !isV4Design && (
        <s.Label htmlFor={id}>
          {caption}
          {required && <s.RequiredMark>*</s.RequiredMark>}
        </s.Label>
      )}
      {caption && isV4Design && (
        <Caption
          id={`${id}-address-lookup-caption`}
          required={required}
          label={caption}
          isValid={isValid}
          isV4Design={isV4Design}
          float
          focused={focused}
          elFor={id}
          disabled={disabled}
        />
      )}
      <AsyncSelectWrapper
        inputId={id}
        cacheOptions
        defaultOptions={false}
        loadOptions={loadOptions}
        placeholder={placeholder}
        isDisabled={disabled}
        value={null} // Always keep the input empty to show as an input-only field
        inputValue={inputValue}
        onInputChange={(newValue: string) => setInputValue(newValue)}
        onChange={handleChange}
        onMenuOpen={() => setFocused(true)}
        onMenuClose={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        styles={customSelectStyles}
        noOptionsMessage={() => 'Search for an address...'}
        menuPlacement={menuPlacement}
        components={{
          Control,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          MenuList: CustomMenuList, // Add the custom MenuList component
        }}
        formatOptionLabel={formatOptionLabel}
      />
      {validationMessage && !isValid && <s.ValidationMessage>{validationMessage}</s.ValidationMessage>}
    </s.ContainerWrapper>
  );
};

export default AddressLookupCustom;
