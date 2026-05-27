import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import { Projection } from '@m-next/types';
import Grid from '@m-next/grid';
import SvgIcon from '@m-next/svg-icon';
import * as s from './GridProjection.styles';

const propTypes = {
  projections: PropTypes.arrayOf(Projection),
  gridProjections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      isVisible: PropTypes.bool,
    }),
  ),
  onChange: PropTypes.func,
};

const buildProjections = (projections, gridProjections) => {
  const result = [];
  if (gridProjections && projections) {
    gridProjections.forEach((projection) => {
      const row = {
        id: projection.id,
        caption: '',
        isVisible: projection.isVisible,
      };

      const match = projections.filter((x) => x.id === projection.id);
      if (match !== null && match.length > 0) {
        row.caption = match[0].caption;
        result.push(row);
      }
    });

    projections.forEach((projection) => {
      const row = {
        id: projection.id,
        caption: projection.caption,
        isVisible: true,
      };

      const match = gridProjections.filter((x) => x.id === projection.id);
      if (match.length === 0) {
        result.push(row);
      }
    });
  } else if (projections) {
    projections.forEach((projection) => {
      const row = {
        id: projection.id,
        caption: projection.caption,
        isVisible: true,
      };

      result.push(row);
    });
  }
  return result;
};

function GridProjection({ projections, gridProjections = [], onChange }) {
  const handleToggleColumnVisibility = (projectionId) => {
    const result = buildProjections(projections, gridProjections);

    const match = result.filter((x) => x.id === projectionId);
    if (match !== null && match.length > 0) {
      match[0].isVisible = !match[0].isVisible;
    }
    onChange(result);
  };

  const handleReorder = (startIndex, endIndex) => {
    const result = buildProjections(projections, gridProjections);

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    onChange(result);
  };

  const data = useMemo(() => buildProjections(projections, gridProjections), [gridProjections, projections]);

  const columns = [
    {
      name: 'id',
      columnAlign: 'center',
      columnType: 0,
      editable: false,
      fieldType: 0,
      headerAlign: 'left',
      caption: '',
      primary: true,
      visible: false,
      with: 'sm',
    },

    {
      name: 'card',
      columnAlign: 'right',
      columnType: 0,
      editable: false,
      fieldType: 0,
      headerAlign: 'left',
      caption: '',
      primary: false,
      visible: true,
      with: 'sm',
      renderAs: (cellId, value, rowIdx) => (
        <s.GridProjectionWrapper>
          <Text> {data[rowIdx].caption}</Text>
          <s.Spacer />
          <SvgIcon
            name={data[rowIdx].isVisible ? 'eye-open' : 'hide-visible'}
            size={16}
            color={data[rowIdx].isVisible ? colors.blue : colors['grey-dark']}
            onClick={() => handleToggleColumnVisibility(data[rowIdx].id)}
          />
        </s.GridProjectionWrapper>
      ),
    },
  ];

  return (
    <Grid
      columns={columns}
      data={data}
      showHeader={false}
      showPagination={false}
      draggable
      searchable={false}
      responsive={false}
      showReload={false}
      showGoToPage={false}
      showPageSize={false}
      compact
      pageSize={1000}
      onReorder={handleReorder}
    />
  );
}

GridProjection.propTypes = propTypes;
export default GridProjection;
