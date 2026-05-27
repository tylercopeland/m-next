// vendors
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import Caption from '@m-next/caption';
import ButtonRadioButton from './ButtonRadioButton';
import { ButtonRadioGroupWrapper } from './ButtonRadioButton.styles';
import warnOnce from './_warnOnce';

let autoIdCounter = 0;

const ButtonRadioGroup = forwardRef(function ButtonRadioGroup(props, ref) {
  const {
    id: idProp,
    options = [],
    onChange,
    selectedValue,
    widthType = 'auto',
    width = 'auto',
    style = null,
    buttonWidth,
    isOneLine,
    disabled,

    // Accessible name — accept both `label` and the legacy `caption`.
    label: labelProp,

    // Standard ARIA pass-through
    'aria-label': ariaLabelAttr,
    'aria-labelledby': ariaLabelledByAttr,

    // Soft-shimmed legacy props
    caption: legacyCaption,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    controlId: _controlId,
  } = props;

  // ============ Auto-generate id if not provided ============
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-button-radio-group-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyCaption != null && label == null) {
    warnOnce(
      'button-radio-group-caption',
      '@m-next/radio-button ButtonRadioGroup: `caption` is deprecated. Use `label`.',
    );
    label = legacyCaption;
  }

  if (legacyForwardRef) {
    warnOnce(
      'button-radio-group-forwardRef-prop',
      '@m-next/radio-button ButtonRadioGroup: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
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

  const [currentValue, setCurrentValue] = useState(selectedValue);

  useEffect(() => {
    if (currentValue !== selectedValue) setCurrentValue(selectedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  const handleOnChange = (item) => {
    setCurrentValue(item.value);
    if (onChange) onChange(item);
  };

  // Group needs an accessible name. Prefer explicit aria attrs, otherwise
  // wire to the Caption we render (if present).
  const captionId = label ? `${id}-Caption` : null;
  const resolvedAriaLabelledBy = ariaLabelledByAttr ?? captionId;

  return (
    <>
      {label && <Caption id={`${id}-RadioGroup`} label={label} narrow />}
      <ButtonRadioGroupWrapper
        ref={rootRef}
        id={`${id}-RadioGroup`}
        role='radiogroup'
        aria-label={ariaLabelAttr}
        aria-labelledby={resolvedAriaLabelledBy}
        widthType={widthType}
        width={width}
        style={style}
        isOneLine={isOneLine}
      >
        {options?.map((option) => (
          <ButtonRadioButton
            key={`${id}-${option.value}`}
            id={id}
            value={option.value}
            onChange={handleOnChange}
            selected={currentValue === option.value}
            label={option.label}
            isOneLine={isOneLine}
            width={buttonWidth}
            disabled={disabled}
          />
        ))}
      </ButtonRadioGroupWrapper>
    </>
  );
});

ButtonRadioGroup.displayName = 'ButtonRadioGroup';

export default ButtonRadioGroup;
