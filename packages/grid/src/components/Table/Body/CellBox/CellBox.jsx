import React from 'react';
import PropTypes from 'prop-types';
import * as s from './CellBox.styles';

function CellBox({ id, hasError, value }) {
  return (
    <s.Box id={id} error={hasError}>
      {value}
    </s.Box>
  );
}

CellBox.defaultProps = {
  hasError: false,
  value: null,
};

CellBox.propTypes = {
  id: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  value: PropTypes.string,
};

export default CellBox;
