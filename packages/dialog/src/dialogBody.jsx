import * as React from 'react';
import PropTypes from 'prop-types';
import * as s from './dialog.styles';

const propTypes = {
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    // children - can render anything in here
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

function DialogBody(props) {
  const {
    // custom props
    id,
    children,
    maxHeight = 'auto',
  } = props;

  return (
    <s.DialogBodyWrapper id={id ? `${id}-body` : null} maxHeight={maxHeight}>
      {children}
    </s.DialogBodyWrapper>
  );
}

DialogBody.propTypes = propTypes;
export default DialogBody;
