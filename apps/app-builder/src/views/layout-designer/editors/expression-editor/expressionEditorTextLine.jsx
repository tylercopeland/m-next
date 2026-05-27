import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import Input from '@m-next/input';
import { interactions } from '@m-next/utilities';
import { colors, lightTheme } from '@m-next/styles';
import { ComplexValue } from '@m-next/expression';

import * as s from './expressionEditor.styles';
// types
const propTypes = {
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  index: PropTypes.number,
  id: PropTypes.string,
  isDragging: PropTypes.bool,
  expressionElement: ComplexValue,
};

function ExpressionEditorTextLine({ id, onChange, index, onDelete, isDragging, expressionElement }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value) => {
    const updated = { ...expressionElement };
    updated.value = value;
    onChange(updated, index);
  };

  const handleDeleteClick = () => {
    onDelete(index);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <s.Wrapper
      isOpen={isOpen}
      id={`data-model-wrapper-${id}`}
      data-testid={`data-model-wrapper-${id}`}
      onKeyUp={interactions.handleEnterKey(toggleOpen)}
      tabIndex={0}
    >
      <s.TextContent
        id={`data-model-wrapper-${id}`}
        data-testid={`data-model-wrapper-${id}`}
        onClick={toggleOpen}
        isOpen={isOpen}
      >
        <SvgIcon
          id={`data-model-drag-${id}`}
          name='drag'
          size={16}
          color={lightTheme.content.primary}
          style={{ cursor: 'grab' }}
        />

        <Input
          compactStyle
          id={`data-model-caption-${id}`}
          value={expressionElement.value}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          background={isDragging ? colors['blue-lighter'] : lightTheme.background.primary}
        />
        <s.DeleteWraper>
          <SvgIcon
            id={`data-model-delete-${id}`}
            name='delete'
            size={16}
            color={lightTheme.content.primary}
            onClick={handleDeleteClick}
          />
        </s.DeleteWraper>
      </s.TextContent>
    </s.Wrapper>
  );
}

ExpressionEditorTextLine.propTypes = propTypes;
export default ExpressionEditorTextLine;
