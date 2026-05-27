// vendors
import React, { useState, useEffect, useRef, useMemo, Fragment, forwardRef } from 'react';
import { colors } from '@m-next/tokens';
import { convertClass } from '@m-next/styles';

// components
import Caption from '@m-next/caption';
import RadioButton from './RadioButton';
import * as s from './RadioButton.styles';
import warnOnce from './_warnOnce';

let autoIdCounter = 0;

const RadioGroup = forwardRef(function RadioGroup(props, ref) {
  const {
    id: idProp,
    name,
    options = [],
    onChange,
    disabled,
    isFocused = false,
    selectedValue,
    direction = 'column',
    widthType = 'auto',
    width = 'auto',
    labelledBy = null,
    style = null,
    className = null,
    wrapperStyle = null,
    narrow = false,
    labelStyle,
    bold,
    gap = 16,
    minWidth = null,
    allowWrap = true,

    // Accessible name — accept both `label` and the legacy `caption`.
    label: labelProp,

    // Color / font tokens — modern names + legacy soft-shims.
    color: colorProp,
    fontSize: fontSizeProp,

    // Standard ARIA pass-through (in addition to `labelledBy`).
    'aria-label': ariaLabelAttr,
    'aria-labelledby': ariaLabelledByAttr,

    // Soft-shimmed legacy props
    caption: legacyCaption,
    customColor: legacyCustomColor,
    customFontSize: legacyCustomFontSize,
    legacyClass: legacyClassProp,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    isRuntime: _isRuntime,
    hideCaption: _hideCaption,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    controlId: _controlId,
  } = props;

  // ============ Auto-generate id if not provided ============
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-radio-group-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyCaption != null && label == null) {
    warnOnce(
      'radio-group-caption',
      '@m-next/radio-button RadioGroup: `caption` is deprecated. Use `label`.',
    );
    label = legacyCaption;
  }

  let color = colorProp;
  if (legacyCustomColor != null && color == null) {
    warnOnce(
      'radio-group-customColor',
      '@m-next/radio-button RadioGroup: `customColor` is deprecated. Use `color`.',
    );
    color = legacyCustomColor;
  }
  if (color == null) color = colors.blue.base;

  let fontSize = fontSizeProp;
  if (legacyCustomFontSize != null && fontSize == null) {
    warnOnce(
      'radio-group-customFontSize',
      '@m-next/radio-button RadioGroup: `customFontSize` is deprecated. Use `fontSize`.',
    );
    fontSize = legacyCustomFontSize;
  }

  if (legacyClassProp != null) {
    warnOnce(
      'radio-group-legacyClass',
      '@m-next/radio-button RadioGroup: `legacyClass` is deprecated. Use `className` / `style`.',
    );
  }

  if (legacyForwardRef) {
    warnOnce(
      'radio-group-forwardRef-prop',
      '@m-next/radio-button RadioGroup: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  const rootRef = useRef(null);
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(rootRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = rootRef.current;
    }
  }, [ref, legacyForwardRef]);

  // ============ Local state ============

  const [noRadioSelected, setNoRadioSelected] = useState(false);
  // rightAlign was driven by reading getComputedStyle on the legacy non-V4
  // root — V4 styling is always on now, so this branch never fires. Kept
  // as a const for the style props that still reference it.
  const rightAlign = false;

  useEffect(() => {
    if (!noRadioSelected && options) {
      const radioSelected = options.some((option) => selectedValue === option.value);
      if (!radioSelected) setNoRadioSelected(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (e) => {
    if (!onChange) return;
    // The DOM input `name` is `${name}-${id}` for uniqueness across multiple
    // groups, but consumers/form managers expect the bare `name`. Rebuild
    // the event with the consumer-facing name.
    const target = {
      name,
      value: e.target.value,
      checked: e.target.checked,
    };
    const formEvent = { target, currentTarget: target, type: e.type };
    onChange(formEvent, e.target.value);
  };

  const mergedWrapperStyle = useMemo(
    () => ({ ...convertClass(legacyClassProp), ...style }),
    [legacyClassProp, style],
  );

  // Group needs an accessible name. Prefer explicit aria attrs, otherwise
  // wire to the Caption we render (if present), otherwise fall back to
  // `labelledBy`.
  const captionId = label ? `${id}-Caption` : null;
  const resolvedAriaLabelledBy = ariaLabelledByAttr ?? captionId ?? labelledBy;

  return (
    <s.RadioGroupWrapper
      ref={rootRef}
      id={`${id}-RadioGroup`}
      role='radiogroup'
      direction={direction}
      isV4Design
      widthType={widthType}
      width={width}
      minWidth={minWidth}
      aria-label={ariaLabelAttr}
      aria-labelledby={resolvedAriaLabelledBy}
      rightAlign={rightAlign}
      className={className}
      style={wrapperStyle}
      narrow={narrow}
      allowWrap={allowWrap}
    >
      {label && (
        <Caption id={id} label={label} style={{ width: 'auto' }} />
      )}
      <s.RadioGroupInnerWrapper
        direction={direction}
        isV4Design
        rightAlign={rightAlign}
        narrow={narrow}
        allowWrap={allowWrap}
      >
        {options?.map((option, idx) => (
          <Fragment key={`${id}-${option.value}`}>
            <RadioButton
              key={`${id}-${option.value}`}
              id={`${name ?? ''}${id}${idx}`}
              name={`${name ?? ''}-${id}`}
              onChange={handleOnChange}
              disabled={disabled || option.disabled}
              value={option.value}
              label={option.label}
              hint={option.hint}
              checked={selectedValue === option.value}
              aria-checked={selectedValue === option.value}
              // eslint-disable-next-line no-nested-ternary
              tabIndex={noRadioSelected && idx === 0 ? 0 : selectedValue === option.value ? 0 : -1}
              direction={direction}
              widthType={widthType}
              isFocused={isFocused}
              rowItemWidth={widthType === 'full' ? `${(100 / options.length).toFixed(4)}%` : 'inherit'}
              color={color}
              customFontSize={fontSize}
              style={mergedWrapperStyle}
              narrow={narrow}
              labelStyle={labelStyle}
              bold={bold}
              marginBottom={
                (idx === options.length - 1 && direction === 'column') || option.subtext || narrow
                  ? 0
                  : gap
              }
            />
            {option.subtext && (
              <s.Subtext key={`${id}-${option.value}-text`} last={idx === options.length - 1} gap={gap}>
                {option.subtext}
              </s.Subtext>
            )}
          </Fragment>
        ))}
      </s.RadioGroupInnerWrapper>
    </s.RadioGroupWrapper>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
