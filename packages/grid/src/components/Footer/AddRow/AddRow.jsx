import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@m-next/button';
import * as s from './AddRow.styles';

const propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

function AddRow({ id, disabled = false, label = 'Add row', onClick = null }) {
  const isKeyboardActivatedRef = useRef(false);

  const handleOnClick = (event) => {
    if (onClick && !disabled) {
      onClick({ ...event, isKeyboardActivated: isKeyboardActivatedRef.current });
      isKeyboardActivatedRef.current = false;
    }
  };

  return (
    <s.Wrapper
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') isKeyboardActivatedRef.current = true;
      }}
      onMouseDown={() => {
        isKeyboardActivatedRef.current = false;
      }}
    >
      <Button
        disabled={disabled}
        id={`${id}-ADDROW-BUTTON`}
        value={label}
        buttonStyle='ghost'
        onClick={handleOnClick}
      />
    </s.Wrapper>
  );
}

AddRow.propTypes = propTypes;

export default AddRow;
