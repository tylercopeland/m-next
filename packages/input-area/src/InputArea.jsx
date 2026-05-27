import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Caption from '@m-next/caption';
import { ValidationMessage } from '@m-next/validation';
import { convertLegacyControlStyle } from '@m-next/styles';
import * as s from './InputArea.styles';

/* Editable Grid up/down key press logic:
Textarea in Editable grid is designed in a way that user can jump to above/below textareas on key up/key down
If a textarea has multiple lines, we should only jump to another line if caret cursor is on first or last line
We cannot get the line position because of word wrap (we do not have line breaks). Solution: 
    1. Create a mirror of the textarea
    2. Send the content from the beginning of the textarea to the cursor position to the mirror
    3. Number of lines in mirror textarea is the current line in textarea
    4. Blur textarea if user is on first/last line and hits up/down
* to test in the browser, in TextAreaInputMirror remove position absolute and set visibility to 'visible' */

const propTypes = {
  ariaLabel: PropTypes.string,
  autoGrow: PropTypes.bool,
  disabled: PropTypes.bool,
  disableResize: PropTypes.bool,
  forwardRef: PropTypes.instanceOf(Object),
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  maxHeight: PropTypes.number,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  style: PropTypes.instanceOf(Object),
  tabIndex: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  validationMessage: PropTypes.string,
  displayAuto: PropTypes.bool,
  legacyClass: PropTypes.string,
  isV4Design: PropTypes.bool,
  initialHeight: PropTypes.number,
  selectOnFocus: PropTypes.bool,
  navigateGrid: PropTypes.func,
  isBlurOnSubmit: PropTypes.bool,
  compactStyle: PropTypes.bool,
};

function InputArea({
  id,
  ariaLabel = '',
  autoGrow = false,
  disabled = false,
  disableResize = false,
  forwardRef = null,
  label = null,
  maxHeight = 250,
  name = null,
  placeholder = null,
  readonly = false,
  required = false,
  rows = 3,
  style = null,
  tabIndex = 0,
  value = '',
  width = '100%',
  onBlur = null,
  onChange = null,
  onFocus = null,
  onKeyDown = null,
  onKeyUp = null,
  isBlurOnSubmit = null,
  validationMessage = null,
  displayAuto = false,
  legacyClass = null,
  isV4Design = true,
  initialHeight = null,
  selectOnFocus = false,
  navigateGrid = null,
  compactStyle = false,
}) {
  const inputRef = useRef();
  const mirrorInputRef = useRef();

  const [height, setHeight] = useState(initialHeight);
  const [mirrorInputValue, setMirrorInputValue] = useState('');
  const [previousActiveLine, setPreviousActiveLine] = useState(null);
  const [keyPressed, setKeyPressed] = useState(null);
  const [focused, setFocused] = useState(false);

  const calculateRowNumber = () => {
    const numOfLines = (inputRef.current.scrollHeight - 16) / 16; // 16 line height / deduct 16 because first line has min-height of 32px
    const numOfMirrorLines = (mirrorInputRef.current.scrollHeight - 16) / 16;

    const currentLine = numOfMirrorLines;

    if (navigateGrid) {
      if (keyPressed === 38 || keyPressed === 40) {
        const blurInput = () => navigateGrid(keyPressed === 38 ? 'up' : 'down');
        if (numOfLines === 1) return blurInput();

        if (currentLine === numOfLines && currentLine === previousActiveLine) return blurInput();

        if (currentLine === 1 && previousActiveLine === 1 && keyPressed === 38) return blurInput();
      }
    }
    setPreviousActiveLine(currentLine);
  };
  const getMirrorInputValue = (clickEvent) => {
    let selectionStart = inputRef.current?.selectionStart;
    const selectionEnd = inputRef.current?.selectionEnd;

    // When textearea is first focused (and text highlighted) and user clicks on text, selectionStart is not registered
    // To fix this create a mock selectionStart
    if (clickEvent && selectionEnd > 0 && selectionStart === 0) {
      selectionStart = selectionEnd / 2;
      setKeyPressed(true);
    }

    if (selectionStart || selectionStart === 0) {
      // Add 10 spaces for cases when word in mirror doesn't break the line
      let mirrorValue = String(value.substring(0, selectionStart)) + Array(10).fill('\xa0').join('');

      if (mirrorValue === mirrorInputValue) mirrorValue = `${mirrorInputValue} `;
      setMirrorInputValue(mirrorValue);
    }
  };

  const autoGrowInput = () => {
    inputRef.current.style.height = 'inherit';
    const newHeight = inputRef.current.scrollHeight;
    if (newHeight < maxHeight) {
      inputRef.current.style.height = `${newHeight}px`;
      setHeight(newHeight);
    }

    if (newHeight > maxHeight) {
      inputRef.current.style.height = `${maxHeight}px`;
      setHeight(maxHeight);
    }
  };
  useImperativeHandle(forwardRef, () => ({
    blur: () => {
      inputRef.current.blur();
    },
    focus: () => {
      inputRef.current.focus();
    },
    select: () => {
      inputRef.current.select();
    },
  }));

  useEffect(() => {
    if (autoGrow && inputRef.current) {
      inputRef.current.style.height = `${height}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef]);

  useEffect(() => {
    if (autoGrow) autoGrowInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate row number for cursor location
  useEffect(() => {
    if (mirrorInputRef.current) {
      mirrorInputRef.current.style.height = 'inherit';
      mirrorInputRef.current.style.height = `${mirrorInputRef.current.scrollHeight}px`;
      calculateRowNumber();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mirrorInputValue]);

  const handleOnChange = (e) => {
    if (autoGrow) autoGrowInput();
    if (onChange) onChange(e.target.value);
  };

  const handleFocus = (e) => {
    if (selectOnFocus) e.target.select();
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleClick = () => {
    if (selectOnFocus) getMirrorInputValue(true);
  };

  const handleOnKeyUp = (e) => {
    if (selectOnFocus) {
      // Tab between rows on first initialization if user hits 'up' or 'down'
      if (!keyPressed && (e.which === 38 || e.which === 40)) {
        e.preventDefault();
        setKeyPressed(e.which);
        if (navigateGrid) {
          return navigateGrid(e.which === 38 ? 'up' : 'down');
        }
      }

      if (e.which === 13 && isBlurOnSubmit) {
        inputRef.current.blur();
        return;
      }

      setKeyPressed(e.which);
      return getMirrorInputValue();
    }

    if (onKeyUp) onKeyUp(e);
  };

  const handleOnKeyDown = (e) => {
    if (isBlurOnSubmit && e.which === 13) {
      e.preventDefault();
    } else if (selectOnFocus && !keyPressed && (e.which === 38 || e.which === 40)) e.preventDefault();
    else if (onKeyDown) onKeyDown(e);
  };

  return (
    <s.Container
      width={width}
      style={style}
      displayAuto={displayAuto}
      isValid={!validationMessage}
      compactStyle={compactStyle}
    >
      {label && (
        <Caption
          id={id}
          required={required}
          label={label}
          legacyClass={legacyClass}
          isValid={!isV4Design || !validationMessage}
          isV4Design={isV4Design}
          float={isV4Design ? true : Boolean(placeholder || value)}
          focused={focused || isV4Design}
          elFor={`${id}-Input`}
          disabled={disabled}
          readOnly={readonly}
        />
      )}
      <s.TextAreaInput
        id={`${id}-Input`}
        autoGrow={autoGrow}
        ref={inputRef}
        rows={rows}
        tabIndex={tabIndex}
        value={value || ''}
        name={name}
        isV4Design={isV4Design}
        placeholder={placeholder}
        onChange={handleOnChange}
        disabled={disabled}
        readOnly={readonly}
        onFocus={(e) => handleFocus(e)}
        onBlur={(e) => handleBlur(e)}
        onKeyDown={(e) => handleOnKeyDown(e)}
        onKeyUp={(e) => handleOnKeyUp(e)}
        onClick={() => handleClick()}
        scrollable={!autoGrow || height >= maxHeight}
        isValid={!validationMessage}
        style={{ ...convertLegacyControlStyle(legacyClass), ...style }}
        disableResize={disableResize}
        aria-label={ariaLabel}
        height={!autoGrow ? height : null}
      />

      {selectOnFocus && (
        <s.TextAreaInputMirror
          autoGrow={autoGrow}
          ref={mirrorInputRef}
          rows={rows}
          scrollable={!autoGrow || height >= maxHeight}
          style={{ ...convertLegacyControlStyle(legacyClass), ...style }}
          value={mirrorInputValue}
          readOnly
        />
      )}

      <ValidationMessage id={id} message={validationMessage} isV4Design={isV4Design} />
    </s.Container>
  );
}

InputArea.propTypes = propTypes;

export default InputArea;
