// vendors
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import Caption from '@m-next/caption';
import IconRadioButton from './IconRadioButton';
import { IconRadioGroupWrapper } from './IconRadioButton.styles';
import warnOnce from './_warnOnce';

let autoIdCounter = 0;

const IconRadioGroup = forwardRef(function IconRadioGroup(props, ref) {
  const {
    id: idProp,
    options = [],
    onChange,
    selectedValue,
    widthType = 'auto',
    width = 'auto',
    style = null,
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
    internalIdRef.current = `m-next-icon-radio-group-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyCaption != null && label == null) {
    warnOnce(
      'icon-radio-group-caption',
      '@m-next/radio-button IconRadioGroup: `caption` is deprecated. Use `label`.',
    );
    label = legacyCaption;
  }

  if (legacyForwardRef) {
    warnOnce(
      'icon-radio-group-forwardRef-prop',
      '@m-next/radio-button IconRadioGroup: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
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
      <IconRadioGroupWrapper
        ref={rootRef}
        id={`${id}-RadioGroup`}
        role='radiogroup'
        aria-label={ariaLabelAttr}
        aria-labelledby={resolvedAriaLabelledBy}
        widthType={widthType}
        width={width}
        style={style}
      >
        {options?.map((option) => (
          <IconRadioButton
            key={`${id}-${option.value}`}
            id={id}
            value={option.value}
            onChange={handleOnChange}
            selected={currentValue === option.value}
            icon={option.icon}
            label={option.label}
            disabled={disabled}
          />
        ))}
      </IconRadioGroupWrapper>
    </>
  );
});

IconRadioGroup.displayName = 'IconRadioGroup';

export default IconRadioGroup;
