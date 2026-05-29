import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldTypeNames, Predicate } from '@m-next/types';
import { colors } from '@m-next/tokens';
import SvgIcon from '@m-next/svg-icon';
import { Text } from '@m-next/typeography';
import OperationSelector from './OperationSelector';

const propTypes = {
  id: PropTypes.string,
  isMobile: PropTypes.bool,
  first: Predicate,
  operation: PropTypes.number,
  fieldList: PropTypes.arrayOf(Field),
  onOperationChange: PropTypes.func,
  firstFieldType: PropTypes.string,
  onToggleOpen: PropTypes.func,
  onShowAdvancedEdit: PropTypes.func,
};

function BuilderHeader({
  id,
  isMobile,
  first,
  operation,
  fieldList,
  onOperationChange,
  firstFieldType,
  onToggleOpen,
  onShowAdvancedEdit,
}) {
  const fieldCaption = useMemo(() => {
    const match = fieldList.find(
      (f) => f.name === first.value && (first.metadata ? first.metadata?.type === f.type : true),
    );
    return match?.caption || match?.name;
  }, [fieldList, first.metadata, first.value]);

  return (
    <div id={`${id}-header`} style={{ display: 'flex', alignItems: 'center' }}>
      <Text bold fontSize='small' style={{ paddingRight: 4 }}>
        {fieldCaption}
      </Text>
      <OperationSelector
        id={id}
        isMobile={isMobile}
        isReadOnly={firstFieldType === FieldTypeNames.YesNo}
        fieldType={firstFieldType}
        value={operation}
        onOperationChange={onOperationChange}
        onToggleOpen={onToggleOpen}
        fieldName={first.value}
      />
      <div style={{ flexGrow: 1 }} />
      <SvgIcon
        id={`${id}-advanced-edit`}
        name='settings'
        size={16}
        position='left'
        color={colors.grey.base}
        onClick={onShowAdvancedEdit}
      />
    </div>
  );
}

BuilderHeader.propTypes = propTypes;
export default BuilderHeader;
