import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import Caption from '@m-next/caption';
import { ValidationMessage } from '@m-next/validation';
import * as s from './InputArea.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/button + @m-next/input.
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

/* Editable Grid up/down key press logic:
Textarea in Editable grid is designed in a way that user can jump to above/below textareas on key up/key down
If a textarea has multiple lines, we should only jump to another line if caret cursor is on first or last line
We cannot get the line position because of word wrap (we do not have line breaks). Solution:
    1. Create a mirror of the textarea
    2. Send the content from the beginning of the textarea to the cursor position to the mirror
    3. Number of lines in mirror textarea is the current line in textarea
    4. Blur textarea if user is on first/last line and hits up/down
* to test in the browser, in TextAreaInputMirror remove position absolute and set visibility to 'visible' */

const InputArea = forwardRef(function InputArea(props, ref) {
  const {
    id: idProp,
    label = null,
    name = null,
    value = '',
    placeholder = null,
    required = false,
    disabled = false,
    autoGrow = false,
    disableResize = false,
    maxHeight = 250,
    initialHeight = null,
    rows = 3,
    cols,
    resize,
    tabIndex = 0,

    // Clean API
    errorMessage: errorMessageProp,
    intent: intentProp,
    hideLabel: hideLabelProp,
    readOnly: readOnlyProp,

    width = '100%',
    style,

    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,

    selectOnFocus = false,
    navigateGrid = null,
    isBlurOnSubmit = null,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    readonly: legacyReadonly,
    ariaDescribedby: legacyAriaDescribedby,
    hideCaption,
    infoLevel,
    validationMessage,

    // Standard ARIA pass-through
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,
    ariaLabel: legacyAriaLabel,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    hidden: _hidden,
    displayAuto: _displayAuto,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-input-area-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let hideLabel = hideLabelProp;
  if (hideCaption !== undefined && hideLabel === undefined) {
    warnOnce(
      'input-area-hideCaption',
      '@m-next/input-area: `hideCaption` is deprecated. Use `hideLabel`.',
    );
    hideLabel = hideCaption;
  }

  let errorMessage = errorMessageProp;
  if (validationMessage != null && errorMessage == null) {
    warnOnce(
      'input-area-validationMessage',
      '@m-next/input-area: `validationMessage` is deprecated. Use `errorMessage`.',
    );
    errorMessage = validationMessage;
  }

  let intent = intentProp;
  if (infoLevel != null && intent == null) {
    warnOnce(
      'input-area-infoLevel',
      '@m-next/input-area: `infoLevel` is deprecated. Use `intent`.',
    );
    intent = infoLevel;
  }
  if (intent == null) intent = 'error';

  let resolvedAriaDescribedby = ariaDescribedby;
  if (legacyAriaDescribedby && !resolvedAriaDescribedby) {
    warnOnce(
      'input-area-ariaDescribedby',
      '@m-next/input-area: `ariaDescribedby` is deprecated. Use `aria-describedby` (standard React attr).',
    );
    resolvedAriaDescribedby = legacyAriaDescribedby;
  }

  let resolvedAriaLabel = ariaLabel;
  if (legacyAriaLabel && !resolvedAriaLabel) {
    warnOnce(
      'input-area-ariaLabel',
      '@m-next/input-area: `ariaLabel` is deprecated. Use `aria-label` (standard React attr).',
    );
    resolvedAriaLabel = legacyAriaLabel;
  }

  let readOnly = readOnlyProp ?? false;
  if (legacyReadonly !== undefined && readOnly === false) {
    warnOnce(
      'input-area-readonly',
      '@m-next/input-area: `readonly` is deprecated. Use `readOnly` (React casing).',
    );
    readOnly = legacyReadonly;
  }

  if (legacyForwardRef) {
    warnOnce(
      'input-area-forwardRef-prop',
      '@m-next/input-area: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ State + refs ============

  const inputRef = useRef();
  const mirrorInputRef = useRef();

  const [height, setHeight] = useState(initialHeight);
  const [mirrorInputValue, setMirrorInputValue] = useState('');
  const [previousActiveLine, setPreviousActiveLine] = useState(null);
  const [keyPressed, setKeyPressed] = useState(null);
  const [focused, setFocused] = useState(false);

  const isValid = !errorMessage;

  // Expose imperative handle via the React forwardRef API. Both `ref` (new) and
  // the legacy `forwardRef` prop are supported.
  useImperativeHandle(
    ref ?? legacyForwardRef,
    () => ({
      blur: () => {
        inputRef.current?.blur();
      },
      focus: () => {
        inputRef.current?.focus();
      },
      select: () => {
        inputRef.current?.select();
      },
    }),
    [ref, legacyForwardRef],
  );

  // ============ Grid navigation helpers ============

  const calculateRowNumber = () => {
    if (!inputRef.current || !mirrorInputRef.current) return undefined;
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
    return undefined;
  };

  const getMirrorInputValue = (clickEvent) => {
    let selectionStart = inputRef.current?.selectionStart;
    const selectionEnd = inputRef.current?.selectionEnd;

    // When textarea is first focused (and text highlighted) and user clicks on text, selectionStart is not registered
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
    if (!inputRef.current) return;
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

  // ============ Handlers ============

  const handleOnChange = (e) => {
    if (autoGrow) autoGrowInput();
    if (onChange) onChange(e);
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
        return undefined;
      }

      setKeyPressed(e.which);
      return getMirrorInputValue();
    }

    if (onKeyUp) onKeyUp(e);
    return undefined;
  };

  const handleOnKeyDown = (e) => {
    if (isBlurOnSubmit && e.which === 13) {
      e.preventDefault();
    } else if (selectOnFocus && !keyPressed && (e.which === 38 || e.which === 40)) e.preventDefault();
    else if (onKeyDown) onKeyDown(e);
  };

  // ============ Render ============

  return (
    <s.Container width={width} style={style} isValid={isValid}>
      {!hideLabel && label && (
        <Caption
          id={`${id}-input-caption`}
          required={required}
          label={label}
          isValid={isValid}
          isV4Design
          float
          focused
          elFor={`${id}-Input`}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
      <s.TextAreaInput
        id={`${id}-Input`}
        autoGrow={autoGrow}
        ref={inputRef}
        rows={rows}
        cols={cols}
        tabIndex={tabIndex}
        value={value || ''}
        name={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleOnKeyDown}
        onKeyUp={handleOnKeyUp}
        onClick={handleClick}
        scrollable={!autoGrow || height >= maxHeight}
        isValid={isValid}
        disableResize={disableResize}
        customResize={resize}
        aria-label={resolvedAriaLabel ?? (label || name) ?? undefined}
        aria-describedby={resolvedAriaDescribedby}
        aria-disabled={disabled || undefined}
        aria-invalid={!isValid || undefined}
        aria-required={required || undefined}
        data-testid={`${id}-Input`}
        height={!autoGrow ? height : null}
        {...rest}
      />

      {selectOnFocus && (
        <s.TextAreaInputMirror
          autoGrow={autoGrow}
          ref={mirrorInputRef}
          rows={rows}
          scrollable={!autoGrow || height >= maxHeight}
          value={mirrorInputValue}
          readOnly
        />
      )}

      <ValidationMessage id={`${id}-input-validation`} message={errorMessage} isV4Design />
    </s.Container>
  );
});

InputArea.displayName = 'InputArea';

export default InputArea;
