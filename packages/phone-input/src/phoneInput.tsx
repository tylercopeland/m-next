import * as React from 'react';
import { CountryData } from 'react-phone-input-2'

import Caption from "@m-next/caption";

import { ReactPhoneContainer, ReactPhoneStyled, ValidationMessage, ValidationMessageWrapper, ValidationIcon } from './phoneInput.styles';

export type PhoneInputProps = {
  id?: string,
  value?: string,
  defaultCountry?: string,
  placeholder?: string,
  searchPlaceholder?: string,
  enableSearch?: boolean,
  disableSearchIcon?: boolean,
  enableTerritories?: boolean,
  isMobile?: boolean,
  validationMessage?: string,
  handleChange?: (phoneValue: string, data: Record<string, unknown> | CountryData, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => void,

  containerStyle?: React.CSSProperties,
  inputStyle?: React.CSSProperties,
  buttonStyle?: React.CSSProperties,
  dropdownStyle?: React.CSSProperties,
  searchStyle?: React.CSSProperties,
};

function PhoneInput(props: PhoneInputProps) {
  const {
    id = 'myPhoneComponent',
    value = undefined,
    defaultCountry = 'ca',
    placeholder = 'Phone number',
    searchPlaceholder = 'Search country',
    enableSearch = true,
    disableSearchIcon = true,
    enableTerritories = true,
    isMobile = false,
    handleChange = null,
    validationMessage = undefined,

    containerStyle = undefined,
    inputStyle = undefined,
    buttonStyle = undefined,
    dropdownStyle = undefined,
    searchStyle = undefined,

  } = props;

  const [phone, setPhone] = React.useState<string | undefined>(value);
  const [focused, setFocus] = React.useState<boolean>(false);

  const localHandleChange = (phoneValue: string, data: Record<string, unknown> | CountryData, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
    setPhone(formattedValue)

    if (handleChange)
      handleChange(phoneValue, { ...data, rawPhone: phoneValue?.slice((data as CountryData)?.dialCode.length) }, event, formattedValue);
  }

  return (
    <ReactPhoneContainer id={`${id}-phoneinput`}>
      <Caption
        id={`${id}-caption`}
        label={placeholder}
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
      {validationMessage &&
        <ValidationMessageWrapper>
          <ValidationIcon name='warning-sign' size={14} />
          <ValidationMessage id={`${id}-validation`}>
            {' '}
            {validationMessage}{' '}
          </ValidationMessage>
        </ValidationMessageWrapper>
      }
    </ReactPhoneContainer>
  );
}

export default PhoneInput;
