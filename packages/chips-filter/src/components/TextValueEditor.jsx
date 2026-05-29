import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Input from '@m-next/input';
import { colors } from '@m-next/tokens';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
};

const Wrapper = styled.div(() => [
  {
    display: 'flex',
    boxSizing: 'border-box',
    gap: 8,
  },
]);

function TextValueEditor({ id, value, onChange, onKeyUp }) {
  const render = () => (
    <Wrapper>
      <Input
        id={`${id}-value`}
        value={value}
        type='text'
        onChange={onChange}
        onKeyUp={onKeyUp}
        style={{ backgroundColor: colors.white }}
        inputStyle={{ fontSize: 13 }}
        compactStyle
        label='Value'
        autoFocus
      />
    </Wrapper>
  );

  return render();
}

TextValueEditor.propTypes = propTypes;
export default TextValueEditor;
