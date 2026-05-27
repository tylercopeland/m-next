import * as React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { lightTheme } from '@m-next/styles';
import DialogHeader from './dialogHeader';
import DialogBody from './dialogBody';
import DialogFooter from './dialogFooter';

// types
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
 * Wrapper component around react-modal with support for custom styling and layout control
 */
function Dialog({
  id = null,
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
}) {
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

  return (
    <Modal
      id={id ? `${id}-wrapper` : null}
      //  appElement='body'

      ariaHideApp={false}
      role={role}
      aria={
        aria ?? {
          labelledby: `${id}-header`,
          describedby: `${id}-body`,
        }
      }
      onAfterClose={onClose}
      isOpen={isOpen}
      style={modalStyles}
    >
      {!hideDefaultHeader && (
        <DialogHeader
          id={id}
          title={title}
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
export default Dialog;
