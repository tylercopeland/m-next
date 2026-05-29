import React, { useState, useEffect, useMemo, useRef, forwardRef, Ref } from 'react';
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
import { colors } from '@m-next/tokens';
import * as s from './addressLookup.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input / @m-next/button.
const warnOnce = (() => {
  const seen = new Set<string>();
  return (key: string, message: string) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

export interface AddressLookupOption {
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

// Backwards-compat alias for the original internal type name.
type OptionType = AddressLookupOption;

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
      <SvgIcon name='address-lookup' size={16} color={colors.grey.base} disabled={isDisabled} data-testid='svg-icon' />
    </div>
  </div>
);

const makeFormatOptionLabel =
  (id: string) =>
  (option: OptionType, meta: FormatOptionLabelMeta<OptionType>) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}
      id={meta.context === 'menu' ? `${id}-option-${option.key}` : undefined}
      role={meta.context === 'menu' ? 'option' : undefined}
    >
      <span>{option.label}</span>
      {option.streetAddress && (
        <span style={{ fontSize: 12, color: colors.grey.base, marginTop: 2 }}>{option.streetAddress}</span>
      )}
    </div>
  );

export interface AddressLookupProps {
  /** Optional id; auto-generated if omitted. */
  id?: string;
  /** Visible label, rendered via @m-next/caption. */
  label?: string;
  /** Fired when a suggestion is selected. */
  onChange?: (option: AddressLookupOption | null) => void;
  /** Alias for `onChange` — fires when a suggestion is selected. */
  onSelect?: (option: AddressLookupOption | null) => void;
  /** Fires on every keystroke in the search box. */
  onInputChange?: (value: string) => void;
  width?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** When set, the component shows error styling and renders this message below. */
  errorMessage?: string | null;
  /** Mapbox gateway base URL — used for ipgeo lookup to bias suggestions. */
  gatewayUrl: string;
  menuPlacement?: 'auto' | 'top' | 'bottom';

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use `errorMessage`. The previous "isValid + validationMessage" pair is folded into a single message. */
  validationMessage?: string | null;
  /** @deprecated Use `errorMessage` (a non-null value implies invalid). */
  isValid?: boolean;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forwardRef?: Ref<any>;

  // ============ Silently ignored legacy ghosts ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

const AddressLookup = forwardRef<HTMLDivElement, AddressLookupProps>(function AddressLookup(props, ref) {
  const {
    id: idProp,
    label: labelProp,
    onChange,
    onSelect,
    onInputChange,
    width = 300,
    placeholder,
    disabled,
    required,
    errorMessage: errorMessageProp,
    gatewayUrl,
    menuPlacement = 'auto',

    // Soft-shimmed legacy
    caption: legacyCaption,
    validationMessage,
    isValid: legacyIsValid,
    forwardRef: legacyForwardRef,

    // Silently ignored
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
  } = props;

  // ============ Auto-id ============
  const internalIdRef = useRef<string | null>(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-address-lookup-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============
  let label = labelProp;
  if (legacyCaption !== undefined && label === undefined) {
    warnOnce('address-lookup-caption', '@m-next/address-lookup: `caption` is deprecated. Use `label`.');
    label = legacyCaption;
  }

  let errorMessage = errorMessageProp ?? null;
  if (validationMessage != null && errorMessage == null) {
    warnOnce(
      'address-lookup-validationMessage',
      '@m-next/address-lookup: `validationMessage` is deprecated. Use `errorMessage`.',
    );
    errorMessage = validationMessage;
  }
  if (legacyIsValid === false && errorMessage == null) {
    warnOnce(
      'address-lookup-isValid',
      '@m-next/address-lookup: `isValid` is deprecated. Set `errorMessage` to convey an invalid state.',
    );
  }

  // `isValid` is derived from errorMessage going forward. Legacy `isValid={false}` is honoured for styling.
  const isValid = legacyIsValid !== undefined ? legacyIsValid : errorMessage == null;

  if (legacyForwardRef) {
    warnOnce(
      'address-lookup-forwardRef-prop',
      '@m-next/address-lookup: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ State ============
  const [userGeolocation, setUserGeolocation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(containerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      (targetRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
    }
  }, [ref, legacyForwardRef]);

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

  const loadOptions = (rawInputValue: string, callback: (options: OptionType[]) => void) => {
    // Early return for short inputs
    if (!rawInputValue || rawInputValue.length <= 2) {
      callback([]);
      return;
    }

    mapboxapi
      .getAddressSuggestions(rawInputValue, userGeolocation)
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
    if (onSelect) onSelect(option);
    // Clear the input field after selection
    setInputValue('');
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (onInputChange) onInputChange(newValue);
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
      borderRadius: 4,
      borderColor: (() => {
        if (!isValid) return colors.red.base;
        if (state.isFocused) return colors.blue.base;
        return colors.grey.light;
      })(),
      boxShadow: state.isFocused ? `0 0 0 2px ${colors.blue.lighter}` : 'none',
      fontSize: 14,
      backgroundColor: disabled ? colors.grey.lighter : colors.white,
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
      color: colors.grey.dark,
      // Make the input position absolute so it can overlay the placeholder
      position: 'relative',
      width: '100%',
    }),
    placeholder: (base: CSSObjectWithLabel, state: { isFocused: boolean; hasValue: boolean }) => ({
      ...base,
      color: colors.grey.base,
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
      color: colors.grey.dark,
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
        if (state.isSelected) return colors.blue.lighter;
        if (state.isFocused) return colors.grey.lighter;
        return colors.white;
      })(),
      color: state.isSelected ? colors.blue.base : colors.grey.dark,
      cursor: 'pointer',
      padding: 8,
      borderRadius: 0,
      borderBottom: `1px solid ${colors.grey.lighter}`,
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
      color: colors.grey.base,
      fontSize: 14,
    }),
  };

  const listboxId = `${id}-List`;

  // Custom MenuList component to override the default listbox ID and role
  const CustomMenuList = (props: MenuListProps<OptionType, boolean, GroupBase<OptionType>>) => {
    const customProps = {
      ...props.innerProps,
      id: listboxId,
      role: 'listbox',
    };

    return <components.MenuList {...props} innerProps={customProps} />;
  };

  return (
    <s.ContainerWrapper
      ref={containerRef}
      width={width}
      isValid={isValid}
      disabled={disabled}
      className={legacyClass}
      data-testid={`${id}-address-lookup`}
      role='combobox'
      aria-expanded={menuOpen}
      aria-haspopup='listbox'
      aria-controls={listboxId}
      aria-owns={listboxId}
    >
      {label && (
        <Caption
          id={`${id}-address-lookup-caption`}
          required={required}
          label={label}
          isValid={isValid}
          isV4Design
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
        onInputChange={handleInputChange}
        onChange={handleChange}
        onMenuOpen={() => {
          setFocused(true);
          setMenuOpen(true);
        }}
        onMenuClose={() => {
          setFocused(false);
          setMenuOpen(false);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        styles={customSelectStyles}
        noOptionsMessage={() => 'Search for an address...'}
        menuPlacement={menuPlacement}
        components={{
          Control,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          MenuList: CustomMenuList,
        }}
        formatOptionLabel={makeFormatOptionLabel(id)}
        // ARIA combobox semantics on the underlying input
        aria-autocomplete='list'
        aria-controls={listboxId}
        aria-expanded={menuOpen}
        aria-invalid={!isValid || undefined}
        aria-required={required || undefined}
      />
      {errorMessage && !isValid && <s.ValidationMessage>{errorMessage}</s.ValidationMessage>}
    </s.ContainerWrapper>
  );
});

AddressLookup.displayName = 'AddressLookup';

export default AddressLookup;
