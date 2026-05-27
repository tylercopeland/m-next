import * as React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import * as s from './dialog.styles';

const propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.node,
  hideDismissButton: PropTypes.bool,
  onDismissClick: PropTypes.func,
};

function DialogHeader(props) {
  const {
    // custom props
    id,
    title,
    content,
    hideDismissButton,
    onDismissClick,
  } = props;

  const handleDismissClick = () => {
    onDismissClick();
  };

  return (
    <s.DialogHeaderWrapper id={id ? `${id}-header` : null} tabIndex='-1'>
      <s.DialogHeaderTitle>{title}</s.DialogHeaderTitle>
      {content}
      {hideDismissButton ? null : (
        <s.DialogHeaderDismissButton id={id ? `${id}-dismiss` : null} onClick={handleDismissClick}>
          <SvgIcon name='close-V4' size={12} color={lightTheme.content.emphasize} />
        </s.DialogHeaderDismissButton>
      )}
    </s.DialogHeaderWrapper>
  );
}

DialogHeader.propTypes = propTypes;
export default DialogHeader;
