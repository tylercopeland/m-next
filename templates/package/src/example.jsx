import * as React from 'react';
import PropTypes from 'prop-types';

// types
const propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
  primaryButton: PropTypes.string,
  onPrimaryButtonClick: PropTypes.func,
};

/**
 * Wrapper component around
 */
function ExampleComponent({ id = '', message = '', primaryButton = null, onPrimaryButtonClick = null }) {
  return (
    <div id={`${id}-example`}>
      <span id={`${id}-example-message`} style={{ padding: 16 }}>
        {message}
      </span>
      {primaryButton && (
        <button id={`${id}-example-button`} type='button' onClick={onPrimaryButtonClick}>
          {primaryButton}
        </button>
      )}
    </div>
  );
}

ExampleComponent.propTypes = propTypes;
export default ExampleComponent;
