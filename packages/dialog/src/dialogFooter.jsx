import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@m-next/button';
import * as s from './dialog.styles';

const propTypes = {
  id: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.shape({
      children: PropTypes.node,
    }),
    PropTypes.shape({
      primaryButtonLabel: PropTypes.string,
      onPrimaryButtonClick: PropTypes.func,
      primaryDisabled: PropTypes.bool,
      primaryVariant: PropTypes.string,
      secondaryButtonLabel: PropTypes.string,
      onSecondaryButtonClick: PropTypes.func,
      secondaryDisabled: PropTypes.bool,
      secondaryVariant: PropTypes.string,
    }),
  ]),
};

function DialogFooter(props) {
  const {
    // custom props
    id,
    content,
  } = props;

  return (
    <s.DialogFooterWrapper id={id ? `${id}-footer` : null}>
      {!content?.children && (
        <>
          {content?.secondaryButtonLabel && (
            <Button
              id={id ? `${id}-footer-secondary` : 'dialog-footer-secondary'}
              value={content.secondaryButtonLabel}
              onClick={content.onSecondaryButtonClick}
              buttonStyle={content.secondaryVariant || 'ghost'}
              disabled={content.secondaryDisabled}
            />
          )}
          {content?.primaryButtonLabel && (
            <Button
              id={id ? `${id}-footer-primary` : 'dialog-footer-primary'}
              value={content.primaryButtonLabel}
              onClick={content.onPrimaryButtonClick}
              buttonStyle={content.primaryVariant || 'primary'}
              disabled={content.primaryDisabled}
            />
          )}
        </>
      )}
    </s.DialogFooterWrapper>
  );
}

DialogFooter.propTypes = propTypes;
export default DialogFooter;
