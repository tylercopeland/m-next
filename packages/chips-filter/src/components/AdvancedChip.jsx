import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Pill from '@m-next/pill';
import { Text } from '@m-next/typeography';
import { ExpressionElement, basicOperationId } from '@m-next/types';
import { colors } from '@m-next/styles';

const propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  expression: PropTypes.arrayOf(ExpressionElement),
  index: PropTypes.number,
  set: PropTypes.number,
};

function AdvancedChip({ id, isOpen, onClick, onDelete, expression, index, set }) {
  const secondLabel = useMemo(() => {
    if (!expression || expression.length === 0) return null;
    let count = 0;
    for (let i = 0; i < expression.length; i++) {
      count += expression[i].expression.length;
    }
    return `${count} ${count > 1 ? 'Rules' : 'Rule'}`;
  }, [expression]);

  const operationLabel = useMemo(() => {
    if (!expression || expression.length === 0) return null;

    if (expression[0].connector === basicOperationId.And) return 'is all of';
    return 'is any of';
  }, [expression]);

  const handleDelete = () => {
    onDelete(index, set);
  };

  return (
    <Pill
      id={`${id}-${isOpen ? 'active-editing' : 'advanced'}`}
      onClick={() => (onClick ? onClick(index) : null)}
      colorScheme='transparent'
      variant='ghost'
      bold={false}
      trailIcon={
        isOpen
          ? {
              name: 'chevron-down-V4',
              size: 12,
              color: colors.grey,
            }
          : null
      }
      fontSize={14}
      style={{ maxWidth: 280 }}
      onDelete={isOpen ? null : handleDelete}
    >
      <Text bold style={{ cursor: 'pointer' }}>
        Advanced filter
      </Text>
      <Text style={{ cursor: 'pointer' }}> {operationLabel} </Text>
      <Text bold style={{ cursor: 'pointer' }}>
        {secondLabel}
      </Text>
    </Pill>
  );
}

AdvancedChip.propTypes = propTypes;
export default AdvancedChip;
