import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useTheme } from '@mui/material';
import { colors, lightTheme } from '@m-next/styles';
import Caption from '@m-next/caption';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import { ValidationMessage } from '@m-next/validation';
import * as s from './dropdown.styles';

// types
const propTypes = {
  id: PropTypes.string,
  displayAuto: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  validationMessage: PropTypes.string,
  isV4Design: PropTypes.bool,
  caption: PropTypes.string,
  required: PropTypes.bool,
  legacyClass: PropTypes.string,
  isMobile: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        lines: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        icon: PropTypes.string,
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        lines: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        icon: PropTypes.string,
      }),
    ]),
  ),
  value: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  hasValidation: PropTypes.bool,
  dropdownStyle: PropTypes.oneOf(['single', 'icon', 'multi', 'multi-icon']),
  onMenuOpen: PropTypes.func,
  style: PropTypes.instanceOf(Object),
  background: PropTypes.string,
  isMultiSelect: PropTypes.bool,
  isCreateable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  onCreate: PropTypes.func,
  actionButtonText: PropTypes.string,
  isPortal: PropTypes.bool,
  onActionButtonClick: PropTypes.func,
  forwardRef: PropTypes.instanceOf(Object),
  openMenuOnFocus: PropTypes.bool,
  breakout: PropTypes.bool,
  hasDividersInsteadOfHeaders: PropTypes.bool,
  isClearable: PropTypes.bool,
  maxMenuHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onLoadData: PropTypes.func,
  onInputChange: PropTypes.func,
  menuPlacement: PropTypes.string,
  ariaLabel: PropTypes.string,
};

/**
 * Wrapper component around
 */
function DropdownAsync({
  id,
  displayAuto,
  width,
  validationMessage,
  isV4Design,
  caption,
  required,
  legacyClass,
  isMobile,
  placeholder,
  disabled,
  options,
  value,
  onChange,
  hasValidation,
  dropdownStyle = 'single',
  onMenuOpen = null,
  style = {},
  background,
  isMultiSelect = false,
  onBlur = null,
  isCreateable = false,
  isSearchable = true,
  onCreate = null,
  actionButtonText = null,
  onActionButtonClick = null,
  isPortal,
  forwardRef,
  openMenuOnFocus = false,
  breakout = false,
  hasDividersInsteadOfHeaders = false,
  isClearable = false,
  maxMenuHeight,
  onLoadData,
  onInputChange,
  menuPlacement = 'auto',
  ariaLabel,
}) {
  const theme = useTheme();
  const currentTheme = !theme || !theme.content ? lightTheme : theme;

  const ACTION_BUTTON = '__action-button__';
  const [focused, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isValid, setIsValid] = useState(!validationMessage);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setIsValid(!validationMessage);
  }, [validationMessage]);

  const colourStyles = {
    background: currentTheme.background.primary,
    color: currentTheme.content.primary,
    container: (styles) => ({
      ...styles,
      border: 'none',
      outline: 'none',
      height: 'auto',
    }),
    control: (styles, { isFocused, isSelected }) => {
      let borderColor = currentTheme.content.border;
      if (isFocused || isSelected) borderColor = currentTheme.content.secondary;
      if (!isValid) borderColor = currentTheme.negative.secondary;

      let backgroundColor = disabled ? currentTheme.background.page : currentTheme.background.primary;
      if (isV4Design) backgroundColor = currentTheme.background.primary;
      return {
        ...styles,
        backgroundColor,
        color: disabled ? colors['grey-light'] : currentTheme.content.primary,
        border: `1px solid  ${isValid ? borderColor : currentTheme.negative.secondary}`,
        borderRadius: `${isV4Design ? '2px' : '1px'}`,
        outline: 'none',
        boxShadow: null,
        minHeight: null,
        height: 32,
        ':hover': {
          ...styles[':hover'],
          // eslint-disable-next-line no-nested-ternary
          borderColor: !isValid
            ? currentTheme.negative.secondary
            : isFocused || isSelected
              ? currentTheme.content.secondary
              : currentTheme.content.primary,
        },
      };
    },
    valueContainer: (styles) => ({ ...styles, padding: '0px 8px' }),
    input: (styles) => ({ ...styles, height: 'auto', margin: 0, padding: 0 }),
    placeholder: (styles) => ({
      ...styles,
      color: colors['grey-dark'],
      opacity: 0.6,
    }),
    option: (styles, { isFocused, isSelected }) => {
      let backgroundColor = currentTheme.background.primary;
      let color = currentTheme.content.emphasize;
      if (isSelected) {
        backgroundColor = colors['grey-lighter'];
        color = colors.white;
        if (isV4Design) {
          backgroundColor = colors['grey-lightest'];
          color = colors.blue;
        }
      } else if (isFocused) {
        backgroundColor = colors['grey-lighter'];
        if (isV4Design) {
          backgroundColor = colors['grey-lightest'];
          color = colors.blue;
        }
      }

      return {
        ...styles,
        backgroundColor,
        color,
        cursor: 'pointer',
        padding: 8,
        ':active': {
          ...styles[':active'],
          backgroundColor: colors['grey-lighter'],
          color: lightTheme.content.primary,
        },
      };
    },
    singleValue: (styles) => ({
      ...styles,
      color: `${currentTheme.content.primary}${disabled ? '80' : 'FF'}`,

      //    backgroundColor: disabled ? colors['grey-lighter'] : null,
    }),
    menu: (styles) => ({
      ...styles,
      //  backgroundColor: disabled ? colors['grey-lighter'] : lightTheme.background.primary,
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px 0px',
      borderRadius: '0px 0px 4px 4px',
      zIndex: '9999',
      width: breakout ? 'auto' : '100%',
    }),
    menuList: (styles) => ({
      ...styles,
      //    backgroundColor: lightTheme.background.primary,
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px 0px',
      borderRadius: '0px 0px 4px 4px',
      //    position:'absolute'
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      color: currentTheme.content.emphasize,
      backgroundColor: colors[`${data.colour || 'blue'}-light`],
      borderRadius: '16px',
      margin: '9px 2px',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      padding: '0px 4px',
      maxWidth: '100%',
      display: 'inline-flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      color: currentTheme.content.emphasize,
      lineHeight: '16px',
      fontWeight: '600',
      borderRight: '1px solid white',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: currentTheme.content.emphasize,
      borderRadius: '0px 16px 16px 0px',
      ':hover': {
        backgroundColor: colors[`${data.colour}-dark`],
        color: 'white',
      },
    }),
    group: (styles) => ({
      ...styles,
      paddingTop: hasDividersInsteadOfHeaders ? '0px' : '8px',
      paddingBottom: hasDividersInsteadOfHeaders ? '0px' : '8px',
    }),
    groupHeading: (styles) => ({
      ...styles,
      color: currentTheme.content.subtle,
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      padding: 0,
      paddingRight: 8,
    }),
    menuPortal: (styles) => ({
      ...styles,
      zIndex: '9999',
    }),
    clearIndicator: (styles) => ({
      ...styles,
      padding: 0,
      paddingRight: 8,
    }),
  };

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta && actionMeta.option && actionMeta.option.value === ACTION_BUTTON) {
      return;
    }
    if (isCreateable) {
      if (actionMeta?.action === 'create-option') {
        if (onCreate) {
          onCreate(actionMeta.option.value);
        }
      } else if (onChange) {
        onChange(newValue);
      }
    } else if (onChange) {
      onChange(newValue);
    }

    setCurrentValue(newValue);
    if (!touched) setTouched(true);
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
    if (onBlur) onBlur();
    if (!touched) setTouched(true);
  };

  const getOptionLabelHeader = (option, meta) => {
    if (meta.inputValue) {
      const cleanInput = meta.inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let regex = new RegExp(`(.*)(${cleanInput.trim()})(.*)`, 'i');
      let result = option.label.match(regex);

      if (result === null && meta.inputValue.length > 1) {
        regex = new RegExp(
          `(.*)(${meta.inputValue
            .substr(0, meta.inputValue.length - 1)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.${meta.inputValue[meta.inputValue.length - 1].replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&',
          )})(.*)`,
          'i',
        );
        result = option.label.match(regex);
      }

      if (result === null) {
        return <span id={`${id}-option-label-${option.value}`}>{option.label}</span>;
      }

      return (
        <span id={`${id}-option-label-${option.value}`}>
          <span style={{ visibility: 'hidden', position: 'absolute' }}>{option.label}</span>
          {result[1]}
          <b>{result[2]}</b>
          {result[3]}
        </span>
      );
    }

    return <span id={`${id}-option-label-${option.value}`}>{option.label}</span>;
  };

  const getOptionsLabelStyle = (option, meta) => {
    if (option === null) return null;
    if (option.value === ACTION_BUTTON) {
      return (
        <s.ButtonOption>
          <Button
            id={`${id}-dropdown-action-button`}
            value={actionButtonText}
            onClick={onActionButtonClick}
            buttonStyle='link'
            style={{ textAlign: 'right', width: '100%' }}
          />
        </s.ButtonOption>
      );
    }

    if (dropdownStyle === 'single') {
      return (
        <s.MultiOption>
          <s.MultiOptionHeader>{getOptionLabelHeader(option, meta)}</s.MultiOptionHeader>
        </s.MultiOption>
      );
    }

    if (dropdownStyle === 'icon') {
      return (
        <s.IconOption>
          {option.icon && <SvgIcon id={`${id}-option-icon-${option.value}`} name={option.icon} size={12} />}
          {getOptionLabelHeader(option, meta)}
        </s.IconOption>
      );
    }

    if (dropdownStyle === 'multi' && meta.context === 'menu') {
      return (
        <s.MultiOption>
          <s.MultiOptionHeader>{getOptionLabelHeader(option, meta)}</s.MultiOptionHeader>
          {option.lines?.map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <s.MultiOptionLine key={`${option.label}-${index}`} id={`${id}-option-label-${option.label}-${index}`}>
              {line}
            </s.MultiOptionLine>
          ))}
        </s.MultiOption>
      );
    }

    if (dropdownStyle === 'multi-icon') {
      if (meta.context === 'value' || !option.lines || option.lines.length === 0) {
        return (
          <s.IconOption>
            {option.icon && <SvgIcon id={`${id}-option-icon-${option.value}`} name={option.icon} size={12} />}
            {getOptionLabelHeader(option, meta)}
          </s.IconOption>
        );
      }
      return (
        <s.MultiOptionIcon>
          <s.MultiOptionHeader>
            <SvgIcon id={`${id}-option-icon-${option.value}`} name={option.icon} size={12} />
            {getOptionLabelHeader(option, meta)}
          </s.MultiOptionHeader>
          <s.MultiOptionIconLines>
            {option.lines?.map((line, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <s.MultiOptionLine key={`${option.label}-${index}`} id={`${id}-option-label-${option.label}-${index}`}>
                {line}
              </s.MultiOptionLine>
            ))}
          </s.MultiOptionIconLines>
        </s.MultiOptionIcon>
      );
    }
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  function GroupHeading(headingProps) {
    const { data } = headingProps;
    if (data.icon) {
      return (
        <s.IconHeader>
          <SvgIcon name={data.icon} size={10} style={{ marginBottom: 6 }} />
          <components.GroupHeading {...headingProps} />
        </s.IconHeader>
      );
    }
    if (hasDividersInsteadOfHeaders) {
      return (
        <s.DividerHeader>
          <components.GroupHeading {...headingProps} />
        </s.DividerHeader>
      );
    }
    return <components.GroupHeading {...headingProps} />;
  }

  const filterOption = (option, inputValue) => {
    if (!inputValue) return true;
    const cleanInput = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(cleanInput.trim(), 'i');
    const matches = option.label.toString().match(regex);

    return matches !== null && matches.length > 0;
  };

  const loadOptions = (inputValue) => onLoadData(inputValue);

  return (
    <s.ContainerWrapper
      displayAuto={displayAuto}
      width={width}
      isValid={isValid}
      hasValidation={hasValidation}
      isV4Design={isV4Design}
      aria-labelledby={caption ? `${id}-dropdown-caption-Caption` : ''}
      disabled={disabled}
      style={style}
    >
      {caption && (
        <Caption
          id={`${id}-dropdown-caption`}
          required={required}
          label={caption}
          legacyClass={legacyClass}
          isV4Design={isV4Design}
          isMobile={isMobile}
          float={Boolean(placeholder) || Boolean(currentValue) || focused}
          elFor={`${id}-Input`}
          isValid={isValid}
          disabled={disabled}
          background={background}
          focused={focused}
        />
      )}
      <AsyncSelect
        aria-labelledby={caption ? `${id}-dropdown-caption` : null}
        aria-label={!caption ? ariaLabel : null}
        id={`${id}-dropdown-list`}
        name={`${id}-dropdown-list`}
        inputId={`${id}-dropdown-list-input`}
        instanceId={`${id}-dropdown-list`}
        components={{ GroupHeading, IndicatorSeparator: () => null }}
        options={options || []}
        styles={colourStyles}
        onChange={handleChange}
        formatOptionLabel={getOptionsLabelStyle}
        value={currentValue}
        menuPlacement={menuPlacement}
        isDisabled={disabled}
        placeholder={placeholder ?? null}
        onMenuOpen={onMenuOpen}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isMulti={isMultiSelect}
        isClearable={isClearable}
        menuPortalTarget={isPortal ? document.body : null}
        ref={forwardRef}
        openMenuOnFocus={openMenuOnFocus}
        filterOption={filterOption}
        maxMenuHeight={maxMenuHeight}
        onInputChange={onInputChange}
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions
        isSearchable={isSearchable}
      />
      <ValidationMessage id={`${id}-input-validation`} message={validationMessage} isV4Design={isV4Design} />
    </s.ContainerWrapper>
  );
}

DropdownAsync.propTypes = propTypes;
export default DropdownAsync;
