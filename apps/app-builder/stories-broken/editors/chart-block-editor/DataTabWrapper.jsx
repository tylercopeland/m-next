import React, { useState, useMemo } from 'react';
import fieldList from '../../../testing/data/fieldListActivities.json';
import controlList from '../../../testing/data/controlList.json';
import DataTab from '../../../src/views/layout-designer/editors/chart-block-editor/DataTab';
import validateChart from '../../../src/views/layout-designer/validation/validateChart';

const propTypes = {};

function DataTabWrapper() {
  const [expression, setExpression] = useState([
    {
      operation: 0,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'ActualCompletedDate',
        ValueType: 3,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 7,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: '2023-02-01T18:00:00.000Z',
        ValueType: 11,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 2,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'ActualDuration',
        ValueType: 3,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 5,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: '0e13acc0-36a4-dc8b-304f-3a60488955f5',
        ValueType: 5,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 2,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'Comments',
        ValueType: 3,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 12,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'gggg',
        ValueType: 9,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 2,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'FollowUpFromActivityNo',
        ValueType: 3,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 6,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'entityfullname',
        ValueType: 6,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 2,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'IsAllDayAppointment',
        ValueType: 3,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 4,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'true',
        ValueType: 12,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 2,
      dateField: null,
      source: null,
    },
    {
      operation: 0,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'SaaSphaltMarkupDollars',
        ValueType: 3,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 8,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: '1001',
        ValueType: 10,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 3,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        Value: 'ContactsAssignedTo',
        ValueType: 3,
        Property: null,
        ChildProperty: null,
      },
    },
    {
      operation: 11,
      dateField: null,
      source: null,
    },
    {
      operation: 1,
      dateField: null,
      source: null,
    },
    {
      operation: 1,
      dateField: null,
      source: null,
    },
  ]);

  const [columns, setColumns] = useState([
    {
      caption: 'PrimaryColumn',
    },
    {
      caption: 'SecondaryColumn',
    },
  ]);
  const [tableName, setTableName] = useState('Activities');
  const [control, setControl] = useState({
    model: {
      viewName: 'Activities',
      columns: [
        {
          caption: 'PrimaryColumn',
        },
        {
          caption: 'SecondaryColumn',
        },
      ],
    },
  });

  const handleFilterChange = (value) => {
    setExpression(value);
  };

  const handleTableChange = (value) => {
    setTableName(value);
    setControl({
      model: {
        viewName: value,
        columns: [
          {
            caption: 'PrimaryColumn',
          },
          {
            caption: 'SecondaryColumn',
          },
        ],
      },
    });
    setColumns([
      {
        caption: 'PrimaryColumn',
      },
      {
        caption: 'SecondaryColumn',
      },
    ]);
  };

  const handleColumnChange = (value) => {
    setColumns(value);
    setControl({
      model: {
        viewName: tableName,
        columns: value,
      },
    });
  };

  const validation = useMemo(() => validateChart(control), [control]);

  return (
    <div style={{ width: 380 }}>
      <DataTab
        fieldList={fieldList}
        tableList={[
          {
            name: 'Activities',
            caption: 'Activities',
          },
          {
            name: 'Contacts',
            caption: 'Contacts',
          },
          {
            name: 'Invoice',
            caption: 'Invoice',
          },
        ]}
        tableName={tableName}
        columns={columns}
        onTableChange={handleTableChange}
        onColumnChange={handleColumnChange}
        onFilterChange={handleFilterChange}
        chartType={2}
        expression={expression}
        controlList={controlList}
        displayPreferences={{}}
        filterId='000-000-001'
        validation={validation}
        expandAll
      />
    </div>
  );
}

DataTabWrapper.propTypes = propTypes;
export default DataTabWrapper;
