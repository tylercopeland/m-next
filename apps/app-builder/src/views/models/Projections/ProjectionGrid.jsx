import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import { DataModel, Projection, getIcon } from '@m-next/types';
import Grid from '@m-next/grid';
import SvgIcon from '@m-next/svg-icon';
import * as s from './ProjectionViewer.styles';

const propTypes = {
  id: PropTypes.string,
  projection: Projection,
  dataModel: DataModel,
  onChange: PropTypes.func,
  displayPreferences: PropTypes.instanceOf(Object),
};

function ProjectionGrid({ id, projection, dataModel, onChange, displayPreferences }) {
  const handleToggleColumnVisibility = (rowIdx) => {
    const updated = { ...projection, fields: [...projection.fields] };
    updated.fields[rowIdx] = { ...updated.fields[rowIdx], isVisible: !updated.fields[rowIdx].isVisible };
    onChange(updated);
  };

  const handleReorder = (startIndex, endIndex) => {
    const result = Array.from(projection.fields);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = { ...projection, fields: [...projection.fields] };
    updated.fields = result;
    onChange(updated);
  };

  const data = useMemo(() => {
    const result = [];
    if (!projection || !dataModel) return result;
    projection.fields.forEach((field) => {
      const row = {
        name: field.name,
        caption: field.caption,
        isVisible: field.isVisible,
      };

      const match = dataModel.fields.filter((x) => x.name === field.name);
      if (match !== null && match.length > 0) {
        row.type = match[0].type;
        row.fieldType = match[0].fieldType;
      }
      result.push(row);
    });

    return result;
  }, [dataModel, projection]);

  const columns = [
    {
      name: 'name',
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
        <s.ProjectionViewerWrapper>
          <SvgIcon name={getIcon(data[rowIdx].type)} size={16} />
          <Text> {data[rowIdx].caption}</Text>
          <s.Spacer />
          <SvgIcon
            name={data[rowIdx].isVisible ? 'eye-open' : 'hide-visible'}
            size={16}
            color={data[rowIdx].isVisible ? colors.blue : colors['grey-dark']}
            onClick={() => handleToggleColumnVisibility(rowIdx)}
          />
        </s.ProjectionViewerWrapper>
      ),
    },
  ];

  const render = () => {
    if (projection) {
      return (
        <Grid
          id={id}
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
          displayPreferences={displayPreferences}
          onReorder={handleReorder}
        />
      );
    }
    return null;
  };

  return render();
}

ProjectionGrid.propTypes = propTypes;
export default ProjectionGrid;
