import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import { DataModel, getIcon } from '@m-next/types';
import SvgIcon from '@m-next/svg-icon';
import * as s from './GridColumn.styles';

const propTypes = {
  dataModel: DataModel,
  column: PropTypes.shape({
    field: PropTypes.string,
    header: PropTypes.string,
    format: PropTypes.shape({
      width: PropTypes.string,
      alignment: PropTypes.string,
    }),
  }),
  onChange: PropTypes.func,
};

function GridColumn({ dataModel, column, onChange }) {
  const field = useMemo(() => {
    const match = dataModel.fields.filter((x) => x.name === column.field);
    if (match !== null && match.length > 0) {
      return match[0];
    }
    return {};
  }, [column.field, dataModel.fields]);

  const handleWidthChange = (value) => {
    const update = { ...column };
    update.format = { ...update.format, width: value };
    onChange(update);
  };

  const handleAlignmentChange = (value) => {
    const update = { ...column };
    update.format = { ...update.format, alignment: value };
    onChange(update);
  };

  return (
    <s.GridColumnWrapper id={`column-${column.field}`}>
      <s.CaptionColumn>
        <SvgIcon name={getIcon(field.type)} size={16} />
        <s.CaptionColumnContent>
          <TextLine bold>{column.header}</TextLine>
          <Text fontSize='small' color={colors['grey-light']}>
            {field.name}
          </Text>
        </s.CaptionColumnContent>
      </s.CaptionColumn>
      <s.ConfigColumn>
        <s.SizeWrapper>
          <TextLine>Size:</TextLine>
          <s.SizeItemWrapper>
            <s.SizeItem
              id={`column-${column.field}-sm`}
              onClick={() => handleWidthChange('sm')}
              selected={column.format.width === 'sm' || !column.format.width}
            >
              Small
            </s.SizeItem>
            <s.SizeItem
              id={`column-${column.field}-md`}
              onClick={() => handleWidthChange('md')}
              selected={column.format.width === 'md'}
            >
              Medium
            </s.SizeItem>
            <s.SizeItem
              id={`column-${column.field}-lg`}
              onClick={() => handleWidthChange('lg')}
              selected={column.format.width === 'lg'}
            >
              Large
            </s.SizeItem>
          </s.SizeItemWrapper>
        </s.SizeWrapper>
        <s.SizeWrapper>
          <TextLine>Alignment:</TextLine>
          <s.SizeItemWrapper>
            <s.SizeItem
              id={`column-${column.field}-left`}
              onClick={() => handleAlignmentChange('left')}
              selected={column.format.alignment === 'left' || !column.format.alignment}
            >
              Left
            </s.SizeItem>
            <s.SizeItem
              id={`column-${column.field}-center`}
              onClick={() => handleAlignmentChange('center')}
              selected={column.format.alignment === 'center'}
            >
              Center
            </s.SizeItem>
            <s.SizeItem
              id={`column-${column.field}-right`}
              onClick={() => handleAlignmentChange('right')}
              selected={column.format.alignment === 'right'}
            >
              Right
            </s.SizeItem>
          </s.SizeItemWrapper>
        </s.SizeWrapper>
      </s.ConfigColumn>
    </s.GridColumnWrapper>
  );
}

GridColumn.propTypes = propTypes;
export default GridColumn;
