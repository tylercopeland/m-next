import React, { useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import * as s from './ButtonGroupRow.styles';

// One-time deprecation warner.
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

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      label: PropTypes.string,
      icon: PropTypes.string,
      labelStyle: PropTypes.instanceOf(Object),
    }),
  ),
  id: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onClick: PropTypes.func,
  tooltipId: PropTypes.string,
  tooltipPlace: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  'aria-label': PropTypes.string,
};

const ButtonGroupRow = forwardRef(function ButtonGroupRow(props, ref) {
  const {
    data = [],
    onClick = null,
    id: idProp,
    selected,
    tooltipId,
    tooltipPlace,
    width,
    'aria-label': ariaLabelProp,

    // Soft-shimmed legacy prop
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-button-group-row-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'button-group-row-forwardRef-prop',
      '@m-next/button-group: `forwardRef` prop on ButtonGroupRow is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const wrapperRef = useRef(null);

  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(wrapperRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = wrapperRef.current;
    }
  }, [ref, legacyForwardRef]);

  const [selectedItem, setSelectedItem] = useState(selected);

  useEffect(() => {
    setSelectedItem(selected);
  }, [selected]);

  return (
    <s.ButtonGroupRowWrapper
      id={id}
      width={width}
      ref={wrapperRef}
      role='group'
      aria-label={ariaLabelProp || 'Button group'}
      {...rest}
    >
      {data.map((item, index) => (
        <s.ButtonGroupRowButton
          id={`${id}-${index}`}
          key={item.value}
          role='button'
          aria-pressed={selectedItem === item.value}
          aria-disabled={item.disabled || undefined}
          aria-label={item.label || item.icon || undefined}
          onClick={() => {
            if (!item.disabled) {
              setSelectedItem(item.value);
              if (onClick) {
                onClick(item, index);
              }
            }
          }}
          selected={selectedItem === item.value}
          index={index}
          length={data.length}
          disabled={item.disabled}
          data-tooltip-id={tooltipId}
          data-tooltip-html={item.tooltip}
          data-tooltip-place={tooltipPlace}
          data-tooltip-position-strategy={item.tooltip ? 'fixed' : null}
        >
          {item.label && (item.labelStyle ? <span style={item.labelStyle}>{item.label}</span> : item.label)}
          {item.icon && (
            <SvgIcon
              name={item.icon}
              size={16}
              color={selectedItem === item.value ? colors.blue.base : colors.grey.base}
              hoverColor={colors.blue.base}
            />
          )}
        </s.ButtonGroupRowButton>
      ))}
    </s.ButtonGroupRowWrapper>
  );
});

ButtonGroupRow.displayName = 'ButtonGroupRow';
ButtonGroupRow.propTypes = propTypes;

export default ButtonGroupRow;
