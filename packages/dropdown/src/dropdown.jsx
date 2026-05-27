/* eslint-disable react/no-array-index-key */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useTheme } from '@mui/material';
import { colors, lightTheme } from '@m-next/styles';
import Caption from '@m-next/caption';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import { ValidationMessage } from '@m-next/validation';
import LoadingSkeleton from '@m-next/loading-skeleton';
import * as s from './dropdown.styles';
import CustomMultiValueRemove from './CustomMultiValueRemove';

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
        secondary: PropTypes.string,
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        secondary: PropTypes.string,
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        icon: PropTypes.string,
        color: PropTypes.string,
        size: PropTypes.number,
        secondary: PropTypes.string,
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        lines: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        icon: PropTypes.string,
        color: PropTypes.string,
        size: PropTypes.number,
        secondary: PropTypes.string,
      }),
    ]),
  ),
  value: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  hasValidation: PropTypes.bool,
  dropdownStyle: PropTypes.oneOf(['single', 'icon', 'multi', 'multi-icon']),
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
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
  isLoading: PropTypes.bool,
  hasDividersInsteadOfHeaders: PropTypes.bool,
  isClearable: PropTypes.bool,
  maxMenuHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onInputChange: PropTypes.func,
  menuPlacement: PropTypes.oneOf(['auto', 'bottom', 'top']),
  ariaLabel: PropTypes.string,
  open: PropTypes.bool,
  menuIsOpen: PropTypes.bool,
  autoFocus: PropTypes.bool,
  clearOnSelect: PropTypes.bool,
  formatCreateLabel: PropTypes.func,
  disableSearchHighlight: PropTypes.bool,
  menuMinWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hideBorderWhenNotActive: PropTypes.bool,
  onMenuScrollToBottom: PropTypes.func,
  filterOption: PropTypes.func,
};
/**
 * Wrapper component around
 */
function Dropdown({
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
  onMenuClose = null,
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
  isLoading = false,
  hasDividersInsteadOfHeaders = false,
  isClearable = false,
  maxMenuHeight,
  onInputChange,
  menuPlacement = 'auto',
  ariaLabel,
  open = false,
  menuIsOpen,
  autoFocus = false,
  clearOnSelect = false,
  formatCreateLabel,
  disableSearchHighlight = false,
  menuMinWidth,
  hideBorderWhenNotActive = false,
  onMenuScrollToBottom,
  filterOption: filterOptionProp,
}) {
  const theme = useTheme();
  const currentTheme = !theme || !theme.content ? lightTheme : theme;

  const ACTION_BUTTON = '__action-button__';
  const [focused, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isValid, setIsValid] = useState(!validationMessage);

  const focusRef = useRef(null);

  // Dynamically decide which ref to use
  const selectRef = forwardRef || focusRef;

  useEffect(() => {
    if (autoFocus && selectRef.current) {
      selectRef.current.focus();
    }
  }, [autoFocus, selectRef]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setIsValid(!validationMessage);
  }, [validationMessage]);

  const internalOptions = useMemo(() => {
    if (actionButtonText) {
      const updated = [...options];
      updated.unshift({
        value: ACTION_BUTTON,
        label: actionButtonText,
      });
      return updated;
    }
    return options;
  }, [options, actionButtonText]);

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

      // if hideBorderWhenNotActive is true then hide border unless focused, hovered, or invalid
      if (hideBorderWhenNotActive && !isFocused && !isSelected && isValid) {
        borderColor = 'transparent';
      }

      let backgroundColor = disabled ? currentTheme.background.page : currentTheme.background.primary;
      if (isV4Design) backgroundColor = currentTheme.background.primary;
      return {
        ...styles,
        backgroundColor,
        color: disabled ? colors['grey-light'] : currentTheme.content.primary,
        border: `1px solid  ${isValid ? borderColor : currentTheme.negative.secondary}`,
        borderRadius: `${isV4Design ? '4px' : '1px'}`,
        outline: 'none',
        boxShadow: null,
        minHeight: isMultiSelect ? 32 : null,
        height: isMultiSelect ? 'fit-content' : 32,
        ':hover': {
          ...styles[':hover'],
          // eslint-disable-next-line no-nested-ternary
          borderColor: !isValid
            ? currentTheme.negative.secondary
            : isFocused || isSelected
              ? currentTheme.content.secondary
              : currentTheme.content.primary,
          cursor: disabled ? 'not-allowed' : 'pointer',
        },
      };
    },
    valueContainer: (styles) => ({ ...styles, padding: '0px 8px' }),
    input: (styles) => ({ ...styles, height: '32px', margin: 0, padding: 0 }),
    option: (styles, { isFocused, isSelected, data }) => {
      let backgroundColor = currentTheme.background.primary;
      let color = currentTheme.content.emphasize;
      const isCreateOption = data?.__isNew__;

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

      // Apply distinct styling for create option in CreatableSelect
      if (isCreateOption) {
        color = colors.blue;
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
          color: isCreateOption ? colors.blue : lightTheme.content.primary,
        },
      };
    },
    singleValue: (styles) => ({
      ...styles,
      color: `${currentTheme.content.primary}${disabled ? '80' : 'FF'}`,
      lineHeight: '18px',
      marginLeft: 0,
      //    backgroundColor: disabled ? colors['grey-lighter'] : null,
    }),
    menu: (styles) => ({
      ...styles,
      //  backgroundColor: disabled ? colors['grey-lighter'] : lightTheme.background.primary,
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px 0px',
      borderRadius: 4,
      zIndex: '99999',
      width: breakout ? 'auto' : '100%',
      marginTop: 4,
      minWidth: menuMinWidth,
    }),
    menuList: (styles) => ({
      ...styles,
      //    backgroundColor: lightTheme.background.primary,
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px 0px',
      borderRadius: 4,
      //    position:'absolute'
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      color: currentTheme.content.emphasize,
      backgroundColor: colors[`${data.colour || 'blue'}-light`],
      borderRadius: '16px',
      margin: '9px 2px',
    }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      padding: `${isMobile ? '0px 8px' : '0px 6px'} !important`,
      maxWidth: '100%',
      display: 'inline-flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      color: currentTheme.content.emphasize,
      lineHeight: isMobile ? '24px' : '16px',
      fontSize: isMobile ? '14px' : '12px',
      fontWeight: '600',
      borderRight: data?.isFixed !== true && '1px solid white',
      opacity: disabled ? 0.5 : 1,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      display: data?.isFixed ? 'none' : undefined,
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
    placeholder: (styles) => ({
      ...styles,
      color: colors['grey-dark'],
      opacity: 0.6,
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

    if (clearOnSelect) {
      setCurrentValue(null);
    } else {
      setCurrentValue(newValue);
    }
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
    if (!option.label) return;
    const shouldHighlight = meta.inputValue && (meta.context === 'menu' || !disableSearchHighlight);
    if (shouldHighlight) {
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
        if (option.secondary) {
          return (
            <s.SecondaryOption id={`${id}-option-label-${option.value}`}>
              <span>{option.label}</span>
              <s.SecondaryLabel>{option.secondary}</s.SecondaryLabel>
            </s.SecondaryOption>
          );
        }
        return <span id={`${id}-option-label-${option.value}`}>{option.label}</span>;
      }

      if (option.secondary) {
        return (
          <s.SecondaryOption id={`${id}-option-label-${option.value}`}>
            <span style={{ visibility: 'hidden', position: 'absolute' }}>{option.label}</span>
            {result[1]}
            <b>{result[2]}</b>
            {result[3]}
            <s.SecondaryLabel>{option.secondary}</s.SecondaryLabel>
          </s.SecondaryOption>
        );
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

    if (option.secondary) {
      return (
        <s.SecondaryOption id={`${id}-option-label-${option.value}`}>
          <span>{option.label}</span>
          <s.SecondaryLabel>{option.secondary}</s.SecondaryLabel>
        </s.SecondaryOption>
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

    if (
      dropdownStyle === 'single' ||
      (dropdownStyle === 'multi' && (meta.context === 'value' || !option.lines || option.lines.length === 0))
    ) {
      return (
        <s.SingleOption>
          <s.OptionHeader>{getOptionLabelHeader(option, meta)}</s.OptionHeader>
        </s.SingleOption>
      );
    }

    if (dropdownStyle === 'icon') {
      return (
        <s.IconOption>
          {option.icon &&
            (option.icon !== 'square' ? (
              <SvgIcon
                id={`${id}-option-icon-${option.value}`}
                name={option.icon}
                color={option.color || 'currentColor'}
                size={option.size || 12}
              />
            ) : (
              <s.Square color={option.color || 'currentColor'} size={option.size || 12} />
            ))}
          {getOptionLabelHeader(option, meta)}
        </s.IconOption>
      );
    }

    if (dropdownStyle === 'multi' && meta.context === 'menu') {
      return (
        <s.MultiOption>
          <s.MultiOptionHeader>{getOptionLabelHeader(option, meta)}</s.MultiOptionHeader>
          <s.MultiOptionLines>
            {option.lines?.map((line, index) => (
              <s.MultiOptionLine key={`${option.label}-${index}`} id={`${id}-option-label-${option.label}-${index}`}>
                {line}
              </s.MultiOptionLine>
            ))}
          </s.MultiOptionLines>
        </s.MultiOption>
      );
    }

    if (dropdownStyle === 'multi-icon') {
      if (meta.context === 'value' || !option.lines || option.lines.length === 0) {
        return (
          <s.IconOption>
            {option.icon && (
              <SvgIcon
                id={`${id}-option-icon-${option.value}`}
                name={option.icon}
                color={option.color || 'currentColor'}
                size={option.size || 12}
              />
            )}
            {getOptionLabelHeader(option, meta)}
          </s.IconOption>
        );
      }
      return (
        <s.MultiOptionIcon>
          <s.MultiOptionHeader>
            <SvgIcon
              id={`${id}-option-icon-${option.value}`}
              name={option.icon}
              color={option.color || 'currentColor'}
              size={option.size || 12}
            />
            {getOptionLabelHeader(option, meta)}
          </s.MultiOptionHeader>
          <s.MultiOptionIconLines>
            {option.lines?.map((line, index) => (
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
    const { data, id: headerId } = headingProps;
    if (data.icon) {
      return (
        <s.IconHeader>
          <SvgIcon
            name={data.icon}
            color={data.color || 'currentColor'}
            size={data.size || 10}
            style={{ marginBottom: 6 }}
          />
          <components.GroupHeading {...headingProps} />
        </s.IconHeader>
      );
    }
    if (hasDividersInsteadOfHeaders) {
      if (headerId.includes('group-0-heading')) {
        return null;
      }
      return (
        <s.DividerHeader>
          <components.GroupHeading {...headingProps} />
        </s.DividerHeader>
      );
    }
    return <components.GroupHeading {...headingProps} />;
  }

  const defaultFilterOption = (option, inputValue) => {
    if (!inputValue) return true;
    const cleanInput = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(cleanInput.trim(), 'i');
    const matches = option.label.toString().match(regex);
    const valueMatches = option.value != null ? option.value.toString().match(regex) : null;

    return matches || valueMatches;
  };

  const filterOption = filterOptionProp || defaultFilterOption;

  return (
    <s.ContainerWrapper
      displayAuto={displayAuto}
      width={width}
      isValid={isValid}
      hasValidation={hasValidation}
      isV4Design={isV4Design}
      aria-labelledby={caption ? `${id}-dropdown-caption-Caption` : ''}
      disabled={disabled}
      style={{ ...style, opacity: disabled ? 0.5 : 1 }}
      data-testid={`${id}-dropdown-list${isCreateable ? '-creatable' : ''}`}
    >
      {((!isV4Design && caption) || (isV4Design && !isLoading && caption)) && (
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
          style={{ opacity: disabled ? 0.5 : 1 }}
        />
      )}
      {isLoading && (
        <div data-testid='loading-skeleton'>
          <LoadingSkeleton count={1} height='36px' />
        </div>
      )}
      {!isLoading && !isCreateable && (
        <Select
          aria-labelledby={caption ? `${id}-dropdown-caption` : null}
          aria-label={!caption ? ariaLabel : null}
          id={`${id}-dropdown-list`}
          name={`${id}-dropdown-list`}
          inputId={`${id}-dropdown-list-input`}
          instanceId={`${id}-dropdown-list`}
          components={{
            GroupHeading,
            IndicatorSeparator: () => null,
            MultiValueRemove: CustomMultiValueRemove,
          }}
          options={internalOptions || []}
          styles={colourStyles}
          onChange={handleChange}
          formatOptionLabel={getOptionsLabelStyle}
          value={currentValue}
          menuPlacement={menuPlacement}
          isDisabled={disabled}
          placeholder={placeholder ?? null}
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isMulti={isMultiSelect}
          closeMenuOnSelect={!isMultiSelect}
          blurInputOnSelect={!isMultiSelect}
          isClearable={isClearable}
          menuPortalTarget={isPortal ? document.body : null}
          ref={selectRef}
          openMenuOnFocus={openMenuOnFocus}
          filterOption={filterOption}
          maxMenuHeight={maxMenuHeight}
          onInputChange={onInputChange}
          menuShouldScrollIntoView={false}
          isSearchable={isSearchable}
          menuIsOpen={menuIsOpen}
          defaultMenuIsOpen={open ? true : undefined}
          onMenuScrollToBottom={onMenuScrollToBottom}
        />
      )}
      {!isLoading && isCreateable && (
        <CreatableSelect
          aria-labelledby={caption ? `${id}-dropdown-caption` : null}
          aria-label={!caption ? ariaLabel : null}
          id={`${id}-dropdown-list`}
          name={`${id}-dropdown-list`}
          inputId={`${id}-dropdown-list-input`}
          instanceId={`${id}-dropdown-list`}
          components={{
            GroupHeading,
            IndicatorSeparator: () => null,
            CustomMultiValueRemove,
          }}
          options={internalOptions}
          styles={colourStyles}
          onChange={handleChange}
          formatOptionLabel={getOptionsLabelStyle}
          value={currentValue}
          menuPlacement={menuPlacement}
          isDisabled={disabled}
          placeholder={placeholder}
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isMulti={isMultiSelect}
          closeMenuOnSelect={!isMultiSelect}
          blurInputOnSelect={!isMultiSelect}
          isClearable={isClearable}
          isSearchable={isSearchable}
          menuPortalTarget={isPortal ? document.body : null}
          ref={selectRef}
          openMenuOnFocus={openMenuOnFocus}
          filterOption={filterOption}
          onInputChange={onInputChange}
          menuShouldScrollIntoView={false}
          menuIsOpen={menuIsOpen}
          defaultMenuIsOpen={open ? true : undefined}
          formatCreateLabel={formatCreateLabel}
          onMenuScrollToBottom={onMenuScrollToBottom}
        />
      )}
      <ValidationMessage id={`${id}-input-validation`} message={validationMessage} isV4Design={isV4Design} />
    </s.ContainerWrapper>
  );
}

Dropdown.propTypes = propTypes;
export default Dropdown;
