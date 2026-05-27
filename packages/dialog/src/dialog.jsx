import * as React from 'react';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';
import DialogHeader from './dialogHeader';
import DialogBody from './dialogBody';
import DialogFooter from './dialogFooter';

// One-time deprecation warner — fires once per key, mirrors @m-next/button / @m-next/input.
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
  id: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  onClose: PropTypes.func,
  onDismiss: PropTypes.func,
  role: PropTypes.oneOf(['dialog', 'alertdialog']),
  isOpen: PropTypes.bool,
  hideDismissButton: PropTypes.bool,
  aria: PropTypes.shape({
    labelledby: PropTypes.string,
    describedby: PropTypes.string,
  }),
  header: PropTypes.node,
  footer: PropTypes.oneOfType([
    PropTypes.shape({
      children: PropTypes.node,
    }),
    PropTypes.shape({
      primaryButtonLabel: PropTypes.string,
      primaryDisabled: PropTypes.bool,
      primaryVariant: PropTypes.string,
      onPrimaryButtonClick: PropTypes.func,
      secondaryButtonLabel: PropTypes.string,
      secondaryVariant: PropTypes.string,
      secondaryDisabled: PropTypes.bool,
      onSecondaryButtonClick: PropTypes.func,
    }),
  ]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // eslint-disable-next-line react/forbid-prop-types
  customStyles: PropTypes.object,
  hideDefaultHeader: PropTypes.bool,
  hideDefaultBody: PropTypes.bool,
  hideDefaultFooter: PropTypes.bool,
};

/**
 * Modal dialog. Wraps react-modal with m-next styling, header/body/footer
 * composition, and proper modal accessibility (role="dialog", aria-modal,
 * aria-labelledby).
 */
function Dialog(props) {
  const {
    id: idProp = null,
    children,
    title,
    role = 'dialog',
    onClose = null,
    onDismiss = null,
    isOpen = false,
    aria,
    header,
    footer,
    hideDismissButton = false,
    width = 612,
    maxHeight = 'auto',
    customStyles = {},
    hideDefaultHeader = false,
    hideDefaultBody = false,
    hideDefaultFooter = false,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-dialog-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;
  const titleId = `${id}-header-title`;
  const bodyId = `${id}-body`;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'dialog-forwardRef-prop',
      '@m-next/dialog: `forwardRef` prop is deprecated. Dialog renders a portal — refs to the dialog element are not supported.',
    );
  }

  const handleDismissClick = () => {
    if (onClose) onClose();
    if (onDismiss) onDismiss();
  };

  // Merge custom styles with defaults, allowing customStyles to override
  const modalStyles = {
    content: {
      padding: 0,
      position: 'unset',
      width,
      background: colors.white,
      ...(customStyles?.content || {}),
    },
    overlay: {
      backgroundColor: `${lightTheme.content.emphasize}88`,
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      ...(customStyles?.overlay || {}),
    },
  };

  // Resolve ARIA association. If the consumer passed `aria`, respect it.
  // Otherwise, point labelledby at the rendered title (when there is one)
  // and describedby at the body wrapper.
  const resolvedAria = aria ?? {
    labelledby: title && !hideDefaultHeader ? titleId : undefined,
    describedby: !hideDefaultBody ? bodyId : undefined,
  };

  return (
    <Modal
      id={`${id}-wrapper`}
      // appElement defaults to react-modal's internal warning suppression. Setting
      // ariaHideApp={false} keeps the consumer responsible for app-level aria-hidden;
      // react-modal still applies role + aria-modal to the content element itself.
      ariaHideApp={false}
      role={role}
      aria={resolvedAria}
      onAfterClose={onClose}
      isOpen={isOpen}
      style={modalStyles}
      {...rest}
    >
      {!hideDefaultHeader && (
        <DialogHeader
          id={id}
          title={title}
          titleId={titleId}
          content={header}
          hideDismissButton={hideDismissButton}
          onDismissClick={handleDismissClick}
        />
      )}
      {!hideDefaultBody ? (
        <DialogBody id={id} maxHeight={maxHeight}>
          {children}
        </DialogBody>
      ) : (
        children
      )}
      {!hideDefaultFooter && footer && <DialogFooter id={id} content={footer} />}
    </Modal>
  );
}

Dialog.propTypes = propTypes;
Dialog.displayName = 'Dialog';

export default Dialog;
