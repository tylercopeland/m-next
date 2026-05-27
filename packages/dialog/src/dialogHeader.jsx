import * as React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import * as s from './dialog.styles';

const propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  titleId: PropTypes.string,
  content: PropTypes.node,
  hideDismissButton: PropTypes.bool,
  onDismissClick: PropTypes.func,
};

function DialogHeader(props) {
  const {
    // custom props
    id,
    title,
    titleId,
    content,
    hideDismissButton,
    onDismissClick,
  } = props;

  const handleDismissClick = () => {
    if (onDismissClick) onDismissClick();
  };

  return (
    <s.DialogHeaderWrapper id={id ? `${id}-header` : undefined} tabIndex='-1'>
      <s.DialogHeaderTitle id={titleId}>{title}</s.DialogHeaderTitle>
      {content}
      {hideDismissButton ? null : (
        <s.DialogHeaderDismissButton
          id={id ? `${id}-dismiss` : undefined}
          type='button'
          aria-label='Close dialog'
          onClick={handleDismissClick}
        >
          <SvgIcon name='close-V4' size={12} color={colors.grey.darkest} />
        </s.DialogHeaderDismissButton>
      )}
    </s.DialogHeaderWrapper>
  );
}

DialogHeader.propTypes = propTypes;
export default DialogHeader;
