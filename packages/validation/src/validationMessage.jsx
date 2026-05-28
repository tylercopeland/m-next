import React, { useRef } from 'react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import warnOnce from './_warnOnce';
import * as s from './validationMessage.styles';

let autoIdCounter = 0;

function ValidationMessage(props) {
  const {
    id: idProp,
    message: messageProp,
    children,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    compactStyle: _compactStyle,
    isMobile: _isMobile,
    legacyClass: _legacyClass,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-validation-message-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // `children` is supported as a convenience alias. `message` remains the
  // primary prop — it's the established React form-library convention and is
  // what form composites (Input, Dropdown, etc.) pass through.
  const message = messageProp ?? children;

  if (legacyForwardRef) {
    warnOnce(
      'validation-message-forwardRef-prop',
      '@m-next/validation: ValidationMessage `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  if (!message) return null;

  return (
    <s.ValidationMessageWrapper {...rest}>
      <SvgIcon
        id={`${id}-validation-icon`}
        name='warning-sign'
        size={14}
        color={colors.red.base}
        style={{ paddingRight: '4px' }}
      />
      <s.ValidationMessage id={`${id}-validation2`}>{message}</s.ValidationMessage>
    </s.ValidationMessageWrapper>
  );
}

export default ValidationMessage;
