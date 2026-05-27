import React, { useRef, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import * as s from './checkBox.styles';
import { checkboxColor, captionStyle, checkboxDark } from './classConverter';

const propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  autoFocus: PropTypes.bool,
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  className: PropTypes.string,
  controlId: PropTypes.string,
  disabled: PropTypes.bool,
  forwardRef: PropTypes.instanceOf(Object),
  halfChecked: PropTypes.bool,
  hideCaption: PropTypes.bool,
  hidden: PropTypes.bool,
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  legacyClasses: PropTypes.string,
  name: PropTypes.string,
  rounded: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  tabIndex: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disableLabel: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  narrow: PropTypes.bool,
  testId: PropTypes.string,
  fullWidth: PropTypes.bool,
  bold: PropTypes.bool,
};
function Checkbox({
  align = 'left',
  autoFocus = false,
  className,
  checked = false,
  controlId,
  disabled = null,
  forwardRef = null,
  halfChecked = false,
  hideCaption,
  hidden = false,
  id,
  isMobile,
  label = null,
  disableLabel = true,
  legacyClasses = null,
  name = null,
  rounded = false,
  style = null,
  tabIndex = 0,
  width = '100%',
  onBlur = null,
  onChange = null,
  onFocus = null,
  onKeyDown = null,
  narrow = false,
  testId = null,
  fullWidth = false,
  bold = false,
}) {
  const checkboxRef = useRef();

  useImperativeHandle(forwardRef, () => ({
    blur: () => {
      checkboxRef.current.blur();
    },
    focus: () => {
      checkboxRef.current.focus();
    },
    select: () => {
      checkboxRef.current.select();
    },
  }));

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = halfChecked;
    }
  }, [halfChecked]);

  useEffect(() => {
    if (autoFocus) return checkboxRef?.current.focus();
  }, [autoFocus]);

  const handleOnChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  const handleKeyDown = (e) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    // Toggle checkbox on Enter or Space
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();

      if (onChange) {
        onChange(!checked);
      }
    }
  };

  return (
    <s.ControlContainer id={`${controlId || id}-wrapper`} isHidden={hidden} className={className} fullWidth={fullWidth}>
      <s.Wrapper
        htmlFor={id}
        align={align}
        rounded={rounded}
        style={style}
        isHidden={hidden}
        width={width}
        dark={checkboxDark(legacyClasses)}
        aria-labelledby={hideCaption || !label ? null : controlId || `${id}Lbl`}
        isMobile={isMobile}
        narrow={narrow}
      >
        {label && (
          <s.Label
            id={controlId || `${id}Lbl`}
            align={align}
            disabled={disabled ? true : null}
            style={captionStyle(legacyClasses)}
            aria-checked={hideCaption || !label ? null : checked}
            tabIndex={-1}
            className={hideCaption || !label ? 'aoda-visually-hidden' : ''}
            disableLabel={disableLabel}
            hideCaption={hideCaption}
            isMobile={isMobile}
            fullWidth={fullWidth}
            bold={bold}
          >
            {label}
          </s.Label>
        )}
        <s.Input
          ref={checkboxRef}
          autoFocus={autoFocus}
          id={id}
          name={name}
          type='checkbox'
          disabled={disabled ? true : null}
          checked={checked}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
          data-testid={testId}
        />

        <s.Checkbox
          align={align}
          rounded={rounded}
          disabled={disabled ? true : null}
          style={checked ? checkboxColor(legacyClasses) : null}
          aria-checked={hideCaption || !label ? checked : null}
          aria-labelledby={hideCaption || !label ? controlId || `${id}Lbl` : null}
          tabIndex={-1}
          isMobile={isMobile}
        />
      </s.Wrapper>
    </s.ControlContainer>
  );
}

Checkbox.propTypes = propTypes;

export default Checkbox;
