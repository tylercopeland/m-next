import React, { Children, cloneElement, isValidElement, useRef } from 'react';
import { colors } from '@m-next/tokens';

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

let autoIdCounter = 0;

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontFamily,
};

const labelStyle = {
  display: 'inline-block',
  fontFamily,
  fontSize: 14,
  fontWeight: 500,
  color: colors.grey.dark,
  marginBottom: 4,
  lineHeight: 1.4,
};

const asteriskStyle = {
  color: colors.red.base,
  marginLeft: 2,
};

const descriptionStyle = {
  fontFamily,
  fontSize: 13,
  fontWeight: 400,
  color: colors.grey.base,
  marginBottom: 8,
  lineHeight: 1.4,
};

const errorStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 4,
  fontFamily,
  fontSize: 13,
  fontWeight: 400,
  color: colors.red.dark,
  marginTop: 4,
  lineHeight: 1.4,
};

const errorGlyphStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  flexShrink: 0,
};

const joinIds = (...ids) => ids.filter(Boolean).join(' ') || undefined;

const FormField = ({
  id: idProp,
  label,
  description,
  errorMessage,
  required = false,
  htmlFor,
  hideLabel = false,
  children,
  style,
  ...rest
}) => {
  // Stable auto id for the wrapper, used to derive description/error ids.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-form-field-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  const descriptionId = description ? `${id}-description` : null;
  const errorId = errorMessage ? `${id}-error` : null;

  // Decide the control id.
  // - If htmlFor is provided, use it (consumer owns wiring on their child).
  // - Otherwise generate one and clone it into the child.
  // Only a single React element child is cloneable; if there are multiple or
  // non-element children, we skip cloning and let the consumer handle it.
  const child = isValidElement(children) && Children.count(children) === 1 ? children : null;

  const generatedControlId = `${id}-control`;
  const controlId = htmlFor ?? child?.props?.id ?? (child ? generatedControlId : undefined);

  let renderedChild = children;
  if (child) {
    const childAriaDescribedby = child.props['aria-describedby'];
    const mergedAriaDescribedby = joinIds(descriptionId, errorId, childAriaDescribedby);
    const nextProps = {};

    // Don't overwrite a child-provided id; otherwise inject the resolved control id.
    if (!child.props.id && controlId) {
      nextProps.id = controlId;
    }
    if (mergedAriaDescribedby) {
      nextProps['aria-describedby'] = mergedAriaDescribedby;
    }
    if (errorMessage && child.props['aria-invalid'] === undefined) {
      nextProps['aria-invalid'] = true;
    }

    renderedChild = cloneElement(child, nextProps);
  }

  return (
    <div id={id} style={{ ...wrapperStyle, ...style }} {...rest}>
      {label != null && (
        <label
          htmlFor={controlId}
          style={hideLabel ? visuallyHidden : labelStyle}
          id={`${id}-label`}
        >
          {label}
          {required && (
            <span aria-hidden="true" style={asteriskStyle}>
              *
            </span>
          )}
        </label>
      )}
      {description != null && (
        <div id={descriptionId} style={descriptionStyle}>
          {description}
        </div>
      )}
      {renderedChild}
      {errorMessage != null && (
        <div id={errorId} role="alert" style={errorStyle}>
          <span aria-hidden="true" style={errorGlyphStyle}>
            {'✕'}
          </span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;
