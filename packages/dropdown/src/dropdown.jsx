/* eslint-disable react/no-array-index-key */
import React, { useState, useMemo, useEffect, useRef, forwardRef } from 'react';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useTheme } from '@mui/material';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';
import Caption from '@m-next/caption';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import { ValidationMessage } from '@m-next/validation';
import LoadingSkeleton from '@m-next/loading-skeleton';
import * as s from './dropdown.styles';
import CustomMultiValueRemove from './CustomMultiValueRemove';

// One-time deprecation warner — fires once per key, mirrors @m-next/button.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const ACTION_BUTTON = '__action-button__';

// Map a colour-family name on a multi-value option to the legacy "{family}-light" / "-dark" shades.
// Keeps prior runtime behavior — options use { colour: 'blue' | 'green' | ... } and we resolve token shades.
const familyShade = (family, shade) => {
  if (!family) return undefined;
  const palette = colors[family];
  if (palette && typeof palette === 'object') return palette[shade];
  return undefined;
};

const Dropdown = forwardRef(function Dropdown(props, ref) {
  const {
    id: idProp,
    width,
    required,
    placeholder,
    disabled,
    options,
    value,
    onChange,
    onBlur = null,
    onMenuOpen = null,
    onMenuClose = null,
    style = {},
    isMultiSelect = false,
    isSearchable = true,
    onCreate = null,
    actionButtonText = null,
    onActionButtonClick = null,
    isPortal,
    openMenuOnFocus = false,
    breakout = false,
    isLoading = false,
    hasDividersInsteadOfHeaders = false,
    isClearable = false,
    maxMenuHeight,
    onInputChange,
    menuPlacement = 'auto',
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
    hasValidation,

    // Clean API
    label: labelProp,
    variant: variantProp,
    errorMessage: errorMessageProp,
    isCreatable: isCreatableProp,

    // Standard ARIA pass-through
    'aria-label': ariaLabel,

    // Soft-shimmed legacy props
    caption,
    dropdownStyle,
    validationMessage,
    isCreateable,
    forwardRef: legacyForwardRef,
    ariaLabel: legacyAriaLabel,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    background: _background,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-dropdown-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (caption !== undefined && label === undefined) {
    warnOnce('dropdown-caption', '@m-next/dropdown: `caption` is deprecated. Use `label`.');
    label = caption;
  }

  let variant = variantProp;
  if (dropdownStyle !== undefined && variant === undefined) {
    warnOnce(
      'dropdown-dropdownStyle',
      '@m-next/dropdown: `dropdownStyle` is deprecated. Use `variant` (\'single\' | \'icon\' | \'multi\' | \'multi-icon\').',
    );
    variant = dropdownStyle;
  }
  if (variant == null) variant = 'single';

  let errorMessage = errorMessageProp;
  if (validationMessage != null && errorMessage == null) {
    warnOnce(
      'dropdown-validationMessage',
      '@m-next/dropdown: `validationMessage` is deprecated. Use `errorMessage`.',
    );
    errorMessage = validationMessage;
  }

  let isCreatable = isCreatableProp;
  if (isCreateable !== undefined && isCreatable === undefined) {
    warnOnce(
      'dropdown-isCreateable',
      '@m-next/dropdown: `isCreateable` is deprecated (typo). Use `isCreatable`.',
    );
    isCreatable = isCreateable;
  }
  if (isCreatable == null) isCreatable = false;

  let resolvedAriaLabel = ariaLabel;
  if (legacyAriaLabel && !resolvedAriaLabel) {
    warnOnce(
      'dropdown-ariaLabel',
      '@m-next/dropdown: `ariaLabel` is deprecated. Use `aria-label` (standard React attr).',
    );
    resolvedAriaLabel = legacyAriaLabel;
  }

  if (legacyForwardRef) {
    warnOnce(
      'dropdown-forwardRef-prop',
      '@m-next/dropdown: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ State ============

  const theme = useTheme();
  const currentTheme = !theme || !theme.content ? lightTheme : theme;

  const [focused, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isValid, setIsValid] = useState(!errorMessage);

  const focusRef = useRef(null);

  // Dynamically decide which ref to use: forwardRef API > legacy forwardRef prop > internal.
  const selectRef = ref || legacyForwardRef || focusRef;

  useEffect(() => {
    if (autoFocus && selectRef.current) {
      selectRef.current.focus();
    }
  }, [autoFocus, selectRef]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setIsValid(!errorMessage);
  }, [errorMessage]);

  const internalOptions = useMemo(() => {
    if (actionButtonText) {
      const updated = [...(options || [])];
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

      const backgroundColor = disabled ? currentTheme.background.page : currentTheme.background.primary;
      return {
        ...styles,
        backgroundColor,
        color: disabled ? colors.grey.light : currentTheme.content.primary,
        border: `1px solid  ${isValid ? borderColor : currentTheme.negative.secondary}`,
        borderRadius: '4px',
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
        backgroundColor = colors.grey.lighter;
        color = colors.blue.base;
      } else if (isFocused) {
        backgroundColor = colors.grey.lighter;
        color = colors.blue.base;
      }

      // Apply distinct styling for create option in CreatableSelect
      if (isCreateOption) {
        color = colors.blue.base;
      }

      return {
        ...styles,
        backgroundColor,
        color,
        cursor: 'pointer',
        padding: 8,
        ':active': {
          ...styles[':active'],
          backgroundColor: colors.grey.lighter,
          color: isCreateOption ? colors.blue.base : lightTheme.content.primary,
        },
      };
    },
    singleValue: (styles) => ({
      ...styles,
      color: `${currentTheme.content.primary}${disabled ? '80' : 'FF'}`,
      lineHeight: '18px',
      marginLeft: 0,
    }),
    menu: (styles) => ({
      ...styles,
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px 0px',
      borderRadius: 4,
      zIndex: '99999',
      width: breakout ? 'auto' : '100%',
      marginTop: 4,
      minWidth: menuMinWidth,
    }),
    menuList: (styles) => ({
      ...styles,
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px 0px',
      borderRadius: 4,
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      color: currentTheme.content.emphasize,
      backgroundColor: familyShade(data.colour || 'blue', 'light') || colors.blue.light,
      borderRadius: '16px',
      margin: '9px 2px',
    }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      padding: '0px 6px !important',
      maxWidth: '100%',
      display: 'inline-flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      color: currentTheme.content.emphasize,
      lineHeight: '16px',
      fontSize: '12px',
      fontWeight: '600',
      borderRight: data?.isFixed !== true && `1px solid ${colors.white}`,
      opacity: disabled ? 0.5 : 1,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      display: data?.isFixed ? 'none' : undefined,
      color: currentTheme.content.emphasize,
      borderRadius: '0px 16px 16px 0px',
      ':hover': {
        backgroundColor: familyShade(data.colour, 'dark') || colors.blue.dark,
        color: colors.white,
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
      color: colors.grey.dark,
      opacity: 0.6,
    }),
  };

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta && actionMeta.option && actionMeta.option.value === ACTION_BUTTON) {
      return;
    }
    if (isCreatable) {
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
            onClick={onActionButtonClick}
            variant='link'
            style={{ textAlign: 'right', width: '100%' }}
          >
            {actionButtonText}
          </Button>
        </s.ButtonOption>
      );
    }

    if (
      variant === 'single' ||
      (variant === 'multi' && (meta.context === 'value' || !option.lines || option.lines.length === 0))
    ) {
      return (
        <s.SingleOption>
          <s.OptionHeader>{getOptionLabelHeader(option, meta)}</s.OptionHeader>
        </s.SingleOption>
      );
    }

    if (variant === 'icon') {
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

    if (variant === 'multi' && meta.context === 'menu') {
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

    if (variant === 'multi-icon') {
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
      width={width}
      isValid={isValid}
      hasValidation={hasValidation}
      aria-labelledby={label ? `${id}-dropdown-caption-Caption` : ''}
      disabled={disabled}
      style={{ ...style, opacity: disabled ? 0.5 : 1 }}
      data-testid={`${id}-dropdown-list${isCreatable ? '-creatable' : ''}`}
    >
      {!isLoading && label && (
        <Caption
          id={`${id}-dropdown-caption`}
          required={required}
          label={label}
          isV4Design
          float={Boolean(placeholder) || Boolean(currentValue) || focused}
          elFor={`${id}-Input`}
          isValid={isValid}
          disabled={disabled}
          focused={focused}
          style={{ opacity: disabled ? 0.5 : 1 }}
        />
      )}
      {isLoading && (
        <div data-testid='loading-skeleton'>
          <LoadingSkeleton count={1} height='36px' />
        </div>
      )}
      {!isLoading && !isCreatable && (
        <Select
          aria-labelledby={label ? `${id}-dropdown-caption` : null}
          aria-label={!label ? resolvedAriaLabel : null}
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
      {!isLoading && isCreatable && (
        <CreatableSelect
          aria-labelledby={label ? `${id}-dropdown-caption` : null}
          aria-label={!label ? resolvedAriaLabel : null}
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
      <ValidationMessage id={`${id}-input-validation`} message={errorMessage} isV4Design />
    </s.ContainerWrapper>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
