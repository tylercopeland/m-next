import * as React from 'react';
import type { ChangeEvent } from 'react';
import type { CountryData } from 'react-phone-input-2';

import Caption from '@m-next/caption';

import {
  ReactPhoneContainer,
  ReactPhoneStyled,
  ValidationMessage,
  ValidationMessageWrapper,
  ValidationIcon,
} from './phoneInput.styles';
import type { PhoneInputProps } from './types';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
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

function PhoneInput(props: PhoneInputProps) {
  const {
    id: idProp,
    value = undefined,
    defaultCountry: defaultCountryProp,
    label: labelProp,
    searchPlaceholder = 'Search country',
    enableSearch = true,
    disableSearchIcon = true,
    enableTerritories = true,
    errorMessage: errorMessageProp,
    onChange: onChangeProp,

    containerStyle = undefined,
    inputStyle = undefined,
    buttonStyle = undefined,
    dropdownStyle = undefined,
    searchStyle = undefined,

    // Soft-shimmed legacy props
    placeholder: legacyPlaceholder,
    validationMessage: legacyValidationMessage,
    handleChange: legacyHandleChange,
    country: legacyCountry,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile = false,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,
    displayAuto: _displayAuto,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = React.useRef<string | null>(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-phone-input-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyPlaceholder != null && label == null) {
    warnOnce(
      'phone-input-placeholder',
      '@m-next/phone-input: `placeholder` is deprecated. Use `label`.',
    );
    label = legacyPlaceholder;
  }
  if (label == null) label = 'Phone number';

  let errorMessage = errorMessageProp;
  if (legacyValidationMessage != null && errorMessage == null) {
    warnOnce(
      'phone-input-validationMessage',
      '@m-next/phone-input: `validationMessage` is deprecated. Use `errorMessage`.',
    );
    errorMessage = legacyValidationMessage;
  }

  let onChange = onChangeProp;
  if (legacyHandleChange != null && onChange == null) {
    warnOnce(
      'phone-input-handleChange',
      '@m-next/phone-input: `handleChange` is deprecated. Use `onChange`.',
    );
    onChange = legacyHandleChange;
  }

  let defaultCountry = defaultCountryProp;
  if (legacyCountry != null && defaultCountry == null) {
    warnOnce(
      'phone-input-country',
      '@m-next/phone-input: `country` is deprecated. Use `defaultCountry`.',
    );
    defaultCountry = legacyCountry;
  }
  if (defaultCountry == null) defaultCountry = 'ca';

  // ============ State ============

  const [phone, setPhone] = React.useState<string | undefined>(value);
  const [focused, setFocus] = React.useState<boolean>(false);

  // Shape matches react-phone-input-2's onChange signature so we can pass it
  // through without an awkward cast.
  const localHandleChange = (
    phoneValue: string,
    data: CountryData | {},
    event: ChangeEvent<HTMLInputElement>,
    formattedValue: string,
  ) => {
    setPhone(formattedValue);

    if (onChange) {
      const dialCode = (data as CountryData)?.dialCode ?? '';
      onChange(
        phoneValue,
        { ...data, rawPhone: phoneValue?.slice(dialCode.length) },
        event,
        formattedValue,
      );
    }
  };

  return (
    <ReactPhoneContainer id={`${id}-phoneinput`}>
      <Caption
        id={`${id}-caption`}
        label={label}
        float={focused || Boolean(phone)}
        focused={focused}
        floatXPosUnfocus='42px'
        isV4Design
        isLabelBolded={false}
        isMobile={isMobile}
      />
      <ReactPhoneStyled
        country={defaultCountry}
        value={phone}
        onChange={localHandleChange}
        placeholder=''
        searchPlaceholder={searchPlaceholder}
        enableSearch={enableSearch}
        disableSearchIcon={disableSearchIcon}
        enableTerritories={enableTerritories}
        containerStyle={containerStyle}
        inputStyle={inputStyle}
        buttonStyle={buttonStyle}
        dropdownStyle={dropdownStyle}
        searchStyle={searchStyle}
        isMobile={isMobile}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onMount={(_value, _data, formattedValue) => setPhone(formattedValue)}
        // The list of all other props can be found => https://www.npmjs.com/package/react-phone-input-2?activeTab=readme
      />
      {errorMessage && (
        <ValidationMessageWrapper>
          <ValidationIcon name='warning-sign' size={14} />
          <ValidationMessage id={`${id}-validation`}>
            {' '}
            {errorMessage}{' '}
          </ValidationMessage>
        </ValidationMessageWrapper>
      )}
    </ReactPhoneContainer>
  );
}

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
export type { PhoneInputProps, PhoneInputChangeHandler } from './types';
